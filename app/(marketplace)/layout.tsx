import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import NavSignOut from "@/components/marketplace/NavSignOut";

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as "client" | "freelancer" | null;
  const fullName = profile?.full_name ?? user.email ?? "";
  const initial = fullName.charAt(0).toUpperCase();

  const clientLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/jobs/new", label: "Post a Job" },
    { href: "/bookings", label: "My Bookings" },
    { href: "/freelancers", label: "Freelancers" },
  ];

  const freelancerLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/bookings", label: "My Bookings" },
    { href: "/freelancers", label: "Freelancers" },
  ];

  const navLinks = role === "client" ? clientLinks : freelancerLinks;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-lk-neutral-mid">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            href="/dashboard"
            className="font-headline font-bold text-xl shrink-0"
          >
            <span className="text-lk-primary">Lik</span>
            <span className="text-lk-dark">henyo</span>
          </Link>

          {/* Center links — desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-inter text-sm font-medium text-lk-dark/60 hover:text-lk-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: avatar + sign out */}
          <div className="flex items-center gap-2 shrink-0">
            {profile?.avatar_url ? (
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt={fullName}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-lk-primary-pale flex items-center justify-center font-headline font-bold text-sm text-lk-primary">
                {initial}
              </div>
            )}
            <NavSignOut />
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 bg-lk-neutral min-h-screen">{children}</main>
    </div>
  );
}
