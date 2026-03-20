"use client";

import Link from "next/link";
import { useState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth";

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
    <div className="min-h-screen bg-lk-cream flex items-center justify-center px-4 py-20">
      <div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lk-navy via-lk-gold to-lk-navy"
        aria-hidden="true"
      />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block font-wordmark font-bold text-2xl text-lk-navy text-center mb-8"
        >
          <span className="text-lk-gold">L</span>ikhenyo
        </Link>

        <div className="bg-white rounded-2xl border border-lk-cream-dark shadow-xl shadow-lk-navy/5 p-8">
          <h1 className="font-display text-3xl font-bold text-lk-navy mb-1">
            Set a new password.
          </h1>
          <p className="font-body text-lk-navy/60 text-sm mb-6">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="password"
                className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide"
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
                className="w-full h-11 px-4 rounded-lg border border-lk-cream-dark bg-lk-cream focus:outline-none focus:border-lk-gold focus:ring-1 focus:ring-lk-gold/30 font-body text-sm text-lk-navy placeholder:text-lk-navy/30 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide"
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
                className="w-full h-11 px-4 rounded-lg border border-lk-cream-dark bg-lk-cream focus:outline-none focus:border-lk-gold focus:ring-1 focus:ring-lk-gold/30 font-body text-sm text-lk-navy placeholder:text-lk-navy/30 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-lk-navy hover:bg-lk-navy-light text-lk-cream font-wordmark font-semibold text-sm rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
