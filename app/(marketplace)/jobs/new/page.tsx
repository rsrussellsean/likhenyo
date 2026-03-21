"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, X, ArrowLeft } from "lucide-react";
import TagInput from "@/components/marketplace/TagInput";
import CategoryInput from "@/components/marketplace/CategoryInput";
import { createJob } from "@/lib/actions/jobs";
import {
  getJobCategorySuggestions,
  getTagSuggestions,
} from "@/lib/actions/autocomplete";

type WorkMode = "remote" | "onsite" | "hybrid";
type BudgetType = "fixed" | "hourly";

const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

const BUDGET_TYPES: { value: BudgetType; label: string }[] = [
  { value: "fixed", label: "Fixed Price" },
  { value: "hourly", label: "Hourly Rate" },
];

export default function NewJobPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected]);
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
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

    const result = await createJob(fd);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.jobId) {
      router.push(`/jobs/${result.jobId}`);
    }
  }

  const inputClass =
    "w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid font-inter text-sm text-lk-dark placeholder:text-lk-dark/30 focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 font-inter text-sm text-lk-dark/50 hover:text-lk-dark transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-lk-dark text-2xl mb-1">
          Post a New Job
        </h1>
        <p className="font-inter text-sm text-lk-dark/50">
          Describe what you need and find the right Filipino professional.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 md:p-8 space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-lk-red-pale text-lk-red rounded-xl p-3 font-inter text-sm">
              {error}
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Job Title <span className="text-lk-red">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Structural Engineer for Residential Project"
              required
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Category <span className="text-lk-red">*</span>
            </label>
            <CategoryInput
              value={category}
              onChange={setCategory}
              placeholder="e.g. Structural Engineer, Web Developer, Logo Designer"
              getSuggestions={getJobCategorySuggestions}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Tags
            </label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Add keywords e.g. React, AutoCAD, Cebu, urgent"
              getSuggestions={getTagSuggestions}
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-2 uppercase tracking-wide">
              Work Mode <span className="text-lk-red">*</span>
            </label>
            <div className="flex gap-2">
              {WORK_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setWorkMode(m.value)}
                  className={`flex-1 py-2.5 px-5 rounded-xl font-inter text-sm font-medium transition-all ${
                    workMode === m.value
                      ? "bg-lk-primary text-white shadow-md shadow-lk-primary/20"
                      : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-neutral-mid"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location — conditional */}
          {workMode !== "remote" && (
            <div>
              <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
                Location <span className="text-lk-red">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Cebu City, Mandaue City"
                className={inputClass}
              />
            </div>
          )}

          {/* Budget Type */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-2 uppercase tracking-wide">
              Budget Type <span className="text-lk-red">*</span>
            </label>
            <div className="flex gap-2">
              {BUDGET_TYPES.map((bt) => (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => setBudgetType(bt.value)}
                  className={`flex-1 py-2.5 px-5 rounded-xl font-inter text-sm font-medium transition-all ${
                    budgetType === bt.value
                      ? "bg-lk-primary text-white shadow-md shadow-lk-primary/20"
                      : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-neutral-mid"
                  }`}
                >
                  {bt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Budget Range (₱) <span className="text-lk-red">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-inter text-sm text-lk-dark/40 pointer-events-none">
                  ₱
                </span>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min"
                  min="0"
                  required
                  className={`${inputClass} pl-7`}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-inter text-sm text-lk-dark/40 pointer-events-none">
                  ₱
                </span>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max"
                  min="0"
                  required
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Deadline <span className="text-lk-dark/30 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Description <span className="text-lk-red">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project, scope, deliverables, and any specific requirements… (min. 50 characters)"
              required
              className="w-full min-h-[140px] px-4 py-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid font-inter text-sm text-lk-dark placeholder:text-lk-dark/30 focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all resize-y"
            />
            <p className="font-inter text-xs text-lk-dark/35 mt-1">
              {description.length} / 50 characters minimum
            </p>
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-inter text-xs font-semibold text-lk-dark/60 mb-1.5 uppercase tracking-wide">
              Attachments <span className="text-lk-dark/30 font-normal normal-case">(optional)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-lk-neutral-mid rounded-xl p-6 text-center hover:border-lk-primary/40 transition-colors cursor-pointer"
            >
              <Upload size={22} className="mx-auto text-lk-dark/25 mb-2" />
              <p className="font-inter text-sm text-lk-dark/40">
                Click to upload files
              </p>
              <p className="font-inter text-xs text-lk-dark/30 mt-1">
                PDFs, images, documents
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between bg-lk-neutral rounded-xl px-3 py-2"
                  >
                    <span className="font-inter text-xs text-lk-dark/70 truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.name)}
                      className="text-lk-dark/30 hover:text-lk-red transition-colors ml-2 shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-12 text-white font-inter font-semibold text-sm rounded-xl
                     transition-all disabled:opacity-60 disabled:cursor-not-allowed
                     hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
          style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
        >
          {loading ? "Posting Job…" : "Post Job"}
        </button>
      </form>
    </div>
  );
}
