"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "client" | "freelancer";

const WORK_PREFS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

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

  // Guard: if profile already has a role, skip onboarding
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

      // Pre-fill role from metadata if set during email signup
      const metaRole = data.user.user_metadata?.role as Role | undefined;
      if (metaRole === "client" || metaRole === "freelancer") {
        setRole(metaRole);
        if (metaRole === "client") {
          // Skip step 2 for clients
          setStep(1);
        }
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        role,
        ...(role === "freelancer"
          ? {
              profession: profession || null,
              skills: skills.length > 0 ? skills : null,
              work_preference: workPref,
              location: location || null,
            }
          : {}),
      })
      .eq("id", user.id);

    router.replace("/dashboard");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-lk-cream flex items-center justify-center">
        <div className="font-body text-lk-navy/40">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lk-cream flex items-center justify-center px-4 py-20">
      <div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lk-navy via-lk-gold to-lk-navy"
        aria-hidden="true"
      />

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-wordmark font-bold text-2xl text-lk-navy">
            <span className="text-lk-gold">L</span>ikhenyo
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-lk-cream-dark shadow-xl shadow-lk-navy/5 p-8">
          {/* Step 1: Role selection */}
          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-bold text-lk-navy mb-2">
                How will you use Likhenyo?
              </h1>
              <p className="font-body text-lk-navy/60 text-sm mb-8">
                Choose your role to get started. You can always switch later.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setRole("client")}
                  className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                    role === "client"
                      ? "border-lk-navy bg-lk-navy text-lk-cream"
                      : "border-lk-cream-dark bg-white text-lk-navy hover:border-lk-navy/40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      role === "client" ? "bg-white/20" : "bg-lk-blue-mist"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${role === "client" ? "text-lk-cream" : "text-lk-navy"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-wordmark font-semibold text-base mb-0.5">
                      I want to hire someone
                    </div>
                    <div
                      className={`font-body text-sm ${role === "client" ? "text-lk-cream/70" : "text-lk-navy/50"}`}
                    >
                      Post jobs and find skilled Filipino professionals.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setRole("freelancer")}
                  className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                    role === "freelancer"
                      ? "border-lk-gold bg-lk-gold text-white"
                      : "border-lk-cream-dark bg-white text-lk-navy hover:border-lk-gold/40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      role === "freelancer" ? "bg-white/20" : "bg-lk-gold-pale"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${role === "freelancer" ? "text-white" : "text-lk-gold"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-wordmark font-semibold text-base mb-0.5">
                      I want to find work
                    </div>
                    <div
                      className={`font-body text-sm ${role === "freelancer" ? "text-white/80" : "text-lk-navy/50"}`}
                    >
                      List your skills and apply to jobs as a professional.
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => {
                  if (!role) return;
                  if (role === "client") {
                    handleComplete();
                  } else {
                    setStep(2);
                  }
                }}
                disabled={!role || loading}
                className="mt-8 w-full h-11 bg-lk-navy hover:bg-lk-navy-light text-lk-cream font-wordmark font-semibold text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : "Continue"}
              </button>
            </>
          )}

          {/* Step 2: Freelancer details */}
          {step === 2 && role === "freelancer" && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 font-body text-sm text-lk-navy/50 hover:text-lk-navy mb-6 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>

              <h1 className="font-display text-3xl font-bold text-lk-navy mb-2">
                Tell us about your work.
              </h1>
              <p className="font-body text-lk-navy/60 text-sm mb-7">
                Help clients find you. You can update this anytime.
              </p>

              <div className="flex flex-col gap-5">
                {/* Profession */}
                <div>
                  <label className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Structural Engineer, Web Developer, Graphic Designer"
                    className="w-full h-11 px-4 rounded-lg border border-lk-cream-dark bg-lk-cream focus:outline-none focus:border-lk-gold focus:ring-1 focus:ring-lk-gold/30 font-body text-sm text-lk-navy placeholder:text-lk-navy/30 transition-all"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide">
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
                      className="flex-1 h-11 px-4 rounded-lg border border-lk-cream-dark bg-lk-cream focus:outline-none focus:border-lk-gold focus:ring-1 focus:ring-lk-gold/30 font-body text-sm text-lk-navy placeholder:text-lk-navy/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="h-11 px-4 rounded-lg bg-lk-navy text-lk-cream font-wordmark text-sm font-medium hover:bg-lk-navy-light transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 bg-lk-gold/10 text-lk-gold font-wordmark font-medium text-xs px-3 py-1.5 rounded-full"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => removeSkill(s)}
                            className="text-lk-gold/60 hover:text-lk-gold transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work preference */}
                <div>
                  <label className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-2 uppercase tracking-wide">
                    Work Preference
                  </label>
                  <div className="flex gap-2">
                    {WORK_PREFS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setWorkPref(p.value)}
                        className={`flex-1 h-10 rounded-lg font-wordmark text-sm font-medium border-2 transition-all ${
                          workPref === p.value
                            ? "border-lk-navy bg-lk-navy text-lk-cream"
                            : "border-lk-cream-dark bg-white text-lk-navy hover:border-lk-navy/30"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block font-wordmark text-xs font-medium text-lk-navy/70 mb-1.5 uppercase tracking-wide">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cebu City, Mandaue, Remote"
                    className="w-full h-11 px-4 rounded-lg border border-lk-cream-dark bg-lk-cream focus:outline-none focus:border-lk-gold focus:ring-1 focus:ring-lk-gold/30 font-body text-sm text-lk-navy placeholder:text-lk-navy/30 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={loading}
                className="mt-8 w-full h-11 bg-lk-gold hover:bg-lk-gold-light text-white font-wordmark font-semibold text-sm rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Setting up your profile…" : "Complete Setup"}
              </button>

              <p className="text-center font-body text-xs text-lk-navy/40 mt-4">
                You can update your profession and skills later from your profile.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
