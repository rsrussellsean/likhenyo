"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithOAuthAction(provider: "google" | "facebook") {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signUpWithEmailAction(
  email: string,
  password: string,
  role: "client" | "freelancer"
) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signInWithEmailAction(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/setup");
}

export async function forgotPasswordAction(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPasswordAction(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateFullProfileAction(
  formData: FormData
): Promise<{ error: string } | never> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not authenticated" };

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const full_name = (formData.get("full_name") as string)?.trim();
  if (!full_name) return { error: "Full name is required" };

  const bio           = (formData.get("bio") as string)?.trim() || null;
  const location      = (formData.get("location") as string)?.trim() || null;
  const profession    = (formData.get("profession") as string)?.trim() || null;
  const skills_raw    = formData.get("skills") as string;
  const work_pref     = (formData.get("work_preference") as string) || null;
  const rate_min_raw  = formData.get("hourly_rate_min") as string;
  const rate_max_raw  = formData.get("hourly_rate_max") as string;
  const avatarFile    = formData.get("avatar") as File | null;

  // Avatar upload
  let avatar_url: string | undefined;
  if (avatarFile && avatarFile.size > 0) {
    const buffer = await avatarFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${user.id}/avatar`, buffer, {
        contentType: avatarFile.type,
        upsert: true,
      });
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${user.id}/avatar`);
      avatar_url = urlData.publicUrl;
    }
  }

  // Skills — stored as JSON string from client
  const skillsParsed: string[] | null = (() => {
    try {
      const parsed = JSON.parse(skills_raw ?? "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      return null;
    }
  })();

  const updateData: Record<string, unknown> = { full_name, bio, location };

  if (currentProfile?.role === "freelancer") {
    updateData.profession      = profession;
    updateData.skills          = skillsParsed;
    updateData.work_preference = work_pref;
    updateData.hourly_rate_min = rate_min_raw ? Number(rate_min_raw) : null;
    updateData.hourly_rate_max = rate_max_raw ? Number(rate_max_raw) : null;
  }

  if (avatar_url) updateData.avatar_url = avatar_url;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  const target =
    currentProfile?.role === "freelancer"
      ? `/freelancers/${user.id}`
      : "/dashboard";

  redirect(target);
}

export async function updateProfileAction(data: {
  role: "client" | "freelancer";
  profession?: string | null;
  skills?: string[] | null;
  work_preference?: string | null;
  location?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role: data.role,
      profession: data.profession ?? null,
      skills: data.skills && data.skills.length > 0 ? data.skills : null,
      work_preference: data.work_preference ?? null,
      location: data.location ?? null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
