"use client";

import Link from "next/link";
import { useState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const result = await resetPasswordAction(password);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 bg-lk-neutral relative"
      style={{
        background: "#F8FAFC",
      }}
    >
      {/* Atmospheric radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,82,255,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-lk-primary/8 overflow-hidden">
          {/* Gradient crown bar */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #0052FF 0%, #4D7FFF 60%, #FFCD00 100%)" }}
            aria-hidden="true"
          />

          <div className="px-8 py-10">
            {/* Wordmark */}
            <Link
              href="/"
              className="block font-headline font-bold text-xl text-lk-dark mb-8 w-fit"
            >
              <span className="text-lk-primary">Lik</span>henyo
            </Link>

            {/* Lock icon */}
            <div className="w-14 h-14 rounded-2xl bg-lk-primary-pale flex items-center justify-center mb-6">
              <Lock size={24} className="text-lk-primary" />
            </div>

            {/* Heading */}
            <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1.5">
              Set a new password.
            </h1>
            <p className="font-inter text-sm text-lk-dark/50 mb-8">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                             font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                             focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                             transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className={`w-full h-11 px-4 rounded-xl bg-lk-neutral border font-inter text-sm text-lk-dark
                              placeholder:text-lk-dark/30 focus:outline-none focus:ring-2 transition-all
                              ${
                                confirm && password !== confirm
                                  ? "border-lk-red focus:border-lk-red focus:ring-lk-red/15"
                                  : "border-lk-neutral-mid focus:border-lk-primary focus:ring-lk-primary/15"
                              }`}
                />
                {confirm && password !== confirm && (
                  <p className="font-inter text-xs text-lk-red mt-1.5">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-lk-red-pale text-lk-red text-sm font-inter px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!!confirm && password !== confirm)}
                className="w-full h-11 text-white font-inter font-semibold text-sm rounded-xl
                           transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
                style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center font-inter text-sm text-lk-dark/40 mt-6">
          <Link href="/login" className="text-lk-primary hover:text-lk-primary-dark font-semibold transition-colors">
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
