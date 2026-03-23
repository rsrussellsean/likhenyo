"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import CategoryInput from "./CategoryInput";
import TagInput from "./TagInput";
import { getJobCategorySuggestions, getTagSuggestions } from "@/lib/actions/autocomplete";

const WORK_MODES = ["any", "remote", "onsite", "hybrid"] as const;
const BUDGET_TYPES = ["any", "fixed", "hourly"] as const;
const POSTED_OPTIONS = [
  { label: "Any time", value: "any" },
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Budget: High to Low", value: "budget_high" },
  { label: "Budget: Low to High", value: "budget_low" },
  { label: "Most Applicants", value: "most_applicants" },
];

const BUDGET_MAX = 500000;

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read current filter values from URL
  const keyword = searchParams.get("keyword") ?? "";
  const category = searchParams.get("category") ?? "";
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const workMode = searchParams.get("work_mode") ?? "any";
  const location = searchParams.get("location") ?? "";
  const budgetType = searchParams.get("budget_type") ?? "any";
  const budgetMin = Number(searchParams.get("budget_min") ?? 0);
  const budgetMax = Number(searchParams.get("budget_max") ?? 0);
  const postedWithin = searchParams.get("posted_within") ?? "any";
  const sort = searchParams.get("sort") ?? "newest";

  // Local keyword state for debouncing
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local keyword with URL when URL changes externally
  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  // Push filter changes to URL
  const pushParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === "" || val === "0" || val === "any") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      params.delete("page"); // Reset to page 1 on filter change
      startTransition(() => {
        router.push(`/jobs?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  // Debounced keyword search
  function handleKeywordChange(val: string) {
    setLocalKeyword(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ keyword: val.trim() || undefined });
    }, 300);
  }

  function clearAll() {
    startTransition(() => {
      router.push("/jobs");
    });
  }

  // Count active filters (excluding sort)
  const activeCount = [
    keyword,
    category,
    tags.length > 0 ? "t" : "",
    workMode !== "any" ? workMode : "",
    location,
    budgetType !== "any" ? budgetType : "",
    budgetMin > 0 ? "bmin" : "",
    budgetMax > 0 ? "bmax" : "",
    postedWithin !== "any" ? postedWithin : "",
  ].filter(Boolean).length;

  const filterPanel = (
    <div className="space-y-5">
      {/* Keyword search */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Keyword
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lk-dark/30" />
          <input
            type="text"
            value={localKeyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="Search jobs..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                       font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                       focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Category
        </label>
        <CategoryInput
          value={category}
          onChange={(val) => pushParams({ category: val || undefined })}
          placeholder="e.g. Web Developer, Engineer"
          getSuggestions={getJobCategorySuggestions}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Tags
        </label>
        <TagInput
          value={tags}
          onChange={(newTags) =>
            pushParams({ tags: newTags.length > 0 ? newTags.join(",") : undefined })
          }
          placeholder="e.g. React, Node.js"
          getSuggestions={getTagSuggestions}
        />
      </div>

      {/* Work Mode */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Work Mode
        </label>
        <div className="flex gap-1">
          {WORK_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => pushParams({ work_mode: mode === "any" ? undefined : mode })}
              className={`flex-1 h-9 rounded-lg font-inter text-xs font-medium capitalize transition-colors ${
                workMode === mode || (mode === "any" && workMode === "any")
                  ? "bg-lk-primary text-white"
                  : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-primary-pale"
              }`}
            >
              {mode === "onsite" ? "On-site" : mode === "any" ? "Any" : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Location — shown only when work_mode is onsite or hybrid */}
      {(workMode === "onsite" || workMode === "hybrid") && (
        <div>
          <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => pushParams({ location: e.target.value || undefined })}
            placeholder="e.g. Cebu City"
            className="w-full h-10 px-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                       font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                       focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all"
          />
        </div>
      )}

      {/* Budget Type */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Budget Type
        </label>
        <div className="flex gap-1">
          {BUDGET_TYPES.map((bt) => (
            <button
              key={bt}
              type="button"
              onClick={() => pushParams({ budget_type: bt === "any" ? undefined : bt })}
              className={`flex-1 h-9 rounded-lg font-inter text-xs font-medium capitalize transition-colors ${
                budgetType === bt || (bt === "any" && budgetType === "any")
                  ? "bg-lk-primary text-white"
                  : "bg-lk-neutral text-lk-dark/60 hover:bg-lk-primary-pale"
              }`}
            >
              {bt === "any" ? "Any" : bt}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Budget Range
        </label>
        <div className="px-1">
          <Slider
            value={[budgetMin, budgetMax || BUDGET_MAX]}
            min={0}
            max={BUDGET_MAX}
            step={1000}
            onValueCommit={(val) => {
              pushParams({
                budget_min: val[0] > 0 ? String(val[0]) : undefined,
                budget_max: val[1] < BUDGET_MAX ? String(val[1]) : undefined,
              });
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-inter text-xs text-lk-dark/40">
            {budgetMin > 0 ? `₱${budgetMin.toLocaleString()}` : "₱0"}
          </span>
          <span className="font-inter text-xs text-lk-dark/40">
            {budgetMax > 0 && budgetMax < BUDGET_MAX
              ? `₱${budgetMax.toLocaleString()}`
              : `₱${BUDGET_MAX.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Posted Within */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Posted Within
        </label>
        <select
          value={postedWithin}
          onChange={(e) =>
            pushParams({ posted_within: e.target.value === "any" ? undefined : e.target.value })
          }
          className="w-full h-10 px-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                     font-inter text-sm text-lk-dark
                     focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all"
        >
          {POSTED_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-1.5 block">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) =>
            pushParams({ sort: e.target.value === "newest" ? undefined : e.target.value })
          }
          className="w-full h-10 px-3 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                     font-inter text-sm text-lk-dark
                     focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15 transition-all"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear all */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full h-10 rounded-xl border border-lk-red/30 text-lk-red font-inter text-sm font-semibold
                     hover:bg-lk-red-pale transition-colors flex items-center justify-center gap-1.5"
        >
          <X size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-lk-neutral-mid
                     font-inter text-sm font-medium text-lk-dark hover:bg-lk-primary-pale transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-lk-primary text-white text-xs flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-white rounded-2xl border border-lk-neutral-mid p-5 mb-4">
          {filterPanel}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5 sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lk-dark text-sm">Filters</h3>
            {activeCount > 0 && (
              <span className="font-inter text-xs text-lk-primary font-semibold">
                {activeCount} active
              </span>
            )}
          </div>
          {filterPanel}
        </div>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border-2 border-lk-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
