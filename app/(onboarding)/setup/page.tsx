"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Check, Briefcase, User, ArrowLeft, X } from "lucide-react";

type Role = "client" | "freelancer";

const WORK_PREFS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

const STEP1_TRUST = [
  "Verified by government ID",
  "Hire or get hired in minutes",
  "Built for Filipino professionals",
];

const STEP2_TRUST = [
  "Your profile is searchable by clients",
  "Add skills to get more job matches",
  "Verification builds trust and higher rates",
];

/* ── Shared left panel ── */
function LeftPanel({ step }: { step: 1 | 2 }) {
  const trust = step === 1 ? STEP1_TRUST : STEP2_TRUST;
  const tagline = step === 1 ? "Welcome to Likhenyo." : "Tell us about your work.";
  const sub =
    step === 1 ? "Let's get your profile set up." : "Help clients find you.";

  return (
    <div
      className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0052FF 0%, #0A3FCC 60%, #001F7A 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,255,255,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 90%, rgba(255,205,0,0.08) 0%, transparent 60%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col h-full px-10 xl:px-14 py-10">
        {/* Wordmark */}
        <Link href="/" className="font-headline font-bold text-2xl flex items-center gap-0.5 w-fit">
          <span style={{ color: "#FFCD00" }}>Lik</span>
          <span className="text-white">henyo</span>
        </Link>

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-center py-12">
          <p className="font-inter text-xs font-semibold text-white/50 uppercase tracking-[0.2em] mb-4">
            Account setup
          </p>
          <h2
            className="font-headline font-extrabold text-white leading-[1.1] mb-2"
            style={{ fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)" }}
          >
            {tagline}
          </h2>
          <p className="font-inter text-base text-white/60 mb-10">{sub}</p>

          <div className="flex flex-col gap-3 mb-12">
            {trust.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="font-inter text-sm text-white/70 leading-snug">{point}</span>
              </div>
            ))}
          </div>

          {/* Progress card */}
          <div className="bg-white/12 backdrop-blur-md rounded-2xl p-5 border border-white/20 max-w-xs">
            <p className="font-inter text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              Your Progress
            </p>
            <div className="flex items-center gap-3">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-sm transition-all ${
                      s <= step
                        ? "bg-white text-lk-primary"
                        : "bg-white/15 text-white/40"
                    }`}
                  >
                    {s < step ? <Check size={14} strokeWidth={2.5} /> : s}
                  </div>
                  {s < 2 && (
                    <div className={`h-px w-8 rounded-full ${s < step ? "bg-white/60" : "bg-white/20"}`} />
                  )}
                </div>
              ))}
              <span className="font-inter text-xs text-white/50 ml-1">Step {step} of 2</span>
            </div>
          </div>
        </div>

        <p className="font-inter text-xs text-white/30">© 2025 Likhenyo · Built for the Philippines</p>
      </div>
    </div>
  );
}

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [profession, setProfession] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [workPref, setWorkPref] = useState<string>("remote");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile?.role) {
        router.replace("/dashboard");
        return;
      }
      const metaRole = data.user.user_metadata?.role as Role | undefined;
      if (metaRole === "client" || metaRole === "freelancer") {
        setRole(metaRole);
        if (metaRole === "client") setStep(1);
      }
      setChecking(false);
    });
  }, [router]);

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function handleComplete() {
    if (!role) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name:
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ??
          "User",
        verified_status: "unverified",
        role,
        ...(role === "freelancer"
          ? {
              profession: profession || null,
              skills: skills.length > 0 ? skills : null,
              work_preference: workPref,
              location: location || null,
            }
          : {}),
      });
    if (error) {
      console.error("Setup upsert error:", error.message);
      setLoading(false);
      return;
    }
    router.replace("/dashboard");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="font-headline font-bold text-2xl text-lk-dark mb-2">
            <span className="text-lk-primary">Lik</span>henyo
          </div>
          <p className="font-inter text-sm text-lk-dark/40">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel step={step} />

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile wordmark */}
          <Link
            href="/"
            className="lg:hidden block font-headline font-bold text-2xl text-lk-dark text-center mb-10"
          >
            <span className="text-lk-primary">Lik</span>henyo
          </Link>

          {/* ── STEP 1: Role selection ── */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1.5">
                  How will you use Likhenyo?
                </h1>
                <p className="font-inter text-sm text-lk-dark/50">
                  Choose your role. You can update this anytime.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {/* Client card */}
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                    role === "client"
                      ? "bg-lk-primary border-lk-primary text-white shadow-lg shadow-lk-primary/20"
                      : "bg-white border-lk-neutral-mid hover:border-lk-primary/40 hover:bg-lk-primary-pale"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      role === "client" ? "bg-white/20" : "bg-lk-primary-pale"
                    }`}
                  >
                    <Briefcase
                      size={20}
                      className={role === "client" ? "text-white" : "text-lk-primary"}
                    />
                  </div>
                  <div>
                    <div className="font-headline font-semibold text-base mb-0.5">
                      I want to hire someone
                    </div>
                    <div
                      className={`font-inter text-sm ${
                        role === "client" ? "text-white/75" : "text-lk-dark/50"
                      }`}
                    >
                      Post jobs and find skilled Filipino professionals.
                    </div>
                  </div>
                  {role === "client" && (
                    <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                      <Check size={11} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </button>

                {/* Freelancer card */}
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                    role === "freelancer"
                      ? "bg-lk-dark border-lk-dark text-white shadow-lg shadow-lk-dark/20"
                      : "bg-white border-lk-neutral-mid hover:border-lk-dark/30 hover:bg-lk-neutral"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      role === "freelancer" ? "bg-white/15" : "bg-lk-neutral-mid"
                    }`}
                  >
                    <User
                      size={20}
                      className={role === "freelancer" ? "text-white" : "text-lk-dark/60"}
                    />
                  </div>
                  <div>
                    <div className="font-headline font-semibold text-base mb-0.5">
                      I want to find work
                    </div>
                    <div
                      className={`font-inter text-sm ${
                        role === "freelancer" ? "text-white/75" : "text-lk-dark/50"
                      }`}
                    >
                      List your skills and apply to jobs as a professional.
                    </div>
                  </div>
                  {role === "freelancer" && (
                    <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check size={11} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!role) return;
                  if (role === "client") handleComplete();
                  else setStep(2);
                }}
                disabled={!role || loading}
                className="w-full h-11 text-white font-inter font-semibold text-sm rounded-xl
                           transition-all disabled:opacity-40 disabled:cursor-not-allowed
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
                style={{
                  background: !role ? "#9ab2ff" : "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)",
                }}
              >
                {loading ? "Saving…" : "Continue →"}
              </button>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mt-5">
                <div className="w-6 h-1.5 rounded-full bg-lk-primary" />
                <div className="w-2 h-1.5 rounded-full bg-lk-neutral-mid" />
              </div>
            </>
          )}

          {/* ── STEP 2: Freelancer details ── */}
          {step === 2 && role === "freelancer" && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 font-inter text-sm text-lk-dark/50 hover:text-lk-dark mb-8 transition-colors"
              >
                <ArrowLeft size={15} />
                Back
              </button>

              <div className="mb-8">
                <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1.5">
                  Tell us about your work.
                </h1>
                <p className="font-inter text-sm text-lk-dark/50">
                  Help clients find you. You can update this anytime.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* Profession */}
                <div>
                  <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Structural Engineer, Web Developer"
                    className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                               font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                               focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                               transition-all"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
                    Skills
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add your skills"
                      className="flex-1 h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                                 font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                                 focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                                 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="h-11 px-4 rounded-xl bg-lk-primary hover:bg-lk-primary-dark text-white font-inter text-sm font-semibold transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 bg-lk-primary-pale text-lk-primary font-inter font-medium text-xs px-3 py-1.5 rounded-full"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => removeSkill(s)}
                            className="text-lk-primary/50 hover:text-lk-primary transition-colors"
                            aria-label={`Remove ${s}`}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work preference */}
                <div>
                  <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-2 uppercase tracking-wide">
                    Work Preference
                  </label>
                  <div className="flex gap-2">
                    {WORK_PREFS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setWorkPref(p.value)}
                        className={`flex-1 h-10 rounded-full font-inter text-sm font-medium transition-all ${
                          workPref === p.value
                            ? "bg-lk-primary text-white shadow-md shadow-lk-primary/20"
                            : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-neutral-mid"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cebu City, Mandaue, Remote"
                    className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                               font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                               focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                               transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="mt-8 w-full h-11 text-white font-inter font-semibold text-sm rounded-xl
                           transition-all disabled:opacity-60 disabled:cursor-not-allowed
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
                style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
              >
                {loading ? "Setting up your profile…" : "Complete Setup"}
              </button>

              <p className="text-center font-inter text-xs text-lk-dark/35 mt-4">
                You can update your profession and skills from your profile.
              </p>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mt-5">
                <div className="w-2 h-1.5 rounded-full bg-lk-neutral-mid" />
                <div className="w-6 h-1.5 rounded-full bg-lk-primary" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
