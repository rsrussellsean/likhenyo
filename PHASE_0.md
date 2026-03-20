<current_task>
Phase 0 — Project Setup + Supabase Configuration

Initialize the Next.js 16 project with App Router and TypeScript. Install all
required dependencies. Configure Supabase project, OAuth providers, and
establish the full folder structure.

Tasks:

1. Initialize Next.js 16 with App Router, TypeScript, and Tailwind CSS.
   Use: npx create-next-app@latest workhub-ph --typescript --tailwind --app

2. Install and configure Shadcn UI:
   npx shadcn@latest init
   Set base color to neutral. Install these components immediately:
   button, input, textarea, select, badge, card, avatar, dialog, dropdown-menu,
   tabs, toast, tooltip, separator, label, form, popover, command

3. Install Supabase dependencies:
   npm install @supabase/supabase-js @supabase/ssr

4. Create .env.local with these exact variables:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_EMAIL=

5. Create lib/supabase/client.ts
   Browser client using createBrowserClient from @supabase/ssr.
   Export a single createClient() function.

6. Create lib/supabase/server.ts
   Server client using createServerClient from @supabase/ssr.
   Must handle cookies via next/headers cookies().
   Export a single createClient() async function.
   Follow the official Supabase Next.js App Router guide exactly.

7. Create lib/supabase/middleware.ts
   Export an updateSession(request) function using createServerClient.
   This refreshes the user session on every request.

8. Create middleware.ts at the project root.
   Import and call updateSession from lib/supabase/middleware.ts.
   Apply to all routes. Exclude: \_next/static, \_next/image, favicon.ico,
   and all files with extensions (.svg, .png, .jpg, .ico, .css, .js).

9. Configure Supabase Dashboard:
   a. Authentication → Providers → Enable Google.
   Add OAuth Client ID and Secret from Google Cloud Console.
   Set Authorized redirect URI: {SUPABASE_URL}/auth/v1/callback
   b. Authentication → Providers → Enable Facebook.
   Add App ID and App Secret from Meta Developer Console.
   Set Valid OAuth Redirect URI: {SUPABASE_URL}/auth/v1/callback
   c. Authentication → URL Configuration:
   Site URL: http://localhost:3000
   Add to Redirect URLs: http://localhost:3000/auth/callback

10. Create the full folder structure (empty files are fine at this stage):
    app/
    (auth)/
    login/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    logout/page.tsx
    auth/
    callback/route.ts
    (onboarding)/
    setup/page.tsx
    (marketplace)/
    dashboard/page.tsx
    jobs/
    page.tsx
    new/page.tsx
    [id]/
    page.tsx
    apply/page.tsx
    applicants/page.tsx
    freelancers/
    page.tsx
    [id]/page.tsx
    applications/page.tsx
    bookings/
    page.tsx
    [id]/
    page.tsx
    chat/page.tsx
    payment/page.tsx
    submit/page.tsx
    review/page.tsx
    admin/
    verifications/page.tsx
    components/
    landing/
    marketplace/
    auth/
    ui/ ← Shadcn output
    lib/
    supabase/
    client.ts
    server.ts
    middleware.ts
    actions/
    auth.ts
    jobs.ts
    applications.ts
    hire.ts
    bookings.ts
    payments.ts
    reviews.ts
    verifications.ts
    utils/
    chatFilter.ts
    formatters.ts
    types/
    database.ts

Definition of Done:

- [ ] npm run dev starts with zero errors or warnings
- [ ] lib/supabase/client.ts exports createClient() using createBrowserClient
- [ ] lib/supabase/server.ts exports createClient() using createServerClient
      with cookie handling
- [ ] middleware.ts runs on every route (confirm in terminal request logs)
- [ ] Google OAuth provider is enabled in Supabase Dashboard
- [ ] Facebook OAuth provider is enabled in Supabase Dashboard
- [ ] Redirect URIs are set correctly in Google Cloud Console and Meta Console
- [ ] Shadcn Button component renders correctly on a test page
- [ ] All folders exist in the correct structure
- [ ] .env.local exists and is listed in .gitignore
      </current_task>
