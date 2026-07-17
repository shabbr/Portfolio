"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl px-3 py-2.5 text-sm bg-[rgba(31,18,12,0.85)] border border-[rgba(230,189,130,0.18)] text-[#fff2df] outline-none focus:border-[rgba(230,189,130,0.55)]";
const labelClass = "block text-[11px] uppercase tracking-[.16em] mb-1.5 text-[rgba(230,189,130,0.75)]";
const cardClass =
  "rounded-2xl p-4 sm:p-5 border border-[rgba(230,189,130,0.14)] bg-[linear-gradient(145deg,rgba(70,43,27,.55),rgba(24,14,10,.78))]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1d1009] disabled:opacity-60";

export default function PasswordSettingsPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const changePassword = async (e: FormEvent) => {
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
      setMessage("Admin password updated successfully. Use the new password next time you sign in.");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setChangingPw(false);
    }
  };

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

      <form onSubmit={changePassword} className={`${cardClass} space-y-4`}>
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-[#e6bd82]" />
          <div>
            <h2 className="text-lg font-bold">Update admin password</h2>
            <p className="text-sm text-[rgba(239,222,201,0.65)] mt-0.5">
              Enter your current password, then choose a new one (min. 8 characters).
              On Vercel this is stored in Blob settings after you save.
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
              autoComplete="current-password"
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
              autoComplete="new-password"
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
              autoComplete="new-password"
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
