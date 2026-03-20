import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0c1828] py-24 lg:py-32">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Amber glow */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs tracking-wider uppercase"
            >
              Now open in Cebu
            </Badge>

            <h1 className="font-heading text-5xl leading-[1.1] text-white lg:text-6xl xl:text-7xl">
              Hire Any Skilled Professional in the Philippines.
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-slate-300">
              Verified freelancers across engineering, technology, design, business, and more
              — all in one structured platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-amber-500 px-8 text-white hover:bg-amber-600 focus:ring-amber-500"
                asChild
              >
                <Link href="/signup?role=client">Post a Job</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 px-8 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/signup?role=freelancer">Find Work</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { value: '500+', label: 'Verified Professionals' },
                { value: '200+', label: 'Jobs Posted' },
                { value: '4.9★', label: 'Avg. Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="relative h-[420px] w-[420px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-8 rounded-full border border-amber-500/10" />
              {/* Center card */}
              <div className="absolute inset-16 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20">
                  <span className="text-2xl">🇵🇭</span>
                </div>
                <p className="text-center text-sm font-medium text-white">
                  Connecting Filipino talent with opportunity
                </p>
                <p className="mt-1 text-center text-xs text-slate-400">
                  Structured. Verified. Trusted.
                </p>
              </div>
              {/* Floating profession chips */}
              {[
                { label: 'Engineer', top: '6%', left: '18%' },
                { label: 'Designer', top: '6%', right: '10%' },
                { label: 'Developer', top: '44%', left: '-4%' },
                { label: 'Accountant', top: '44%', right: '-6%' },
                { label: 'Architect', bottom: '8%', left: '14%' },
                { label: 'Writer', bottom: '8%', right: '8%' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="absolute flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0c1828]/80 px-3 py-1.5 backdrop-blur-sm"
                  style={{
                    top: chip.top,
                    left: (chip as { left?: string }).left,
                    right: (chip as { right?: string }).right,
                    bottom: chip.bottom,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="text-xs text-slate-300">{chip.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
