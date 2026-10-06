import { neon } from "@neondatabase/serverless";
import { isAdmin } from "@/lib/admin-auth";
import { pruneExpiredAnalytics } from "@/lib/analytics-retention";

export const dynamic = "force-dynamic";

const allowedRanges = [7, 30, 90] as const;

export async function GET(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Database not configured." }, { status: 503 });

  const daysParam = Number(new URL(request.url).searchParams.get("days") || 30);
  const days = allowedRanges.includes(daysParam as (typeof allowedRanges)[number]) ? daysParam : 30;

  try {
    const sql = neon(process.env.DATABASE_URL);
    await pruneExpiredAnalytics(sql);
    const [summaryRows, daily, popular, consultations] = await Promise.all([
      sql`
        WITH period_visits AS (
          SELECT visitor_id, id, started_at
          FROM analytics_visits
          WHERE started_at >= NOW() - (${days}::int * INTERVAL '1 day')
        ), browser_counts AS (
          SELECT visitor_id, COUNT(*)::int AS visits
          FROM period_visits GROUP BY visitor_id
        )
        SELECT
          (SELECT COUNT(*)::int FROM analytics_page_views WHERE viewed_at >= NOW() - (${days}::int * INTERVAL '1 day')) AS page_views,
          (SELECT COUNT(*)::int FROM browser_counts) AS unique_browsers,
          (SELECT COUNT(*)::int FROM browser_counts WHERE visits > 1) AS returning_browsers,
          (SELECT COALESCE(SUM(visits - 1), 0)::int FROM browser_counts) AS return_visits,
          (SELECT COUNT(*)::int FROM period_visits) AS visits
      `,
      sql`
        SELECT date_trunc('day', viewed_at)::date::text AS day,
               COUNT(*)::int AS page_views,
               COUNT(DISTINCT visitor_id)::int AS unique_browsers
        FROM analytics_page_views
        WHERE viewed_at >= NOW() - (${days}::int * INTERVAL '1 day')
        GROUP BY date_trunc('day', viewed_at)::date
        ORDER BY day
      `,
      sql`
        SELECT path, COUNT(*)::int AS page_views,
               COUNT(DISTINCT visitor_id)::int AS unique_browsers
        FROM analytics_page_views
        WHERE viewed_at >= NOW() - (${days}::int * INTERVAL '1 day')
        GROUP BY path ORDER BY page_views DESC LIMIT 10
      `,
      sql`
        SELECT COUNT(*)::int AS consultation_submissions
        FROM consultations
        WHERE created_at >= NOW() - (${days}::int * INTERVAL '1 day')
      `,
    ]);

    return Response.json({
      rangeDays: days,
      ...summaryRows[0],
      consultationSubmissions: consultations[0]?.consultation_submissions ?? 0,
      daily,
      popular,
      definitions: {
        uniqueBrowsers: "Distinct consenting browser IDs with a counted visit in this date range; not a count of verified people.",
        returningBrowsers: "Browsers with more than one counted visit in this date range.",
        returnVisits: "Visits after each browser's first counted visit in this date range; a visit begins after a 24-hour gap.",
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    process.stderr.write(`Analytics report failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ error: "Analytics are unavailable. Confirm the analytics migration has been applied." }, { status: 503 });
  }
}