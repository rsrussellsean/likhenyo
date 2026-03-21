import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileEditForm from "@/components/marketplace/ProfileEditForm";
import type { Profile } from "@/types/database";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.role) redirect("/setup");

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-lk-dark text-2xl mb-1">
          Edit Profile
        </h1>
        <p className="font-inter text-sm text-lk-dark/50">
          Update your professional information.
        </p>
      </div>

      <ProfileEditForm profile={profile as Profile} />
    </div>
  );
}
