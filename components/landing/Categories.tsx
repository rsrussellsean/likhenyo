import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Display only — illustrative categories, NOT used as functional filter values
const categories = [
  { icon: '⚙️', label: 'Engineering' },
  { icon: '💻', label: 'Web Development' },
  { icon: '🎨', label: 'Graphic Design' },
  { icon: '✍️', label: 'Writing & Content' },
  { icon: '📊', label: 'Accounting' },
  { icon: '🏛️', label: 'Architecture' },
  { icon: '⚖️', label: 'Legal' },
  { icon: '🖥️', label: 'Virtual Assistant' },
  { icon: '🎬', label: 'Video Editing' },
  { icon: '📣', label: 'Marketing' },
  { icon: '📷', label: 'Photography' },
  { icon: '🔧', label: 'Trades & Labor' },
]

export default function Categories() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-600">
              Professions
            </p>
            <h2 className="font-heading text-4xl text-foreground lg:text-5xl">
              Any skill. Any profession.
            </h2>
          </div>
          <Link
            href="/jobs"
            className="hidden items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 sm:flex"
          >
            Browse All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-slate-50 p-5 text-center transition-all hover:border-amber-200 hover:bg-amber-50 hover:shadow-sm"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium leading-tight text-muted-foreground group-hover:text-foreground">
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            Browse All Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
