"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Code2,
  Eye,
  EyeOff,
  FolderKanban,
  LayoutDashboard,
  Link2,
  Loader2,
  KeyRound,
  LogOut,
  Mail,
  Palette,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
import type {
  AboutHighlight,
  ExperienceItem,
  NavLink,
  PortfolioData,
  ProjectItem,
  SkillCategory,
  SkillLevel,
} from "@/lib/portfolio-types";
import { createId, reindexOrder, sortByOrder } from "@/lib/portfolio-types";
import EmailSettingsPanel from "./EmailSettingsPanel";
import PasswordSettingsPanel from "./PasswordSettingsPanel";
import ThemeSettingsPanel from "./ThemeSettingsPanel";

type TabId =
  | "overview"
  | "site"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "nav"
  | "email"
  | "theme"
  | "security";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "site", label: "Site Info", icon: <Settings2 size={16} /> },
  { id: "about", label: "About", icon: <UserRound size={16} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
  { id: "projects", label: "Projects", icon: <FolderKanban size={16} /> },
  { id: "skills", label: "Skills", icon: <Wrench size={16} /> },
  { id: "nav", label: "Navigation", icon: <Link2 size={16} /> },
  { id: "email", label: "Email", icon: <Mail size={16} /> },
  { id: "theme", label: "Theme", icon: <Palette size={16} /> },
  { id: "security", label: "Password", icon: <KeyRound size={16} /> },
];
const fieldClass =
  "w-full rounded-xl px-3 py-2.5 text-sm bg-[rgba(31,18,12,0.85)] border border-[rgba(230,189,130,0.18)] text-[#fff2df] outline-none focus:border-[rgba(230,189,130,0.55)]";
const labelClass = "block text-[11px] uppercase tracking-[.16em] mb-1.5 text-[rgba(230,189,130,0.75)]";
const cardClass =
  "rounded-2xl p-4 sm:p-5 border border-[rgba(230,189,130,0.14)] bg-[linear-gradient(145deg,rgba(70,43,27,.55),rgba(24,14,10,.78))]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1d1009] disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs border border-[rgba(230,189,130,0.22)] text-[#e6bd82] hover:bg-[rgba(92,56,35,0.35)] transition";

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function AdminApp() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "forgot">("login");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSending, setForgotSending] = useState(false);

  const [data, setData] = useState<PortfolioData | null>(null);
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabId>("overview");

  const dirty = useMemo(
    () => (data ? JSON.stringify(data) !== baseline : false),
    [data, baseline],
  );

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me");
      setAuthenticated(res.ok);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load portfolio");
      const json = (await res.json()) as PortfolioData;
      setData(json);
      setBaseline(JSON.stringify(json));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authenticated) void loadPortfolio();
  }, [authenticated, loadPortfolio]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || "Login failed");
        return;
      }
      setPassword("");
      setAuthenticated(true);
    } catch {
      setLoginError("Network error");
    } finally {
      setLoggingIn(false);
    }
  };

  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSending(true);
    setForgotError("");
    setForgotMessage("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const json = await res.json();
      if (!res.ok) {
        setForgotError(json.error || "Could not send reset email");
        return;
      }
      setForgotMessage(json.message || "Check your inbox for a reset link.");
    } catch {
      setForgotError("Network error");
    } finally {
      setForgotSending(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setData(null);
    setBaseline("");
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setData(json.data);
      setBaseline(JSON.stringify(json.data));
      setMessage("Portfolio saved successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-[#e6bd82]" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        {loginMode === "login" ? (
          <form onSubmit={login} className={`${cardClass} w-full max-w-md space-y-5`}>
            <div>
              <div className="inline-flex items-center gap-2 text-[#e6bd82] text-xs uppercase tracking-[.2em] mb-2">
                <Sparkles size={14} /> Portfolio CMS
              </div>
              <h1 className="text-2xl font-bold">Admin Login</h1>
              <p className="text-sm mt-1 text-[rgba(239,222,201,0.65)]">
                Sign in to manage site content, projects, experience, and skills.
              </p>
            </div>
            <div>
              <label className={labelClass} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className={btnPrimary}
              style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)", width: "100%" }}
            >
              {loggingIn ? <Loader2 size={16} className="animate-spin" /> : null}
              {loggingIn ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              className="w-full text-sm text-[#e6bd82] hover:underline"
              onClick={() => {
                setLoginMode("forgot");
                setLoginError("");
                setForgotError("");
                setForgotMessage("");
              }}
            >
              Forgot password?
            </button>
            <p className="text-[11px] text-[rgba(215,185,144,0.55)]">
              Default local password is in <code>.env.local</code> as <code>ADMIN_PASSWORD</code>.
            </p>
          </form>
        ) : (
          <form onSubmit={requestPasswordReset} className={`${cardClass} w-full max-w-md space-y-5`}>
            <div>
              <div className="inline-flex items-center gap-2 text-[#e6bd82] text-xs uppercase tracking-[.2em] mb-2">
                <Mail size={14} /> Password reset
              </div>
              <h1 className="text-2xl font-bold">Forgot password</h1>
              <p className="text-sm mt-1 text-[rgba(239,222,201,0.65)]">
                Enter your admin recovery email. We&apos;ll send a one-hour reset link if it matches.
              </p>
            </div>
            <div>
              <label className={labelClass} htmlFor="recovery">Recovery email</label>
              <input
                id="recovery"
                type="email"
                className={fieldClass}
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            {forgotError && <p className="text-sm text-red-400">{forgotError}</p>}
            {forgotMessage && <p className="text-sm text-emerald-300">{forgotMessage}</p>}
            <button
              type="submit"
              disabled={forgotSending}
              className={btnPrimary}
              style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)", width: "100%" }}
            >
              {forgotSending ? <Loader2 size={16} className="animate-spin" /> : null}
              {forgotSending ? "Sending..." : "Send reset link"}
            </button>
            <button
              type="button"
              className="w-full text-sm text-[#e6bd82] hover:underline"
              onClick={() => {
                setLoginMode("login");
                setForgotError("");
                setForgotMessage("");
              }}
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen grid place-items-center gap-3">
        <Loader2 className="animate-spin text-[#e6bd82]" />
        <p className="text-sm text-[rgba(239,222,201,0.7)]">Loading portfolio data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[rgba(230,189,130,0.12)] bg-[rgba(12,7,5,0.92)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[.22em] text-[#e6bd82]">Portfolio CMS</p>
            <h1 className="text-lg font-bold">{data.site.fullName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {dirty && (
              <span className="text-xs px-2.5 py-1 rounded-full border border-amber-500/40 text-amber-300">
                Unsaved changes
              </span>
            )}
            {message && <span className="text-xs text-emerald-300">{message}</span>}
            {error && <span className="text-xs text-red-400">{error}</span>}
            <a href="/" target="_blank" rel="noreferrer" className={btnGhost}>
              <Eye size={14} /> View site
            </a>
            <button
              type="button"
              onClick={() => void save()}
              disabled={!dirty || saving}
              className={btnPrimary}
              style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving..." : "Save all"}
            </button>
            <button type="button" onClick={() => void logout()} className={btnGhost}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-1 lg:sticky lg:top-24 lg:self-start">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                tab === t.id
                  ? "bg-[rgba(92,56,35,0.55)] text-[#e6bd82] border border-[rgba(230,189,130,0.28)]"
                  : "text-[rgba(239,222,201,0.72)] hover:bg-[rgba(92,56,35,0.28)]"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </aside>

        <main className="space-y-5 min-w-0">
          {tab === "overview" && <OverviewTab data={data} onGo={setTab} />}
          {tab === "site" && <SiteTab data={data} setData={setData} />}
          {tab === "about" && <AboutTab data={data} setData={setData} />}
          {tab === "experience" && <ExperienceTab data={data} setData={setData} />}
          {tab === "projects" && <ProjectsTab data={data} setData={setData} />}
          {tab === "skills" && <SkillsTab data={data} setData={setData} />}
          {tab === "nav" && <NavTab data={data} setData={setData} />}
          {tab === "email" && <EmailSettingsPanel />}
          {tab === "theme" && <ThemeSettingsPanel />}
          {tab === "security" && <PasswordSettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function OverviewTab({ data, onGo }: { data: PortfolioData; onGo: (t: TabId) => void }) {
  const cards = [
    { label: "Experience", value: data.experience.length, tab: "experience" as TabId },
    { label: "Projects", value: data.projects.length, tab: "projects" as TabId },
    { label: "Skill levels", value: data.skillLevels.length, tab: "skills" as TabId },
    { label: "Nav links", value: data.navLinks.length, tab: "nav" as TabId },
  ];
  return (
    <div className="space-y-5">
      <div className={cardClass}>
        <h2 className="text-xl font-bold mb-2">Dashboard</h2>
        <p className="text-sm text-[rgba(239,222,201,0.7)]">
          Manage every section of your portfolio from here. Edit records, reorder items, toggle visibility, then click Save all.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((c) => (
          <button key={c.label} type="button" onClick={() => onGo(c.tab)} className={`${cardClass} text-left hover:border-[rgba(230,189,130,0.35)] transition`}>
            <p className="text-xs uppercase tracking-[.16em] text-[#e6bd82]">{c.label}</p>
            <p className="text-3xl font-bold mt-2">{c.value}</p>
          </button>
        ))}
      </div>
      <div className={cardClass}>
        <p className="text-sm"><span className="text-[#e6bd82]">Email:</span> {data.site.email}</p>
        <p className="text-sm mt-1"><span className="text-[#e6bd82]">GitHub:</span> {data.site.github}</p>
        <p className="text-sm mt-1"><span className="text-[#e6bd82]">LinkedIn:</span> {data.site.linkedin}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => onGo("email")}
            className="text-sm text-[#e6bd82] hover:underline"
          >
            Configure contact email delivery →
          </button>
          <button
            type="button"
            onClick={() => onGo("theme")}
            className="text-sm text-[#e6bd82] hover:underline"
          >
            Theme & visitor switcher →
          </button>
        </div>
      </div>
    </div>
  );
}

function SiteTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  const site = data.site;
  const set = (key: keyof typeof site, value: string) =>
    setData((prev) => (prev ? { ...prev, site: { ...prev.site, [key]: value } } : prev));

  const fields: { key: keyof typeof site; label: string }[] = [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "fullName", label: "Full name" },
    { key: "initials", label: "Initials" },
    { key: "title", label: "Title" },
    { key: "tagline", label: "Tagline" },
    { key: "location", label: "Location" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone / WhatsApp (e.g. +92 327 7798112)" },
    { key: "linkedin", label: "LinkedIn URL" },
    { key: "linkedinHandle", label: "LinkedIn handle" },
    { key: "github", label: "GitHub URL" },
    { key: "githubHandle", label: "GitHub handle" },
    { key: "website", label: "Website" },
    { key: "yearsExp", label: "Years experience label" },
  ];

  return (
    <div className={`${cardClass} space-y-4`}>
      <div className="flex items-center gap-2">
        <Code2 size={18} className="text-[#e6bd82]" />
        <h2 className="text-lg font-bold">Site information</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key} className={key === "tagline" ? "sm:col-span-2" : ""}>
            <label className={labelClass}>{label}</label>
            {key === "tagline" ? (
              <textarea className={`${fieldClass} min-h-[90px]`} value={site[key]} onChange={(e) => set(key, e.target.value)} />
            ) : (
              <input className={fieldClass} value={site[key]} onChange={(e) => set(key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  const about = data.about;
  const stats = sortByOrder(about.stats);
  const highlights = sortByOrder(about.highlights);

  const updateAbout = (patch: Partial<PortfolioData["about"]>) =>
    setData((prev) => (prev ? { ...prev, about: { ...prev.about, ...patch } } : prev));

  return (
    <div className="space-y-5">
      <div className={`${cardClass} space-y-3`}>
        <h2 className="text-lg font-bold">About paragraphs</h2>
        {about.paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              className={`${fieldClass} min-h-[80px]`}
              value={p}
              onChange={(e) => {
                const paragraphs = [...about.paragraphs];
                paragraphs[i] = e.target.value;
                updateAbout({ paragraphs });
              }}
            />
            <button
              type="button"
              className={btnGhost}
              onClick={() => updateAbout({ paragraphs: about.paragraphs.filter((_, idx) => idx !== i) })}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className={btnGhost}
          onClick={() => updateAbout({ paragraphs: [...about.paragraphs, "New paragraph"] })}
        >
          <Plus size={14} /> Add paragraph
        </button>
      </div>

      <div className={`${cardClass} space-y-3`}>
        <h2 className="text-lg font-bold">Tags</h2>
        <input
          className={fieldClass}
          value={about.tags.join(", ")}
          onChange={(e) =>
            updateAbout({
              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
            })
          }
          placeholder="Laravel, Nuxt.js, Docker"
        />
      </div>

      <ReorderableList
        title="Stats"
        items={stats}
        onChange={(next) => updateAbout({ stats: reindexOrder(next) })}
        renderItem={(item, index, helpers) => (
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div>
              <label className={labelClass}>Value</label>
              <input
                className={fieldClass}
                value={item.val}
                onChange={(e) => helpers.update({ ...item, val: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Label</label>
              <input
                className={fieldClass}
                value={item.label}
                onChange={(e) => helpers.update({ ...item, label: e.target.value })}
              />
            </div>
            <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === stats.length - 1} />
          </div>
        )}
        onAdd={() =>
          updateAbout({
            stats: reindexOrder([
              ...stats,
              { id: createId("stat"), val: "0+", label: "New stat", order: stats.length },
            ]),
          })
        }
      />

      <ReorderableList
        title="Highlight cards"
        items={highlights}
        onChange={(next) => updateAbout({ highlights: reindexOrder(next) })}
        renderItem={(item, index, helpers) => (
          <div className="space-y-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Title</label>
                <input className={fieldClass} value={item.title} onChange={(e) => helpers.update({ ...item, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Icon (Server, Code2, Database, GitBranch)</label>
                <input className={fieldClass} value={item.icon} onChange={(e) => helpers.update({ ...item, icon: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${fieldClass} min-h-[70px]`} value={item.desc} onChange={(e) => helpers.update({ ...item, desc: e.target.value })} />
            </div>
            <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === highlights.length - 1} />
          </div>
        )}
        onAdd={() =>
          updateAbout({
            highlights: reindexOrder([
              ...highlights,
              {
                id: createId("hl"),
                title: "New highlight",
                desc: "Description",
                icon: "Server",
                order: highlights.length,
              } satisfies AboutHighlight,
            ]),
          })
        }
      />
    </div>
  );
}

function ExperienceTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  const items = sortByOrder(data.experience);
  const setItems = (next: ExperienceItem[]) =>
    setData((prev) => (prev ? { ...prev, experience: reindexOrder(next) } : prev));

  return (
    <ReorderableList
      title="Experience"
      items={items}
      onChange={setItems}
      renderItem={(item, index, helpers) => (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-between">
            <p className="font-semibold text-[#e6bd82]">{item.company || "Untitled role"}</p>
            <div className="flex gap-2">
              <button type="button" className={btnGhost} onClick={() => helpers.update({ ...item, visible: !item.visible })}>
                {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                {item.visible ? "Visible" : "Hidden"}
              </button>
              <button type="button" className={btnGhost} onClick={() => helpers.update({ ...item, current: !item.current })}>
                {item.current ? "Current" : "Mark current"}
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {([
              ["role", "Role"],
              ["company", "Company"],
              ["location", "Location"],
              ["period", "Period"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  className={fieldClass}
                  value={item[key]}
                  onChange={(e) => helpers.update({ ...item, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div>
            <label className={labelClass}>Bullet points (one per line)</label>
            <textarea
              className={`${fieldClass} min-h-[110px]`}
              value={item.points.join("\n")}
              onChange={(e) =>
                helpers.update({
                  ...item,
                  points: e.target.value.split("\n").map((p) => p.trim()).filter(Boolean),
                })
              }
            />
          </div>
          <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === items.length - 1} />
        </div>
      )}
      onAdd={() =>
        setItems([
          ...items,
          {
            id: createId("exp"),
            role: "New role",
            company: "Company",
            location: "Lahore, Pakistan",
            period: "2026 - Present",
            current: false,
            points: ["Describe what you did"],
            order: items.length,
            visible: true,
          },
        ])
      }
    />
  );
}

function ProjectsTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  const items = sortByOrder(data.projects);
  const setItems = (next: ProjectItem[]) =>
    setData((prev) => (prev ? { ...prev, projects: reindexOrder(next) } : prev));

  return (
    <ReorderableList
      title="Projects"
      items={items}
      onChange={setItems}
      renderItem={(item, index, helpers) => (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-between">
            <p className="font-semibold text-[#e6bd82]">{item.title || "Untitled project"}</p>
            <div className="flex gap-2">
              <button type="button" className={btnGhost} onClick={() => helpers.update({ ...item, visible: !item.visible })}>
                {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                {item.visible ? "Visible" : "Hidden"}
              </button>
              <button type="button" className={btnGhost} onClick={() => helpers.update({ ...item, featured: !item.featured })}>
                {item.featured ? "Featured" : "Mark featured"}
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Title</label>
              <input className={fieldClass} value={item.title} onChange={(e) => helpers.update({ ...item, title: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Icon initials</label>
              <input className={fieldClass} value={item.icon} onChange={(e) => helpers.update({ ...item, icon: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Live URL</label>
              <input className={fieldClass} value={item.liveUrl} onChange={(e) => helpers.update({ ...item, liveUrl: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input className={fieldClass} value={item.githubUrl} onChange={(e) => helpers.update({ ...item, githubUrl: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${fieldClass} min-h-[90px]`} value={item.description} onChange={(e) => helpers.update({ ...item, description: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Tech (comma separated)</label>
            <input
              className={fieldClass}
              value={item.tech.join(", ")}
              onChange={(e) =>
                helpers.update({
                  ...item,
                  tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
            />
          </div>
          <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === items.length - 1} />
        </div>
      )}
      onAdd={() =>
        setItems([
          ...items,
          {
            id: createId("proj"),
            title: "New project",
            description: "Project description",
            tech: ["Laravel"],
            icon: "NP",
            featured: false,
            liveUrl: "",
            githubUrl: "",
            order: items.length,
            visible: true,
          },
        ])
      }
    />
  );
}

function SkillsTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  const levels = sortByOrder(data.skillLevels);
  const categories = sortByOrder(data.skillCategories);

  return (
    <div className="space-y-5">
      <ReorderableList
        title="Skill levels (bars)"
        items={levels}
        onChange={(next) => setData((prev) => (prev ? { ...prev, skillLevels: reindexOrder(next) } : prev))}
        renderItem={(item, index, helpers) => (
          <div className="grid sm:grid-cols-[1fr_120px_auto] gap-2 items-end">
            <div>
              <label className={labelClass}>Name</label>
              <input className={fieldClass} value={item.name} onChange={(e) => helpers.update({ ...item, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Level %</label>
              <input
                type="number"
                min={0}
                max={100}
                className={fieldClass}
                value={item.level}
                onChange={(e) => helpers.update({ ...item, level: Number(e.target.value) })}
              />
            </div>
            <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === levels.length - 1} />
          </div>
        )}
        onAdd={() =>
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  skillLevels: reindexOrder([
                    ...levels,
                    { id: createId("sl"), name: "New skill", level: 70, order: levels.length } satisfies SkillLevel,
                  ]),
                }
              : prev,
          )
        }
      />

      <ReorderableList
        title="Skill categories"
        items={categories}
        onChange={(next) => setData((prev) => (prev ? { ...prev, skillCategories: reindexOrder(next) } : prev))}
        renderItem={(item, index, helpers) => (
          <div className="space-y-2">
            <div>
              <label className={labelClass}>Category name</label>
              <input className={fieldClass} value={item.name} onChange={(e) => helpers.update({ ...item, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Items (comma separated)</label>
              <input
                className={fieldClass}
                value={item.items.join(", ")}
                onChange={(e) =>
                  helpers.update({
                    ...item,
                    items: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
              />
            </div>
            <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === categories.length - 1} />
          </div>
        )}
        onAdd={() =>
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  skillCategories: reindexOrder([
                    ...categories,
                    { id: createId("sk"), name: "New category", items: ["Skill"], order: categories.length } satisfies SkillCategory,
                  ]),
                }
              : prev,
          )
        }
      />
    </div>
  );
}

function NavTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  const items = sortByOrder(data.navLinks);
  const setItems = (next: NavLink[]) =>
    setData((prev) => (prev ? { ...prev, navLinks: reindexOrder(next) } : prev));

  return (
    <ReorderableList
      title="Navigation links"
      items={items}
      onChange={setItems}
      renderItem={(item, index, helpers) => (
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div>
            <label className={labelClass}>Label</label>
            <input className={fieldClass} value={item.label} onChange={(e) => helpers.update({ ...item, label: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Href</label>
            <input className={fieldClass} value={item.href} onChange={(e) => helpers.update({ ...item, href: e.target.value })} />
          </div>
          <OrderControls onUp={helpers.up} onDown={helpers.down} onDelete={helpers.remove} disableUp={index === 0} disableDown={index === items.length - 1} />
        </div>
      )}
      onAdd={() =>
        setItems([
          ...items,
          { id: createId("nav"), label: "New", href: "#section", order: items.length },
        ])
      }
    />
  );
}

function OrderControls({
  onUp,
  onDown,
  onDelete,
  disableUp,
  disableDown,
}: {
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <button type="button" className={btnGhost} onClick={onUp} disabled={disableUp} aria-label="Move up">
        <ArrowUp size={14} />
      </button>
      <button type="button" className={btnGhost} onClick={onDown} disabled={disableDown} aria-label="Move down">
        <ArrowDown size={14} />
      </button>
      <button type="button" className={btnGhost} onClick={onDelete} aria-label="Delete">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function ReorderableList<T extends { id: string; order: number }>({
  title,
  items,
  onChange,
  renderItem,
  onAdd,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    helpers: {
      update: (item: T) => void;
      up: () => void;
      down: () => void;
      remove: () => void;
    },
  ) => React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <button type="button" className={btnGhost} onClick={onAdd}>
          <Plus size={14} /> Add
        </button>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className={cardClass}>
          {renderItem(item, index, {
            update: (next) => {
              const copy = [...items];
              copy[index] = next;
              onChange(copy);
            },
            up: () => onChange(reindexOrder(moveItem(items, index, -1))),
            down: () => onChange(reindexOrder(moveItem(items, index, 1))),
            remove: () => onChange(reindexOrder(items.filter((_, i) => i !== index))),
          })}
        </div>
      ))}
      {items.length === 0 && (
        <div className={`${cardClass} text-sm text-[rgba(239,222,201,0.65)]`}>
          No records yet. Click Add to create one.
        </div>
      )}
    </div>
  );
}
