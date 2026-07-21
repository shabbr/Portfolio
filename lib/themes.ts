/** Canonical theme registry — add a theme here + a [data-theme] block in globals.css. */

export const THEME_IDS = [
  "copper",
  "slate",
  "emerald",
  "dark",
  "light",
  "azure",
  "violet",
] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  description: string;
  /** Accent swatch for admin / switcher UI */
  swatch: string;
  /** Browser chrome / meta theme-color */
  themeColor: string;
  /** CSS color-scheme for form controls / scrollbars */
  colorScheme: "dark" | "light";
};

export const THEMES: ThemeMeta[] = [
  {
    id: "copper",
    label: "Warm Bronze & Ember",
    description: "Executive warm obsidian with ember bronze & soft amber glow.",
    swatch: "#e27d60",
    themeColor: "#070504",
    colorScheme: "dark",
  },
  {
    id: "slate",
    label: "Midnight Platinum",
    description: "Luxury charcoal with ice-silver accents.",
    swatch: "#9eb6d4",
    themeColor: "#05070c",
    colorScheme: "dark",
  },
  {
    id: "emerald",
    label: "Deep Velvet Emerald",
    description: "Premium forest black, mint ice text & emerald neon accents.",
    swatch: "#10b981",
    themeColor: "#0b0f0e",
    colorScheme: "dark",
  },
  {
    id: "dark",
    label: "Obsidian Dark",
    description: "Mature charcoal navy, gold & indigo — from premium fintech UI.",
    swatch: "#d4af37",
    themeColor: "#0b0e14",
    colorScheme: "dark",
  },
  {
    id: "light",
    label: "Clean Light",
    description: "Bright surfaces with navy & electric blue accents.",
    swatch: "#2f5cff",
    themeColor: "#f4f5f8",
    colorScheme: "light",
  },
  {
    id: "azure",
    label: "Deep Cobalt & Indigo",
    description: "Modern enterprise SaaS — midnight, electric indigo & cyber cyan.",
    swatch: "#6366f1",
    themeColor: "#06080e",
    colorScheme: "dark",
  },
  {
    id: "violet",
    label: "Royal Violet",
    description: "Deep violet with soft lilac highlights.",
    swatch: "#a78bfa",
    themeColor: "#0a0712",
    colorScheme: "dark",
  },
];

export const DEFAULT_THEME_ID: ThemeId = "copper";

export const THEME_STORAGE_KEY = "portfolio-theme";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export function getThemeMeta(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export type ThemeSettings = {
  /** Site-wide default when visitor has no override. */
  defaultTheme: ThemeId;
  /** Themes visitors may pick (must include defaultTheme). */
  enabledThemes: ThemeId[];
  /** When false, no public switcher; always use defaultTheme. */
  switcherEnabled: boolean;
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  defaultTheme: DEFAULT_THEME_ID,
  enabledThemes: [...THEME_IDS],
  switcherEnabled: false,
};

/** Normalize raw settings into a valid ThemeSettings object. */
export function normalizeThemeSettings(
  raw: Partial<ThemeSettings> | null | undefined,
): ThemeSettings {
  const defaultTheme = isThemeId(raw?.defaultTheme)
    ? raw.defaultTheme
    : DEFAULT_THEME_ID;

  let enabledThemes = Array.isArray(raw?.enabledThemes)
    ? raw.enabledThemes.filter(isThemeId)
    : [...DEFAULT_THEME_SETTINGS.enabledThemes];

  if (enabledThemes.length === 0) {
    enabledThemes = [defaultTheme];
  }
  if (!enabledThemes.includes(defaultTheme)) {
    enabledThemes = [defaultTheme, ...enabledThemes];
  }

  return {
    defaultTheme,
    enabledThemes,
    switcherEnabled: Boolean(raw?.switcherEnabled),
  };
}

/** Resolve which theme a visitor should see. */
export function resolveVisitorTheme(
  settings: ThemeSettings,
  stored: string | null | undefined,
): ThemeId {
  if (
    settings.switcherEnabled &&
    isThemeId(stored) &&
    settings.enabledThemes.includes(stored)
  ) {
    return stored;
  }
  return settings.defaultTheme;
}
