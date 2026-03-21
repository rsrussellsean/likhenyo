"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { Check, Lock, Mail } from "lucide-react";

const TRUST_POINTS = [
  "Secure, one-time reset link",
  "Link expires in 60 minutes",
];

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
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0052FF 0%, #0A3FCC 60%, #001F7A 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 60% 50% at 80% 90%, rgba(255,205,0,0.08) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }} />

        <div className="relative flex flex-col h-full px-10 xl:px-14 py-10">
          <Link href="/" className="font-headline font-bold text-2xl flex items-center gap-0.5 w-fit">
            <span style={{ color: "#FFCD00" }}>Lik</span>
            <span className="text-white">henyo</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center py-16">
            <p className="font-inter text-xs font-semibold text-white/50 uppercase tracking-[0.2em] mb-4">
              Account recovery
            </p>
            <h2
              className="font-headline font-extrabold text-white leading-[1.1] mb-3"
              style={{ fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)" }}
            >
              Let&apos;s get you{" "}
              <span style={{ color: "#FFCD00" }}>back in.</span>
            </h2>
            <p className="font-inter text-base text-white/60 mb-10">
              We&apos;ll send a secure link to reset your password.
            </p>

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

            {/* Glassmorphic lock card */}
            <div className="bg-white/12 backdrop-blur-md rounded-2xl p-5 border border-white/20 max-w-xs">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <Lock size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-headline font-semibold text-white text-sm">Account Secured</div>
                  <p className="font-inter text-xs text-white/55 mt-0.5">
                    Reset links are single-use only
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="font-inter text-xs text-white/30">© 2025 Likhenyo · Built for the Philippines</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block font-headline font-bold text-2xl text-lk-dark text-center mb-10">
            <span className="text-lk-primary">Lik</span>henyo
          </Link>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-lk-primary-pale flex items-center justify-center mx-auto mb-5">
                <Mail size={28} className="text-lk-primary" />
              </div>
              <h2 className="font-headline font-extrabold text-lk-dark text-2xl mb-3">
                Check your email
              </h2>
              <p className="font-inter text-lk-dark/55 text-sm leading-relaxed max-w-xs mx-auto">
                A reset link has been sent to{" "}
                <span className="font-semibold text-lk-dark">{email}</span>.
                It may take a few minutes to arrive.
              </p>
              <Link
                href="/login"
                className="inline-flex mt-6 font-inter text-sm font-semibold text-lk-primary hover:text-lk-primary-dark transition-colors"
              >
                Back to login →
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1.5">
                  Reset your password.
                </h1>
                <p className="font-inter text-sm text-lk-dark/50">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

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
                  style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center font-inter text-sm text-lk-dark/45 mt-8">
                <Link
                  href="/login"
                  className="text-lk-primary hover:text-lk-primary-dark font-semibold transition-colors"
                >
                  ← Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
