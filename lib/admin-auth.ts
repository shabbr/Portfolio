import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";
import { readSettings, updateSettings } from "./settings-store";

export const ADMIN_COOKIE = "portfolio_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-admin-secret";
}

function getEnvPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const settings = await readSettings();
  if (settings.auth.passwordHash) {
    return verifyPasswordHash(password, settings.auth.passwordHash);
  }
  return safeEqual(password, getEnvPassword());
}

export async function setAdminPassword(password: string): Promise<void> {
  const passwordHash = hashPassword(password);
  await updateSettings((current) => ({
    ...current,
    auth: {
      ...current.auth,
      passwordHash,
      resetTokenHash: null,
      resetTokenExpires: null,
    },
  }));
}

export async function getRecoveryEmail(): Promise<string> {
  const settings = await readSettings();
  return (
    settings.auth.recoveryEmail.trim() ||
    settings.email.toEmail.trim() ||
    process.env.ADMIN_RECOVERY_EMAIL?.trim() ||
    process.env.RESEND_TO_EMAIL?.trim() ||
    ""
  );
}

export async function createPasswordResetToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = sign(token);
  const expires = Date.now() + RESET_TTL_MS;
  await updateSettings((current) => ({
    ...current,
    auth: {
      ...current.auth,
      resetTokenHash: tokenHash,
      resetTokenExpires: expires,
    },
  }));
  return token;
}

export async function consumePasswordResetToken(
  token: string,
): Promise<boolean> {
  const settings = await readSettings();
  const { resetTokenHash, resetTokenExpires } = settings.auth;
  if (!resetTokenHash || !resetTokenExpires) return false;
  if (Date.now() > resetTokenExpires) return false;
  if (!safeEqual(resetTokenHash, sign(token))) return false;

  await updateSettings((current) => ({
    ...current,
    auth: {
      ...current.auth,
      resetTokenHash: null,
      resetTokenExpires: null,
    },
  }));
  return true;
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  const [, expRaw] = payload.split(":");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return isValidSessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function appBaseUrl(reqUrl: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  try {
    const url = new URL(reqUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:3000";
  }
}
