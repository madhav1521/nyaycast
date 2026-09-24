import { neon } from "@neondatabase/serverless";
import { getSiteContent } from "@/lib/site-content";
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

    // Get configured notification email from Site Content
    const site = await getSiteContent();
    const recipientEmail = site.notificationEmail || "manas0812@yopmail.com";

    // Dispatch email notification
    await sendConsultationEmail({
      recipientEmail,
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      clientMessage: message,
    });

    if (contentType.includes("application/json")) {
      return Response.json({
        success: true,
        message: API_MESSAGES.consultationReceived,
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
  recipientEmail,
  clientName,
  clientPhone,
  clientEmail,
  clientMessage,
}: {
  recipientEmail: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientMessage: string;
}) {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const subject = `📢 New Consultation Request from ${clientName}`;
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

  console.log(`[EMAIL NOTIFICATION TO ${recipientEmail}]`, {
    to: recipientEmail,
    subject,
    body: textContent,
  });

  // Optional: If Resend API Key is set in environment, send via Resend REST API
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Website Consultation <onboarding@resend.dev>",
          to: [recipientEmail],
          subject,
          text: textContent,
        }),
      });
    } catch (e) {
      console.error("Failed to send email via Resend:", e);
    }
  }
}
