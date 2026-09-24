import { isAdmin } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import { revalidatePath } from "next/cache";
import { API_MESSAGES } from "@/constants/messages";
export async function GET() {
  return Response.json(await getSiteContent());
}
export async function PUT(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: API_MESSAGES.unauthorized }, { status: 401 });
  try {
    await saveSiteContent(await request.json());
    revalidatePath("/");
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : API_MESSAGES.unableToSave },
      { status: 500 },
    );
  }
}
