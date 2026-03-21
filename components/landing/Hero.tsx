import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star, MapPin } from "lucide-react";

const TRUST_ITEMS = [
  "Any Profession",
  "100% ID Verified",
  "₱0 Platform Fee",
  "Starting in Cebu",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16" style={{ background: "#ffffff" }}>

      {/* ── Layered atmospheric background ── */}

      {/* Base diagonal gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, #EBF0FF 0%, #ffffff 45%, #F0F4FF 100%)",
        }}
      />

      {/* Large radial blue glow — top-right light source */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 65% at 100% 0%, rgba(0,82,255,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Secondary radial blue — upper center bloom */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 40% at 60% 0%, rgba(0,82,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Gold warmth glow — bottom-left */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 45% at 0% 100%, rgba(255,205,0,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Grain texture overlay for material feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="lk-container px-6 md:px-12 lg:px-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[88vh] py-16 lg:py-20">

          {/* ── Left: Text content ── */}
          <div className="flex flex-col items-start animate-fade-up opacity-0">
            {/* Eyebrow chip */}
            <div className="inline-flex items-center gap-2 bg-lk-primary-pale border border-lk-primary/15 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-lk-primary" aria-hidden="true" />
              <span className="font-inter text-xs font-semibold text-lk-primary uppercase tracking-widest">
                The Philippine Freelance Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-headline font-extrabold text-lk-dark leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.2rem)" }}
            >
              Hire Any Skilled
              <br />
              <span className="text-lk-primary">Professional</span>
              {" "}in the{" "}
              <span className="relative inline-block">
                Philippines
                <span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ background: "#FFCD00" }}
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="font-inter text-lk-dark/55 leading-relaxed mb-10 max-w-lg"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)" }}
            >
              Connect with verified Filipino professionals — engineers, developers,
              designers, and more. Post jobs or find work on one structured platform.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/signup?role=client"
                className="inline-flex items-center gap-2 font-inter font-semibold text-sm
                           text-white px-7 py-3.5 rounded-xl transition-all
                           shadow-lg shadow-lk-primary/30 hover:shadow-lk-primary/45 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)",
                }}
              >
                Post a Job
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/signup?role=freelancer"
                className="inline-flex items-center gap-2 font-inter font-semibold text-sm
                           border-2 border-lk-dark/15 hover:border-lk-primary
                           text-lk-dark hover:text-lk-primary
                           px-7 py-3.5 rounded-xl transition-all hover:bg-lk-primary-pale"
              >
                Find Work →
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-12 pt-8 border-t border-lk-neutral-mid w-full">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {TRUST_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lk-yellow" aria-hidden="true" />
                    <span className="font-inter text-[11px] font-medium text-lk-dark/45 uppercase tracking-widest">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Image + floating glassmorphic cards ── */}
          <div className="relative hidden lg:block animate-slide-in-right opacity-0">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl shadow-lk-primary/10">
              <Image
                src="/images/Filipino_meeting_client.jpg"
                alt="Filipino professionals collaborating"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-lk-dark/25 via-transparent to-transparent" />
            </div>

            {/* Floating card — top left */}
            <div
              className="absolute -left-8 top-14 bg-white/85 backdrop-blur-xl rounded-2xl p-4 shadow-xl shadow-lk-dark/8 border border-white/60 w-52 animate-[float-card_5s_ease-in-out_infinite]"
              style={{ "--card-rotate": "-2deg" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-lk-primary flex items-center justify-center text-white font-headline font-bold text-xs shrink-0">
                  MV
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-headline font-semibold text-lk-dark text-xs">Marco V.</span>
                    <BadgeCheck size={11} className="text-lk-primary shrink-0" />
                  </div>
                  <p className="font-inter text-[10px] text-lk-dark/50 truncate mt-0.5">Structural Engineer</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 pt-2 border-t border-lk-neutral-mid">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} className="text-lk-yellow fill-lk-yellow" />
                ))}
                <span className="font-inter text-[10px] text-lk-dark/40 ml-1">4.9</span>
                <MapPin size={8} className="text-lk-dark/25 ml-auto" />
                <span className="font-inter text-[9px] text-lk-dark/30 ml-0.5 truncate">Cebu City</span>
              </div>
            </div>

            {/* Floating card — bottom right */}
            <div
              className="absolute -right-8 bottom-20 bg-white/85 backdrop-blur-xl rounded-2xl p-4 shadow-xl shadow-lk-dark/8 border border-white/60 w-52 animate-[float-card_5s_ease-in-out_infinite]"
              style={{ "--card-rotate": "2deg", animationDelay: "0.7s" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-lk-red flex items-center justify-center text-white font-headline font-bold text-xs shrink-0">
                  JR
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-headline font-semibold text-lk-dark text-xs">Jasmine R.</span>
                    <BadgeCheck size={11} className="text-lk-primary shrink-0" />
                  </div>
                  <p className="font-inter text-[10px] text-lk-dark/50 truncate mt-0.5">Full Stack Dev</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 pt-2 border-t border-lk-neutral-mid">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} className="text-lk-yellow fill-lk-yellow" />
                ))}
                <span className="font-inter text-[10px] text-lk-dark/40 ml-1">5.0</span>
                <span className="font-inter text-[9px] text-lk-dark/30 ml-auto truncate">Mandaue City</span>
              </div>
            </div>

            {/* Floating stat badge */}
            <div
              className="absolute -right-4 top-1/3 rounded-2xl p-4 shadow-xl shadow-lk-primary/30"
              style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
            >
              <div className="text-white font-headline font-bold text-2xl leading-none">100%</div>
              <div className="text-white/70 font-inter text-xs mt-1">ID Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: two cards below headline */}
      <div className="lg:hidden px-6 pb-8 grid grid-cols-2 gap-3">
        {[
          { initials: "MV", name: "Marco V.", role: "Structural Engineer", rating: 4.9, color: "bg-lk-primary" },
          { initials: "JR", name: "Jasmine R.", role: "Full Stack Dev", rating: 5.0, color: "bg-lk-red" },
        ].map((card) => (
          <div key={card.name} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-lk-neutral-mid shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl ${card.color} flex items-center justify-center text-white font-headline font-bold text-xs shrink-0`}>
                {card.initials}
              </div>
              <div className="min-w-0">
                <div className="font-headline font-semibold text-lk-dark text-xs truncate">{card.name}</div>
                <div className="font-inter text-[9px] text-lk-dark/50 truncate">{card.role}</div>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={8} className="text-lk-yellow fill-lk-yellow" />
              ))}
              <span className="font-inter text-[9px] text-lk-dark/40 ml-1">{card.rating}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-lk-neutral-mid" />
    </section>
  );
}
