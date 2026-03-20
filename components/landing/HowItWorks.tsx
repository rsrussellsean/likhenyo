'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const clientSteps = [
  {
    icon: '📋',
    title: 'Post a Job',
    description: 'Describe what you need, set your budget, and add skill tags — takes under 5 minutes.',
  },
  {
    icon: '👥',
    title: 'Review Applicants',
    description: 'Browse proposals, check portfolios, and shortlist the candidates you like.',
  },
  {
    icon: '✅',
    title: 'Hire',
    description: 'Select your freelancer. The booking is created automatically and the agreement is locked.',
  },
  {
    icon: '💳',
    title: 'Pay',
    description: 'Log a downpayment via GCash, QR PH, or bank transfer — no escrow fees.',
  },
  {
    icon: '📦',
    title: 'Receive Work',
    description: 'Review the submission, mark the booking complete, and leave a review.',
  },
]

const freelancerSteps = [
  {
    icon: '🪪',
    title: 'Build Your Profile',
    description: 'Add your profession, skills, portfolio, and rate. Verify your identity for a trust badge.',
  },
  {
    icon: '🔍',
    title: 'Browse Jobs',
    description: 'Filter by category, skills, work mode, and budget to find the right fit.',
  },
  {
    icon: '✍️',
    title: 'Apply',
    description: 'Write a proposal and submit. No bidding wars — just a clear pitch.',
  },
  {
    icon: '🤝',
    title: 'Get Hired',
    description: 'The client selects you. Review the agreed price and timeline before accepting.',
  },
  {
    icon: '💰',
    title: 'Get Paid',
    description: 'Submit your work, confirm payment receipt, and build your review history.',
  },
]

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'clients' | 'freelancers'>('clients')
  const steps = activeTab === 'clients' ? clientSteps : freelancerSteps

  return (
    <section id="how-it-works" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-600">
            How It Works
          </p>
          <h2 className="font-heading text-4xl text-foreground lg:text-5xl">
            Simple from start to finish.
          </h2>
        </div>

        {/* Tabs */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-background p-1">
            {(['clients', 'freelancers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-full px-6 py-2 text-sm font-medium transition-all',
                  activeTab === tab
                    ? 'bg-[#0c1828] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                For {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid gap-4 sm:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-7 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] border-t border-dashed border-amber-300 sm:block" />
              )}
              <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-2xl shadow-sm">
                {step.icon}
              </div>
              <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
                Step {i + 1}
              </span>
              <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
