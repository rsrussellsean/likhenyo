"use server";

import { createClient } from "@/lib/supabase/server";
import type { Job, Profile } from "@/types/database";

// ─── Parameter types ─────────────────────────────────────────────────────────

export interface JobSearchParams {
  keyword?: string;
  category?: string;
  tags?: string[];
  work_mode?: string;
  location?: string;
  budget_type?: string;
  budget_min?: number;
  budget_max?: number;
  posted_within?: "today" | "week" | "month" | "any";
  sort?: "newest" | "budget_high" | "budget_low" | "most_applicants";
  page?: number;
  limit?: number;
}

export interface FreelancerSearchParams {
  keyword?: string;
  profession?: string;
  skills?: string[];
  work_preference?: string;
  location?: string;
  rate_min?: number;
  rate_max?: number;
  verified_only?: boolean;
  sort?: "rating" | "reviews" | "newest" | "rate_low";
  page?: number;
  limit?: number;
}

// ─── Result types ────────────────────────────────────────────────────────────

export interface JobSearchResult {
  jobs: (Job & {
    client_name: string;
    client_avatar: string | null;
    client_verified: string;
    applicant_count: number;
  })[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface FreelancerSearchResult {
  freelancers: Profile[];
  supplementMap: Record<string, string | null>;
  totalCount: number;
  page: number;
  totalPages: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTsQuery(keyword: string): string {
  // Split on whitespace, remove empty, join with & for AND matching
  const terms = keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);
  if (terms.length === 0) return "";
  return terms.map((t) => `${t}:*`).join(" & ");
}

// ─── searchJobs ──────────────────────────────────────────────────────────────

export async function searchJobs(
  params: JobSearchParams
): Promise<JobSearchResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const offset = (page - 1) * limit;

  // We need to use raw SQL via RPC because Supabase JS client can't do
  // JOIN + GROUP BY + COUNT in a single query with filters.
  // Instead, we build the query using the Supabase JS client with separate
  // count queries for applicants.

  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("status", "open");

  // Keyword: full-text search on fts column
  if (params.keyword?.trim()) {
    const tsq = toTsQuery(params.keyword);
    if (tsq) {
      query = query.textSearch("fts", tsq, { type: "plain", config: "english" });
    }
  }

  // Category: case-insensitive partial match
  if (params.category?.trim()) {
    query = query.ilike("category", `%${params.category.trim()}%`);
  }

  // Tags: array overlap
  if (params.tags && params.tags.length > 0) {
    query = query.overlaps("tags", params.tags);
  }

  // Work mode
  if (params.work_mode && params.work_mode !== "any") {
    query = query.eq("work_mode", params.work_mode);
  }

  // Location
  if (params.location?.trim()) {
    query = query.ilike("location", `%${params.location.trim()}%`);
  }

  // Budget type
  if (params.budget_type && params.budget_type !== "any") {
    query = query.eq("budget_type", params.budget_type);
  }

  // Budget range: jobs whose range overlaps with the filter range
  if (params.budget_min !== undefined && params.budget_min > 0) {
    query = query.gte("budget_max", params.budget_min);
  }
  if (params.budget_max !== undefined && params.budget_max > 0) {
    query = query.lte("budget_min", params.budget_max);
  }

  // Posted within
  if (params.posted_within && params.posted_within !== "any") {
    const now = new Date();
    let since: Date;
    switch (params.posted_within) {
      case "today":
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    query = query.gte("created_at", since!.toISOString());
  }

  // Sort
  switch (params.sort) {
    case "budget_high":
      query = query.order("budget_max", { ascending: false });
      break;
    case "budget_low":
      query = query.order("budget_min", { ascending: true });
      break;
    // most_applicants handled after fetch
    case "most_applicants":
      query = query.order("created_at", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data: jobs, count: totalCount, error } = await query;

  if (error || !jobs) {
    return { jobs: [], totalCount: 0, page, totalPages: 0 };
  }

  // Fetch client profiles for the jobs
  const clientIds = [...new Set(jobs.map((j) => j.client_id as string))];
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, verified_status")
    .in("id", clientIds.length > 0 ? clientIds : ["__none__"]);

  const clientMap: Record<
    string,
    { name: string; avatar: string | null; verified: string }
  > = {};
  (clients ?? []).forEach((c) => {
    clientMap[c.id as string] = {
      name: c.full_name as string,
      avatar: c.avatar_url as string | null,
      verified: c.verified_status as string,
    };
  });

  // Fetch applicant counts for these jobs
  const jobIds = jobs.map((j) => j.id as string);
  const { data: appCounts } = await supabase
    .from("applications")
    .select("job_id")
    .in("job_id", jobIds.length > 0 ? jobIds : ["__none__"]);

  const countMap: Record<string, number> = {};
  (appCounts ?? []).forEach((a) => {
    const jid = a.job_id as string;
    countMap[jid] = (countMap[jid] ?? 0) + 1;
  });

  let enriched = jobs.map((job) => {
    const client = clientMap[job.client_id as string];
    return {
      ...(job as Job),
      client_name: client?.name ?? "Unknown",
      client_avatar: client?.avatar ?? null,
      client_verified: client?.verified ?? "unverified",
      applicant_count: countMap[job.id as string] ?? 0,
    };
  });

  // If sorting by most_applicants, sort in-memory and note:
  // pagination is approximate for this sort since we can't do it in SQL easily
  if (params.sort === "most_applicants") {
    enriched.sort((a, b) => b.applicant_count - a.applicant_count);
  }

  const total = totalCount ?? 0;

  return {
    jobs: enriched,
    totalCount: total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── searchFreelancers ───────────────────────────────────────────────────────

export async function searchFreelancers(
  params: FreelancerSearchParams
): Promise<FreelancerSearchResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("role", "freelancer");

  // Keyword: full-text search
  if (params.keyword?.trim()) {
    const tsq = toTsQuery(params.keyword);
    if (tsq) {
      query = query.textSearch("fts", tsq, { type: "plain", config: "english" });
    }
  }

  // Profession: case-insensitive partial match
  if (params.profession?.trim()) {
    query = query.ilike("profession", `%${params.profession.trim()}%`);
  }

  // Skills: array overlap
  if (params.skills && params.skills.length > 0) {
    query = query.overlaps("skills", params.skills);
  }

  // Work preference
  if (params.work_preference && params.work_preference !== "any") {
    query = query.eq("work_preference", params.work_preference);
  }

  // Location
  if (params.location?.trim()) {
    query = query.ilike("location", `%${params.location.trim()}%`);
  }

  // Rate range
  if (params.rate_min !== undefined && params.rate_min > 0) {
    query = query.gte("hourly_rate_max", params.rate_min);
  }
  if (params.rate_max !== undefined && params.rate_max > 0) {
    query = query.lte("hourly_rate_min", params.rate_max);
  }

  // Verified only
  if (params.verified_only) {
    query = query.eq("verified_status", "verified");
  }

  // Sort
  switch (params.sort) {
    case "reviews":
      query = query.order("review_count", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "rate_low":
      query = query.order("hourly_rate_min", { ascending: true, nullsFirst: false });
      break;
    case "rating":
    default:
      query = query
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data: freelancers, count: totalCount, error } = await query;

  if (error || !freelancers) {
    return { freelancers: [], supplementMap: {}, totalCount: 0, page, totalPages: 0 };
  }

  // Fetch supplement labels for verified freelancers
  const verifiedIds = (freelancers as Profile[])
    .filter((p) => p.verified_status === "verified")
    .map((p) => p.id);

  const supplementMap: Record<string, string | null> = {};
  if (verifiedIds.length > 0) {
    const { data: verifications } = await supabase
      .from("verifications")
      .select("user_id, supplement_label")
      .in("user_id", verifiedIds)
      .eq("status", "approved");

    (verifications ?? []).forEach((v) => {
      supplementMap[v.user_id as string] = (v.supplement_label as string | null) ?? null;
    });
  }

  const total = totalCount ?? 0;

  return {
    freelancers: freelancers as Profile[],
    supplementMap,
    totalCount: total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
