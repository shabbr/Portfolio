"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  getThemeMeta,
  isThemeId,
  resolveVisitorTheme,
  type ThemeId,
  type ThemeMeta,
  type ThemeSettings,
} from "@/lib/themes";

export type PublicThemeConfig = ThemeSettings & {
  themes: ThemeMeta[];
};

type ThemeContextValue = {
  themeId: ThemeId;
  config: PublicThemeConfig;
  setTheme: (id: ThemeId) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_CHANGE_EVENT = "portfolio-themechange";

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", id);
  const meta = getThemeMeta(id);
  root.style.colorScheme = meta.colorScheme;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", meta.themeColor);
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { themeId: id } }));
}

function readStored(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(id: ThemeId | null) {
  try {
    if (id === null) localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* ignore quota / private mode */
  }
}

export function ThemeProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig: PublicThemeConfig;
}) {
  const [config, setConfig] = useState(initialConfig);
  const [themeId, setThemeId] = useState<ThemeId>(initialConfig.defaultTheme);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage + refresh public config
  useEffect(() => {
    let cancelled = false;

    const hydrate = (cfg: PublicThemeConfig) => {
      if (cancelled) return;
      setConfig(cfg);
      const resolved = resolveVisitorTheme(cfg, readStored());
      setThemeId(resolved);
      applyTheme(resolved);
      if (!cfg.switcherEnabled) {
        writeStored(null);
      }
      setReady(true);
    };

    hydrate(initialConfig);

    void fetch("/api/theme")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!json || cancelled) return;
        hydrate({
          defaultTheme: isThemeId(json.defaultTheme)
            ? json.defaultTheme
            : DEFAULT_THEME_ID,
          enabledThemes: Array.isArray(json.enabledThemes)
            ? json.enabledThemes.filter(isThemeId)
            : initialConfig.enabledThemes,
          switcherEnabled: Boolean(json.switcherEnabled),
          themes: Array.isArray(json.themes) ? json.themes : initialConfig.themes,
        });
      })
      .catch(() => {
        /* keep initialConfig */
      });

    return () => {
      cancelled = true;
    };
  }, [initialConfig]);

  // Keep DOM in sync if themeId changes
  useEffect(() => {
    if (!ready) return;
    applyTheme(themeId);
  }, [themeId, ready]);

  const setTheme = useCallback(
    (id: ThemeId) => {
      if (!config.switcherEnabled) return;
      if (!config.enabledThemes.includes(id)) return;
      setThemeId(id);
      applyTheme(id);
      writeStored(id);
    },
    [config.enabledThemes, config.switcherEnabled],
  );

  const value = useMemo(
    () => ({ themeId, config, setTheme, ready }),
    [themeId, config, setTheme, ready],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** Safe variant for optional UI that may render outside provider. */
export function useThemeOptional() {
  return useContext(ThemeContext);
}
