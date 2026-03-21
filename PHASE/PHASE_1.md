<current_task>
Phase 1 — Landing Page + Authentication

Build the full marketing landing page for Likhenyo and the complete
authentication system. Google and Facebook login use Supabase OAuth via
a server action. Email/password flows follow official Supabase patterns.
After any signup, users are redirected to onboarding before the dashboard.

Brand Context:
Name: Likhenyo
Meaning: Likha (create) + Henyo (genius) — Creative Genius
Voice: Confident, Filipino-proud, professional but warm. Not corporate.
Speaks to skilled Filipinos who deserve a better way to work.
Visual direction: Bold typography, strong contrast, Filipino warmth.
Avoid generic SaaS look. This should feel like it was built for
the Philippine market, not adapted from a Western template.

Landing Page (components/landing/):

1. Header.tsx
   Logo: "Likhenyo" wordmark. Use a distinctive font — not Inter or Roboto.
   Suggestion: pair a strong display font for the logo with a clean sans-serif
   for navigation. The logo can include a subtle mark or ligature on the
   "L" or the "Lk" pairing.
   Navigation links: How It Works, Browse Jobs, Find Talent, About.
   Logged out: "Log In" (ghost button) and "Get Started" (filled button).
   Logged in: user avatar, "Dashboard" link, "Log Out".
   Sticky. No flash between auth states — read session server-side.
   Mobile: hamburger menu that collapses nav links.

2. Hero.tsx
   Layout: full-width asymmetric section. Large bold headline on the left,
   taking up most of the vertical space. Right side: a dynamic stacked card
   visual showing sample freelancer profile cards (mocked, not real data)
   slightly overlapping and rotated — conveying a sense of a living
   marketplace. No stock photography.
   Headline (large, bold, 2–3 lines):
   "Ang Henyo Mo,
   Ang Trabaho Mo."
   (English subtitle below in smaller text):
   "Connect with verified Filipino professionals — engineers, developers,
   designers, and more. Post jobs or find work, all in one place."
   Two CTAs side by side:
   "Post a Job" — filled, primary color → /signup?role=client
   "Find Work" — outlined → /signup?role=freelancer
   Below the CTAs: small social proof line —
   "Trusted by professionals across Cebu and beyond."

3. HowItWorks.tsx
   Section headline: "Simple. Structured. Trusted."
   Two tabs: "For Clients" and "For Freelancers" (Shadcn Tabs component).
   Each tab shows a horizontal step flow on desktop, vertical on mobile.

   For Clients (5 steps):
   1. Post Your Job
      "Describe what you need. Add your budget, timeline, and tags.
      No complicated forms."
   2. Review Applicants
      "Freelancers apply with proposals. Shortlist the ones that fit.
      Compare profiles and ratings."
   3. Hire with Confidence
      "Select your freelancer. A booking is created automatically.
      Set your agreed price and timeline."
   4. Track the Work
      "Log your downpayment. Chat inside the platform.
      Stay updated without leaving Likhenyo."
   5. Receive and Review
      "Accept the deliverables. Leave a review.
      Build a track record for future hires."

   For Freelancers (5 steps):
   1. Build Your Profile
      "List your profession, skills, and work preference.
      Get verified to stand out."
   2. Browse and Apply
      "Find jobs that match your skills. Apply with a proposal
      that shows what you can do."
   3. Get Hired
      "Clients review your application and hire you directly.
      A booking is set up automatically."
   4. Do the Work
      "Agree on the price and timeline. Communicate through
      the built-in chat. No need for external apps."
   5. Get Paid and Grow
      "Submit your work. Receive payment. Collect reviews
      that build your reputation on the platform."

4. ProfessionGrid.tsx
   Section headline: "Any Skill. Any Project."
   Subheadline: "From blueprints to code to brand identity —
   Likhenyo is built for every kind of Filipino professional."
   Grid of profession tiles. Each tile: icon + label.
   Professions to show (12 tiles in a 4x3 grid on desktop, 2x6 on mobile):
   Structural Engineering, Web Development, Graphic Design,
   Architecture, Accounting & Finance, Legal Services,
   Content Writing, Mobile Development, Interior Design,
   Video Production, Virtual Assistance, Trades & Labor
   Below the grid: "Browse All Jobs →" link to /jobs.
   Important: these are illustrative display tiles only. Do not hardcode
   them as functional filter values in the codebase.

5. WhyLikhenyo.tsx
   Section headline: "Built for How Filipinos Actually Work"
   3-column layout on desktop, stacked on mobile.
   Each column: large icon, bold title, 2-sentence description.

   Column 1 — Verified Professionals
   "Every freelancer on Likhenyo submits a government ID before applying
   to jobs. Optional credentials like PRC licenses add another layer
   of trust."

   Column 2 — Structured, Not Scattered
   "No more chasing leads in Facebook groups or Viber chats.
   Jobs, applications, agreements, and payments — all in one place."

   Column 3 — Built for the Philippine Market
   "GCash, QR Ph, and local payment methods. Philippine cities and
   provinces. Designed for how business works here."

6. Stats.tsx
   Full-width section with a bold background (dark or brand color).
   4 stat blocks in a row:
   "100%" — Verified freelancers
   "₱0" — Platform fee to browse and apply (MVP)
   "1 Platform" — For jobs, chat, and payments
   "All Professions" — Engineers to designers to VAs
   Note: use these placeholder stats for MVP launch. Replace with real
   numbers once data exists. Do not fabricate specific user or job counts.

7. Testimonials.tsx
   Section headline: "What Professionals Are Saying"
   3 testimonial cards in a row (horizontal scroll on mobile).
   Each card: avatar (illustrated placeholder, not photo), name,
   profession, location, star rating (4 or 5 stars), quote.

   Card 1:
   Name: Marco Villanueva
   Profession: Structural Engineer
   Location: Cebu City
   Quote: "Finally, a platform that takes verification seriously.
   Clients here actually know what they're hiring."

   Card 2:
   Name: Jasmine Reyes
   Profession: Full Stack Developer
   Location: Mandaue City
   Quote: "I used to find projects through Facebook groups.
   Likhenyo is so much more organized. My proposals
   actually get read."

   Card 3:
   Name: Dana Mercado
   Profession: Brand Designer
   Location: Remote — based in Cebu
   Quote: "The in-app chat means I never have to share my number
   with a client before we've agreed on terms. Big deal for me."

8. ForThePhilippines.tsx
   A bold, full-width section that leans into the Filipino identity
   of the platform. This is a brand differentiator — lean into it.
   Headline (large, proud):
   "Para sa mga Pilipinong Henyo."
   (Subtitle in English):
   "Likhenyo was built for the Philippines. For the engineer in Cebu,
   the developer in Davao, the designer in Manila — and everyone
   in between."
   Single CTA: "Join Likhenyo Today" → /signup

9. Footer.tsx
   Logo wordmark left-aligned.
   4 columns:
   Likhenyo: About, How It Works, Pricing, Blog (placeholder link)
   For Clients: Post a Job, How Hiring Works, Client FAQ
   For Freelancers: Find Jobs, Build Your Profile, Freelancer FAQ,
   Verification Guide
   Legal & Support: Privacy Policy, Terms of Service,
   Contact Us, Report an Issue
   Bottom bar: "© 2025 Likhenyo. All rights reserved." left side.
   Social icons right side: Facebook, LinkedIn, Instagram.

10. app/page.tsx
    Compose all sections in this order:
    Header → Hero → HowItWorks → ProfessionGrid → WhyLikhenyo
    → Stats → Testimonials → ForThePhilippines → Footer

Authentication:
(No changes to auth logic — only brand name references update)

11. components/auth/OAuthButtons.tsx
    "Continue with Google" and "Continue with Facebook" buttons.
    Each calls signInWithOAuthAction(provider) from lib/actions/auth.ts.

12. lib/actions/auth.ts
    signInWithOAuthAction(provider: 'google' | 'facebook'):
    Call supabase.auth.signInWithOAuth({
    provider,
    options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    queryParams: { access_type: 'offline', prompt: 'consent' }
    }
    })
    If data.url exists: redirect(data.url).
    If error: return { error: error.message }.

13. app/(auth)/signup/page.tsx
    Headline: "Simulan na. Libre."
    Subheadline: "Create your Likhenyo account."
    Three sign-up options:
    a. Email + password form.
    Read role from query param (?role=client or ?role=freelancer).
    Pass role in signUp options.data: { role }.
    On success: "Check your email to confirm your Likhenyo account."
    b. "Continue with Google" button.
    c. "Continue with Facebook" button.
    Link below: "Already have an account? Log in"

14. app/(auth)/login/page.tsx
    Headline: "Welcome back."
    Three sign-in options:
    a. Email + password form.
    On success: redirect to /setup.
    b. "Continue with Google" button.
    c. "Continue with Facebook" button.
    Links: "Forgot password?" and "Don't have an account? Sign up"

15. app/auth/callback/route.ts
    Handles all auth callbacks: OAuth redirects and email confirmations.
    Extract code from URL searchParams.
    Call supabase.auth.exchangeCodeForSession(code).
    On success:
    Call supabase.auth.getUser().
    Check if a profiles row exists for this user id.
    If no profiles row: insert one using user metadata.
    Redirect to /setup.
    On error: redirect to /login?error=auth_failed.

16. app/(auth)/forgot-password/page.tsx
    Headline: "Reset your password."
    Email input form.
    Call supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`
    }).
    Success message: "Check your email for a reset link."

17. app/(auth)/reset-password/page.tsx
    Headline: "Set a new password."
    New password + confirm password form.
    Call supabase.auth.updateUser({ password: newPassword }).
    Redirect to /dashboard on success.

18. app/(auth)/logout/page.tsx
    Server component only.
    Call supabase.auth.signOut() server-side.
    Redirect to /.

Definition of Done:

- [ ] All landing sections render without layout errors on desktop and mobile
- [ ] Filipino headline text renders correctly (no encoding issues)
- [ ] Header shows correct state logged in vs logged out with no flash
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] HowItWorks tabs switch between client and freelancer views
- [ ] "Post a Job" CTA passes ?role=client to signup page
- [ ] "Find Work" CTA passes ?role=freelancer to signup page
- [ ] Email signup sends a confirmation email with Likhenyo in the sender name
- [ ] Confirming email creates a profiles row and redirects to /setup
- [ ] Google OAuth completes and lands on /setup
- [ ] Facebook OAuth completes and lands on /setup
- [ ] OAuth creates a profiles row if one does not exist
- [ ] Forgot password email received and reset link works
- [ ] Logout clears session and redirects to /
      </current_task>
