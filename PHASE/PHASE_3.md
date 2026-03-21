<current_task>
Phase 3 — Job Posting System

Build the job creation form and job detail page. Clients post
profession-agnostic jobs using free-text category and tag inputs.
No job browsing or search yet — that is Phase 5.

Tasks:

1. app/(onboarding)/setup/page.tsx — Onboarding page.
   Guard: if profiles.role is already set, redirect to /dashboard immediately.
   Step 1: Role selection cards.
   "I want to hire someone" → role: client
   "I want to find work" → role: freelancer
   Step 2 (freelancer only): profession, skills, work preference, location.
   Profession: text input. Placeholder: "e.g. Structural Engineer,
   Web Developer, Graphic Designer".
   Skills: multi-tag input. Placeholder: "Add your skills e.g. React, AutoCAD".
   Work preference: remote | onsite | hybrid toggle.
   Location: text input.
   On submit (server action in lib/actions/auth.ts — updateProfile):
   Update profiles row with role, profession, skills, work_preference, location.
   Redirect to /dashboard.

2. app/(marketplace)/dashboard/page.tsx — Role-aware dashboard.
   Guard: authenticated users only. If no role set, redirect to /setup.
   Client view:
   "Post a New Job" button → /jobs/new
   "My Posted Jobs" list: title, status badge, applicant count, date.
   "My Active Bookings" count with link to /bookings.
   Freelancer view:
   "Browse Jobs" button → /jobs
   Application summary: counts by status (pending, shortlisted, hired, rejected).
   "My Active Bookings" count with link to /bookings.

3. lib/actions/jobs.ts — Server actions for job operations.
   createJob(formData): validates all fields, uploads attachments to
   Supabase Storage (job-attachments/{client_id}/{job_id}/{filename}),
   inserts into jobs table. Returns { jobId } or { error }.

4. components/marketplace/TagInput.tsx — Reusable multi-tag input component.
   Accepts: value (string[]), onChange, placeholder, suggestionsQuery.
   suggestionsQuery is a server action that queries distinct values from
   the database for autocomplete. Renders tags as removable chips.
   Enter or comma keystroke adds a tag. Backspace removes the last tag.
   Used for both job tags and freelancer skills.

5. components/marketplace/CategoryInput.tsx — Text input with autocomplete.
   Queries distinct values from jobs.category (for job form) or
   profiles.profession (for profile form) as the user types.
   Returns suggestions in a dropdown. Selecting fills the input.
   Used on job creation and onboarding forms.

6. lib/actions/autocomplete.ts — Server actions for autocomplete queries.
   getJobCategorysuggestions(query: string): returns distinct jobs.category
   values matching the query (case-insensitive, limit 10).
   getSkillSuggestions(query: string): returns distinct unnested values
   from profiles.skills matching the query (limit 10).
   getTagSuggestions(query: string): returns distinct unnested values
   from jobs.tags matching the query (limit 10).

7. app/(marketplace)/jobs/new/page.tsx — Job creation page.
   Guard: role must be 'client'. Redirect freelancers to /jobs.
   Form fields:
   title (text input, required)
   category (CategoryInput with autocomplete, required)
   Placeholder: "e.g. Structural Engineer, Web Developer, Logo Designer"
   tags (TagInput with autocomplete, optional)
   Placeholder: "Add keywords e.g. React, AutoCAD, Cebu, urgent"
   work_mode (segmented control: Remote | On-site | Hybrid, required)
   location (text input — shown only when work_mode is onsite or hybrid)
   budget_type (toggle: Fixed Price | Hourly Rate, required)
   budget_min and budget_max (side-by-side number inputs in PHP ₱)
   deadline (date picker, optional)
   description (textarea, required, min 50 characters)
   attachments (multi-file upload, optional)
   On submit: call createJob server action.
   Show upload progress for attachments.
   On success: redirect to /jobs/[id].

8. app/(marketplace)/jobs/[id]/page.tsx — Job detail page.
   Server component. Fetch job joined with client profile.
   Show: title, category badge, tags as chips, work_mode badge,
   location (if applicable), budget range + type, deadline,
   description, client name + avatar + verified badge.
   Show attachment download links if any.
   If job is 'open' and viewer is a verified freelancer:
   Show "Apply Now" button → /jobs/[id]/apply.
   If job is 'open' and viewer is an unverified freelancer:
   Show "Apply Now" button as disabled with tooltip:
   "Complete verification to apply" + link to /profile/verify.
   If viewer is the client who owns this job:
   Show "View Applicants" button → /jobs/[id]/applicants.
   Show "Edit Job" button (only if status is 'open').
   If job is 'in_progress':
   Show "Hiring Closed" badge.
   Client sees "View Active Booking" link.

9. app/(marketplace)/jobs/[id]/edit/page.tsx — Edit job page.
   Guard: must be the client who owns this job. Status must be 'open'.
   Same form as /jobs/new but pre-filled.
   On submit: update jobs row. Redirect to /jobs/[id].

Components (components/marketplace/):

- JobCard.tsx — title, category, tags (first 3 chips + overflow count),
  work_mode badge, location, budget range + type, deadline, client name,
  status badge. Entire card is a link to /jobs/[id].
- StatusBadge.tsx — accepts any status string from the union types.
  Returns a color-coded Shadcn badge. Covers all status types.
- BudgetDisplay.tsx — formats ₱budget_min – ₱budget_max + type label.

Definition of Done:

- [ ] Onboarding page redirects to /dashboard if role is already set
- [ ] Client completes onboarding and lands on dashboard with client view
- [ ] Freelancer completes onboarding and lands on dashboard with freelancer view
- [ ] CategoryInput shows autocomplete suggestions from the database
- [ ] TagInput adds and removes tags correctly
- [ ] Client can post a job and it inserts into the jobs table
- [ ] Attachments upload to Supabase Storage at the correct path
- [ ] attachment_urls array is saved in the jobs row
- [ ] Job detail page renders all fields correctly
- [ ] work_mode = 'remote' hides the location field on the form
- [ ] Freelancers cannot access /jobs/new (server-side redirect)
- [ ] RLS blocks direct inserts by non-clients (test in SQL editor)
      </current_task>
