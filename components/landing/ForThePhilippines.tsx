import Image from "next/image";
import Link from "next/link";

export default function ForThePhilippines() {
  return (
    <section className="relative overflow-hidden bg-lk-dark">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/Filipino_teamwork.jpg"
          alt="Filipino professionals working together"
          fill
          className="object-cover object-center"
        />
        {/* Deep overlay — preserves readability */}
        <div className="absolute inset-0 bg-lk-dark/75" />
        {/* Blue gradient wash — primary brand direction */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,82,255,0.35) 0%, rgba(10,22,40,0.60) 60%, rgba(10,22,40,0.85) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Top accent line */}
      <div
        className="relative h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,82,255,0.4), rgba(255,205,0,0.4), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="lk-container px-6 md:px-12 lg:px-20 py-28 relative text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <span className="font-inter text-xs font-semibold text-white/70 uppercase tracking-widest">
            Made in the Philippines
          </span>
        </div>

        {/* Headline */}
        <h2
          className="font-headline font-extrabold text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
          lang="tl"
        >
          Para sa mga{" "}
          <span style={{ color: "#FFCD00" }}>Filipino Workers.</span>
        </h2>

        {/* Subtitle */}
        <p className="font-inter text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Likhenyo was built for the Philippines. For the engineer in Cebu,
          the developer in Davao, the designer in Manila — and everyone
          in between.
        </p>

        {/* CTA */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="lk-shimmer inline-flex font-inter font-bold text-base
                       bg-lk-primary hover:bg-lk-primary-dark text-white
                       px-10 py-4 rounded-xl transition-all
                       shadow-2xl shadow-lk-primary/30 hover:shadow-lk-primary/50 hover:-translate-y-0.5"
          >
            Join Likhenyo Today
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex font-inter font-semibold text-base
                       text-white/70 hover:text-white px-6 py-4 transition-colors"
          >
            Learn how it works →
          </Link>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="relative h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,205,0,0.3), rgba(0,82,255,0.3), transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
