import { Resend } from "resend";
import { readSettings, type EmailSettings } from "./settings-store";

export type ResolvedEmailConfig = EmailSettings & { configured: boolean };

export async function getEmailConfig(): Promise<ResolvedEmailConfig> {
  const settings = await readSettings();
  const resendApiKey =
    settings.email.resendApiKey.trim() || process.env.RESEND_API_KEY?.trim() || "";
  const fromEmail =
    settings.email.fromEmail.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "onboarding@resend.dev";
  const toEmail =
    settings.email.toEmail.trim() || process.env.RESEND_TO_EMAIL?.trim() || "";

  return {
    resendApiKey,
    fromEmail,
    toEmail,
    configured: Boolean(resendApiKey && toEmail),
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
};

export async function sendEmail(
  args: SendArgs,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = await getEmailConfig();
  if (!config.resendApiKey) {
    return { ok: false, error: "Email is not configured. Add a Resend API key in Admin → Email." };
  }

  const resend = new Resend(config.resendApiKey);
  const { error } = await resend.emails.send({
    from: args.from ?? config.fromEmail,
    to: args.to,
    subject: args.subject,
    html: args.html,
    replyTo: args.replyTo,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
