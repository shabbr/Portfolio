import { NextResponse } from "next/server";
import { readPortfolio } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readPortfolio();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load portfolio." }, { status: 500 });
  }
}
