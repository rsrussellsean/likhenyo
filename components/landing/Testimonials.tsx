import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marco Villanueva",
    profession: "Structural Engineer",
    location: "Cebu City",
    rating: 5,
    quote:
      "Finally, a platform that takes verification seriously. Clients here actually know what they're hiring.",
    initials: "MV",
    bg: "bg-lk-primary",
  },
  {
    name: "Jasmine Reyes",
    profession: "Full Stack Developer",
    location: "Mandaue City",
    rating: 5,
    quote:
      "I used to find projects through Facebook groups. Likhenyo is so much more organized. My proposals actually get read.",
    initials: "JR",
    bg: "bg-lk-red",
  },
  {
    name: "Dana Mercado",
    profession: "Brand Designer",
    location: "Remote — based in Cebu",
    rating: 5,
    quote:
      "The in-app chat means I never have to share my number with a client before we've agreed on terms. Big deal for me.",
    initials: "DM",
    bg: "bg-lk-dark",
  },
];

export default function Testimonials() {
  return (
    <section className="lk-section bg-white">
      <div className="lk-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-lk-yellow-pale border border-lk-yellow/40 rounded-full px-4 py-1.5 mb-6">
            <span className="font-inter text-xs font-semibold text-lk-dark/70 uppercase tracking-widest">
              Testimonials
            </span>
          </div>
          <h2
            className="font-headline font-extrabold text-lk-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            What Professionals{" "}
            <span className="text-lk-primary">Are Saying</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 pb-4 md:pb-0 snap-x snap-mandatory md:snap-none">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="min-w-[300px] md:min-w-0 snap-start bg-lk-neutral rounded-3xl p-8 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {/* Quote icon */}
              <Quote
                size={28}
                className="text-lk-primary/20 mb-4 shrink-0"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-lk-yellow fill-lk-yellow" />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-inter text-lk-dark/75 leading-relaxed flex-1 text-base">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 pt-6 border-t border-lk-neutral-mid flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl ${t.bg} flex items-center justify-center text-white font-headline font-bold text-sm shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-headline font-semibold text-sm text-lk-dark">
                    {t.name}
                  </div>
                  <div className="font-inter text-xs text-lk-dark/50">
                    {t.profession} · {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
