"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2, Sparkles } from "lucide-react";

const fieldClass =
  "w-full rounded-xl px-3 py-2.5 text-sm bg-[rgba(31,18,12,0.85)] border border-[rgba(230,189,130,0.18)] text-[#fff2df] outline-none focus:border-[rgba(230,189,130,0.55)]";
const labelClass = "block text-[11px] uppercase tracking-[.16em] mb-1.5 text-[rgba(230,189,130,0.75)]";
const cardClass =
  "rounded-2xl p-4 sm:p-5 border border-[rgba(230,189,130,0.14)] bg-[linear-gradient(145deg,rgba(70,43,27,.55),rgba(24,14,10,.78))]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1d1009] disabled:opacity-60";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Missing reset token. Request a new link from the login page.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Reset failed");
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${cardClass} w-full max-w-md space-y-5`}>
      <div>
        <div className="inline-flex items-center gap-2 text-[#e6bd82] text-xs uppercase tracking-[.2em] mb-2">
          <Sparkles size={14} /> Portfolio CMS
        </div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <KeyRound size={22} className="text-[#e6bd82]" /> Reset password
        </h1>
        <p className="text-sm mt-1 text-[rgba(239,222,201,0.65)]">
          Choose a new admin password. You will be signed in automatically after saving.
        </p>
      </div>

      {!token && (
        <p className="text-sm text-amber-300">
          No reset token found. Go back to{" "}
          <a href="/admin" className="underline text-[#e6bd82]">
            Admin login
          </a>{" "}
          and use Forgot password.
        </p>
      )}

      <div>
        <label className={labelClass} htmlFor="password">
          New password
        </label>
        <input
          id="password"
          type="password"
          className={fieldClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          disabled={!token}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="confirm">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          className={fieldClass}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={8}
          required
          disabled={!token}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving || !token}
        className={btnPrimary}
        style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)", width: "100%" }}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
        {saving ? "Saving..." : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-[#fff2df]">
      <Suspense
        fallback={
          <div className="grid place-items-center gap-3">
            <Loader2 className="animate-spin text-[#e6bd82]" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
