import Link from "next/link";
import { Wifi, MapPin, Shuffle, Calendar, Users } from "lucide-react";
import type { Job } from "@/types/database";
import StatusBadge from "./StatusBadge";
import BudgetDisplay from "./BudgetDisplay";

interface JobCardProps {
  job: Job;
  applicantCount?: number;
}

const WORK_MODE_ICON = {
  remote:  { icon: Wifi,    color: "text-lk-primary" },
  onsite:  { icon: MapPin,  color: "text-lk-red" },
  hybrid:  { icon: Shuffle, color: "text-lk-dark/60" },
} as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function JobCard({ job, applicantCount }: JobCardProps) {
  const modeInfo = WORK_MODE_ICON[job.work_mode as keyof typeof WORK_MODE_ICON];
  const ModeIcon = modeInfo?.icon ?? Wifi;
  const modeColor = modeInfo?.color ?? "text-lk-dark/60";
  const visibleTags = job.tags?.slice(0, 3) ?? [];
  const extraTags = (job.tags?.length ?? 0) - 3;

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
        {/* Top row: status + budget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={job.status} />
          <BudgetDisplay min={job.budget_min} max={job.budget_max} type={job.budget_type} />
        </div>

        {/* Title + category */}
        <div className="flex items-start gap-2 mb-2 flex-wrap">
          <span className="font-headline font-semibold text-lk-dark text-base leading-snug">
            {job.title}
          </span>
          <span className="inline-flex items-center bg-lk-primary-pale text-lk-primary text-xs rounded-full px-2.5 py-0.5 font-inter font-medium shrink-0">
            {job.category}
          </span>
        </div>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="bg-lk-neutral text-lk-dark/60 text-xs rounded-full px-2.5 py-0.5 font-inter"
              >
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="bg-lk-neutral-mid text-lk-dark/50 text-xs rounded-full px-2.5 py-0.5 font-inter">
                +{extraTags}
              </span>
            )}
          </div>
        )}

        {/* Work mode + location */}
        <div className="flex items-center gap-1.5 mb-3">
          <ModeIcon size={13} className={modeColor} />
          <span className={`font-inter text-xs capitalize ${modeColor}`}>{job.work_mode}</span>
          {job.location && job.work_mode !== "remote" && (
            <span className="font-inter text-xs text-lk-dark/50">· {job.location}</span>
          )}
        </div>

        {/* Bottom row: deadline + applicants */}
        {(job.deadline || applicantCount !== undefined) && (
          <div className="flex items-center gap-3 pt-3 border-t border-lk-neutral-mid">
            {job.deadline && (
              <span className="inline-flex items-center gap-1 font-inter text-xs text-lk-dark/50">
                <Calendar size={11} />
                Due: {formatDate(job.deadline)}
              </span>
            )}
            {applicantCount !== undefined && (
              <span className="inline-flex items-center gap-1 font-inter text-xs text-lk-dark/50 ml-auto">
                <Users size={11} />
                {applicantCount} applicant{applicantCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
