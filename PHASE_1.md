<current_task>
Phase 1 — Landing Page + Authentication

Build the full marketing landing page and complete authentication system.
Google and Facebook login use Supabase OAuth via a server action.
Email/password flows follow official Supabase patterns exactly.
After any signup, users are redirected to onboarding before the dashboard.

Landing Page (components/landing/):

1. Header.tsx
   Read session server-side using the Supabase server client.
   Logged out: "Login" button and "Get Started" button.
   Logged in: user avatar, "Dashboard" link, "Logout" button.
   Navigation links: How It Works, Browse Jobs, Find Freelancers.
   Sticky positioning. No client-side flash between auth states.

2. Hero.tsx
   Headline: "Hire Any Skilled Professional in the Philippines."
   Subheadline: "Verified freelancers across engineering, technology, design,
   business, and more — all in one structured platform."
   Two CTAs: "Post a Job" (→ /signup?role=client) and
   "Find Work" (→ /signup?role=freelancer).
   Right column: decorative SVG illustration or abstract graphic.

3. HowItWorks.tsx
   Two tabs: "For Clients" and "For Freelancers".
   Clients: Post a Job → Review Applicants → Hire → Pay → Receive Work.
   Freelancers: Build Profile → Browse Jobs → Apply → Get Hired → Get Paid.
   Each step has an icon, short title, and one sentence description.

4. Categories.tsx
   Visual grid of popular profession categories with icons.
   These are display only — not functional filters yet.
   Examples: Engineering, Web Development, Graphic Design, Writing,
   Accounting, Architecture, Legal, Virtual Assistant, Video Editing,
   Marketing, Photography, Trades and Labor.
   Include a "Browse All" link → /jobs.
   Important: these are illustrative only. Do not hardcode them as
   functional category values anywhere in the codebase.

5. Features.tsx
   6-card grid. Each card: icon, title, description.
   Cards: Verified Professionals, Structured Job Posts, Apply to Multiple Jobs,
   Secure Hiring Flow, In-App Chat, Ratings and Reviews.

6. Testimonials.tsx
   3 placeholder testimonial cards with avatar, name, profession, and quote.
   Use realistic-looking placeholder data.

7. CTA.tsx
   Full-width section. Headline + two buttons mirroring the Hero CTAs.

8. Footer.tsx
   Multi-column: About, For Clients, For Freelancers, Support.
   Copyright line. Social icon links (Facebook, LinkedIn, Instagram).

9. app/page.tsx
   Compose all landing components in order:
   Header → Hero → HowItWorks → Categories → Features → Testimonials
   → CTA → Footer.

Authentication:

10. components/auth/OAuthButtons.tsx
    Renders "Continue with Google" and "Continue with Facebook" buttons.
    Each calls signInWithOAuthAction(provider) from lib/actions/auth.ts.
    Used on both login and signup pages.
    Accept an optional redirectTo prop to pass through to the action.

11. lib/actions/auth.ts
    Export signInWithOAuthAction(provider: 'google' | 'facebook'):
    Call supabase.auth.signInWithOAuth({
    provider,
    options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    queryParams: { access_type: 'offline', prompt: 'consent' }
    }
    })
    If data.url exists: call redirect(data.url).
    If error: return { error: error.message }.

12. app/(auth)/signup/page.tsx
    Three sign-up options:
    a. Email + password form.
    Read role from query param (?role=client or ?role=freelancer).
    Pass role in supabase.auth.signUp() options.data: { role }.
    On success: show "Check your email to confirm your account."
    b. OAuthButtons component (Google + Facebook).
    Include link: "Already have an account? Log in".

13. app/(auth)/login/page.tsx
    Three sign-in options:
    a. Email + password form.
    On success: redirect to /setup (onboarding guard handles redirect
    to /dashboard if profile is already complete).
    b. OAuthButtons component.
    Include links: "Forgot password?" and "Don't have an account? Sign up".

14. app/auth/callback/route.ts
    Handles all auth callbacks: OAuth redirects and email confirmations.
    Extract code from URL searchParams.
    Call supabase.auth.exchangeCodeForSession(code).
    On success:
    Call supabase.auth.getUser() to get the user.
    Check if a profiles row exists for this user id.
    If no profiles row: insert one with id, full_name (from
    user_metadata.full_name or email prefix), avatar_url
    (from user_metadata.avatar_url), role (from user_metadata.role,
    default null), verified_status = 'unverified'.
    Redirect to /setup.
    On error: redirect to /login?error=auth_failed.

15. app/(auth)/forgot-password/page.tsx
    Email input form.
    Call supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`
    }).
    Show "Check your email for a reset link." on success.

16. app/(auth)/reset-password/page.tsx
    New password + confirm password form.
    Only accessible when session has recovery type.
    Call supabase.auth.updateUser({ password: newPassword }).
    Redirect to /dashboard on success.

17. app/(auth)/logout/page.tsx
    Server component only.
    Call supabase.auth.signOut() server-side.
    Redirect to / after signout.

Definition of Done:

- [ ] All landing sections render without layout errors on desktop and mobile
- [ ] Header shows correct state logged in vs logged out with no flash
- [ ] Email signup sends a confirmation email
- [ ] Confirming email creates a profiles row and redirects to /setup
- [ ] Email login redirects to /setup on success
- [ ] Google OAuth completes and lands on /setup
- [ ] Facebook OAuth completes and lands on /setup
- [ ] OAuth login creates a profiles row if one does not exist
- [ ] role from ?role= query param is stored in profiles row on email signup
- [ ] Forgot password email is received and reset link works
- [ ] Logout clears session and redirects to /
      </current_task>
