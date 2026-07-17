import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { escapeHtml, getEmailConfig, sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getEmailConfig();
    if (!config.configured) {
      return NextResponse.json(
        { error: "Save a Resend API key and inbox email before sending a test." },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const to = String(body.to ?? config.toEmail).trim() || config.toEmail;

    const result = await sendEmail({
      to,
      subject: "[Portfolio] Test email from admin dashboard",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#1a100c;color:#fff2df;border-radius:12px;border:1px solid rgba(230,189,130,.25)">
          <h2 style="margin:0 0 12px;color:#e6bd82">Email setup works</h2>
          <p style="margin:0;line-height:1.6">
            This is a test message from your portfolio admin dashboard.
            Contact form submissions will be delivered to
            <strong>${escapeHtml(config.toEmail)}</strong>.
          </p>
        </div>
      `,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, to });
  } catch {
    return NextResponse.json({ error: "Failed to send test email." }, { status: 500 });
  }
}
