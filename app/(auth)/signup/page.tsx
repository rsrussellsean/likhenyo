"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { signUpWithEmailAction } from "@/lib/actions/auth";
import OAuthButtons from "@/components/auth/OAuthButtons";

function SignupForm() {
  const params = useSearchParams();
  const roleParam = params.get("role");
  const role: "client" | "freelancer" =
    roleParam === "freelancer" ? "freelancer" : "client";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signUpWithEmailAction(email, password, role);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
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
            Check your email to confirm your Likhenyo account. The link expires
            in 24 hours.
          </p>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-bold text-lk-navy mb-1">
            Simulan na. Libre.
          </h1>
          <p className="font-body text-lk-navy/60 text-sm mb-6 flex items-center gap-2 flex-wrap">
            Create your Likhenyo account.
            {role === "freelancer" && (
              <span className="inline-flex items-center bg-lk-gold/10 text-lk-gold text-xs font-wordmark font-medium px-2 py-0.5 rounded-full">
                Freelancer
              </span>
            )}
            {role === "client" && (
              <span className="inline-flex items-center bg-lk-navy/10 text-lk-navy text-xs font-wordmark font-medium px-2 py-0.5 rounded-full">
                Client
              </span>
            )}
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
              <label
                htmlFor="password"
                className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide"
              >
                Password
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
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function SignupPage() {
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

        <Suspense
          fallback={
            <div className="bg-white rounded-2xl border border-lk-cream-dark shadow-xl p-8 text-center">
              <div className="font-body text-lk-navy/40">Loading…</div>
            </div>
          }
        >
          <SignupForm />
        </Suspense>

        <p className="text-center font-body text-sm text-lk-navy/50 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-lk-gold hover:text-lk-gold-light font-medium transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
