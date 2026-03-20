import Link from 'next/link'
import { Facebook, Linkedin, Instagram } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const columns = [
  {
    heading: 'About',
    links: [
      { label: 'About WorkHub PH', href: '#' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Trust & Safety', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'For Clients',
    links: [
      { label: 'Post a Job', href: '/signup?role=client' },
      { label: 'Browse Freelancers', href: '/freelancers' },
      { label: 'How to Hire', href: '#how-it-works' },
      { label: 'Payment Guide', href: '#' },
    ],
  },
  {
    heading: 'For Freelancers',
    links: [
      { label: 'Find Work', href: '/signup?role=freelancer' },
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'Get Verified', href: '#' },
      { label: 'Profile Tips', href: '#' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#0c1828]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-heading text-2xl text-white">
              WorkHub<span className="text-amber-400">PH</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Hire any skilled professional in the Philippines. Verified and Structured.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Instagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-400"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} WorkHub PH. All rights reserved.</p>
          <p>Made with care in Cebu, Philippines 🇵🇭</p>
        </div>
      </div>
    </footer>
  )
}
