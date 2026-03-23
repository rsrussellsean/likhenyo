<current_task>
Phase 5 — Job Search + Filter System

Build the fully functional job search page and freelancer search page.
All filters run server-side via Supabase queries. Filter state lives in
URL search params. Results are shareable and bookmarkable.

Tasks:

1. lib/actions/search.ts — Server actions for all search queries.

   searchJobs(params: JobSearchParams):
   Parameters: keyword, category, tags (string[]), work_mode,
   location, budget_type, budget_min, budget_max, posted_within
   (today | week | month | any), sort (newest | budget_high |
   budget_low | most_applicants), page (default 1), limit (default 20).
   Query logic:
   Base: SELECT jobs._, profiles.full_name, profiles.avatar_url,
   profiles.verified_status,
   COUNT(applications.id) AS applicant_count
   FROM jobs JOIN profiles ON jobs.client_id = profiles.id
   LEFT JOIN applications ON applications.job_id = jobs.id
   WHERE jobs.status = 'open'
   If keyword: AND jobs.fts @@ to_tsquery('english', keyword)
   If category: AND jobs.category ILIKE '%' || category || '%'
   If tags: AND jobs.tags && tags_array
   If work_mode: AND jobs.work_mode = work_mode
   If location: AND jobs.location ILIKE '%' || location || '%'
   If budget_type: AND jobs.budget_type = budget_type
   If budget_min: AND jobs.budget_max >= budget_min
   If budget_max: AND jobs.budget_min <= budget_max
   If posted_within today: AND jobs.created_at >= now() - interval '1 day'
   If posted_within week: AND jobs.created_at >= now() - interval '7 days'
   If posted_within month: AND jobs.created_at >= now() - interval '30 days'
   ORDER BY: newest = created_at DESC, budget_high = budget_max DESC,
   budget_low = budget_min ASC, most_applicants = applicant_count DESC
   LIMIT limit OFFSET (page - 1) _ limit
   Returns { jobs, totalCount, page, totalPages }.

   searchFreelancers(params: FreelancerSearchParams):
   Parameters: keyword, profession, skills (string[]), work_preference,
   location, rate_min, rate_max, verified_only, sort (rating | reviews |
   newest | rate_low), page (default 1), limit (default 20).
   Query logic:
   Base: SELECT _ FROM profiles WHERE role = 'freelancer'
   If keyword: AND profiles.fts @@ to_tsquery('english', keyword)
   If profession: AND profession ILIKE '%' || profession || '%'
   If skills: AND skills && skills_array
   If work_preference: AND work_preference = work_preference
   If location: AND location ILIKE '%' || location || '%'
   If rate_min: AND hourly_rate_max >= rate_min
   If rate_max: AND hourly_rate_min <= rate_max
   If verified_only: AND verified_status = 'verified'
   ORDER BY: rating = rating DESC, reviews = review_count DESC,
   newest = created_at DESC, rate_low = hourly_rate_min ASC
   LIMIT limit OFFSET (page - 1) _ limit
   Returns { freelancers, totalCount, page, totalPages }.

2. components/marketplace/JobFilters.tsx — Client component.
   Reads current filter values from URL search params using useSearchParams().
   On any filter change: updates URL params using router.push() with the
   new params. Does NOT hold local state — URL is the single source of truth.
   Filter controls:
   keyword: text input with search icon (debounced 300ms)
   category: CategoryInput with autocomplete
   tags: TagInput with autocomplete (multi-select chips)
   work_mode: segmented button (Any | Remote | On-site | Hybrid)
   location: text input (shown only when work_mode is onsite or hybrid)
   budget_type: toggle (Any | Fixed | Hourly)
   budget range: dual-handle range slider (₱0 to ₱500,000)
   posted_within: select dropdown
   sort: select dropdown
   "Clear All Filters" button: resets all params to defaults.
   Show active filter count badge on a "Filters" button for mobile collapse.

3. components/marketplace/FreelancerFilters.tsx — Client component.
   Same URL-param-driven pattern as JobFilters.
   Filter controls:
   keyword: text input (debounced 300ms)
   profession: CategoryInput querying profiles.profession
   skills: TagInput with autocomplete (multi-select chips)
   work_preference: segmented button (Any | Remote | On-site | Hybrid)
   location: text input
   rate range: dual-handle range slider (₱0 to ₱5,000/hr)
   verified_only: toggle switch
   sort: select dropdown
   "Clear All Filters" button.

4. app/(marketplace)/jobs/page.tsx — Update from Phase 3.
   Read all filter params from URL searchParams (server-side).
   Pass params to searchJobs server action.
   Render JobFilters (client component, receives current params as props).
   Render results: JobCard grid.
   Render pagination: prev/next + page indicator.
   Show result count: "Showing X of Y jobs".
   Empty state: "No jobs match your filters. Try adjusting your search."

5. app/(marketplace)/freelancers/page.tsx — Update from Phase 4.
   Read all filter params from URL searchParams (server-side).
   Pass params to searchFreelancers server action.
   Render FreelancerFilters (client component).
   Render results: FreelancerCard grid.
   Render pagination.
   Show result count.
   Empty state: "No freelancers match your filters."

6. components/marketplace/Pagination.tsx — Reusable pagination component.
   Props: currentPage, totalPages, baseUrl.
   Renders prev button, page numbers (show max 5, with ellipsis),
   next button. Each button updates the page param in the URL.

7. components/marketplace/SearchBar.tsx — Reusable hero search bar.
   Used at the top of both /jobs and /freelancers pages.
   Single text input + "Search" button.
   On submit: sets the keyword param in the URL.

Definition of Done:

- [ ] Keyword search on /jobs returns results matching title, category,
      and description (test with a word only in description)
- [ ] Category filter narrows results correctly (case-insensitive)
- [ ] Tags filter returns jobs that have at least one matching tag
- [ ] work_mode filter works independently and in combination with other filters
- [ ] Budget range filter returns jobs within the correct range
- [ ] posted_within filter returns only jobs created in the correct window
- [ ] Sort options change the order of results correctly
- [ ] All active filters are reflected in the URL search params
- [ ] Reloading the page with filter params in the URL restores the filter state
- [ ] "Clear All Filters" resets URL and shows all open jobs
- [ ] Freelancer search filters all work independently and in combination
- [ ] verified_only toggle shows only verified freelancers
- [ ] Pagination shows correct page count and navigates correctly
- [ ] Zero results shows the empty state message (not a blank page)
      </current_task>
