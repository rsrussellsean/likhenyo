import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // For password recovery, redirect to reset-password
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Check if a profiles row exists for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  // Insert profile row if it doesn't exist yet
  if (!profile) {
    const metadata = user.user_metadata ?? {};
    await supabase.from("profiles").insert({
      id: user.id,
      full_name:
        metadata.full_name ??
        metadata.name ??
        ([metadata.given_name, metadata.family_name].filter(Boolean).join(" ") || null),
      avatar_url: metadata.avatar_url ?? metadata.picture ?? null,
      role: metadata.role ?? null,
    });
  }

  // If profile has a role already set, go to dashboard; otherwise go to setup
  const redirectPath =
    profile?.role ? "/dashboard" : "/setup";

  return NextResponse.redirect(`${origin}${redirectPath}`);
}
