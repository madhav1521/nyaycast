export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) return Response.json({ ok: false }, { status: 403 });
    } catch {
      return Response.json({ ok: false }, { status: 403 });
    }
  }

  let choice: unknown;
  try {
    choice = (await request.json()).choice;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (choice !== "accepted" && choice !== "declined") return Response.json({ ok: false }, { status: 400 });

  const response = Response.json({ ok: true });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append("Set-Cookie", `manas_analytics_consent=${choice}; Max-Age=${365 * 24 * 60 * 60}; Path=/; HttpOnly; SameSite=Lax${secure}`);
  if (choice === "declined") {
    response.headers.append("Set-Cookie", `manas_analytics_visitor=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`);
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}