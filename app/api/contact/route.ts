import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, getEmailConfig, sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const config = await getEmailConfig();
    if (!config.configured) {
      return NextResponse.json(
        {
          error:
            "Contact form is not configured yet. Open Admin → Email and add your Resend credentials.",
        },
        { status: 503 },
      );
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safeMessage = escapeHtml(String(message));

    const result = await sendEmail({
      to: config.toEmail,
      replyTo: String(email),
      subject: `[Portfolio] ${String(name)} sent you a message`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#1a100c;color:#fff2df;padding:32px;border-radius:16px;border:1px solid rgba(230,189,130,0.25)">
          <h2 style="color:#e6bd82;margin:0 0 24px">New message from your portfolio</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:rgba(230,189,130,0.75);width:80px">Name</td>
              <td style="padding:8px 0;color:#fff2df">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:rgba(230,189,130,0.75)">Email</td>
              <td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#e6bd82">${safeEmail}</a></td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(230,189,130,0.18);margin:20px 0"/>
          <p style="color:rgba(230,189,130,0.75);margin:0 0 8px;font-size:13px">Message</p>
          <p style="color:#fff2df;white-space:pre-wrap;margin:0">${safeMessage}</p>
        </div>
      `,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
