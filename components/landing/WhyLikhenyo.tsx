import Link from "next/link";

export default function WhyLikhenyo() {
  return (
    <section className="bg-lk-neutral py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="lk-container">
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center"
          style={{
            background:
              "linear-gradient(135deg, #0052FF 0%, #1A6BFF 40%, #2979FF 70%, #0047E0 100%)",
          }}
        >
          {/* Inner radial glow — lighter at top-center for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.14) 0%, transparent 65%)",
            }}
          />

          {/* Subtle bottom shadow vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(0,28,120,0.35) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative">
            <h2
              className="font-headline font-bold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
            >
              Start Your Journey with LikHenyo
            </h2>

            <p
              className="font-inter text-white/75 leading-relaxed mx-auto mb-10"
              style={{ maxWidth: "30rem", fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}
            >
              Join thousands of companies leveraging the power of Filipino
              talent. Your next &lsquo;Henyo&rsquo; is just a click away.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Primary CTA — white solid */}
              <Link
                href="/signup"
                className="inline-flex items-center font-inter font-semibold text-sm
                           bg-white hover:bg-white/90 text-lk-primary
                           px-7 py-3 rounded-full transition-all
                           shadow-lg shadow-black/15 hover:shadow-black/20 hover:-translate-y-0.5"
              >
                Get Started Today
              </Link>

              {/* Secondary CTA — outlined */}
              <Link
                href="/contact"
                className="inline-flex items-center font-inter font-semibold text-sm
                           border-2 border-white/60 hover:border-white text-white
                           px-7 py-3 rounded-full transition-all
                           hover:bg-white/10 hover:-translate-y-0.5"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
