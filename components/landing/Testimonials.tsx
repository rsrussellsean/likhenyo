import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Maria Santos',
    profession: 'Structural Engineer',
    location: 'Cebu City',
    quote:
      'I landed three projects in my first month. The verified badge made clients trust me immediately without lengthy back-and-forth.',
    initials: 'MS',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Carlo Reyes',
    profession: 'Small Business Owner',
    location: 'Mandaue City',
    quote:
      "I've hired a web developer and a graphic designer through WorkHub PH. No more posting in Facebook groups and hoping for the best.",
    initials: 'CR',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Aira Villanueva',
    profession: 'Freelance Copywriter',
    location: 'Lapu-Lapu City',
    quote:
      'The structured proposals and in-app chat keep everything clean. Clients know exactly what they are getting before we even start.',
    initials: 'AV',
    color: 'bg-rose-100 text-rose-700',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-600">
            Testimonials
          </p>
          <h2 className="font-heading text-4xl text-foreground lg:text-5xl">
            Trusted by professionals.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-7 shadow-sm"
            >
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`text-sm font-semibold ${t.color}`}>
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.profession} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
