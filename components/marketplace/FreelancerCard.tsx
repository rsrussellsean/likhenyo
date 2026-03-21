import Link from "next/link";
import Image from "next/image";
import { MapPin, Wifi, Shuffle } from "lucide-react";
import type { Profile } from "@/types/database";
import VerifiedBadge from "./VerifiedBadge";
import SkillChip from "./SkillChip";
import StarRating from "./StarRating";

interface FreelancerCardProps {
  profile: Profile;
  supplementLabel?: string | null;
}

const WORK_PREF_STYLE: Record<
  string,
  { label: string; color: string; Icon: React.ElementType }
> = {
  remote: { label: "Remote",  color: "text-lk-primary", Icon: Wifi },
  onsite: { label: "On-site", color: "text-lk-red",     Icon: MapPin },
  hybrid: { label: "Hybrid",  color: "text-lk-dark/60", Icon: Shuffle },
};

export default function FreelancerCard({ profile, supplementLabel }: FreelancerCardProps) {
  const visibleSkills = profile.skills?.slice(0, 4) ?? [];
  const extraSkills   = Math.max(0, (profile.skills?.length ?? 0) - 4);
  const pref          = profile.work_preference ? WORK_PREF_STYLE[profile.work_preference] : null;
  const initial       = (profile.full_name ?? "?").charAt(0).toUpperCase();

  return (
    <Link href={`/freelancers/${profile.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5
                      hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">

        {/* Avatar + name + verified */}
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name ?? ""}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-lk-primary-pale flex items-center justify-center">
                <span className="font-headline font-bold text-lk-primary text-lg">{initial}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-headline font-semibold text-lk-dark text-base truncate">
                {profile.full_name}
              </span>
              <VerifiedBadge
                verifiedStatus={profile.verified_status}
                supplementLabel={supplementLabel}
                size="sm"
              />
            </div>
            {profile.profession && (
              <span className="inline-flex mt-1 items-center bg-lk-primary-pale text-lk-primary
                               text-xs rounded-full px-2.5 py-0.5 font-inter font-medium">
                {profile.profession}
              </span>
            )}
          </div>
        </div>

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
            {visibleSkills.map((skill) => (
              <SkillChip key={skill} label={skill} variant="skill" />
            ))}
            {extraSkills > 0 && (
              <span className="bg-lk-neutral-mid text-lk-dark/50 text-xs rounded-full px-2.5 py-1 font-inter">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        {/* Bottom meta row */}
        <div className="pt-3 border-t border-lk-neutral-mid flex items-center justify-between gap-2 flex-wrap mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {profile.rating > 0 && (
              <div className="flex items-center gap-1">
                <StarRating value={profile.rating} size="sm" />
                <span className="font-inter text-xs text-lk-dark/50">
                  ({profile.review_count})
                </span>
              </div>
            )}
            {pref && (
              <span className={`inline-flex items-center gap-1 font-inter text-xs ${pref.color}`}>
                <pref.Icon size={11} />
                {pref.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {profile.location && (
              <span className="inline-flex items-center gap-1 font-inter text-xs text-lk-dark/40">
                <MapPin size={11} />
                {profile.location}
              </span>
            )}
            {profile.hourly_rate_min && (
              <span className="font-inter text-xs font-semibold text-lk-dark/70">
                ₱{profile.hourly_rate_min.toLocaleString()}
                {profile.hourly_rate_max
                  ? `–₱${profile.hourly_rate_max.toLocaleString()}`
                  : "+"}
                /hr
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
