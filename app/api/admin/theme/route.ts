import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readSettings, updateSettings } from "@/lib/settings-store";
import {
  THEMES,
  isThemeId,
  normalizeThemeSettings,
  type ThemeId,
} from "@/lib/themes";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { theme } = await readSettings();
  return NextResponse.json({
    theme,
    catalog: THEMES,
  });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const defaultTheme = body.defaultTheme;
    const enabledThemesRaw = body.enabledThemes;
    const switcherEnabled = Boolean(body.switcherEnabled);

    if (!isThemeId(defaultTheme)) {
      return NextResponse.json(
        { error: "Invalid default theme." },
        { status: 400 },
      );
    }

    if (!Array.isArray(enabledThemesRaw)) {
      return NextResponse.json(
        { error: "enabledThemes must be an array." },
        { status: 400 },
      );
    }

    const enabledThemes = enabledThemesRaw.filter(isThemeId) as ThemeId[];
    if (!enabledThemes.includes(defaultTheme)) {
      return NextResponse.json(
        { error: "Default theme must be included in enabled themes." },
        { status: 400 },
      );
    }

    const next = await updateSettings((current) => ({
      ...current,
      theme: normalizeThemeSettings({
        defaultTheme,
        enabledThemes,
        switcherEnabled,
      }),
    }));

    return NextResponse.json({ success: true, theme: next.theme, catalog: THEMES });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save theme settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
