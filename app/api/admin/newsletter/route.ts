import { createHash, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]!));

function allowed() {
  return process.env.NODE_ENV === "development" && process.env.NEWSLETTER_ENABLED === "true";
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") return Response.json({ error: "Not found." }, { status: 404 });
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowed() || !process.env.DATABASE_URL) return Response.json({ error: "Newsletter service is not enabled or configured." }, { status: 503 });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const [summary] = await sql`
      SELECT COUNT(*) FILTER (WHERE status = 'subscribed')::int AS subscribed,
             COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
             COUNT(*) FILTER (WHERE status = 'unsubscribed')::int AS unsubscribed
      FROM newsletter_subscribers
    `;
    return Response.json(summary);
  } catch (error) {
    process.stderr.write(`Newsletter admin summary failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ error: "Could not load newsletter totals." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return Response.json({ error: "Not found." }, { status: 404 });
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowed() || !process.env.DATABASE_URL || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_SITE_URL) {
    return Response.json({ error: "Newsletter sending is not enabled or fully configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const subject = String(body.subject || "").trim();
    const text = String(body.text || "").trim();
    if (subject.length < 4 || subject.length > 120 || text.length < 20 || text.length > 12000) {
      return Response.json({ error: "Enter a subject (4–120 characters) and message (20–12,000 characters)." }, { status: 400 });
    }
    const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
    const sql = neon(process.env.DATABASE_URL);
    const subscribers = await sql`
      SELECT email, unsubscribe_token_hash
      FROM newsletter_subscribers
      WHERE status = 'subscribed'
      ORDER BY confirmed_at ASC
      LIMIT 301
    `;
    if (subscribers.length > 300) return Response.json({ error: "There are more than 300 subscribers. Send through a reviewed campaign workflow before scaling." }, { status: 413 });
    if (!subscribers.length) return Response.json({ sent: 0, failed: 0, message: "There are no confirmed subscribers yet." });

    const resend = new Resend(process.env.RESEND_API_KEY);
    let sent = 0;
    let failed = 0;
    for (const subscriber of subscribers) {
      const token = randomBytes(32).toString("base64url");
      const tokenHash = hashToken(token);
      await sql`INSERT INTO newsletter_unsubscribe_tokens (token_hash, email) VALUES (${tokenHash}, ${subscriber.email})`;
      const unsubscribeUrl = `${baseUrl}/v2/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
      const htmlMessage = escapeHtml(text).replaceAll("\n", "<br>");
      try {
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: subscriber.email,
          subject,
          text: `${text}\n\nUnsubscribe from Nyaycast updates: ${unsubscribeUrl}`,
          html: `<div>${htmlMessage}</div><hr><p style="font-size:12px;color:#555">You receive this because you confirmed Nyaycast monthly updates. <a href="${unsubscribeUrl}">Unsubscribe</a>.</p>`,
        });
        if (error) throw new Error(error.message);
        sent += 1;
      } catch {
        await sql`DELETE FROM newsletter_unsubscribe_tokens WHERE token_hash = ${tokenHash}`;
        failed += 1;
      }
    }
    return Response.json({ sent, failed, message: `Sent to ${sent} confirmed subscriber(s); ${failed} delivery failure(s).` });
  } catch (error) {
    process.stderr.write(`Newsletter campaign failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ error: "The newsletter could not be sent." }, { status: 503 });
  }
}