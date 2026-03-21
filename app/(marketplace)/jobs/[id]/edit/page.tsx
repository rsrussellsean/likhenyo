"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TagInput from "@/components/marketplace/TagInput";
import CategoryInput from "@/components/marketplace/CategoryInput";
import { updateJob } from "@/lib/actions/jobs";
import {
  getJobCategorySuggestions,
  getTagSuggestions,
} from "@/lib/actions/autocomplete";
import type { Job } from "@/types/database";

type WorkMode = "remote" | "onsite" | "hybrid";
type BudgetType = "fixed" | "hourly";

const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "remote",  label: "Remote" },
  { value: "onsite",  label: "On-site" },
  { value: "hybrid",  label: "Hybrid" },
];

const BUDGET_TYPES: { value: BudgetType; label: string }[] = [
  { value: "fixed",   label: "Fixed Price" },
  { value: "hourly",  label: "Hourly Rate" },
];

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [workMode, setWorkMode] = useState<WorkMode>("remote");
  const [location, setLocation] = useState("");
  const [budgetType, setBudgetType] = useState<BudgetType>("fixed");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!data || data.client_id !== user.id || data.status !== "open") {
        router.replace(`/jobs/${jobId}`);
        return;
      }

      const j = data as Job;
      setJob(j);
      setTitle(j.title);
      setCategory(j.category);
      setTags(j.tags ?? []);
      setWorkMode(j.work_mode as WorkMode);
      setLocation(j.location ?? "");
      setBudgetType(j.budget_type as BudgetType);
      setBudgetMin(String(j.budget_min));
      setBudgetMax(String(j.budget_max));
      setDeadline(j.deadline ?? "");
      setDescription(j.description);
      setChecking(false);
    }
    load();
  }, [jobId, router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (description.trim().length < 50) {
      setError("Description must be at least 50 characters.");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("tags", tags.join(","));
    fd.append("work_mode", workMode);
    fd.append("location", location);
    fd.append("budget_type", budgetType);
    fd.append("budget_min", budgetMin);
    fd.append("budget_max", budgetMax);
    fd.append("deadline", deadline);
    fd.append("description", description);
    files.forEach((f) => fd.append("attachments", f));

    const result = await updateJob(jobId, fd);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  const inputClass =
    "w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid font-inter text-sm text-lk-dark placeholder:text-lk-dark/30 focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all";

  if (checking) {
    return (
      <div className="min-h-screen bg-lk-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="font-headline font-bold text-2xl text-lk-dark mb-2">
            <span className="text-lk-primary">Lik</span>henyo
          </div>
          <p className="font-inter text-sm text-lk-dark/40">Loading…</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href={`/jobs/${jobId}`}
        className="inline-flex items-center gap-1.5 font-inter text-sm text-lk-dark/50 hover:text-lk-dark transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Job
      </Link>

      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-lk-dark text-2xl mb-1">Edit Job</h1>
        <p className="font-inter text-sm text-lk-dark/50">Update your job details.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 md:p-8 space-y-6">
          {error && (
            <div className="bg-lk-red-pale text-lk-red rounded-xl p-3 font-inter text-sm">{error}</div>
          )}

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Job Title <span className="text-lk-red">*</span>
            </label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Category <span className="text-lk-red">*</span>
            </label>
            <CategoryInput value={category} onChange={setCategory} getSuggestions={getJobCategorySuggestions} />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">Tags</label>
            <TagInput value={tags} onChange={setTags} getSuggestions={getTagSuggestions} />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-2 uppercase tracking-wide">
              Work Mode <span className="text-lk-red">*</span>
            </label>
            <div className="flex gap-2">
              {WORK_MODES.map((m) => (
                <button key={m.value} type="button" onClick={() => setWorkMode(m.value)}
                  className={`flex-1 py-2.5 px-5 rounded-xl font-inter text-sm font-medium transition-all ${workMode === m.value ? "bg-lk-primary text-white shadow-md shadow-lk-primary/20" : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-neutral-mid"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {workMode !== "remote" && (
            <div>
              <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
                Location <span className="text-lk-red">*</span>
              </label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
            </div>
          )}

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-2 uppercase tracking-wide">
              Budget Type <span className="text-lk-red">*</span>
            </label>
            <div className="flex gap-2">
              {BUDGET_TYPES.map((bt) => (
                <button key={bt.value} type="button" onClick={() => setBudgetType(bt.value)}
                  className={`flex-1 py-2.5 px-5 rounded-xl font-inter text-sm font-medium transition-all ${budgetType === bt.value ? "bg-lk-primary text-white shadow-md shadow-lk-primary/20" : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-neutral-mid"}`}>
                  {bt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Budget Range (₱) <span className="text-lk-red">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-inter text-sm text-lk-dark/40 pointer-events-none">₱</span>
                <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="Min" min="0" required className={`${inputClass} pl-7`} />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-inter text-sm text-lk-dark/40 pointer-events-none">₱</span>
                <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="Max" min="0" required className={`${inputClass} pl-7`} />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Deadline <span className="text-lk-dark/30 font-normal normal-case">(optional)</span>
            </label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Description <span className="text-lk-red">*</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
              className="w-full min-h-[140px] px-4 py-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid font-inter text-sm text-lk-dark placeholder:text-lk-dark/30 focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all resize-y" />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Add Attachments <span className="text-lk-dark/30 font-normal normal-case">(optional)</span>
            </label>
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-lk-neutral-mid rounded-xl p-6 text-center hover:border-lk-primary/40 transition-colors cursor-pointer">
              <Upload size={22} className="mx-auto text-lk-dark/25 mb-2" />
              <p className="font-inter text-sm text-lk-dark/40">Click to upload files</p>
              <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f) => (
                  <div key={f.name} className="flex items-center justify-between bg-lk-neutral rounded-xl px-3 py-2">
                    <span className="font-inter text-xs text-lk-dark/70 truncate">{f.name}</span>
                    <button type="button" onClick={() => setFiles((p) => p.filter((x) => x.name !== f.name))}
                      className="text-lk-dark/30 hover:text-lk-red transition-colors ml-2 shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="mt-6 w-full h-12 text-white font-inter font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
          style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
