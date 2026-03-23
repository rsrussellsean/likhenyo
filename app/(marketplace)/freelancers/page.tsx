import { Users } from "lucide-react";
import { searchFreelancers } from "@/lib/actions/search";
import type { FreelancerSearchParams } from "@/lib/actions/search";
import FreelancerCard from "@/components/marketplace/FreelancerCard";
import FreelancerFilters from "@/components/marketplace/FreelancerFilters";
import SearchBar from "@/components/marketplace/SearchBar";
import Pagination from "@/components/marketplace/Pagination";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  const str = Array.isArray(val) ? val[0] : val;
  return str?.split(",").filter(Boolean) ?? [];
}

function parseNum(val: string | string[] | undefined): number | undefined {
  if (!val) return undefined;
  const n = Number(Array.isArray(val) ? val[0] : val);
  return isNaN(n) || n <= 0 ? undefined : n;
}

export default async function FreelancersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchInput: FreelancerSearchParams = {
    keyword: (params.keyword as string) || undefined,
    profession: (params.profession as string) || undefined,
    skills: parseArray(params.skills),
    work_preference: (params.work_preference as string) || undefined,
    location: (params.location as string) || undefined,
    rate_min: parseNum(params.rate_min),
    rate_max: parseNum(params.rate_max),
    verified_only: params.verified_only === "true",
    sort: (params.sort as FreelancerSearchParams["sort"]) || undefined,
    page: Math.max(1, Number(params.page ?? "1")),
  };

  const { freelancers, supplementMap, totalCount, page, totalPages } =
    await searchFreelancers(searchInput);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1">
          Find Talent
        </h1>
        <p className="font-inter text-sm text-lk-dark/50 mb-6">
          Browse verified Filipino professionals across all skills and professions.
        </p>
        <SearchBar
          basePath="/freelancers"
          placeholder="Search by profession, skill, or name..."
        />
      </div>

      {/* Layout: sidebar + grid */}
      <div className="lg:flex gap-6 mt-8">
        {/* Filters sidebar — hidden below lg, filters handle own mobile toggle */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FreelancerFilters />
        </aside>

        {/* Mobile filters toggle — visible below lg */}
        <div className="lg:hidden">
          <FreelancerFilters />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          {totalCount > 0 && (
            <p className="font-inter text-sm text-lk-dark/40 mb-4">
              Showing {freelancers.length} of {totalCount} freelancer
              {totalCount !== 1 ? "s" : ""}
            </p>
          )}

          {/* Freelancer cards grid */}
          {freelancers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-lk-neutral-mid p-16 text-center">
              <Users size={48} className="mx-auto text-lk-primary/20 mb-4" />
              <p className="font-headline font-semibold text-lk-dark/50 mb-1">
                No freelancers match your filters.
              </p>
              <p className="font-inter text-sm text-lk-dark/30">
                Try adjusting your search or clearing some filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {freelancers.map((profile) => (
                  <FreelancerCard
                    key={profile.id}
                    profile={profile}
                    supplementLabel={supplementMap[profile.id] ?? null}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/freelancers"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
