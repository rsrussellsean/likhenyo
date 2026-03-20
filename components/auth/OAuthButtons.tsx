"use client";

import { signInWithOAuthAction } from "@/lib/actions/auth";
import { useState } from "react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.805.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

export default function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "facebook" | null
  >(null);

  async function handleOAuth(provider: "google" | "facebook") {
    setLoadingProvider(provider);
    await signInWithOAuthAction(provider);
    setLoadingProvider(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => handleOAuth("google")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-lk-cream-dark bg-white hover:bg-lk-cream text-lk-navy font-wordmark font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {loadingProvider === "google" ? "Redirecting…" : "Continue with Google"}
      </button>

      <button
        onClick={() => handleOAuth("facebook")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-lk-cream-dark bg-white hover:bg-lk-cream text-lk-navy font-wordmark font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <FacebookIcon />
        {loadingProvider === "facebook"
          ? "Redirecting…"
          : "Continue with Facebook"}
      </button>
    </div>
  );
}
