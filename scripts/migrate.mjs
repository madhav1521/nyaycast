import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDirectory = path.join(root, "database", "migrations");
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(root);

function splitSqlStatements(source) {
  const statements = [];
  let statement = "";
  let state = "normal";
  let dollarTag = "";
  let blockDepth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (state === "single") {
      statement += character;
      if (character === "'" && next === "'") {
        statement += next;
        index += 1;
      } else if (character === "'" && source[index - 1] !== "\\") {
        state = "normal";
      }
      continue;
    }

    if (state === "double") {
      statement += character;
      if (character === '"' && next === '"') {
        statement += next;
        index += 1;
      } else if (character === '"') {
        state = "normal";
      }
      continue;
    }

    if (state === "line-comment") {
      statement += character;
      if (character === "\n") state = "normal";
      continue;
    }

    if (state === "block-comment") {
      statement += character;
      if (character === "/" && next === "*") {
        statement += next;
        index += 1;
        blockDepth += 1;
      } else if (character === "*" && next === "/") {
        statement += next;
        index += 1;
        blockDepth -= 1;
        if (blockDepth === 0) state = "normal";
      }
      continue;
    }

    if (state === "dollar") {
      if (source.startsWith(dollarTag, index)) {
        statement += dollarTag;
        index += dollarTag.length - 1;
        state = "normal";
      } else {
        statement += character;
      }
      continue;
    }

    if (character === "'" ) {
      state = "single";
      statement += character;
    } else if (character === '"') {
      state = "double";
      statement += character;
    } else if (character === "-" && next === "-") {
      state = "line-comment";
      statement += "--";
      index += 1;
    } else if (character === "/" && next === "*") {
      state = "block-comment";
      blockDepth = 1;
      statement += "/*";
      index += 1;
    } else if (character === "$") {
      const tag = source.slice(index).match(/^\$[a-zA-Z_][a-zA-Z_0-9]*\$|^\$\$/)?.[0];
      if (tag) {
        state = "dollar";
        dollarTag = tag;
        statement += tag;
        index += tag.length - 1;
      } else {
        statement += character;
      }
    } else if (character === ";") {
      if (statement.trim()) statements.push(statement.trim());
      statement = "";
    } else {
      statement += character;
    }
  }

  if (statement.trim()) statements.push(statement.trim());
  return statements;
}

async function main() {
  const files = (await readdir(migrationsDirectory))
    .filter((file) => /^\d+.*\.sql$/i.test(file))
    .sort((left, right) => left.localeCompare(right, "en", { numeric: true }));
  const migrations = await Promise.all(
    files.map(async (file) => ({
      file,
      statements: splitSqlStatements(await readFile(path.join(migrationsDirectory, file), "utf8")),
    })),
  );

  if (process.argv.includes("--dry-run")) {
    for (const migration of migrations) {
      process.stdout.write(`${migration.file}: ${migration.statements.length} statements\n`);
    }
    process.stdout.write(`Dry run complete: ${migrations.length} migration(s) found.\n`);
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. Configure it in .env.local or the process environment.");
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS public.schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS public.schema_migration_statements (
      version TEXT NOT NULL,
      statement_hash TEXT NOT NULL,
      occurrence INTEGER NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (version, statement_hash, occurrence)
    )
  `;

  const appliedRows = await sql`SELECT version FROM public.schema_migrations`;
  const applied = new Set(appliedRows.map((row) => row.version));
  let appliedCount = 0;
  let baselineCount = 0;

  for (const migration of migrations) {
    if (migration.statements.length === 0) {
      process.stdout.write(`Skipping empty migration: ${migration.file}\n`);
      continue;
    }

    const seenOccurrences = new Map();
    const statements = migration.statements.map((statement) => {
      const statementHash = createHash("sha256").update(statement.trim().replace(/\s+/g, " ")).digest("hex");
      const occurrence = seenOccurrences.get(statementHash) || 0;
      seenOccurrences.set(statementHash, occurrence + 1);
      return { statement, statementHash, occurrence };
    });

    const trackedRows = await sql`
      SELECT statement_hash, occurrence
      FROM public.schema_migration_statements
      WHERE version = ${migration.file}
    `;
    const tracked = new Set(trackedRows.map((row) => `${row.statement_hash}:${row.occurrence}`));

    if (applied.has(migration.file) && tracked.size === 0) {
      const baselineQueries = [
        sql`SELECT pg_advisory_xact_lock(hashtext('manas_site_schema_migrations'))`,
        ...statements.map(({ statementHash, occurrence }) => sql.query(
          `INSERT INTO public.schema_migration_statements (version, statement_hash, occurrence) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [migration.file, statementHash, occurrence],
        )),
      ];
      await sql.transaction(baselineQueries);
      baselineCount += statements.length;
      process.stdout.write(`Baselined existing migration: ${migration.file} (${statements.length} statements)\n`);
      continue;
    }

    const pending = statements.filter(({ statementHash, occurrence }) => !tracked.has(`${statementHash}:${occurrence}`));
    if (pending.length === 0) {
      process.stdout.write(`Already up to date: ${migration.file}\n`);
      continue;
    }

    const queries = [
      sql`SELECT pg_advisory_xact_lock(hashtext('manas_site_schema_migrations'))`,
      ...pending.flatMap(({ statement, statementHash, occurrence }) => [
        sql.query(statement),
        sql.query(
          `INSERT INTO public.schema_migration_statements (version, statement_hash, occurrence) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [migration.file, statementHash, occurrence],
        ),
      ]),
      sql.query(
        "INSERT INTO public.schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING",
        [migration.file],
      ),
    ];
    await sql.transaction(queries);
    applied.add(migration.file);
    appliedCount += pending.length;
    process.stdout.write(`Applied ${pending.length} new statement(s): ${migration.file}\n`);
  }

  if (appliedCount || baselineCount) {
    process.stdout.write(`Migration complete: ${appliedCount} SQL statement(s) applied; ${baselineCount} existing statement(s) baselined.\n`);
  } else {
    process.stdout.write("Database is up to date.\n");
  }
}

main().catch((error) => {
  process.stderr.write(`Migration failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
  process.exitCode = 1;
});