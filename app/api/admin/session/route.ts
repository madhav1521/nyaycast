import { adminCookie, isAdmin, validPassword } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { API_MESSAGES } from "@/constants/messages";

export async function GET() {
  return Response.json({ authenticated: await isAdmin() });
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!validPassword(String(password)))
      return Response.json({ error: API_MESSAGES.invalidPassword }, { status: 401 });
    const cookie = adminCookie();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return Response.json({ error: API_MESSAGES.internalServerError }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("manas_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
