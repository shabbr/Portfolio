import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isBlobConfigured, isVercelRuntime } from "@/lib/blob-store";
import { writePortfolio } from "@/lib/portfolio-store";
import type { PortfolioData } from "@/lib/portfolio-types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { loadPortfolio } = await import("@/lib/portfolio-store");
    const data = await loadPortfolio();
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

    if (isVercelRuntime() && !isBlobConfigured()) {
      return NextResponse.json(
        {
          error:
            "Live saves need Vercel Blob. Open Vercel → Storage → Create Blob store for this project, connect it, then Redeploy. Local file saves cannot persist on Vercel.",
        },
        { status: 503 },
      );
    }

    const saved = await writePortfolio(data);
    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, data: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save portfolio.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
