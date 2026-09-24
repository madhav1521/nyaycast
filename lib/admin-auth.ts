import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
const name = "manas_admin";
const sign = (value: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "change-this-before-production")
    .update(value)
    .digest("hex");
export function validPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && timingSafeEqual(Buffer.from(sign(password)), Buffer.from(sign(expected)));
}
export async function isAdmin() {
  return (await cookies()).get(name)?.value === `admin.${sign("admin")}`;
}
export function adminCookie() {
  return {
    name,
    value: `admin.${sign("admin")}`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 28800,
    },
  };
}
