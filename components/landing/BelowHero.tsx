const STATS = [
  { value: "50k+", label: "Freelancers" },
  { value: "10k+", label: "Projects Completed" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "100%", label: "Payment Secure" },
];

export default function BelowHero() {
  return (
    <section className=" bg-lk-neutral">
      <div className="lk-container px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8 ">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1.5 py-8 px-6"
            >
              <span
                className="font-headline font-bold leading-none"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "#0052FF",
                }}
              >
                {value}
              </span>
              <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-lk-dark text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
