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
          ? "bg-[#171717]/95 backdrop-blur-md shadow-lg shadow-[#171717]/20"
          : "bg-[#171717]"
      }`}
    >
      <div className="lk-container">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-wordmark font-bold text-2xl text-lk-cream tracking-tight group flex items-center gap-1"
          >
            <span className="text-lk-gold group-hover:text-lk-gold-light transition-colors">
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
                className="font-body text-sm font-medium text-lk-cream/70 hover:text-lk-cream transition-colors"
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
                  className="font-wordmark text-sm font-medium text-lk-cream/80 hover:text-lk-cream transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/logout"
                  className="font-wordmark text-sm font-medium bg-lk-navy-light text-lk-cream/80 hover:text-lk-cream border border-lk-navy-light hover:border-lk-cream/30 px-4 py-2 rounded-md transition-all"
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-wordmark text-sm font-medium text-lk-cream/80 hover:text-lk-cream border border-transparent hover:border-lk-cream/20 px-4 py-2 rounded-md transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="lk-shimmer font-wordmark text-sm font-semibold bg-lk-gold hover:bg-lk-gold-light text-white px-5 py-2 rounded-md transition-colors flex items-center gap-1.5"
                >
                  Get Started
                  <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-lk-cream p-2 rounded-md hover:bg-lk-navy-light transition-colors"
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
        <div className="bg-lk-navy-deep border-t border-lk-navy-light px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-body text-base font-medium text-lk-cream/80 hover:text-lk-cream py-2.5 border-b border-lk-navy-light/50 last:border-0 transition-colors"
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
                  className="font-wordmark text-sm font-medium text-center bg-lk-navy-light text-lk-cream py-3 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  href="/logout"
                  onClick={() => setMenuOpen(false)}
                  className="font-wordmark text-sm font-medium text-center text-lk-cream/60 py-2"
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="font-wordmark text-sm font-semibold text-center bg-lk-gold text-white py-3 rounded-md"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="font-wordmark text-sm font-medium text-center text-lk-cream/70 py-2"
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
