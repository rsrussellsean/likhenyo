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
  { icon: HardHat,     label: "Structural Engineering" },
  { icon: Code2,       label: "Web Development" },
  { icon: Palette,     label: "Graphic Design" },
  { icon: Building2,   label: "Architecture" },
  { icon: Calculator,  label: "Accounting & Finance" },
  { icon: Scale,       label: "Legal Services" },
  { icon: PenLine,     label: "Content Writing" },
  { icon: Smartphone,  label: "Mobile Development" },
  { icon: Sofa,        label: "Interior Design" },
  { icon: Video,       label: "Video Production" },
  { icon: Headphones,  label: "Virtual Assistance" },
  { icon: Wrench,      label: "Trades & Labor" },
];

export default function ProfessionGrid() {
  return (
    <section className="lk-section bg-lk-neutral">
      <div className="lk-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-lk-primary-pale border border-lk-primary/15 rounded-full px-4 py-1.5 mb-6">
            <span className="font-inter text-xs font-semibold text-lk-primary uppercase tracking-widest">
              Our Professions
            </span>
          </div>
          <h2
            className="font-headline font-extrabold text-lk-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Any Skill.{" "}
            <span className="text-lk-primary">Any Project.</span>
          </h2>
          <p className="mt-4 font-inter text-lk-dark/55 text-lg max-w-2xl mx-auto">
            From blueprints to code to brand identity — Likhenyo is built for
            every kind of Filipino professional.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROFESSIONS.map((p, i) => {
            const Icon = p.icon;
            const useRed = i % 5 === 4;
            return (
              <div
                key={p.label}
                className="group flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl transition-all cursor-default hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-lk-primary-pale flex items-center justify-center transition-colors group-hover:bg-lk-primary">
                  <Icon
                    size={22}
                    className={`transition-colors ${
                      useRed
                        ? "text-lk-red group-hover:text-white"
                        : "text-lk-primary group-hover:text-white"
                    }`}
                  />
                </div>
                <span className="font-headline font-medium text-sm text-lk-dark text-center leading-snug">
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
            className="inline-flex items-center gap-2 font-inter font-semibold text-lk-primary hover:text-lk-primary-dark text-base transition-colors group"
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
