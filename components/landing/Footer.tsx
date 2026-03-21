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
    <footer className="bg-lk-dark border-t border-white/5">
      <div className="lk-container px-6 md:px-12 lg:px-20 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-headline font-bold text-2xl text-white flex items-center gap-0.5"
            >
              <span className="text-lk-primary">Lik</span>
              <span>henyo</span>
            </Link>
            <p className="mt-3 font-inter text-sm text-white/35 leading-relaxed">
              Hire Any Skilled Professional in the Philippines. Verified and
              Structured.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              {[
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/30 hover:text-lk-primary transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-inter font-semibold text-xs text-white/50 mb-4 uppercase tracking-widest">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-inter text-sm text-white/40 hover:text-white/80 transition-colors"
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
        <div className="mt-14 mb-6 h-px bg-white/8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-sm text-white/25">
            © 2025 Likhenyo. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lk-primary" aria-hidden="true" />
            <span className="font-inter text-xs text-white/25">
              Built for the Philippines
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
