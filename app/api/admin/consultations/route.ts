import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { neon } from "@neondatabase/serverless";
import { API_MESSAGES } from "@/constants/messages";

const consultationStatuses = ["new", "contacted", "in_progress", "resolved", "archived"] as const;

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: API_MESSAGES.unauthorized }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: API_MESSAGES.databaseNotConfigured }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const consultations = await sql`SELECT * FROM consultations ORDER BY created_at DESC`;

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Failed to fetch consultations:", error);
    return NextResponse.json({ error: API_MESSAGES.internalServerError }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: API_MESSAGES.unauthorized }, { status: 401 });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: API_MESSAGES.databaseNotConfigured }, { status: 500 });
    }

    const body = await request.json();
    const id = Number(body.id);
    const status = body.status;
    const adminNotes = body.adminNotes;
    if (!Number.isSafeInteger(id) || id < 1) {
      return NextResponse.json({ error: "A valid consultation ID is required." }, { status: 400 });
    }
    if (status !== undefined && !consultationStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid consultation status." }, { status: 400 });
    }
    if (adminNotes !== undefined && (typeof adminNotes !== "string" || adminNotes.length > 5000)) {
      return NextResponse.json({ error: "Notes must be 5,000 characters or fewer." }, { status: 400 });
    }
    if (status === undefined && adminNotes === undefined) {
      return NextResponse.json({ error: "No consultation changes were provided." }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const [updated] = await sql`
      UPDATE consultations
      SET status = COALESCE(${status ?? null}, status),
          admin_notes = COALESCE(${adminNotes ?? null}, admin_notes),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, status, admin_notes, updated_at
    `;
    if (!updated) return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update consultation:", error);
    return NextResponse.json({ error: API_MESSAGES.internalServerError }, { status: 500 });
  }
}
