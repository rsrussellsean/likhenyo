import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

/*
 * Hero — Scheme1-inspired: centered headline flanked by floating freelancer
 * cards (left/right columns), two CTA pills below, trust bar at bottom.
 * Cream background, Fraunces headline — scheme.jpg color palette.
 */

const LEFT_CARDS = [
  {
    name: "Marco V.",
    role: "Structural Engineer",
    location: "Cebu City",
    rating: 4.9,
    initials: "MV",
    color: "from-[#0f1d42] to-[#1b3268]",
    rotate: "-2deg",
    delay: "0s",
  },
  {
    name: "Dana M.",
    role: "Brand Designer",
    location: "Remote — Cebu",
    rating: 4.8,
    initials: "DM",
    color: "from-[#8a5a0a] to-[#d4841a]",
    rotate: "1.5deg",
    delay: "1s",
  },
];

const RIGHT_CARDS = [
  {
    name: "Jasmine R.",
    role: "Full Stack Dev",
    location: "Mandaue City",
    rating: 5.0,
    initials: "JR",
    color: "from-[#8a3220] to-[#b85239]",
    rotate: "2deg",
    delay: "0.5s",
  },
  {
    name: "Carlo B.",
    role: "Architect",
    location: "Cebu City",
    rating: 5.0,
    initials: "CB",
    color: "from-[#1a4a3a] to-[#2d7a5e]",
    rotate: "-1.5deg",
    delay: "1.4s",
  },
];

type CardData = (typeof LEFT_CARDS)[0];

function FloatingCard({ card }: { card: CardData }) {
  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-lg shadow-lk-navy/8 border border-lk-navy/6
                 animate-[float-card_5s_ease-in-out_infinite]"
      style={{ "--card-rotate": card.rotate, animationDelay: card.delay } as React.CSSProperties}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color}
                      flex items-center justify-center text-white font-wordmark font-bold text-xs shrink-0`}
        >
          {card.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-wordmark font-semibold text-lk-navy text-xs">{card.name}</span>
            <BadgeCheck size={11} className="text-lk-gold shrink-0" />
          </div>
          <p className="font-body text-[10px] text-lk-navy/50 truncate mt-0.5">{card.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 pt-2 border-t border-lk-cream-dark">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={9}
            className={i < Math.floor(card.rating) ? "text-lk-gold fill-lk-gold" : "text-lk-navy/15"}
          />
        ))}
        <span className="font-wordmark text-[10px] text-lk-navy/40 ml-1">{card.rating}</span>
        <span className="font-body text-[9px] text-lk-navy/30 ml-auto truncate">{card.location}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-lk-cream overflow-hidden pt-24 md:pt-32 pb-0">
      <div className="lk-container px-6 md:px-12 lg:px-20">

        {/* ── Scheme1: // section label // — centered ── */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-up opacity-0">
          <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
          <span className="font-wordmark text-[11px] font-medium text-lk-navy/40 uppercase tracking-[0.2em]">
            The Philippine Freelance Platform
          </span>
          <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
        </div>

        {/* ── Scheme1: 3-col grid — left cards | center | right cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] xl:grid-cols-[255px_1fr_255px] items-center gap-6">

          {/* Left floating cards */}
          <div className="hidden lg:flex flex-col gap-4">
            {LEFT_CARDS.map((c) => <FloatingCard key={c.name} card={c} />)}
          </div>

          {/* Center: headline + subtitle + CTAs */}
          <div className="text-center">
            <h1
              className="font-display font-black text-lk-navy leading-[0.9] animate-fade-up opacity-0 animation-delay-100"
              style={{ fontSize: "clamp(3.8rem, 9vw, 7.5rem)" }}
              lang="tl"
            >
              Likha Mo,
              <br />
              <em className="text-lk-gold" style={{ fontStyle: "italic" }}>Henyo Mo.</em>
            </h1>

            <p
              className="mt-6 font-body text-lk-navy/45 leading-relaxed mx-auto animate-fade-up opacity-0 animation-delay-200"
              style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", maxWidth: "30rem" }}
            >
              Connect with verified Filipino professionals — engineers,
              developers, designers, and more. Post jobs or find work,
              all in one place.
            </p>

            {/* Scheme1: two side-by-side pill CTAs */}
            <div className="mt-9 flex items-center justify-center gap-3 flex-wrap animate-fade-up opacity-0 animation-delay-300">
              <Link
                href="/signup?role=client"
                className="inline-flex items-center gap-2 bg-lk-navy hover:bg-lk-navy-light text-lk-cream
                           font-wordmark font-semibold text-sm px-7 py-3 rounded-full transition-all"
              >
                Post a Job
                <span className="text-lk-gold">↗</span>
              </Link>
              <Link
                href="/signup?role=freelancer"
                className="inline-flex items-center gap-2 border border-lk-navy/20 hover:border-lk-navy/50
                           hover:bg-lk-navy/5 text-lk-navy font-wordmark font-semibold text-sm px-7 py-3
                           rounded-full transition-all"
              >
                Find Work →
              </Link>
            </div>
          </div>

          {/* Right floating cards */}
          <div className="hidden lg:flex flex-col gap-4">
            {RIGHT_CARDS.map((c) => <FloatingCard key={c.name} card={c} />)}
          </div>
        </div>

        {/* Mobile: 2 cards below headline */}
        <div className="lg:hidden mt-8 grid grid-cols-2 gap-3">
          <FloatingCard card={LEFT_CARDS[0]} />
          <FloatingCard card={RIGHT_CARDS[0]} />
        </div>

        {/* ── Scheme1 trust bar — replaces logo strip ── */}
        <div className="mt-14 py-6 border-t border-lk-navy/8 animate-fade-up opacity-0 animation-delay-400">
          <div className="flex items-center justify-center flex-wrap gap-3">
            {["Any Profession", "100% Verified", "₱0 Platform Fee", "Starting in Cebu"].map(
              (label, i, arr) => (
                <span key={label} className="flex items-center gap-3">
                  <span className="font-wordmark text-[11px] font-medium text-lk-navy/30 uppercase tracking-widest">
                    {label}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-lk-navy/15" aria-hidden="true" />
                  )}
                </span>
              )
            )}
          </div>
        </div>

      </div>

      {/* Bottom section divider */}
      <div className="border-t border-lk-navy/8" />
    </section>
  );
}
