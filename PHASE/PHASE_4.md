<current_task>
Phase 4 — Freelancer Profile System + Discovery Page

Build the public freelancer profile page, the profile edit page, and the
freelancer discovery listing page. No search filtering yet — that is Phase 5.
Profiles are the freelancer's storefront. Make them information-rich.

Tasks:

1. app/(marketplace)/freelancers/[id]/page.tsx — Public profile page.
   Server component. Fetch profile joined with reviews and completed
   bookings count.
   Layout sections:
   a. Profile header: avatar, full_name, profession badge, location,
   work_preference badge (Remote / On-site / Hybrid),
   verified badge (show only if verified_status = 'verified'),
   hourly rate range (if set), rating stars + review count.
   b. About section: bio text.
   c. Skills section: skill chips from profiles.skills array.
   If empty: "No skills listed yet."
   d. Portfolio link: show as a button if portfolio_url exists in
   verifications table (join to check). Label: "View Portfolio".
   e. Stats row: Completed Jobs count, Member Since date.
   f. Reviews section: list of last 10 reviews. Each review shows
   reviewer name + avatar, star rating, comment, date.
   If no reviews: "No reviews yet."
   g. "Hire [Name]" button — links to /jobs/new for clients.
   Not shown if viewer is the profile owner.
   h. "Edit Profile" button — shown only to the profile owner.

2. app/(marketplace)/profile/edit/page.tsx — Edit own profile.
   Guard: authenticated users only. Redirects to own profile page.
   Fields:
   full_name (text, required)
   avatar (file upload → avatars/{user_id}/avatar, public bucket)
   bio (textarea)
   profession (CategoryInput querying profiles.profession values)
   Only shown if role = 'freelancer'.
   skills (TagInput querying profiles.skills values)
   Only shown if role = 'freelancer'.
   work_preference (remote | onsite | hybrid)
   Only shown if role = 'freelancer'.
   hourly_rate_min and hourly_rate_max (number inputs in PHP ₱)
   Only shown if role = 'freelancer'.
   location (text input)
   On submit (server action in lib/actions/auth.ts — updateProfile):
   Update profiles row. If avatar uploaded, update avatar_url.
   Redirect to /freelancers/[id].

3. app/(marketplace)/freelancers/page.tsx — Freelancer discovery page.
   Server component. Fetch all profiles where role = 'freelancer'.
   Default sort: highest rated first.
   Render FreelancerFilters (client component, placeholder only in this
   phase — full implementation in Phase 5).
   Render FreelancerCard for each result.
   Empty state: "No freelancers found."
   Pagination: show 20 per page. Simple prev/next navigation via URL params.

4. components/marketplace/FreelancerCard.tsx
   avatar, full_name, profession badge, top 4 skill chips + overflow count,
   location, work_preference badge, rating stars + review_count,
   verified badge, hourly rate range (if set).
   Entire card is a link to /freelancers/[id].

5. components/marketplace/VerifiedBadge.tsx
   Props: verifiedStatus (VerifiedStatus type), supplementLabel (string | null),
   size ('sm' | 'md').
   Renders a checkmark badge with tooltip showing supplementLabel if available
   (e.g. "PRC License Verified", "Bar Certificate Verified", "ID Verified").
   Renders nothing if verifiedStatus is not 'verified'.

6. components/marketplace/SkillChip.tsx
   Reusable chip for a single skill or tag.
   Props: label, variant ('skill' | 'tag' | 'category'), onClick (optional).
   Used in FreelancerCard, JobCard, and profile pages.

7. components/marketplace/StarRating.tsx
   Props: value (number), max (5), size ('sm' | 'md' | 'lg'),
   interactive (boolean), onChange (optional).
   In display mode: renders filled/empty stars based on value.
   In interactive mode: renders clickable stars for review form.

8. Update app/(marketplace)/dashboard/page.tsx:
   Freelancer dashboard: add "Edit My Profile" link → /profile/edit.
   Add "My Public Profile" link → /freelancers/[user_id].

Definition of Done:

- [ ] Public profile page renders all sections correctly
- [ ] Profile with no bio, skills, or reviews shows appropriate empty states
- [ ] Verified badge shows correct tooltip based on supplementLabel
- [ ] Edit profile saves changes and redirects to public profile
- [ ] Avatar uploads to Supabase Storage and updates avatar_url in profiles
- [ ] Profession and skills fields are hidden on client profile edit
- [ ] Freelancer discovery page shows all freelancer profiles
- [ ] FreelancerCard renders all fields including skill overflow count
- [ ] Clicking a FreelancerCard navigates to the correct profile page
- [ ] Dashboard links to edit profile and public profile work correctly
      </current_task>
