import { promises as fs } from "fs";
import path from "path";
import {
  cmsWriteUnavailableMessage,
  hasRemoteCmsBackend,
  readCmsDocument,
  storageWriteHint,
  writeCmsDocument,
} from "./cms-store";

export type EmailSettings = {
  resendApiKey: string;
  fromEmail: string;
  toEmail: string;
};

export type AuthSettings = {
  /** scrypt hash (`salt:hash`). Null means fall back to ADMIN_PASSWORD env. */
  passwordHash: string | null;
  /** Email that may request a password reset. */
  recoveryEmail: string;
  resetTokenHash: string | null;
  resetTokenExpires: number | null;
};

export type AppSettings = {
  email: EmailSettings;
  auth: AuthSettings;
};

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

function defaultsFromEnv(): AppSettings {
  return {
    email: {
      resendApiKey: process.env.RESEND_API_KEY ?? "",
      fromEmail: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      toEmail: process.env.RESEND_TO_EMAIL ?? "",
    },
    auth: {
      passwordHash: null,
      recoveryEmail: process.env.ADMIN_RECOVERY_EMAIL ?? process.env.RESEND_TO_EMAIL ?? "",
      resetTokenHash: null,
      resetTokenExpires: null,
    },
  };
}

function mergeSettings(raw: Partial<AppSettings> | null | undefined): AppSettings {
  const base = defaultsFromEnv();
  return {
    email: {
      resendApiKey: raw?.email?.resendApiKey ?? base.email.resendApiKey,
      fromEmail: raw?.email?.fromEmail ?? base.email.fromEmail,
      toEmail: raw?.email?.toEmail ?? base.email.toEmail,
    },
    auth: {
      passwordHash: raw?.auth?.passwordHash ?? base.auth.passwordHash,
      recoveryEmail: raw?.auth?.recoveryEmail ?? base.auth.recoveryEmail,
      resetTokenHash: raw?.auth?.resetTokenHash ?? null,
      resetTokenExpires: raw?.auth?.resetTokenExpires ?? null,
    },
  };
}

async function readSettingsFromDisk(): Promise<AppSettings | null> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf8");
    return mergeSettings(JSON.parse(raw) as Partial<AppSettings>);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

export async function readSettings(): Promise<AppSettings> {
  const remote = await readCmsDocument<Partial<AppSettings>>("settings");
  if (remote) return mergeSettings(remote);

  const disk = await readSettingsFromDisk();
  const seeded = disk ?? defaultsFromEnv();

  if (hasRemoteCmsBackend()) {
    try {
      await writeCmsDocument("settings", seeded);
    } catch {
      // env/disk defaults still apply
    }
  }

  return seeded;
}

export async function writeSettings(settings: AppSettings): Promise<void> {
  if (hasRemoteCmsBackend()) {
    await writeCmsDocument("settings", settings);
    try {
      const dir = path.dirname(SETTINGS_PATH);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n", "utf8");
    } catch {
      // ignore disk mirror failures on Vercel
    }
    return;
  }

  try {
    const dir = path.dirname(SETTINGS_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n", "utf8");
  } catch (err) {
    throw new Error(storageWriteHint(err) || cmsWriteUnavailableMessage());
  }
}

export async function updateSettings(
  patch: (current: AppSettings) => AppSettings,
): Promise<AppSettings> {
  const current = await readSettings();
  const next = patch(current);
  await writeSettings(next);
  return next;
}
