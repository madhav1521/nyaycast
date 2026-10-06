import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { API_MESSAGES } from "@/constants/messages";
import { phoneDigits } from "@/lib/common";

export async function POST(request: Request) {
  try {
    let name = "";
    let phone = "";
    let email = "";
    let message = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = String(body.name || "").trim();
      phone = String(body.phone || "").trim();
      email = String(body.email || "").trim();
      message = String(body.message || "").trim();
    } else {
      const form = await request.formData();
      name = String(form.get("name") || "").trim();
      phone = String(form.get("phone") || "").trim();
      email = String(form.get("email") || "").trim();
      message = String(form.get("message") || "").trim();
    }

    if (!name || name.length < 2) {
      return Response.json(
        { error: API_MESSAGES.fullNameRequired },
        { status: 400 }
      );
    }

    if (!phone || phoneDigits(phone).length < 10) {
      return Response.json(
        { error: API_MESSAGES.phoneInvalid },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: API_MESSAGES.emailInvalid },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return Response.json(
        { error: API_MESSAGES.matterRequired },
        { status: 400 }
      );
    }

    // Save to Neon Database
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      await sql`INSERT INTO consultations (name, phone, email, message) VALUES (${name}, ${phone}, ${email}, ${message})`;
    }

    // Dispatch email notification after the request is safely stored.
    const emailDelivery = await sendConsultationEmail({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      clientMessage: message,
    });

    if (contentType.includes("application/json")) {
      return Response.json({
        success: true,
        message: API_MESSAGES.consultationReceived,
        emailSent: emailDelivery.sent,
      });
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/?consultation=received" },
    });
  } catch (error) {
    console.error("Consultation Submission Error:", error);
    return Response.json(
      { error: API_MESSAGES.internalServerError },
      { status: 500 }
    );
  }
}

async function sendConsultationEmail({
  clientName,
  clientPhone,
  clientEmail,
  clientMessage,
}: {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientMessage: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "Consultation email skipped: configure RESEND_API_KEY and RESEND_FROM_EMAIL."
    );
    return { sent: false };
  }

  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(from.replace(/^.*<|>.*$/g, "").trim())) {
    console.error("Invalid RESEND_FROM_EMAIL: provide an address at a verified sending domain.");
    return { sent: false };
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const subject = `New Consultation Request from ${clientName}`;
  const textContent = `New Legal Consultation Request
---------------------------------
Name: ${clientName}
Phone: ${clientPhone}
Email: ${clientEmail || "Not provided"}
Time: ${timestamp}

Client Message:
${clientMessage}

---------------------------------
View in Admin Inbox: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`;

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: ["manasagravat.adv@gmail.com"],
      replyTo: clientEmail || undefined,
      subject,
      text: textContent,
    });

    if (error) {
      console.error("Failed to send consultation email via Resend:", error.message);
      return { sent: false };
    }

    console.info("Consultation email sent via Resend:", data.id);
    return { sent: true };
  } catch (error) {
    console.error("Network error sending consultation email via Resend:", error);
    return { sent: false };
  }
}
