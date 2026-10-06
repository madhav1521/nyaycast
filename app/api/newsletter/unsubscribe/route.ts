import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return Response.json({ error: "Not found." }, { status: 404 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Newsletter service is not available." }, { status: 503 });
  try {
    const body = await request.json();
    const token = String(body.token || "");
    if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return Response.json({ error: "This unsubscribe link is invalid." }, { status: 400 });
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      WITH matched AS (
        UPDATE newsletter_unsubscribe_tokens
        SET used_at = NOW()
        WHERE token_hash = ${tokenHash} AND used_at IS NULL
        RETURNING email
      )
      UPDATE newsletter_subscribers AS subscriber
      SET status = 'unsubscribed', confirmation_token_hash = NULL,
          unsubscribed_at = NOW(), updated_at = NOW()
      FROM matched
      WHERE subscriber.email = matched.email AND subscriber.status <> 'unsubscribed'
      RETURNING subscriber.email
    `;
    if (!rows.length) return Response.json({ error: "This address is already unsubscribed or the link is invalid." }, { status: 400 });
    return Response.json({ message: "You have been unsubscribed from Nyaycast monthly updates." });
  } catch (error) {
    process.stderr.write(`Newsletter unsubscribe failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ error: "We could not process the unsubscribe request." }, { status: 503 });
  }
}