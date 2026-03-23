import { Briefcase } from "lucide-react";
import { searchJobs } from "@/lib/actions/search";
import type { JobSearchParams } from "@/lib/actions/search";
import JobCard from "@/components/marketplace/JobCard";
import JobFilters from "@/components/marketplace/JobFilters";
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

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchInput: JobSearchParams = {
    keyword: (params.keyword as string) || undefined,
    category: (params.category as string) || undefined,
    tags: parseArray(params.tags),
    work_mode: (params.work_mode as string) || undefined,
    location: (params.location as string) || undefined,
    budget_type: (params.budget_type as string) || undefined,
    budget_min: parseNum(params.budget_min),
    budget_max: parseNum(params.budget_max),
    posted_within: (params.posted_within as JobSearchParams["posted_within"]) || undefined,
    sort: (params.sort as JobSearchParams["sort"]) || undefined,
    page: Math.max(1, Number(params.page ?? "1")),
  };

  const { jobs, totalCount, page, totalPages } = await searchJobs(searchInput);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="font-headline font-extrabold text-lk-dark text-3xl mb-1">
          Browse Jobs
        </h1>
        <p className="font-inter text-sm text-lk-dark/50 mb-6">
          Find opportunities from clients across the Philippines.
        </p>
        <SearchBar basePath="/jobs" placeholder="Search by title, skill, or keyword..." />
      </div>

      {/* Layout: sidebar + grid */}
      <div className="lg:flex gap-6 mt-8">
        {/* Filters sidebar — hidden below lg, filters handle own mobile toggle */}
        <aside className="hidden lg:block w-72 shrink-0">
          <JobFilters />
        </aside>

        {/* Mobile filters toggle — visible below lg */}
        <div className="lg:hidden">
          <JobFilters />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          {totalCount > 0 && (
            <p className="font-inter text-sm text-lk-dark/40 mb-4">
              Showing {jobs.length} of {totalCount} job{totalCount !== 1 ? "s" : ""}
            </p>
          )}

          {/* Job cards grid */}
          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-lk-neutral-mid p-16 text-center">
              <Briefcase size={48} className="mx-auto text-lk-primary/20 mb-4" />
              <p className="font-headline font-semibold text-lk-dark/50 mb-1">
                No jobs match your filters.
              </p>
              <p className="font-inter text-sm text-lk-dark/30">
                Try adjusting your search or clearing some filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    applicantCount={job.applicant_count}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/jobs"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
