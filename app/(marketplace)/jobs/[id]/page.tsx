import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Paperclip, ArrowLeft, Wifi, Shuffle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/marketplace/StatusBadge";
import BudgetDisplay from "@/components/marketplace/BudgetDisplay";
import type { Job, Profile } from "@/types/database";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const WORK_MODE_ICON = {
  remote: { icon: Wifi,    color: "text-lk-primary",  label: "Remote" },
  onsite: { icon: MapPin,  color: "text-lk-red",       label: "On-site" },
  hybrid: { icon: Shuffle, color: "text-lk-dark/60",   label: "Hybrid" },
} as const;

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  // Fetch job
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  // Fetch client profile
  const { data: clientProfile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, verified_status")
    .eq("id", (job as Job).client_id)
    .single();

  // Fetch viewer profile
  const { data: viewerProfile } = await supabase
    .from("profiles")
    .select("id, role, verified_status")
    .eq("id", user.id)
    .single();

  const typedJob = job as Job;
  const client = clientProfile as Profile | null;
  const viewer = viewerProfile as Profile | null;

  const isOwner = user.id === typedJob.client_id;
  const isFreelancer = viewer?.role === "freelancer";
  const isVerifiedFreelancer = isFreelancer && viewer?.verified_status === "verified";

  const modeInfo = WORK_MODE_ICON[typedJob.work_mode as keyof typeof WORK_MODE_ICON];
  const ModeIcon = modeInfo?.icon ?? Wifi;

  // If in_progress, find booking id for the owner
  let bookingId: string | null = null;
  if (typedJob.status === "in_progress" && isOwner) {
    const { data: booking } = await supabase
      .from("bookings")
      .select("id")
      .eq("job_id", typedJob.id)
      .single();
    bookingId = booking?.id ?? null;
  }

  const clientInitial = client?.full_name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 font-inter text-sm text-lk-primary hover:text-lk-primary-dark transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6 md:p-8">
            {/* Status + work mode + budget */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge status={typedJob.status} />
              <span className={`inline-flex items-center gap-1 font-inter text-xs rounded-full px-2.5 py-0.5 bg-lk-neutral ${modeInfo?.color ?? "text-lk-dark/60"}`}>
                <ModeIcon size={11} />
                {modeInfo?.label ?? typedJob.work_mode}
              </span>
              <div className="ml-auto">
                <BudgetDisplay min={typedJob.budget_min} max={typedJob.budget_max} type={typedJob.budget_type} />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-headline font-bold text-lk-dark text-2xl md:text-3xl leading-snug mb-3">
              {typedJob.title}
            </h1>

            {/* Category + tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-lk-primary-pale text-lk-primary font-inter text-xs font-medium rounded-full px-3 py-1">
                {typedJob.category}
              </span>
              {(typedJob.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="bg-lk-neutral text-lk-dark/60 font-inter text-xs rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Location + deadline */}
            <div className="flex flex-wrap gap-4 mb-5 text-lk-dark/50">
              {typedJob.location && typedJob.work_mode !== "remote" && (
                <span className="inline-flex items-center gap-1.5 font-inter text-sm">
                  <MapPin size={13} />
                  {typedJob.location}
                </span>
              )}
              {typedJob.deadline && (
                <span className="inline-flex items-center gap-1.5 font-inter text-sm">
                  <Calendar size={13} />
                  Due: {formatDate(typedJob.deadline)}
                </span>
              )}
            </div>

            <hr className="border-lk-neutral-mid mb-5" />

            {/* Description */}
            <p className="font-inter text-lk-dark/75 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {typedJob.description}
            </p>

            {/* Attachments */}
            {typedJob.attachment_urls && typedJob.attachment_urls.length > 0 && (
              <div className="mt-6 pt-5 border-t border-lk-neutral-mid">
                <p className="font-inter text-xs font-semibold text-lk-dark/50 uppercase tracking-wide mb-3">
                  Attachments
                </p>
                <div className="space-y-2">
                  {typedJob.attachment_urls.map((url, i) => {
                    const filename = url.split("/").pop() ?? `Attachment ${i + 1}`;
                    return (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-inter text-sm text-lk-primary hover:text-lk-primary-dark transition-colors"
                      >
                        <Paperclip size={13} />
                        {filename}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Client card */}
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5">
            <p className="font-inter text-xs text-lk-dark/40 uppercase tracking-wide mb-3">Posted by</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-lk-primary-pale flex items-center justify-center font-headline font-bold text-sm text-lk-primary shrink-0">
                {clientInitial}
              </div>
              <div>
                <div className="font-headline font-semibold text-sm text-lk-dark flex items-center gap-1">
                  {client?.full_name ?? "Unknown"}
                  {client?.verified_status === "verified" && (
                    <ShieldCheck size={13} className="text-lk-primary" />
                  )}
                </div>
                <div className="font-inter text-xs text-lk-dark/40">
                  {formatDate(typedJob.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5 space-y-3">
            {isOwner ? (
              <>
                <Link
                  href={`/jobs/${typedJob.id}/applicants`}
                  className="block w-full text-center font-inter font-semibold text-sm text-white py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
                >
                  View Applicants
                </Link>
                {typedJob.status === "open" && (
                  <Link
                    href={`/jobs/${typedJob.id}/edit`}
                    className="block w-full text-center font-inter font-semibold text-sm text-lk-primary border-2 border-lk-primary/25 hover:border-lk-primary py-2.5 rounded-xl transition-all"
                  >
                    Edit Job
                  </Link>
                )}
                {typedJob.status === "in_progress" && bookingId && (
                  <div className="text-center">
                    <span className="inline-block bg-lk-primary-pale text-lk-primary font-inter text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
                      Booking Active
                    </span>
                    <br />
                    <Link
                      href={`/bookings/${bookingId}`}
                      className="font-inter text-sm text-lk-primary hover:text-lk-primary-dark transition-colors"
                    >
                      View Active Booking →
                    </Link>
                  </div>
                )}
              </>
            ) : isFreelancer && typedJob.status === "open" ? (
              isVerifiedFreelancer ? (
                <Link
                  href={`/jobs/${typedJob.id}/apply`}
                  className="block w-full text-center font-inter font-semibold text-sm text-white py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
                >
                  Apply Now
                </Link>
              ) : (
                <div className="text-center space-y-2">
                  <button
                    disabled
                    className="block w-full text-center font-inter font-semibold text-sm text-lk-dark/30 bg-lk-neutral py-2.5 rounded-xl cursor-not-allowed"
                  >
                    Apply Now
                  </button>
                  <p className="font-inter text-xs text-lk-dark/40">
                    Verify your identity to apply.{" "}
                    <Link href="/profile/verify" className="text-lk-primary hover:underline">
                      Start verification →
                    </Link>
                  </p>
                </div>
              )
            ) : typedJob.status === "in_progress" ? (
              <div className="text-center">
                <span className="inline-block bg-lk-neutral text-lk-dark/50 font-inter text-sm font-semibold px-4 py-2 rounded-full">
                  Hiring Closed
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
