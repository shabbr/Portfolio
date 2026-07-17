import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = String(body.password ?? "");

    if (!(await verifyAdminPassword(password))) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const token = createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
