import { Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FreelancerCard from "@/components/marketplace/FreelancerCard";
import FreelancerFilters from "@/components/marketplace/FreelancerFilters";
import type { Profile } from "@/types/database";

const PAGE_SIZE = 20;

export default async function FreelancersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page   = Math.max(1, Number(params.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("role", "freelancer")
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  // Fetch supplement labels for verified freelancers in one query
  const verifiedIds = (profiles ?? [])
    .filter((p) => p.verified_status === "verified")
    .map((p) => p.id as string);

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

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1">
          Find Talent
        </h1>
        <p className="font-inter text-sm text-lk-dark/50">
          Browse verified Filipino professionals across all skills and professions.
        </p>
      </div>

      {/* Filters placeholder */}
      <div className="mb-6">
        <FreelancerFilters />
      </div>

      {/* Result count */}
      {count !== null && count > 0 && (
        <p className="font-inter text-sm text-lk-dark/40 mb-4">
          {count} freelancer{count !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {!profiles || profiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-lk-neutral-mid p-16 text-center">
          <Users size={48} className="mx-auto text-lk-primary/20 mb-4" />
          <p className="font-headline font-semibold text-lk-dark/50">No freelancers found.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {(profiles as Profile[]).map((profile) => (
              <FreelancerCard
                key={profile.id}
                profile={profile}
                supplementLabel={supplementMap[profile.id] ?? null}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              {page > 1 && (
                <Link
                  href={`/freelancers?page=${page - 1}`}
                  className="font-inter text-sm font-semibold text-lk-primary px-4 py-2 rounded-xl
                             border border-lk-primary/30 hover:bg-lk-primary-pale transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="font-inter text-sm text-lk-dark/50">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/freelancers?page=${page + 1}`}
                  className="font-inter text-sm font-semibold text-lk-primary px-4 py-2 rounded-xl
                             border border-lk-primary/30 hover:bg-lk-primary-pale transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
