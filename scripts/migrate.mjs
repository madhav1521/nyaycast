import { readdir, readFile } from "node:fs/promises";
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

  const appliedRows = await sql`SELECT version FROM public.schema_migrations`;
  const applied = new Set(appliedRows.map((row) => row.version));
  let count = 0;

  for (const migration of migrations) {
    if (applied.has(migration.file)) {
      process.stdout.write(`Already applied: ${migration.file}\n`);
      continue;
    }
    if (migration.statements.length === 0) {
      process.stdout.write(`Skipping empty migration: ${migration.file}\n`);
      continue;
    }

    const queries = migration.statements.map((statement) => sql.query(statement));
    queries.push(sql.query("INSERT INTO public.schema_migrations (version) VALUES ($1)", [migration.file]));
    await sql.transaction(queries);
    applied.add(migration.file);
    count += 1;
    process.stdout.write(`Applied: ${migration.file}\n`);
  }

  process.stdout.write(count ? `Migration complete: ${count} applied.\n` : "Database is up to date.\n");
}

main().catch((error) => {
  process.stderr.write(`Migration failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
  process.exitCode = 1;
});