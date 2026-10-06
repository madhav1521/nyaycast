import type { NeonQueryFunction } from "@neondatabase/serverless";

export async function pruneExpiredAnalytics(sql: NeonQueryFunction<false, false>) {
  const claimed = await sql`
    INSERT INTO analytics_retention_state (id, last_cleanup_at)
    VALUES (1, NOW())
    ON CONFLICT (id) DO UPDATE SET last_cleanup_at = NOW()
    WHERE analytics_retention_state.last_cleanup_at < NOW() - INTERVAL '1 day'
    RETURNING id
  `;
  if (!claimed.length) return;

  await sql.transaction([
    sql`DELETE FROM analytics_page_views WHERE viewed_at < NOW() - INTERVAL '13 months'`,
    sql`DELETE FROM analytics_visits WHERE started_at < NOW() - INTERVAL '13 months'`,
    sql`DELETE FROM analytics_visitors WHERE last_seen_at < NOW() - INTERVAL '13 months'`,
  ]);
}