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
