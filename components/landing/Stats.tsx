import Link from "next/link";

/*
 * Stats — Scheme1-inspired two-column layout.
 * Left: section label + heading + tagline + CTA.
 * Right: 2×2 bracket-corner stat boxes (scheme1's signature corner decoration).
 */

type BracketAccent = "gold" | "terra";

function StatBox({
  metric,
  label,
  desc,
  accent = "gold",
}: {
  metric: string;
  label: string;
  desc: string;
  accent?: BracketAccent;
}) {
  const b = accent === "gold" ? "border-lk-gold" : "border-lk-terra";
  return (
    <div className="relative bg-white rounded-2xl border border-lk-navy/8 p-6 overflow-hidden
                    hover:shadow-lg hover:shadow-lk-navy/5 transition-all">
      {/* Scheme1 signature: L-shaped corner bracket decorations */}
      <span className={`absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 ${b} rounded-tl`} />
      <span className={`absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 ${b} rounded-tr`} />
      <span className={`absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 ${b} rounded-bl`} />
      <span className={`absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 ${b} rounded-br`} />

      <div
        className="font-display font-black italic text-lk-navy leading-none mb-1"
        style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
      >
        {metric}
      </div>
      <div className="font-wordmark font-semibold text-sm text-lk-navy/70 mb-2">{label}</div>
      <p className="font-body text-xs text-lk-navy/40 leading-snug">{desc}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="bg-lk-cream py-20 md:py-24">
      <div className="lk-container px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: text column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
              <span className="font-wordmark text-xs font-medium text-lk-navy/40 uppercase tracking-[0.18em]">
                By the Numbers
              </span>
              <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
            </div>

            <h2
              className="font-display font-black text-lk-navy leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Transparent{" "}
              <em className="text-lk-gold" style={{ fontStyle: "italic" }}>
                by Design.
              </em>
            </h2>

            <p className="font-body text-lk-navy/50 leading-relaxed max-w-md mb-8">
              No hidden fees. No paywalled trust features. Likhenyo is built for
              Filipino professionals — structured, fair, and open from day one.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 font-wordmark font-semibold text-sm text-lk-navy
                         border border-lk-navy/25 hover:border-lk-navy hover:bg-lk-navy hover:text-lk-cream
                         px-5 py-2.5 rounded-full transition-all group"
            >
              Join for Free
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Right: 2×2 bracket-corner stat boxes */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox metric="₱0"   label="Platform Fee"  desc="Free to browse and apply during MVP launch." accent="gold" />
            <StatBox metric="100%" label="ID Verified"   desc="Every freelancer submits a government ID." accent="gold" />
            <StatBox metric="Any"  label="Profession"    desc="Engineers · Developers · Designers · Lawyers" accent="terra" />
            <StatBox metric="PH"   label="Built Local"   desc="Starting in Cebu, open to all Filipino professionals." accent="terra" />
          </div>

        </div>
      </div>
    </section>
  );
}
