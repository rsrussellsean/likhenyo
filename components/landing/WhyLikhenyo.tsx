import { ShieldCheck, LayoutGrid, MapPin } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    desc: "Every freelancer on Likhenyo submits a government ID before applying to jobs. Optional credentials like PRC licenses add another layer of trust.",
    accent: "yellow",
  },
  {
    icon: LayoutGrid,
    title: "Structured, Not Scattered",
    desc: "No more chasing leads in Facebook groups or Viber chats. Jobs, applications, agreements, and payments — all in one place.",
    accent: "yellow",
  },
  {
    icon: MapPin,
    title: "Built for the Philippine Market",
    desc: "GCash, QR Ph, and local payment methods. Philippine cities and provinces. Designed for how business works here.",
    accent: "red",
  },
] as const;

export default function WhyLikhenyo() {
  return (
    <section className="lk-section relative overflow-hidden bg-lk-primary">
      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(255,205,0,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="lk-container relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="font-inter text-xs font-semibold text-white/80 uppercase tracking-widest">
              Why Likhenyo
            </span>
          </div>
          <h2
            className="font-headline font-extrabold text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Built for How{" "}
            <span style={{ color: "#FFCD00" }}>Filipinos Actually Work</span>
          </h2>
          <p className="mt-4 font-inter text-white/60 text-lg max-w-xl mx-auto">
            A platform designed around real Filipino work culture — not a
            copy-paste of foreign freelance sites.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isYellow = pillar.accent === "yellow";
            return (
              <div
                key={pillar.title}
                className="group bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/30 rounded-3xl p-8 transition-all hover:bg-white/[0.13]"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                  style={{
                    background: isYellow
                      ? "rgba(255,205,0,0.15)"
                      : "rgba(238,43,43,0.15)",
                  }}
                >
                  <Icon
                    size={26}
                    style={{ color: isYellow ? "#FFCD00" : "#EE2B2B" }}
                  />
                </div>

                <h3 className="font-headline font-bold text-xl text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="font-inter text-white/60 leading-relaxed">
                  {pillar.desc}
                </p>

                {/* Bottom accent */}
                <div
                  className="mt-6 h-0.5 w-8 rounded-full"
                  style={{
                    background: isYellow ? "#FFCD00" : "#EE2B2B",
                    opacity: 0.5,
                  }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
