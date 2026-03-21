"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAction } from "@/lib/actions/auth";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { BadgeCheck, Check, Star } from "lucide-react";

const TRUST_POINTS = [
  "100% Verified Filipino Professionals",
  "Structured. Trusted. No Facebook Groups.",
  "Free to browse and apply",
];

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
    if (result?.error) setError(result.error);
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: editorial blue ── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0052FF 0%, #0A3FCC 60%, #001F7A 100%)",
        }}
      >
        {/* Ambient radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,255,255,0.12) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 90%, rgba(255,205,0,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col h-full px-10 xl:px-14 py-10">
          {/* Wordmark */}
          <Link href="/" className="font-headline font-bold text-2xl flex items-center gap-0.5 w-fit">
            <span style={{ color: "#FFCD00" }}>Lik</span>
            <span className="text-white">henyo</span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center py-16">
            <p className="font-inter text-xs font-semibold text-white/50 uppercase tracking-[0.2em] mb-4">
              Trusted by professionals
            </p>
            <h2
              className="font-headline font-extrabold text-white leading-[1.1] mb-8"
              style={{ fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)" }}
            >
              Your next{" "}
              <span style={{ color: "#FFCD00" }}>Henyo</span>
              <br />
              is just a click away.
            </h2>

            <div className="flex flex-col gap-3 mb-12">
              {TRUST_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-inter text-sm text-white/70 leading-snug">{point}</span>
                </div>
              ))}
            </div>

            {/* Glassmorphic freelancer card */}
            <div className="bg-white/12 backdrop-blur-md rounded-2xl p-5 border border-white/20 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-headline font-bold text-sm shrink-0"
                  style={{ background: "rgba(255,255,255,0.20)" }}
                >
                  MV
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline font-semibold text-white text-sm">Marco Villanueva</span>
                    <BadgeCheck size={13} style={{ color: "#FFCD00" }} className="shrink-0" />
                  </div>
                  <p className="font-inter text-xs text-white/55 mt-0.5">Structural Engineer · Cebu City</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} style={{ color: "#FFCD00", fill: "#FFCD00" }} />
                ))}
                <span className="font-inter text-xs text-white/50 ml-1.5">5.0 · 42 reviews</span>
              </div>
            </div>
          </div>

          {/* Bottom footnote */}
          <p className="font-inter text-xs text-white/30">
            © 2025 Likhenyo · Built for the Philippines
          </p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile-only logo */}
          <Link
            href="/"
            className="lg:hidden block font-headline font-bold text-2xl text-lk-dark text-center mb-10"
          >
            <span className="text-lk-primary">Lik</span>henyo
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1.5">
              Welcome back.
            </h1>
            <p className="font-inter text-sm text-lk-dark/50">
              Sign in to your Likhenyo account.
            </p>
          </div>

          {/* OAuth */}
          <OAuthButtons />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-lk-neutral-mid" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 font-inter text-xs text-lk-dark/35">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide"
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
                className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                           font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                           focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                           transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block font-inter text-xs font-semibold text-lk-dark/60 uppercase tracking-wide"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-inter text-xs text-lk-primary hover:text-lk-primary-dark transition-colors"
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
                className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                           font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                           focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                           transition-all"
              />
            </div>

            {error && (
              <div className="bg-lk-red-pale text-lk-red text-sm font-inter px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-white font-inter font-semibold text-sm rounded-xl
                         transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1
                         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
              style={{
                background: loading
                  ? "#6699FF"
                  : "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center font-inter text-sm text-lk-dark/45 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-lk-primary hover:text-lk-primary-dark font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
