import { ShieldCheck, FileText, Send, Handshake, MessageSquare, Star } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    description:
      'Every freelancer submits a government ID. Top professionals hold a verified badge visible to all clients.',
  },
  {
    icon: FileText,
    title: 'Structured Job Posts',
    description:
      'Tag-based job posts surface the right talent fast — no more sifting through irrelevant applicants.',
  },
  {
    icon: Send,
    title: 'Apply to Multiple Jobs',
    description:
      'Freelancers can apply across any category with a focused proposal — no generic mass applications.',
  },
  {
    icon: Handshake,
    title: 'Secure Hiring Flow',
    description:
      'One-click hiring locks the agreement atomically — price, timeline, and scope all confirmed before work begins.',
  },
  {
    icon: MessageSquare,
    title: 'In-App Chat',
    description:
      'Private messaging unlocked only after hiring. All communication stays on-platform, safe and documented.',
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    description:
      'Both parties leave verified reviews after every booking — building real trust over time.',
  },
]

export default function Features() {
  return (
    <section className="bg-[#0c1828] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-400">
            Platform Features
          </p>
          <h2 className="font-heading text-4xl text-white lg:text-5xl">
            Built for trust. Built to last.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            WorkHub PH replaces informal referral chains with a structured, transparent platform
            every professional deserves.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-amber-500/30 hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                <feature.icon className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
