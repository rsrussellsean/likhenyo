"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import CategoryInput from "./CategoryInput";
import TagInput from "./TagInput";
import { getProfessionSuggestions, getSkillSuggestions } from "@/lib/actions/autocomplete";
import { updateFullProfileAction } from "@/lib/actions/auth";
import type { Profile } from "@/types/database";

interface ProfileEditFormProps {
  profile: Profile;
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [fullName,      setFullName]      = useState(profile.full_name ?? "");
  const [bio,           setBio]           = useState(profile.bio ?? "");
  const [location,      setLocation]      = useState(profile.location ?? "");
  const [profession,    setProfession]    = useState(profile.profession ?? "");
  const [skills,        setSkills]        = useState<string[]>(profile.skills ?? []);
  const [workPref,      setWorkPref]      = useState(profile.work_preference ?? "");
  const [rateMin,       setRateMin]       = useState(profile.hourly_rate_min?.toString() ?? "");
  const [rateMax,       setRateMax]       = useState(profile.hourly_rate_max?.toString() ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url ?? null);

  const fileRef = useRef<HTMLInputElement>(null);
  const isFreelancer = profile.role === "freelancer";
  const initial = (fullName || "?").charAt(0).toUpperCase();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Inject dynamic state into formData
    formData.set("skills", JSON.stringify(skills));
    formData.set("profession", profession);
    formData.set("work_preference", workPref);
    setError(null);
    startTransition(async () => {
      const result = await updateFullProfileAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  const inputCls =
    "w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid " +
    "font-inter text-sm text-lk-dark placeholder:text-lk-dark/30 " +
    "focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all";

  const labelCls = "font-inter text-sm font-medium text-lk-dark mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Avatar ── */}
      <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6">
        <h2 className="font-headline font-semibold text-lk-dark mb-4">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {avatarPreview ? (
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-lk-neutral-mid">
                <Image src={avatarPreview} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-lk-primary-pale flex items-center justify-center ring-2 ring-lk-neutral-mid">
                <span className="font-headline font-bold text-lk-primary text-2xl">{initial}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-lk-primary flex items-center
                         justify-center shadow-md hover:bg-lk-primary-dark transition-colors"
            >
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-inter text-sm text-lk-dark/60 mb-1">Upload a photo (optional)</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="font-inter text-sm font-semibold text-lk-primary hover:text-lk-primary-dark transition-colors"
            >
              Choose file
            </button>
          </div>
          <input
            ref={fileRef}
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* ── Basic info ── */}
      <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 space-y-5">
        <h2 className="font-headline font-semibold text-lk-dark">Basic Information</h2>

        <div>
          <label className={labelCls}>
            Full Name <span className="text-lk-red">*</span>
          </label>
          <input
            name="full_name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Bio</label>
          <textarea
            name="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell clients about yourself and your work…"
            className="w-full px-4 py-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                       font-inter text-sm text-lk-dark placeholder:text-lk-dark/30 resize-none
                       focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all"
          />
        </div>

        <div>
          <label className={labelCls}>Location</label>
          <input
            name="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Cebu City, Philippines"
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Freelancer-only fields ── */}
      {isFreelancer && (
        <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 space-y-5">
          <h2 className="font-headline font-semibold text-lk-dark">Professional Details</h2>

          <div>
            <label className={labelCls}>Profession</label>
            <CategoryInput
              value={profession}
              onChange={setProfession}
              placeholder="e.g. Structural Engineer, Web Developer, Graphic Designer"
              getSuggestions={getProfessionSuggestions}
            />
          </div>

          <div>
            <label className={labelCls}>Skills</label>
            <TagInput
              value={skills}
              onChange={setSkills}
              placeholder="Add your skills"
              getSuggestions={getSkillSuggestions}
            />
          </div>

          <div>
            <label className={labelCls}>Work Preference</label>
            <div className="flex gap-2">
              {(["remote", "onsite", "hybrid"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkPref(mode)}
                  className={`flex-1 py-2.5 rounded-xl font-inter text-sm font-medium border transition-all
                    ${workPref === mode
                      ? "bg-lk-primary text-white border-lk-primary"
                      : "bg-lk-neutral text-lk-dark/60 border-lk-neutral-mid hover:border-lk-primary/30"
                    }`}
                >
                  {mode === "onsite" ? "On-site" : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Hourly Rate Range (₱)</label>
            <div className="flex items-center gap-3">
              <input
                name="hourly_rate_min"
                type="number"
                min="0"
                value={rateMin}
                onChange={(e) => setRateMin(e.target.value)}
                placeholder="Min"
                className={inputCls}
              />
              <span className="font-inter text-sm text-lk-dark/50 shrink-0">to</span>
              <input
                name="hourly_rate_max"
                type="number"
                min="0"
                value={rateMax}
                onChange={(e) => setRateMax(e.target.value)}
                placeholder="Max"
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-lk-red-pale text-lk-red font-inter text-sm px-4 py-3 rounded-xl border border-lk-red/20">
          {error}
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-white
                   px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5
                   hover:shadow-lg hover:shadow-lk-primary/25
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
      >
        {isPending && <Loader2 size={15} className="animate-spin" />}
        {isPending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
