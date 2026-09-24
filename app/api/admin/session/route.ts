import { adminCookie, validPassword } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { API_MESSAGES } from "@/constants/messages";
export async function POST(request: Request) {
  const { password } = await request.json();
  if (!validPassword(String(password)))
    return Response.json({ error: API_MESSAGES.invalidPassword }, { status: 401 });
  const cookie = adminCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("manas_admin");
  return response;
}
