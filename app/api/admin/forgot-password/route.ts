import { NextRequest, NextResponse } from "next/server";
import {
  appBaseUrl,
  createPasswordResetToken,
  getRecoveryEmail,
} from "@/lib/admin-auth";
import { escapeHtml, getEmailConfig, sendEmail } from "@/lib/email";

function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const recoveryEmail = await getRecoveryEmail();
    const config = await getEmailConfig();

    // Always return a generic success message to avoid account enumeration.
    const generic = {
      success: true,
      message:
        "If that email matches the admin recovery address and email is configured, a reset link has been sent.",
    };

    if (!recoveryEmail || !emailsMatch(email, recoveryEmail)) {
      return NextResponse.json(generic);
    }

    if (!config.resendApiKey) {
      return NextResponse.json(
        {
          error:
            "Email is not configured yet. Set Resend credentials in the admin Email tab (or .env) first, then try again. If you still have the current password, sign in and configure email.",
        },
        { status: 503 },
      );
    }

    const token = await createPasswordResetToken();
    const base = appBaseUrl(req.url);
    const resetUrl = `${base}/admin/reset-password?token=${encodeURIComponent(token)}`;

    const result = await sendEmail({
      to: recoveryEmail,
      subject: "[Portfolio] Reset your admin password",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#1a100c;color:#fff2df;border-radius:12px;border:1px solid rgba(230,189,130,.25)">
          <h2 style="margin:0 0 12px;color:#e6bd82">Password reset</h2>
          <p style="margin:0 0 16px;line-height:1.6">
            Someone requested a password reset for your portfolio admin dashboard.
            This link expires in 1 hour.
          </p>
          <p style="margin:0 0 20px">
            <a href="${escapeHtml(resetUrl)}"
              style="display:inline-block;padding:12px 18px;border-radius:10px;background:linear-gradient(135deg,#e6bd82,#c47d45);color:#1d1009;font-weight:700;text-decoration:none">
              Reset password
            </a>
          </p>
          <p style="margin:0;font-size:12px;color:rgba(239,222,201,.65);word-break:break-all">
            Or open: ${escapeHtml(resetUrl)}
          </p>
        </div>
      `,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(generic);
  } catch {
    return NextResponse.json({ error: "Failed to process reset request." }, { status: 500 });
  }
}
