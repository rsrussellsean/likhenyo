"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu, X, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Find Talent", href: "/freelancers" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm shadow-lk-dark/5 border-b border-lk-neutral-mid"
          : "bg-transparent"
      }`}
    >
      <div className="lk-container px-6 md:px-12 lg:px-20">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-headline font-bold text-2xl text-lk-dark tracking-tight group flex items-center gap-0.5"
          >
            <span className="text-lk-primary group-hover:opacity-80 transition-opacity">
              Lik
            </span>
            <span>henyo</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-inter text-sm font-medium text-lk-dark/60 hover:text-lk-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="font-inter text-sm font-medium text-lk-dark/70 hover:text-lk-dark transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/logout"
                  className="font-inter text-sm font-medium text-lk-primary border border-lk-primary/25 hover:bg-lk-primary hover:text-white px-4 py-2 rounded-lg transition-all"
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-inter text-sm font-medium text-lk-dark/70 hover:text-lk-dark px-4 py-2 rounded-lg hover:bg-lk-neutral-mid transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="font-inter text-sm font-semibold bg-lk-primary hover:bg-lk-primary-dark text-white px-5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-lk-primary/25"
                >
                  Get Started
                  <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-lk-dark p-2 rounded-lg hover:bg-lk-neutral-mid transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-lk-neutral-mid px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-inter text-base font-medium text-lk-dark/70 hover:text-lk-dark py-2.5 border-b border-lk-neutral-mid last:border-0 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-sm font-medium text-center bg-lk-primary-pale text-lk-primary py-3 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/logout"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-sm font-medium text-center text-lk-dark/50 py-2"
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-sm font-semibold text-center bg-lk-primary text-white py-3 rounded-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-sm font-medium text-center text-lk-dark/60 py-2"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
