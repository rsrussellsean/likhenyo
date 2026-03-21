import Link from "next/link";
import {
  HardHat,
  Code2,
  Palette,
  Building2,
  Calculator,
  Scale,
  PenLine,
  Smartphone,
  Sofa,
  Video,
  Headphones,
  Wrench,
  ArrowRight,
} from "lucide-react";

/* Illustrative display tiles only — not hardcoded filter values */
const PROFESSIONS = [
  { icon: HardHat, label: "Structural Engineering" },
  { icon: Code2, label: "Web Development" },
  { icon: Palette, label: "Graphic Design" },
  { icon: Building2, label: "Architecture" },
  { icon: Calculator, label: "Accounting & Finance" },
  { icon: Scale, label: "Legal Services" },
  { icon: PenLine, label: "Content Writing" },
  { icon: Smartphone, label: "Mobile Development" },
  { icon: Sofa, label: "Interior Design" },
  { icon: Video, label: "Video Production" },
  { icon: Headphones, label: "Virtual Assistance" },
  { icon: Wrench, label: "Trades & Labor" },
];

export default function ProfessionGrid() {
  return (
    <section className="lk-section bg-lk-cream">
      <div className="lk-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
            <span className="font-wordmark text-xs font-medium text-lk-navy/40 uppercase tracking-[0.18em]">Our Professions</span>
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-lk-navy">
            Any Skill.{" "}
            <span className="italic text-lk-gold">Any Project.</span>
          </h2>
          <p className="mt-4 font-body text-lk-navy/60 text-lg max-w-2xl mx-auto">
            From blueprints to code to brand identity — Likhenyo is built for
            every kind of Filipino professional.
          </p>
        </div>

        {/* Grid — tiles alternate gold / terracotta hover to showcase both accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROFESSIONS.map((p, i) => {
            const Icon = p.icon;
            const useGold = i % 3 !== 2;  /* roughly 2/3 gold, 1/3 terra */
            return (
              <div
                key={p.label}
                className={`group flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-lk-cream-dark transition-all cursor-default hover:shadow-lg ${
                  useGold
                    ? "hover:border-lk-gold/40 hover:shadow-lk-gold/5"
                    : "hover:border-lk-terra/40 hover:shadow-lk-terra/5"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-lk-blue-mist flex items-center justify-center transition-colors ${
                    useGold ? "group-hover:bg-lk-gold/10" : "group-hover:bg-lk-terra/10"
                  }`}
                >
                  <Icon
                    size={22}
                    className={`text-lk-navy transition-colors ${
                      useGold ? "group-hover:text-lk-gold" : "group-hover:text-lk-terra"
                    }`}
                  />
                </div>
                <span className="font-wordmark font-medium text-sm text-lk-navy text-center leading-snug">
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Browse link */}
        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 font-wordmark font-semibold text-lk-gold hover:text-lk-gold-light text-base transition-colors group"
          >
            Browse All Jobs
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
