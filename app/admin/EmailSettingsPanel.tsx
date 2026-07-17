"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, Mail, Send } from "lucide-react";

const fieldClass =
  "w-full rounded-xl px-3 py-2.5 text-sm bg-[rgba(31,18,12,0.85)] border border-[rgba(230,189,130,0.18)] text-[#fff2df] outline-none focus:border-[rgba(230,189,130,0.55)]";
const labelClass = "block text-[11px] uppercase tracking-[.16em] mb-1.5 text-[rgba(230,189,130,0.75)]";
const cardClass =
  "rounded-2xl p-4 sm:p-5 border border-[rgba(230,189,130,0.14)] bg-[linear-gradient(145deg,rgba(70,43,27,.55),rgba(24,14,10,.78))]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1d1009] disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs border border-[rgba(230,189,130,0.22)] text-[#e6bd82] hover:bg-[rgba(92,56,35,0.35)] transition";

type EmailState = {
  resendApiKey: string;
  resendApiKeySet: boolean;
  fromEmail: string;
  toEmail: string;
  configured: boolean;
  source: string;
};

type AuthState = {
  recoveryEmail: string;
  hasCustomPassword: boolean;
};

export default function EmailSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [emailMeta, setEmailMeta] = useState<EmailState | null>(null);
  const [authMeta, setAuthMeta] = useState<AuthState | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/email");
      if (!res.ok) throw new Error("Failed to load email settings");
      const json = await res.json();
      setEmailMeta(json.email);
      setAuthMeta(json.auth);
      setFromEmail(json.email.fromEmail ?? "");
      setToEmail(json.email.toEmail ?? "");
      setRecoveryEmail(json.auth.recoveryEmail ?? "");
      setApiKeyInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmail,
          toEmail,
          recoveryEmail,
          resendApiKey: apiKeyInput.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setEmailMeta(json.email);
      setAuthMeta(json.auth);
      setApiKeyInput("");
      setMessage("Email settings saved. Contact form will use these credentials.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Test failed");
      setMessage(`Test email sent to ${json.to}.`);
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test failed");
    } finally {
      setTesting(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setChangingPw(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Password change failed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAuthMeta((prev) => (prev ? { ...prev, hasCustomPassword: true } : prev));
      setMessage("Admin password updated.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div className={`${cardClass} flex items-center gap-3`}>
        <Loader2 className="animate-spin text-[#e6bd82]" size={18} />
        <span className="text-sm text-[rgba(239,222,201,0.7)]">Loading email settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {(message || error) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border ${
            error
              ? "text-red-300 border-red-500/30 bg-red-500/10"
              : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
          }`}
        >
          {error || message}
        </div>
      )}

      <form onSubmit={saveEmail} className={`${cardClass} space-y-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#e6bd82]" />
            <div>
              <h2 className="text-lg font-bold">Email credentials</h2>
              <p className="text-sm text-[rgba(239,222,201,0.65)] mt-0.5">
                Configure Resend so contact form submissions are emailed to you.
              </p>
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              emailMeta?.configured
                ? "border-emerald-500/40 text-emerald-300"
                : "border-amber-500/40 text-amber-300"
            }`}
          >
            {emailMeta?.configured ? "Configured" : "Not configured"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Resend API key</label>
            <input
              className={fieldClass}
              type="password"
              autoComplete="off"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={
                emailMeta?.resendApiKeySet
                  ? `Saved: ${emailMeta.resendApiKey || "••••••••"} (leave blank to keep)`
                  : "re_xxxxxxxx"
              }
            />
            <p className="text-[11px] mt-1.5 text-[rgba(215,185,144,0.55)]">
              Get a key at resend.com. Leave blank to keep the current key.
            </p>
          </div>
          <div>
            <label className={labelClass}>From email</label>
            <input
              className={fieldClass}
              type="email"
              required
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="onboarding@resend.dev or your verified domain"
            />
          </div>
          <div>
            <label className={labelClass}>Inbox (to) email</label>
            <input
              className={fieldClass}
              type="email"
              required
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Recovery email (forgot password)</label>
            <input
              className={fieldClass}
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Same as inbox email by default"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className={btnPrimary}
            style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            {saving ? "Saving..." : "Save email settings"}
          </button>
          <button
            type="button"
            onClick={() => void sendTest()}
            disabled={testing || !emailMeta?.configured}
            className={btnGhost}
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Send test email
          </button>
        </div>
      </form>

      <form onSubmit={changePassword} className={`${cardClass} space-y-4`}>
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-[#e6bd82]" />
          <div>
            <h2 className="text-lg font-bold">Change admin password</h2>
            <p className="text-sm text-[rgba(239,222,201,0.65)] mt-0.5">
              {authMeta?.hasCustomPassword
                ? "Using a custom password stored securely on the server."
                : "Currently using ADMIN_PASSWORD from environment. Saving a new password overrides it."}
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Current password</label>
            <input
              className={fieldClass}
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>New password</label>
            <input
              className={fieldClass}
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm new password</label>
            <input
              className={fieldClass}
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={changingPw}
          className={btnPrimary}
          style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
        >
          {changingPw ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
          {changingPw ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
