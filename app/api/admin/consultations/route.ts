import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { neon } from "@neondatabase/serverless";
import { API_MESSAGES } from "@/constants/messages";

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
