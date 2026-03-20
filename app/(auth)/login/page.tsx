"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAction } from "@/lib/actions/auth";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signInWithEmailAction(email, password);

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
            Welcome back.
          </h1>
          <p className="font-body text-lk-navy/60 text-sm mb-6">
            Sign in to your Likhenyo account.
          </p>

          <OAuthButtons />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-lk-cream-dark" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 font-body text-xs text-lk-navy/40">
                or continue with email
              </span>
            </div>
          </div>

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block font-wordmark text-xs font-medium text-lk-navy/70 uppercase tracking-wide"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-body text-xs text-lk-gold hover:text-lk-gold-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-lk-navy/50 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-lk-gold hover:text-lk-gold-light font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
