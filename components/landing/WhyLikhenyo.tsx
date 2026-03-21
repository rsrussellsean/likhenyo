import { ShieldCheck, LayoutGrid, MapPin } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    desc: "Every freelancer on Likhenyo submits a government ID before applying to jobs. Optional credentials like PRC licenses add another layer of trust.",
    accent: "gold",
  },
  {
    icon: LayoutGrid,
    title: "Structured, Not Scattered",
    desc: "No more chasing leads in Facebook groups or Viber chats. Jobs, applications, agreements, and payments — all in one place.",
    accent: "gold",
  },
  {
    icon: MapPin,
    title: "Built for the Philippine Market",
    desc: "GCash, QR Ph, and local payment methods. Philippine cities and provinces. Designed for how business works here.",
    accent: "terra",
  },
] as const;

export default function WhyLikhenyo() {
  return (
    <section className="lk-section bg-lk-navy relative overflow-hidden">
      {/* Dot-grid texture using new amber token */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #d4841a 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="lk-container relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
            <span className="font-wordmark text-xs font-medium text-white/30 uppercase tracking-[0.18em]">Why Likhenyo</span>
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-lk-cream">
            Built for How{" "}
            <span className="italic text-lk-gold">Filipinos Actually Work</span>
          </h2>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isGold = pillar.accent === "gold";
            return (
              <div
                key={pillar.title}
                className={`bg-lk-navy-light/50 border rounded-2xl p-8 transition-all group ${
                  isGold
                    ? "border-lk-navy-light hover:border-lk-gold/30"
                    : "border-lk-navy-light hover:border-lk-terra/40"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors ${
                    isGold
                      ? "bg-lk-gold/10 border-lk-gold/20 group-hover:bg-lk-gold/20"
                      : "bg-lk-terra/10 border-lk-terra/20 group-hover:bg-lk-terra/20"
                  }`}
                >
                  <Icon
                    size={26}
                    className={isGold ? "text-lk-gold" : "text-lk-terra-light"}
                  />
                </div>

                <h3 className="font-wordmark font-bold text-xl text-lk-cream mb-3">
                  {pillar.title}
                </h3>
                <p className="font-body text-lk-cream/60 leading-relaxed">
                  {pillar.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`mt-6 h-0.5 w-8 rounded-full ${
                    isGold ? "bg-lk-gold/40" : "bg-lk-terra/40"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
