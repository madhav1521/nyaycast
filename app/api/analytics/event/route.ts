import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { pruneExpiredAnalytics } from "@/lib/analytics-retention";

export const dynamic = "force-dynamic";

const visitorCookie = "manas_analytics_visitor";
const consentCookie = "manas_analytics_consent";
const daySeconds = 60 * 60 * 24;
const trackedPaths = new Set([
  "/",
  "/about",
  "/services",
  "/team",
  "/nyaycast",
  "/contact",
  "/resources",
  "/resources/checklists",
  "/resources/consultation-preparation",
  "/guides",
  "/newsletter",
  "/newsletter/confirm",
  "/newsletter/unsubscribe",
  "/privacy",
]);
const allowedPath = (path: string) => trackedPaths.has(path) || /^\/guides\/[a-z0-9-]{1,120}$/.test(path);
const likelyAutomatedTraffic = (agent: string) =>
  /bot|crawler|spider|headless|lighthouse|pagespeed|monitoring/i.test(agent);

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return Response.json({ ok: false }, { status: 503 });

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) return Response.json({ ok: false }, { status: 403 });
    } catch {
      return Response.json({ ok: false }, { status: 403 });
    }
  }
  if (likelyAutomatedTraffic(request.headers.get("user-agent") || "")) {
    return Response.json({ ok: true, tracked: false });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = new Map(cookieHeader.split(";").map((part) => {
    const separator = part.indexOf("=");
    return separator < 0 ? ["", ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
  }));
  if (cookies.get(consentCookie) !== "accepted") return Response.json({ ok: true, tracked: false });

  try {
    const body = await request.json();
    const path = String(body.path || "");
    if (path.length > 300 || path.includes("?") || path.includes("#") || !allowedPath(path)) {
      return Response.json({ ok: true, tracked: false });
    }

    const priorId = cookies.get(visitorCookie) || "";
    const visitorId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(priorId) ? priorId : randomUUID();
    const sql = neon(process.env.DATABASE_URL);
    await pruneExpiredAnalytics(sql);
    const result = await sql.transaction((tx) => [
      tx`SELECT pg_advisory_xact_lock(hashtextextended(${visitorId}, 0))`,
      tx`
        INSERT INTO analytics_visitors (visitor_id)
        VALUES (${visitorId}::uuid)
        ON CONFLICT (visitor_id) DO UPDATE SET last_seen_at = NOW()
      `,
      tx`
        WITH created_visit AS (
          INSERT INTO analytics_visits (visitor_id, started_at)
          SELECT ${visitorId}::uuid, NOW()
          WHERE NOT EXISTS (
            SELECT 1 FROM analytics_visits
            WHERE visitor_id = ${visitorId}::uuid
              AND started_at > NOW() - INTERVAL '24 hours'
          )
          RETURNING id
        ), chosen_visit AS (
          SELECT id, TRUE AS is_new FROM created_visit
          UNION ALL
          SELECT id, FALSE AS is_new FROM analytics_visits
          WHERE visitor_id = ${visitorId}::uuid
            AND NOT EXISTS (SELECT 1 FROM created_visit)
          ORDER BY id DESC
          LIMIT 1
        ), inserted_page_view AS (
          INSERT INTO analytics_page_views (visitor_id, visit_id, path)
          SELECT ${visitorId}::uuid, id, ${path} FROM chosen_visit
          RETURNING visit_id
        )
        UPDATE analytics_visitors
        SET visit_count = visit_count + (SELECT COUNT(*)::int FROM chosen_visit WHERE is_new),
            last_seen_at = NOW()
        WHERE visitor_id = ${visitorId}::uuid
        RETURNING (SELECT visit_id FROM inserted_page_view LIMIT 1) AS visit_id
      `,
    ]);
    const visitResult = result[2] as { visit_id: number }[];
    if (!visitResult.length) return Response.json({ ok: false }, { status: 503 });

    const response = Response.json({ ok: true, tracked: true });
    if (!priorId) {
      response.headers.append("Set-Cookie", `${visitorCookie}=${visitorId}; Max-Age=${365 * daySeconds}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    process.stderr.write(`Analytics event failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ ok: false }, { status: 503 });
  }
}