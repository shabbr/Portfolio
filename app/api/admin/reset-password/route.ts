import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  consumePasswordResetToken,
  createSessionToken,
  isAdminAuthenticated,
  sessionCookieOptions,
  setAdminPassword,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = String(body.password ?? "");
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    // Logged-in password change
    if (!token) {
      if (!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!(await verifyAdminPassword(currentPassword))) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 401 },
        );
      }
      await setAdminPassword(password);
      return NextResponse.json({ success: true, message: "Password updated." });
    }

    // Token-based reset (forgot password)
    const valid = await consumePasswordResetToken(token);
    if (!valid) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    await setAdminPassword(password);
    const session = createSessionToken();
    const res = NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
    res.cookies.set(ADMIN_COOKIE, session, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
