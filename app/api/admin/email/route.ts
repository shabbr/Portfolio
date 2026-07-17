import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getEmailConfig } from "@/lib/email";
import { readSettings, updateSettings } from "@/lib/settings-store";

function maskKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) return "••••••••";
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await readSettings();
  const config = await getEmailConfig();

  return NextResponse.json({
    email: {
      resendApiKey: maskKey(settings.email.resendApiKey || process.env.RESEND_API_KEY || ""),
      resendApiKeySet: Boolean(config.resendApiKey),
      fromEmail: config.fromEmail,
      toEmail: config.toEmail,
      configured: config.configured,
      source:
        settings.email.resendApiKey.trim() || settings.email.toEmail.trim()
          ? "settings"
          : "env",
    },
    auth: {
      recoveryEmail: settings.auth.recoveryEmail || config.toEmail,
      hasCustomPassword: Boolean(settings.auth.passwordHash),
    },
  });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const fromEmail = String(body.fromEmail ?? "").trim();
    const toEmail = String(body.toEmail ?? "").trim();
    const recoveryEmail = String(body.recoveryEmail ?? "").trim();
    const resendApiKeyRaw = body.resendApiKey;
    const clearApiKey = body.clearApiKey === true;

    if (!fromEmail || !toEmail) {
      return NextResponse.json(
        { error: "From email and inbox (to) email are required." },
        { status: 400 },
      );
    }

    const next = await updateSettings((current) => {
      let resendApiKey = current.email.resendApiKey;
      if (clearApiKey) {
        resendApiKey = "";
      } else if (typeof resendApiKeyRaw === "string" && resendApiKeyRaw.trim()) {
        const value = resendApiKeyRaw.trim();
        // Ignore masked placeholder submissions
        if (!value.includes("••••")) {
          resendApiKey = value;
        }
      }

      return {
        ...current,
        email: {
          resendApiKey,
          fromEmail,
          toEmail,
        },
        auth: {
          ...current.auth,
          recoveryEmail: recoveryEmail || toEmail,
        },
      };
    });

    const config = await getEmailConfig();

    return NextResponse.json({
      success: true,
      email: {
        resendApiKey: maskKey(next.email.resendApiKey),
        resendApiKeySet: Boolean(config.resendApiKey),
        fromEmail: config.fromEmail,
        toEmail: config.toEmail,
        configured: config.configured,
        source: "settings",
      },
      auth: {
        recoveryEmail: next.auth.recoveryEmail || config.toEmail,
        hasCustomPassword: Boolean(next.auth.passwordHash),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to save email settings." }, { status: 500 });
  }
}
