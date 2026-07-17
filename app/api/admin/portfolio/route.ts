import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readPortfolio, writePortfolio } from "@/lib/portfolio-store";
import type { PortfolioData } from "@/lib/portfolio-types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readPortfolio();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load portfolio." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = (await req.json()) as PortfolioData;
    if (!data?.site || !Array.isArray(data.projects) || !Array.isArray(data.experience)) {
      return NextResponse.json({ error: "Invalid portfolio payload." }, { status: 400 });
    }
    await writePortfolio(data);
    const saved = await readPortfolio();
    return NextResponse.json({ success: true, data: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save portfolio." }, { status: 500 });
  }
}
