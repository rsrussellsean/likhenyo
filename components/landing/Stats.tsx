const STATS = [
  {
    value: "100%",
    label: "Verified freelancers",
    note: "Every professional submits a government ID",
    accent: "gold",
  },
  {
    value: "₱0",
    label: "Platform fee to browse and apply",
    note: "Free for everyone during MVP launch",
    accent: "terra",
  },
  {
    value: "1 Platform",
    label: "For jobs, chat, and payments",
    note: "No more scattered tools and apps",
    accent: "gold",
  },
  {
    value: "All Professions",
    label: "Engineers to designers to VAs",
    note: "Any skilled professional is welcome",
    accent: "terra",
  },
] as const;

export default function Stats() {
  return (
    <section className="bg-lk-navy-deep relative overflow-hidden lk-noise">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-lk-gold/40 to-transparent" />

      <div className="lk-container py-20 px-6 md:px-12 lg:px-20 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => {
            const isGold = stat.accent === "gold";
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                {/* Value */}
                <div
                  className={`font-display text-4xl md:text-5xl font-bold italic mb-2 ${
                    isGold ? "text-lk-gold" : "text-lk-terra-light"
                  }`}
                >
                  {stat.value}
                </div>
                {/* Label */}
                <div className="font-wordmark font-semibold text-lk-cream text-base mb-1">
                  {stat.label}
                </div>
                {/* Note */}
                <div className="font-body text-sm text-lk-cream/40 leading-snug">
                  {stat.note}
                </div>
                {/* Accent underline */}
                <div
                  className={`mt-4 h-px w-10 ${isGold ? "bg-lk-gold/30" : "bg-lk-terra/30"}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-lk-terra/30 to-transparent" />
    </section>
  );
}
