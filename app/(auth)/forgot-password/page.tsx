"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPasswordAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await forgotPasswordAction(email);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
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
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-lk-gold/10 border border-lk-gold/30 flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-lk-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-lk-navy mb-3">
                Check your email
              </h2>
              <p className="font-body text-lk-navy/60">
                Check your email for a reset link. It may take a few minutes to
                arrive.
              </p>
              <Link
                href="/login"
                className="inline-block mt-6 font-wordmark text-sm font-medium text-lk-gold hover:text-lk-gold-light transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-lk-navy mb-1">
                Reset your password.
              </h1>
              <p className="font-body text-lk-navy/60 text-sm mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
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
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center font-body text-sm text-lk-navy/50 mt-5">
                <Link
                  href="/login"
                  className="text-lk-gold hover:text-lk-gold-light font-medium transition-colors"
                >
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
