import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowRight, Briefcase, UserCircle, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/marketplace/JobCard";
import type { Job } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile?.role) redirect("/setup");

  const role = profile.role as "client" | "freelancer";
  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  // ── Shared: active bookings count ──
  const bookingField = role === "client" ? "client_id" : "freelancer_id";
  const { count: activeBookingsCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq(bookingField, user.id)
    .eq("status", "active");

  if (role === "client") {
    // Fetch jobs with applicant counts
    const { data: jobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Applicant counts per job
    const jobIds = (jobs ?? []).map((j) => j.id as string);
    const countMap: Record<string, number> = {};
    if (jobIds.length > 0) {
      const { data: appCounts } = await supabase
        .from("applications")
        .select("job_id")
        .in("job_id", jobIds);
      (appCounts ?? []).forEach((a) => {
        countMap[a.job_id as string] = (countMap[a.job_id as string] ?? 0) + 1;
      });
    }

    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-inter text-sm text-lk-dark/50 mb-1">Welcome back</p>
            <h1 className="font-headline font-extrabold text-lk-dark text-3xl">
              Good day, {firstName} 👋
            </h1>
          </div>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-white
                       px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
            style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
          >
            <Plus size={16} />
            Post a New Job
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main: jobs list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-headline font-semibold text-lk-dark text-lg">My Posted Jobs</h2>
            {!jobs || jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-lk-neutral-mid p-10 text-center">
                <Briefcase size={40} className="mx-auto text-lk-primary/20 mb-3" />
                <p className="font-headline font-semibold text-lk-dark/50 text-sm mb-4">
                  No jobs posted yet.
                </p>
                <Link
                  href="/jobs/new"
                  className="font-inter text-sm font-semibold text-lk-primary hover:text-lk-primary-dark transition-colors"
                >
                  Post your first job →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id as string}
                    job={job as Job}
                    applicantCount={countMap[job.id as string] ?? 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="font-headline font-semibold text-lk-dark text-lg">Active Bookings</h2>
            <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 flex items-center justify-between">
              <div>
                <div className="font-headline font-bold text-3xl text-lk-primary">
                  {activeBookingsCount ?? 0}
                </div>
                <div className="font-inter text-xs text-lk-dark/50 mt-0.5">active booking{(activeBookingsCount ?? 0) !== 1 ? "s" : ""}</div>
              </div>
              <Link
                href="/bookings"
                className="inline-flex items-center gap-1 font-inter text-sm font-semibold text-lk-primary hover:text-lk-primary-dark transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Freelancer dashboard ──
  const { data: applications } = await supabase
    .from("applications")
    .select("status")
    .eq("freelancer_id", user.id);

  const counts = { pending: 0, shortlisted: 0, hired: 0, rejected: 0 };
  (applications ?? []).forEach((a) => {
    const s = a.status as keyof typeof counts;
    if (s in counts) counts[s]++;
  });

  const statCards = [
    { label: "Pending",    value: counts.pending,    color: "bg-lk-yellow-pale text-lk-dark" },
    { label: "Shortlisted",value: counts.shortlisted, color: "bg-lk-primary-pale text-lk-primary" },
    { label: "Hired",      value: counts.hired,       color: "bg-green-50 text-green-700" },
    { label: "Rejected",   value: counts.rejected,    color: "bg-lk-red-pale text-lk-red" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="font-inter text-sm text-lk-dark/50 mb-1">Welcome back</p>
          <h1 className="font-headline font-extrabold text-lk-dark text-3xl">
            Good day, {firstName} 👋
          </h1>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-white
                     px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
          style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
        >
          Browse Jobs
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-headline font-semibold text-lk-dark text-lg">My Applications</h2>
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl p-5 ${card.color}`}
              >
                <div className="font-headline font-bold text-2xl">{card.value}</div>
                <div className="font-inter text-xs mt-1 opacity-70">{card.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline font-semibold text-lk-dark text-lg">Active Bookings</h2>
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 flex items-center justify-between">
            <div>
              <div className="font-headline font-bold text-3xl text-lk-primary">
                {activeBookingsCount ?? 0}
              </div>
              <div className="font-inter text-xs text-lk-dark/50 mt-0.5">active booking{(activeBookingsCount ?? 0) !== 1 ? "s" : ""}</div>
            </div>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1 font-inter text-sm font-semibold text-lk-primary hover:text-lk-primary-dark transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Profile quick links */}
          <h2 className="font-headline font-semibold text-lk-dark text-lg">My Profile</h2>
          <div className="bg-white rounded-2xl border border-lk-neutral-mid divide-y divide-lk-neutral-mid">
            <Link
              href={`/freelancers/${user.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-lk-neutral transition-colors rounded-t-2xl"
            >
              <UserCircle size={16} className="text-lk-primary shrink-0" />
              <span className="font-inter text-sm font-medium text-lk-dark">My Public Profile</span>
              <ArrowRight size={13} className="ml-auto text-lk-dark/30" />
            </Link>
            <Link
              href="/profile/edit"
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-lk-neutral transition-colors rounded-b-2xl"
            >
              <Pencil size={16} className="text-lk-primary shrink-0" />
              <span className="font-inter text-sm font-medium text-lk-dark">Edit My Profile</span>
              <ArrowRight size={13} className="ml-auto text-lk-dark/30" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
