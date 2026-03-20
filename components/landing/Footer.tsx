import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";

const FOOTER_COLS = [
  {
    heading: "Likhenyo",
    links: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "For Clients",
    links: [
      { label: "Post a Job", href: "/jobs/new" },
      { label: "How Hiring Works", href: "/#how-it-works" },
      { label: "Client FAQ", href: "/faq/clients" },
    ],
  },
  {
    heading: "For Freelancers",
    links: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Build Your Profile", href: "/signup?role=freelancer" },
      { label: "Freelancer FAQ", href: "/faq/freelancers" },
      { label: "Verification Guide", href: "/verify" },
    ],
  },
  {
    heading: "Legal & Support",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
      { label: "Report an Issue", href: "/report" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-lk-navy-deep border-t border-lk-navy-light">
      <div className="lk-container px-6 md:px-12 lg:px-20 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-wordmark font-bold text-2xl text-lk-cream flex items-center gap-0.5"
            >
              <span className="text-lk-gold">L</span>
              <span>ikhenyo</span>
            </Link>
            <p className="mt-3 font-body text-sm text-lk-cream/40 leading-relaxed">
              Hire Any Skilled Professional in the Philippines. Verified and
              Structured.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-wordmark font-semibold text-sm text-lk-cream mb-4 uppercase tracking-wider">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-lk-cream/50 hover:text-lk-cream/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-14 mb-6 h-px bg-lk-navy-light" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-lk-cream/30">
            © 2025 Likhenyo. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-lk-cream/40 hover:text-lk-cream transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-lk-cream/40 hover:text-lk-cream transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-lk-cream/40 hover:text-lk-cream transition-colors"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
