import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return Response.json({ error: "Not found." }, { status: 404 });
  if (process.env.NEWSLETTER_ENABLED !== "true" || !process.env.DATABASE_URL) {
    return Response.json({ error: "Newsletter service is not available." }, { status: 503 });
  }
  try {
    const body = await request.json();
    const token = String(body.token || "");
    if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return Response.json({ error: "This confirmation link is invalid or expired." }, { status: 400 });
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`
      UPDATE newsletter_subscribers
      SET status = 'subscribed', confirmation_token_hash = NULL,
          confirmed_at = NOW(), updated_at = NOW()
      WHERE confirmation_token_hash = ${tokenHash}
        AND status = 'pending' AND confirmation_expires_at > NOW()
      RETURNING email
    `;
    if (!result.length) return Response.json({ error: "This confirmation link is invalid, expired, or already used." }, { status: 400 });
    return Response.json({ message: "Subscription confirmed. You can unsubscribe from any monthly email." });
  } catch (error) {
    process.stderr.write(`Newsletter confirmation failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ error: "We could not confirm the subscription." }, { status: 503 });
  }
}