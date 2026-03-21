import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marco Villanueva",
    profession: "Structural Engineer",
    location: "Cebu City",
    rating: 5,
    quote:
      "Finally, a platform that takes verification seriously. Clients here actually know what they're hiring.",
    initials: "MV",
    color: "from-blue-900 to-blue-700",
  },
  {
    name: "Jasmine Reyes",
    profession: "Full Stack Developer",
    location: "Mandaue City",
    rating: 5,
    quote:
      "I used to find projects through Facebook groups. Likhenyo is so much more organized. My proposals actually get read.",
    initials: "JR",
    color: "from-amber-800 to-amber-600",
  },
  {
    name: "Dana Mercado",
    profession: "Brand Designer",
    location: "Remote — based in Cebu",
    rating: 5,
    quote:
      "The in-app chat means I never have to share my number with a client before we've agreed on terms. Big deal for me.",
    initials: "DM",
    color: "from-emerald-900 to-emerald-700",
  },
];

export default function Testimonials() {
  return (
    <section className="lk-section bg-lk-cream">
      <div className="lk-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
            <span className="font-wordmark text-xs font-medium text-lk-navy/40 uppercase tracking-[0.18em]">Testimonials</span>
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-lk-navy">
            What Professionals{" "}
            <span className="italic text-lk-gold">Are Saying</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 pb-2 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-none">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="min-w-[300px] md:min-w-0 snap-start bg-white rounded-2xl border border-lk-cream-dark p-8 flex flex-col hover:shadow-lg hover:shadow-lk-navy/5 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-lk-gold fill-lk-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-body text-lk-navy/80 leading-relaxed flex-1 text-base italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 pt-6 border-t border-lk-cream-dark flex items-center gap-3">
                {/* Illustrated avatar */}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-wordmark font-bold text-sm shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-wordmark font-semibold text-sm text-lk-navy">
                    {t.name}
                  </div>
                  <div className="font-body text-xs text-lk-navy/50">
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
