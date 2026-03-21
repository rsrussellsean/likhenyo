"use client";

import { useState } from "react";
import {
  FileText,
  Users,
  Handshake,
  MessageSquare,
  Star,
  UserCircle,
  Search,
  Briefcase,
  Send,
  DollarSign,
} from "lucide-react";

const CLIENT_STEPS = [
  {
    icon: FileText,
    title: "Post Your Job",
    desc: "Describe what you need. Add your budget, timeline, and tags. No complicated forms.",
  },
  {
    icon: Users,
    title: "Review Applicants",
    desc: "Freelancers apply with proposals. Shortlist the ones that fit. Compare profiles and ratings.",
  },
  {
    icon: Handshake,
    title: "Hire with Confidence",
    desc: "Select your freelancer. A booking is created automatically. Set your agreed price and timeline.",
  },
  {
    icon: MessageSquare,
    title: "Track the Work",
    desc: "Log your downpayment. Chat inside the platform. Stay updated without leaving Likhenyo.",
  },
  {
    icon: Star,
    title: "Receive and Review",
    desc: "Accept the deliverables. Leave a review. Build a track record for future hires.",
  },
];

const FREELANCER_STEPS = [
  {
    icon: UserCircle,
    title: "Build Your Profile",
    desc: "List your profession, skills, and work preference. Get verified to stand out.",
  },
  {
    icon: Search,
    title: "Browse and Apply",
    desc: "Find jobs that match your skills. Apply with a proposal that shows what you can do.",
  },
  {
    icon: Briefcase,
    title: "Get Hired",
    desc: "Clients review your application and hire you directly. A booking is set up automatically.",
  },
  {
    icon: Send,
    title: "Do the Work",
    desc: "Agree on the price and timeline. Communicate through the built-in chat. No need for external apps.",
  },
  {
    icon: DollarSign,
    title: "Get Paid and Grow",
    desc: "Submit your work. Receive payment. Collect reviews that build your reputation on the platform.",
  },
];

function StepFlow({
  steps,
}: {
  steps: { icon: React.ElementType; title: string; desc: string }[];
}) {
  return (
    <div className="relative">
      {/* Connector line — desktop */}
      <div className="hidden md:block absolute top-10 left-10 right-10 h-px bg-gradient-to-r from-lk-gold/0 via-lk-gold/40 to-lk-gold/0" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex flex-col items-center text-center md:items-start md:text-left relative">
              {/* Step number + icon */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-2xl bg-lk-navy flex items-center justify-center border border-lk-navy-light shadow-lg">
                  <Icon size={28} className="text-lk-gold" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lk-gold text-white font-wordmark font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-wordmark font-semibold text-lk-navy text-base mb-2">
                {step.title}
              </h3>
              <p className="font-body text-sm text-lk-navy/60 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [tab, setTab] = useState<"clients" | "freelancers">("clients");

  return (
    <section id="how-it-works" className="lk-section bg-lk-cream-dark">
      <div className="lk-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
            <span className="font-wordmark text-xs font-medium text-lk-navy/40 uppercase tracking-[0.18em]">How It Works</span>
            <span className="font-display italic text-lk-gold text-sm leading-none">//</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-lk-navy">
            Simple.{" "}
            <span className="italic text-lk-gold">Structured.</span>{" "}
            Trusted.
          </h2>
          <p className="mt-4 font-body text-lk-navy/60 text-lg max-w-xl mx-auto">
            A clear process from job posting to payment — no ambiguity, no
            scattered conversations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-lk-cream rounded-xl p-1 border border-lk-cream-dark shadow-inner">
            <button
              onClick={() => setTab("clients")}
              className={`font-wordmark font-semibold text-sm px-7 py-2.5 rounded-lg transition-all ${
                tab === "clients"
                  ? "bg-lk-navy text-lk-cream shadow-md"
                  : "text-lk-navy/60 hover:text-lk-navy"
              }`}
            >
              For Clients
            </button>
            <button
              onClick={() => setTab("freelancers")}
              className={`font-wordmark font-semibold text-sm px-7 py-2.5 rounded-lg transition-all ${
                tab === "freelancers"
                  ? "bg-lk-navy text-lk-cream shadow-md"
                  : "text-lk-navy/60 hover:text-lk-navy"
              }`}
            >
              For Freelancers
            </button>
          </div>
        </div>

        {/* Step flow */}
        <div className="transition-all duration-300">
          {tab === "clients" ? (
            <StepFlow steps={CLIENT_STEPS} />
          ) : (
            <StepFlow steps={FREELANCER_STEPS} />
          )}
        </div>
      </div>
    </section>
  );
}
