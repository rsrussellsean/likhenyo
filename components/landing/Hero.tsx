import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";

/* Mocked freelancer cards — illustrative only, no real data */
const MOCK_CARDS = [
  {
    name: "Marco V.",
    profession: "Structural Engineer",
    location: "Cebu City",
    rate: "₱1,200/hr",
    rating: 4.9,
    reviews: 38,
    verified: true,
    initials: "MV",
    color: "from-[#0f1d42] to-[#1b3268]",   /* Philippine indigo */
  },
  {
    name: "Jasmine R.",
    profession: "Full Stack Developer",
    location: "Mandaue City",
    rate: "₱900/hr",
    rating: 5.0,
    reviews: 61,
    verified: true,
    initials: "JR",
    color: "from-[#8a3220] to-[#b85239]",   /* Terracotta */
  },
  {
    name: "Dana M.",
    profession: "Brand Designer",
    location: "Remote — Cebu",
    rate: "₱750/hr",
    rating: 4.8,
    reviews: 44,
    verified: true,
    initials: "DM",
    color: "from-[#8a5a0a] to-[#d4841a]",   /* Amber sunburst */
  },
];

function FreelancerCard({
  card,
  style,
  className,
}: {
  card: (typeof MOCK_CARDS)[0];
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      style={style}
      className={`w-72 bg-white rounded-2xl shadow-2xl shadow-lk-navy/20 p-5 border border-lk-cream-dark ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-wordmark font-bold text-base shrink-0`}
        >
          {card.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-wordmark font-semibold text-lk-navy text-sm truncate">
              {card.name}
            </span>
            {card.verified && (
              <BadgeCheck size={14} className="text-lk-gold shrink-0" />
            )}
          </div>
          <p className="text-xs text-lk-navy/60 font-body truncate">
            {card.profession}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-lk-navy/50 font-body">
          <MapPin size={11} />
          <span className="truncate max-w-[120px]">{card.location}</span>
        </div>
        <span className="font-wordmark font-semibold text-xs text-lk-gold">
          {card.rate}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-lk-cream-dark flex items-center gap-1">
        <Star size={12} className="text-lk-gold fill-lk-gold" />
        <span className="font-wordmark font-semibold text-xs text-lk-navy">
          {card.rating}
        </span>
        <span className="font-body text-xs text-lk-navy/40">
          ({card.reviews} reviews)
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-lk-navy overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background geometric accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-5"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at center, #d4841a 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 opacity-5"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at center, #d4841a 0%, transparent 70%)",
        }}
      />

      <div className="lk-container px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Headline + CTAs */}
          <div className="flex flex-col items-start">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-lk-gold/10 border border-lk-gold/30 rounded-full px-4 py-1.5 mb-8 animate-fade-up opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-lk-gold animate-pulse" />
              <span className="font-wordmark text-xs font-medium text-lk-gold uppercase tracking-widest">
                Now live in Cebu
              </span>
            </div>

            {/* Hero headline — display font, Filipino */}
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-lk-cream leading-[1.1] animate-fade-up opacity-0 animation-delay-100"
              lang="tl"
            >
              Likha Mo,
              <br />
              <span className="text-lk-gold italic">Henyo Mo.</span>
            </h1>

            {/* English subtitle */}
            <p className="mt-6 text-lg md:text-xl text-lk-cream/70 font-body leading-relaxed max-w-lg animate-fade-up opacity-0 animation-delay-200">
              Connect with verified Filipino professionals — engineers,
              developers, designers, and more. Post jobs or find work, all in
              one place.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4 animate-fade-up opacity-0 animation-delay-300">
              <Link
                href="/signup?role=client"
                className="lk-shimmer font-wordmark font-semibold bg-lk-gold hover:bg-lk-gold-light text-white px-7 py-3.5 rounded-lg text-base transition-all shadow-lg shadow-lk-gold/25 hover:shadow-lk-gold/40 hover:-translate-y-0.5"
              >
                Post a Job
              </Link>
              <Link
                href="/signup?role=freelancer"
                className="font-wordmark font-semibold border-2 border-lk-cream/30 hover:border-lk-cream/60 text-lk-cream px-7 py-3.5 rounded-lg text-base transition-all hover:-translate-y-0.5"
              >
                Find Work
              </Link>
            </div>

            {/* Social proof */}
            <p className="mt-8 text-sm text-lk-cream/40 font-body animate-fade-up opacity-0 animation-delay-400">
              Trusted by professionals across Philippines.
            </p>
          </div>

          {/* Right: Stacked freelancer profile cards */}
          <div className="relative h-96 lg:h-[480px] hidden md:block animate-slide-in-right opacity-0 animation-delay-300">
            {/* Card 1 — back, rotated left */}
            <FreelancerCard
              card={MOCK_CARDS[2]}
              className="absolute top-8 left-4 animate-float"
              style={
                {
                  transform: "rotate(-6deg)",
                  "--card-rotate": "-6deg",
                  animationDelay: "0s",
                  zIndex: 1,
                } as React.CSSProperties
              }
            />
            {/* Card 2 — front center */}
            <FreelancerCard
              card={MOCK_CARDS[1]}
              className="absolute top-20 left-16 animate-float"
              style={
                {
                  transform: "rotate(2deg)",
                  "--card-rotate": "2deg",
                  animationDelay: "1.5s",
                  zIndex: 3,
                } as React.CSSProperties
              }
            />
            {/* Card 3 — front, rotated right */}
            <FreelancerCard
              card={MOCK_CARDS[0]}
              className="absolute top-40 left-32 animate-float"
              style={
                {
                  transform: "rotate(-3deg)",
                  "--card-rotate": "-3deg",
                  animationDelay: "0.8s",
                  zIndex: 2,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
