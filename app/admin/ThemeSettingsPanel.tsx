"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Palette, Save } from "lucide-react";
import type { ThemeId, ThemeMeta, ThemeSettings } from "@/lib/themes";

const fieldClass =
  "w-full rounded-xl px-3 py-2.5 text-sm bg-[rgba(31,18,12,0.85)] border border-[rgba(230,189,130,0.18)] text-[#fff2df] outline-none focus:border-[rgba(230,189,130,0.55)]";
const labelClass =
  "block text-[11px] uppercase tracking-[.16em] mb-1.5 text-[rgba(230,189,130,0.75)]";
const cardClass =
  "rounded-2xl p-4 sm:p-5 border border-[rgba(230,189,130,0.14)] bg-[linear-gradient(145deg,rgba(70,43,27,.55),rgba(24,14,10,.78))]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1d1009] disabled:opacity-60";

export default function ThemeSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState<ThemeMeta[]>([]);
  const [defaultTheme, setDefaultTheme] = useState<ThemeId>("copper");
  const [enabledThemes, setEnabledThemes] = useState<ThemeId[]>(["copper"]);
  const [switcherEnabled, setSwitcherEnabled] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/theme");
      if (!res.ok) throw new Error("Failed to load theme settings");
      const json = await res.json();
      const theme = json.theme as ThemeSettings;
      setCatalog(json.catalog as ThemeMeta[]);
      setDefaultTheme(theme.defaultTheme);
      setEnabledThemes(theme.enabledThemes);
      setSwitcherEnabled(theme.switcherEnabled);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleEnabled = (id: ThemeId) => {
    setEnabledThemes((prev) => {
      if (prev.includes(id)) {
        if (id === defaultTheme) return prev; // default must stay enabled
        if (prev.length <= 1) return prev;
        return prev.filter((t) => t !== id);
      }
      return [...prev, id];
    });
  };

  const onDefaultChange = (id: ThemeId) => {
    setDefaultTheme(id);
    setEnabledThemes((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultTheme,
          enabledThemes,
          switcherEnabled,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      const theme = json.theme as ThemeSettings;
      setDefaultTheme(theme.defaultTheme);
      setEnabledThemes(theme.enabledThemes);
      setSwitcherEnabled(theme.switcherEnabled);
      setMessage("Theme settings saved. Visitors will pick up changes shortly.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[rgba(230,189,130,0.7)]">
        <Loader2 className="animate-spin" size={16} /> Loading theme settings…
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-5 max-w-2xl">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(212,154,87,0.14)",
            color: "#e6bd82",
            border: "1px solid rgba(230,189,130,0.22)",
          }}
        >
          <Palette size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#fff2df]">Theme</h2>
          <p className="text-xs mt-1 leading-relaxed text-[rgba(222,228,236,0.65)]">
            Set the site default, which themes visitors may use, and whether the
            public theme switcher is shown. Visitors can override locally when
            the switcher is enabled.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-300/90 rounded-xl px-3 py-2 border border-red-400/30 bg-red-950/30">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-[#e6bd82] rounded-xl px-3 py-2 border border-[rgba(230,189,130,0.22)] bg-[rgba(92,56,35,0.25)]">
          {message}
        </p>
      )}

      <div className={cardClass}>
        <label className={labelClass} htmlFor="default-theme">
          Default theme
        </label>
        <select
          id="default-theme"
          className={fieldClass}
          value={defaultTheme}
          onChange={(e) => onDefaultChange(e.target.value as ThemeId)}
        >
          {catalog.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="text-[11px] mt-2 text-[rgba(222,228,236,0.5)]">
          Used for first visits and when the switcher is off.
        </p>
      </div>

      <div className={cardClass}>
        <p className={labelClass}>Available to visitors</p>
        <ul className="space-y-2">
          {catalog.map((t) => {
            const checked = enabledThemes.includes(t.id);
            const locked = t.id === defaultTheme;
            return (
              <li key={t.id}>
                <label
                  className={`flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer border transition ${
                    checked
                      ? "border-[rgba(230,189,130,0.35)] bg-[rgba(92,56,35,0.28)]"
                      : "border-[rgba(230,189,130,0.12)] bg-[rgba(0,0,0,0.15)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    disabled={locked}
                    onChange={() => toggleEnabled(t.id)}
                  />
                  <span
                    className="mt-1 w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ background: t.swatch }}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[#fff2df]">
                      {t.label}
                      {locked ? (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-[rgba(230,189,130,0.55)]">
                          default
                        </span>
                      ) : null}
                    </span>
                    <span className="block text-[11px] mt-0.5 text-[rgba(222,228,236,0.55)]">
                      {t.description}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cardClass}>
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <span>
            <span className="block text-sm font-medium text-[#fff2df]">
              Show theme switcher on site
            </span>
            <span className="block text-[11px] mt-1 text-[rgba(222,228,236,0.55)]">
              When off, everyone sees the default theme (local overrides ignored).
            </span>
          </span>
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={switcherEnabled}
            onChange={(e) => setSwitcherEnabled(e.target.checked)}
          />
        </label>
        {switcherEnabled && enabledThemes.length < 2 && (
          <p className="text-[11px] mt-3 text-amber-200/80">
            Enable at least two themes so the switcher has something to show.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className={btnPrimary}
        style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save theme settings
      </button>
    </form>
  );
}
