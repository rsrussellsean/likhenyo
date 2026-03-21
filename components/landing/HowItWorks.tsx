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
    desc: "Freelancers apply with proposals. Shortlist the ones that fit.",
  },
  {
    icon: Handshake,
    title: "Hire with Confidence",
    desc: "Select your freelancer. A booking is created automatically. Set the agreed price and timeline.",
  },
  {
    icon: MessageSquare,
    title: "Track the Work",
    desc: "Log your downpayment. Chat inside the platform. No external apps needed.",
  },
  {
    icon: Star,
    title: "Receive and Review",
    desc: "Accept deliverables. Leave a review. Build a track record for future hires.",
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
    desc: "Agree on the price and timeline. Communicate through built-in chat.",
  },
  {
    icon: DollarSign,
    title: "Get Paid and Grow",
    desc: "Submit your work. Receive payment. Collect reviews that build your reputation.",
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
      <div className="hidden md:block absolute top-10 left-10 right-10 h-px bg-gradient-to-r from-lk-primary/0 via-lk-primary/30 to-lk-primary/0" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="flex flex-col items-center text-center md:items-start md:text-left relative"
            >
              {/* Step badge + icon */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-2xl bg-lk-primary-pale flex items-center justify-center shadow-sm">
                  <Icon size={26} className="text-lk-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lk-primary text-white font-headline font-bold text-xs flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-headline font-semibold text-lk-dark text-base mb-2">
                {step.title}
              </h3>
              <p className="font-inter text-sm text-lk-dark/55 leading-relaxed">
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
    <section id="how-it-works" className="lk-section bg-white">
      <div className="lk-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-lk-primary-pale border border-lk-primary/15 rounded-full px-4 py-1.5 mb-6">
            <span className="font-inter text-xs font-semibold text-lk-primary uppercase tracking-widest">
              How It Works
            </span>
          </div>
          <h2
            className="font-headline font-extrabold text-lk-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Simple.{" "}
            <span className="text-lk-primary">Structured.</span>{" "}
            Trusted.
          </h2>
          <p className="mt-4 font-inter text-lk-dark/55 text-lg max-w-xl mx-auto">
            A clear process from job posting to payment — no ambiguity,
            no scattered conversations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-lk-neutral rounded-xl p-1 border border-lk-neutral-mid">
            <button
              onClick={() => setTab("clients")}
              className={`font-inter font-semibold text-sm px-7 py-2.5 rounded-lg transition-all ${
                tab === "clients"
                  ? "bg-lk-primary text-white shadow-md shadow-lk-primary/25"
                  : "text-lk-dark/60 hover:text-lk-dark"
              }`}
            >
              For Clients
            </button>
            <button
              onClick={() => setTab("freelancers")}
              className={`font-inter font-semibold text-sm px-7 py-2.5 rounded-lg transition-all ${
                tab === "freelancers"
                  ? "bg-lk-primary text-white shadow-md shadow-lk-primary/25"
                  : "text-lk-dark/60 hover:text-lk-dark"
              }`}
            >
              For Freelancers
            </button>
          </div>
        </div>

        {/* Step flow */}
        <div>
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
