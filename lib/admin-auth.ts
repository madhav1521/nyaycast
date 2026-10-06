import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
const name = "manas_admin";
const sessionDurationSeconds = 28800;
const sessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET ||
  (process.env.NODE_ENV === "development" ? "local-development-only-admin-session-secret" : undefined);
const sign = (value: string, secret: string) =>
  createHmac("sha256", secret).update(value).digest("hex");
const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export function validPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = sessionSecret();
  return !!expected && !!secret && safeEqual(sign(password, secret), sign(expected, secret));
}

export async function isAdmin() {
  const secret = sessionSecret();
  const value = (await cookies()).get(name)?.value;
  if (!secret || !value) return false;

  const [expiresAtValue, nonce, signature, ...extra] = value.split(".");
  const expiresAt = Number(expiresAtValue);
  if (extra.length || !nonce || !signature || !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  return safeEqual(signature, sign(`${expiresAtValue}.${nonce}`, secret));
}

export function adminCookie() {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must be configured outside development.");

  const expiresAt = Date.now() + sessionDurationSeconds * 1000;
  const nonce = randomBytes(32).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  return {
    name,
    value: `${payload}.${sign(payload, secret)}`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: sessionDurationSeconds,
    },
  };
}
