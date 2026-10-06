import { neon } from "@neondatabase/serverless";
import { isAdmin } from "@/lib/admin-auth";
import { API_MESSAGES } from "@/constants/messages";

function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ error: API_MESSAGES.unauthorized }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: API_MESSAGES.databaseNotConfigured }, { status: 500 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, name, phone, email, message, status, admin_notes, created_at, updated_at
      FROM consultations ORDER BY created_at DESC
    `;
    const columns = ["id", "name", "phone", "email", "message", "status", "admin_notes", "created_at", "updated_at"] as const;
    const csv = [
      columns.map(csvCell).join(","),
      ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
    ].join("\r\n");

    return new Response(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="consultations.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export consultations:", error);
    return Response.json({ error: API_MESSAGES.internalServerError }, { status: 500 });
  }
}