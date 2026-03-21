import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Wifi, Shuffle, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import VerifiedBadge from "@/components/marketplace/VerifiedBadge";
import SkillChip from "@/components/marketplace/SkillChip";
import StarRating from "@/components/marketplace/StarRating";

const WORK_PREF_STYLE: Record<
  string,
  { label: string; color: string; Icon: React.ElementType }
> = {
  remote: { label: "Remote",  color: "text-lk-primary", Icon: Wifi },
  onsite: { label: "On-site", color: "text-lk-red",     Icon: MapPin },
  hybrid: { label: "Hybrid",  color: "text-lk-dark/60", Icon: Shuffle },
};

function fmtLong(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Viewer auth (optional — layout already guards)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Profile — must be a freelancer
  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "freelancer")
    .single();

  if (!profileRaw) notFound();
  const profile = profileRaw as Profile;
  const isOwner = user?.id === id;

  // Viewer's role for Hire button
  let viewerRole: string | null = null;
  if (user && !isOwner) {
    const { data: vp } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    viewerRole = (vp?.role as string | null) ?? null;
  }

  // Completed bookings count
  const { count: completedJobs } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("freelancer_id", id)
    .eq("status", "completed");

  // Last 10 reviews where this freelancer is the reviewee
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, reviewer_id")
    .eq("reviewee_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Reviewer profiles
  const reviewerIds = (reviews ?? []).map((r) => r.reviewer_id as string);
  const reviewerMap: Record<string, { full_name: string; avatar_url: string | null }> = {};
  if (reviewerIds.length > 0) {
    const { data: reviewers } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", reviewerIds);
    (reviewers ?? []).forEach((r) => {
      reviewerMap[r.id as string] = {
        full_name: r.full_name as string,
        avatar_url: r.avatar_url as string | null,
      };
    });
  }

  // Approved verification (portfolio + supplement label)
  const { data: verification } = await supabase
    .from("verifications")
    .select("portfolio_url, supplement_label")
    .eq("user_id", id)
    .eq("status", "approved")
    .maybeSingle();

  const pref    = profile.work_preference ? WORK_PREF_STYLE[profile.work_preference] : null;
  const initial = (profile.full_name ?? "?").charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* ── Profile header card ── */}
      <div className="bg-white rounded-2xl border border-lk-neutral-mid overflow-hidden mb-6">
        {/* Gradient accent strip */}
        <div
          className="h-24"
          style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 55%, #EBF0FF 100%)" }}
        />

        <div className="px-8 pb-8 -mt-12">
          {/* Avatar row */}
          <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
            {profile.avatar_url ? (
              <div className="w-24 h-24 rounded-full ring-4 ring-white overflow-hidden shadow-lg shrink-0">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name ?? ""}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full ring-4 ring-white bg-lk-primary-pale
                             flex items-center justify-center shadow-lg shrink-0">
                <span className="font-headline font-bold text-lk-primary text-3xl">{initial}</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center gap-2 mt-10">
              {isOwner ? (
                <Link
                  href="/profile/edit"
                  className="font-inter font-semibold text-sm text-lk-primary border border-lk-primary/30
                             px-4 py-2 rounded-xl hover:bg-lk-primary-pale transition-colors"
                >
                  Edit Profile
                </Link>
              ) : viewerRole === "client" ? (
                <Link
                  href="/jobs/new"
                  className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-xl
                             transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lk-primary/25"
                  style={{ background: "linear-gradient(135deg, #0052FF 0%, #1A6BFF 100%)" }}
                >
                  Hire {profile.full_name?.split(" ")[0] ?? "Freelancer"}
                </Link>
              ) : null}
            </div>
          </div>

          {/* Name + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="font-headline font-extrabold text-lk-dark text-2xl">
              {profile.full_name}
            </h1>
            <VerifiedBadge
              verifiedStatus={profile.verified_status}
              supplementLabel={verification?.supplement_label ?? null}
              size="md"
            />
          </div>

          {profile.profession && (
            <span className="inline-flex items-center bg-lk-primary-pale text-lk-primary
                             text-sm rounded-full px-3 py-1 font-inter font-medium mb-3">
              {profile.profession}
            </span>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap mt-2">
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 font-inter text-sm text-lk-dark/50">
                <MapPin size={13} />
                {profile.location}
              </span>
            )}
            {pref && (
              <span className={`inline-flex items-center gap-1.5 font-inter text-sm ${pref.color}`}>
                <pref.Icon size={13} />
                {pref.label}
              </span>
            )}
            {profile.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating value={profile.rating} size="sm" />
                <span className="font-inter text-sm text-lk-dark/50">
                  {profile.rating.toFixed(1)} ({profile.review_count} review{profile.review_count !== 1 ? "s" : ""})
                </span>
              </div>
            )}
            {profile.hourly_rate_min && (
              <span className="font-inter text-sm font-semibold text-lk-dark">
                ₱{profile.hourly_rate_min.toLocaleString()}
                {profile.hourly_rate_max ? `–₱${profile.hourly_rate_max.toLocaleString()}` : "+"}
                <span className="font-normal text-lk-dark/50">/hr</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {profile.bio && (
            <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6">
              <h2 className="font-headline font-bold text-lk-dark text-base mb-3">About</h2>
              <p className="font-inter text-sm text-lk-dark/70 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6">
            <h2 className="font-headline font-bold text-lk-dark text-base mb-3">Skills</h2>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <SkillChip key={skill} label={skill} variant="skill" />
                ))}
              </div>
            ) : (
              <p className="font-inter text-sm text-lk-dark/40">No skills listed yet.</p>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-6">
            <h2 className="font-headline font-bold text-lk-dark text-base mb-4">Reviews</h2>
            {!reviews || reviews.length === 0 ? (
              <p className="font-inter text-sm text-lk-dark/40">No reviews yet.</p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => {
                  const reviewer = reviewerMap[review.reviewer_id as string];
                  const ri = (reviewer?.full_name ?? "?").charAt(0).toUpperCase();
                  return (
                    <div key={review.id as string} className="flex gap-3">
                      {reviewer?.avatar_url ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={reviewer.avatar_url}
                            alt={reviewer.full_name}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-lk-primary-pale flex items-center justify-center shrink-0">
                          <span className="font-headline font-bold text-lk-primary text-sm">{ri}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-inter text-sm font-semibold text-lk-dark">
                            {reviewer?.full_name ?? "Anonymous"}
                          </span>
                          <StarRating value={review.rating as number} size="sm" />
                          <span className="font-inter text-xs text-lk-dark/40 ml-auto">
                            {fmtShort(review.created_at as string)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="font-inter text-sm text-lk-dark/60 leading-relaxed">
                            {review.comment as string}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5">
            <h2 className="font-headline font-bold text-lk-dark text-sm mb-4">Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-inter text-sm text-lk-dark/60">
                  <Briefcase size={14} />
                  Completed Jobs
                </span>
                <span className="font-headline font-bold text-lk-dark">{completedJobs ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-inter text-sm text-lk-dark/60">
                  <Calendar size={14} />
                  Member Since
                </span>
                <span className="font-inter text-sm text-lk-dark">{fmtLong(profile.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          {verification?.portfolio_url && (
            <div className="bg-white rounded-2xl border border-lk-neutral-mid p-5">
              <h2 className="font-headline font-bold text-lk-dark text-sm mb-3">Portfolio</h2>
              <a
                href={verification.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-lk-primary
                           hover:text-lk-primary-dark transition-colors"
              >
                View Portfolio
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
