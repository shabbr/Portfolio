import { NextResponse } from "next/server";
import { readSettings } from "@/lib/settings-store";
import { THEMES, getThemeMeta } from "@/lib/themes";

/** Public theme config — no secrets. */
export async function GET() {
  const { theme } = await readSettings();
  const enabled = theme.enabledThemes.map((id) => getThemeMeta(id));

  return NextResponse.json(
    {
      defaultTheme: theme.defaultTheme,
      enabledThemes: theme.enabledThemes,
      switcherEnabled: theme.switcherEnabled,
      themes: enabled,
      allThemes: THEMES.map((t) => ({
        id: t.id,
        label: t.label,
        description: t.description,
        swatch: t.swatch,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    },
  );
}
