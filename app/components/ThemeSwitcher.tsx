"use client";

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { useThemeOptional } from "./ThemeProvider";
import type { ThemeId } from "@/lib/themes";

/** Compact theme picker — only renders when admin enables the switcher. */
export default function ThemeSwitcher() {
  const ctx = useThemeOptional();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!ctx) return null;
  const { config, themeId, setTheme } = ctx;
  if (!config.switcherEnabled || config.enabledThemes.length < 2) return null;

  const options = config.themes.filter((t) =>
    config.enabledThemes.includes(t.id as ThemeId),
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        aria-expanded={open}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: "var(--muted)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--fg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--muted)";
        }}
      >
        <Palette size={18} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 min-w-[160px] rounded-xl overflow-hidden z-[60] py-1"
          style={{
            background: "var(--bg-nav-scrolled)",
            border: "1px solid var(--border)",
            boxShadow: "0 12px 40px color-mix(in srgb, var(--bg) 55%, transparent)",
          }}
          role="listbox"
          aria-label="Themes"
        >
          {options.map((t) => {
            const active = t.id === themeId;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setTheme(t.id as ThemeId);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium transition-colors"
                style={{
                  color: active ? "var(--accent-2)" : "var(--muted)",
                  background: active
                    ? "color-mix(in srgb, var(--accent) 14%, transparent)"
                    : "transparent",
                }}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: t.swatch,
                    boxShadow: active ? `0 0 0 2px var(--bg), 0 0 0 3px ${t.swatch}` : undefined,
                  }}
                />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
