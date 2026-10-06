import { createHash, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const genericMessage = "If the address can be subscribed, a confirmation email will arrive shortly.";
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]!));

function siteBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) throw new Error("NEXT_PUBLIC_SITE_URL is required for newsletter links.");
  const url = new URL(configured);
  if (url.protocol !== "https:" && process.env.NODE_ENV !== "development") {
    throw new Error("Newsletter links must use HTTPS outside development.");
  }
  return url.origin;
}

export async function POST(request: Request) {
  if (process.env.NEWSLETTER_ENABLED !== "true") {
    return Response.json({ error: "Newsletter signup is not enabled yet." }, { status: 503 });
  }
  if (!process.env.DATABASE_URL || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return Response.json({ error: "Newsletter service is not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    if (typeof body.website === "string" && body.website.length > 0) {
      return Response.json({ message: genericMessage });
    }
    const email = String(body.email || "").trim().toLowerCase();
    if (body.consent !== true) return Response.json({ error: "Please confirm that you want to receive monthly updates." }, { status: 400 });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const baseUrl = siteBaseUrl();
    const confirmationToken = randomBytes(32).toString("base64url");
    const unsubscribeToken = randomBytes(32).toString("base64url");
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      INSERT INTO newsletter_subscribers (
        email, status, confirmation_token_hash, unsubscribe_token_hash,
        confirmation_expires_at, confirmation_sent_at, unsubscribed_at,
        consent_source, updated_at
      ) VALUES (
        ${email}, 'pending', ${hashToken(confirmationToken)}, ${hashToken(unsubscribeToken)},
        NOW() + INTERVAL '24 hours', NOW(), NULL, 'nyaycast-site-form', NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        status = 'pending',
        confirmation_token_hash = EXCLUDED.confirmation_token_hash,
        unsubscribe_token_hash = EXCLUDED.unsubscribe_token_hash,
        confirmation_expires_at = EXCLUDED.confirmation_expires_at,
        confirmation_sent_at = NOW(),
        unsubscribed_at = NULL,
        consent_source = EXCLUDED.consent_source,
        updated_at = NOW()
      WHERE newsletter_subscribers.status <> 'subscribed'
        AND (newsletter_subscribers.confirmation_sent_at < NOW() - INTERVAL '10 minutes'
          OR newsletter_subscribers.status = 'unsubscribed')
      RETURNING email
    `;

    if (!rows.length) return Response.json({ message: genericMessage });
    await sql`INSERT INTO newsletter_unsubscribe_tokens (token_hash, email) VALUES (${hashToken(unsubscribeToken)}, ${email})`;

    const confirmUrl = `${baseUrl}/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`;
    const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
    const safeEmail = escapeHtml(email);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Confirm your Nyaycast monthly updates",
      text: `Please confirm your request to receive monthly Nyaycast updates: ${confirmUrl}\n\nIf you did not request these emails, ignore this message. You can unsubscribe at any time: ${unsubscribeUrl}`,
      html: `<p>Confirm your request to receive monthly Nyaycast updates.</p><p><a href="${confirmUrl}">Confirm subscription</a></p><p>If you did not request these emails, ignore this message. <a href="${unsubscribeUrl}">Unsubscribe</a>.</p><p>Address: ${safeEmail}</p>`,
    });
    if (error) {
      await sql`UPDATE newsletter_subscribers SET confirmation_sent_at = NOW() - INTERVAL '11 minutes' WHERE email = ${email} AND status = 'pending'`;
      return Response.json({ error: "We could not send the confirmation email. Please try again shortly." }, { status: 502 });
    }
    return Response.json({ message: genericMessage });
  } catch (error) {
    process.stderr.write(`Newsletter signup failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    return Response.json({ error: "Newsletter signup is temporarily unavailable." }, { status: 503 });
  }
}