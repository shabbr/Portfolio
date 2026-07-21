/**
 * Read live CSS design tokens for canvas / Three.js code that cannot use CSS.
 * Call after mount (or when data-theme changes).
 */
export type ThemeColors = {
  bg: string;
  bgElevated: string;
  fg: string;
  accent: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accentRgb: string;
  accent2Rgb: string;
  accent3Rgb: string;
  accent4Rgb: string;
  fgRgb: string;
};

const FALLBACK: ThemeColors = {
  bg: "#070504",
  bgElevated: "#120f0d",
  fg: "#f5f4f0",
  accent: "#e27d60",
  accent2: "#f4a261",
  accent3: "#c96a50",
  accent4: "#8a4a38",
  accentRgb: "226, 125, 96",
  accent2Rgb: "244, 162, 97",
  accent3Rgb: "201, 106, 80",
  accent4Rgb: "138, 74, 56",
  fgRgb: "245, 244, 240",
};

function cssVar(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const v = styles.getPropertyValue(name).trim();
  return v || fallback;
}

export function readThemeColors(
  el: Element | null = typeof document !== "undefined" ? document.documentElement : null,
): ThemeColors {
  if (!el || typeof getComputedStyle === "undefined") return { ...FALLBACK };
  const s = getComputedStyle(el);
  return {
    bg: cssVar(s, "--bg", FALLBACK.bg),
    bgElevated: cssVar(s, "--bg-elevated", FALLBACK.bgElevated),
    fg: cssVar(s, "--fg", FALLBACK.fg),
    accent: cssVar(s, "--accent", FALLBACK.accent),
    accent2: cssVar(s, "--accent-2", FALLBACK.accent2),
    accent3: cssVar(s, "--accent-3", FALLBACK.accent3),
    accent4: cssVar(s, "--accent-4", FALLBACK.accent4),
    accentRgb: cssVar(s, "--accent-rgb", FALLBACK.accentRgb),
    accent2Rgb: cssVar(s, "--accent-2-rgb", FALLBACK.accent2Rgb),
    accent3Rgb: cssVar(s, "--accent-3-rgb", FALLBACK.accent3Rgb),
    accent4Rgb: cssVar(s, "--accent-4-rgb", FALLBACK.accent4Rgb),
    fgRgb: cssVar(s, "--fg-rgb", FALLBACK.fgRgb),
  };
}

/** Parse "r, g, b" token into a CSS rgb()/rgba() string. */
export function rgba(rgbToken: string, alpha: number): string {
  return `rgba(${rgbToken}, ${alpha})`;
}
