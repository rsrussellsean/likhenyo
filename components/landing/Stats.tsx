import Image from "next/image";
import Link from "next/link";

const STATS = [
  {
    metric: "₱0",
    label: "Platform Fee",
    desc: "Free to browse and apply during MVP launch.",
    bg: "bg-lk-primary-pale",
    text: "text-lk-primary",
  },
  {
    metric: "100%",
    label: "Government ID Verified",
    desc: "Every freelancer submits a government ID before applying.",
    bg: "bg-lk-red-pale",
    text: "text-lk-red",
  },
  {
    metric: "12+",
    label: "Professions Supported",
    desc: "From structural engineers to designers to tradespeople.",
    bg: "bg-lk-primary-pale",
    text: "text-lk-primary",
  },
  {
    metric: "PH",
    label: "Built for the Philippines",
    desc: "Starting in Cebu — open to all Filipino professionals.",
    bg: "bg-lk-yellow-pale",
    text: "text-lk-dark",
  },
];

export default function Stats() {
  return (
    <section className="bg-lk-neutral py-20 md:py-28">
      <div className="lk-container px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Image with glassmorphic overlay ── */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl shadow-lk-dark/10">
              <Image
                src="/images/Filipino_agree.jpg"
                alt="Filipino professionals in agreement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lk-dark/25 to-transparent" />
            </div>

            {/* Glassmorphic stats bar overlaid on image */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-xl">
              <div className="grid grid-cols-3 gap-4 divide-x divide-lk-neutral-mid">
                {[
                  { value: "₱0", label: "Platform Fee" },
                  { value: "100%", label: "ID Verified" },
                  { value: "Any", label: "Profession" },
                ].map((s) => (
                  <div key={s.label} className="text-center px-2">
                    <div className="font-headline font-bold text-lk-primary text-xl leading-none">{s.value}</div>
                    <div className="font-inter text-[10px] text-lk-dark/50 mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Text + stat list ── */}
          <div className="order-1 lg:order-2">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-lk-yellow-pale border border-lk-yellow/40 rounded-full px-4 py-1.5 mb-6">
              <span className="font-inter text-xs font-semibold text-lk-dark/70 uppercase tracking-widest">
                By the Numbers
              </span>
            </div>

            <h2
              className="font-headline font-extrabold text-lk-dark leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Transparent{" "}
              <span className="text-lk-primary">by Design.</span>
            </h2>

            <p className="font-inter text-lk-dark/55 leading-relaxed max-w-md mb-10">
              No hidden fees. No paywalled trust features. Likhenyo is built for
              Filipino professionals — structured, fair, and open from day one.
            </p>

            {/* Stat rows */}
            <div className="space-y-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <span className={`font-headline font-bold ${stat.text} text-sm`}>{stat.metric}</span>
                  </div>
                  <div className="pt-1">
                    <div className="font-headline font-semibold text-lk-dark text-sm">{stat.label}</div>
                    <div className="font-inter text-xs text-lk-dark/45 mt-0.5">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-lk-primary
                         border-2 border-lk-primary/25 hover:border-lk-primary hover:bg-lk-primary hover:text-white
                         px-5 py-2.5 rounded-xl transition-all mt-8 group"
            >
              Join for Free
              <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
