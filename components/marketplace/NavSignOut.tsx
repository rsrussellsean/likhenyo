"use client";

import { signOutAction } from "@/lib/actions/auth";

export default function NavSignOut() {
  return (
    <button
      onClick={() => signOutAction()}
      className="font-inter text-xs text-lk-dark/40 hover:text-lk-red transition-colors px-2 py-1"
    >
      Sign out
    </button>
  );
}
