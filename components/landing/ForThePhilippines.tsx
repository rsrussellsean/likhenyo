import Link from "next/link";

export default function ForThePhilippines() {
  return (
    <section className="relative bg-lk-navy overflow-hidden">
      {/* Dual radial — gold from bottom, terracotta from top-right corner */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 110%, rgba(212,132,26,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 90% 0%, rgba(184,82,57,0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Top accent line — gold → terracotta */}
      <div className="h-px bg-gradient-to-r from-transparent via-lk-gold/40 via-50% to-lk-terra/30" />

      <div className="lk-container px-6 md:px-12 lg:px-20 py-28 relative text-center">
        {/* Scheme1: // label // */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
          <span className="font-wordmark text-xs font-medium text-white/35 uppercase tracking-[0.18em]">Made in the Philippines</span>
          <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
        </div>

        {/* Filipino tagline — Fraunces in italic black */}
        <h2
          className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-lk-cream italic leading-tight mb-6"
          lang="tl"
        >
          Para sa mga{" "}
          <span className="text-lk-gold">Filipino Workers.</span>
        </h2>

        {/* English subtitle */}
        <p className="font-body text-lk-cream/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Likhenyo was built for the Philippines. For the engineer in Cebu, the
          developer in Davao, the designer in Manila — and everyone in between.
        </p>

        {/* CTA with shimmer */}
        <Link
          href="/signup"
          className="lk-shimmer inline-flex font-wordmark font-bold text-base bg-lk-gold hover:bg-lk-gold-light text-white px-10 py-4 rounded-xl transition-all shadow-2xl shadow-lk-gold/20 hover:shadow-lk-gold/35 hover:-translate-y-0.5"
        >
          Join Likhenyo Today
        </Link>
      </div>

      {/* Bottom accent line — terracotta → gold */}
      <div className="h-px bg-gradient-to-r from-lk-terra/20 via-lk-gold/40 to-transparent" />
    </section>
  );
}
