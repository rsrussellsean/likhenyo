<current_task>
Phase 2 — Core Database Schema + RLS + Search Indexes

Create the complete database schema in Supabase. Enable RLS on every table.
Add full-text search indexes and GIN indexes for array fields. Create the
auto-profile trigger. No UI in this phase — SQL and TypeScript types only.

Output each section as a clearly labeled SQL migration block.

MIGRATION 1 — profiles table:
CREATE TABLE profiles (
id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
full_name text NOT NULL,
avatar_url text,
bio text,
location text,
role text CHECK (role IN ('client', 'freelancer')),
profession text,
skills text[],
work_preference text CHECK (work_preference IN ('remote', 'onsite', 'hybrid')),
hourly_rate_min numeric,
hourly_rate_max numeric,
verified_status text NOT NULL DEFAULT 'unverified'
CHECK (verified_status IN ('unverified', 'pending', 'verified')),
rating numeric NOT NULL DEFAULT 0,
review_count integer NOT NULL DEFAULT 0,
created_at timestamptz NOT NULL DEFAULT now()
);

MIGRATION 2 — jobs table:
CREATE TABLE jobs (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
title text NOT NULL,
category text NOT NULL,
tags text[],
work_mode text NOT NULL CHECK (work_mode IN ('remote', 'onsite', 'hybrid')),
location text,
budget_min numeric NOT NULL,
budget_max numeric NOT NULL,
budget_type text NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
deadline date,
description text NOT NULL,
attachment_urls text[],
metadata jsonb,
status text NOT NULL DEFAULT 'open'
CHECK (status IN ('open', 'in_progress', 'completed')),
created_at timestamptz NOT NULL DEFAULT now()
);

MIGRATION 3 — applications table:
CREATE TABLE applications (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
freelancer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
proposal text NOT NULL,
status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'shortlisted', 'hired', 'rejected')),
created_at timestamptz NOT NULL DEFAULT now(),
UNIQUE (job_id, freelancer_id)
);

MIGRATION 4 — bookings table:
CREATE TABLE bookings (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
job_id uuid NOT NULL REFERENCES jobs(id),
application_id uuid NOT NULL UNIQUE REFERENCES applications(id),
freelancer_id uuid NOT NULL REFERENCES profiles(id),
client_id uuid NOT NULL REFERENCES profiles(id),
agreed_price numeric,
timeline text,
payment_status text NOT NULL DEFAULT 'unpaid'
CHECK (payment_status IN ('unpaid', 'downpaid', 'fully_paid')),
status text NOT NULL DEFAULT 'active'
CHECK (status IN ('active', 'submitted', 'completed')),
created_at timestamptz NOT NULL DEFAULT now()
);

MIGRATION 5 — messages table:
CREATE TABLE messages (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
sender_id uuid NOT NULL REFERENCES profiles(id),
message text NOT NULL,
created_at timestamptz NOT NULL DEFAULT now()
);

MIGRATION 6 — verifications table:
CREATE TABLE verifications (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
id_url text NOT NULL,
supplement_url text,
supplement_label text,
portfolio_url text,
status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected')),
submitted_at timestamptz NOT NULL DEFAULT now(),
reviewed_at timestamptz
);

MIGRATION 7 — payments table:
CREATE TABLE payments (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
amount numeric NOT NULL,
payment_type text NOT NULL CHECK (payment_type IN ('downpayment', 'final')),
method text NOT NULL
CHECK (method IN ('gcash', 'qr_ph', 'bank_transfer', 'cash')),
status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'confirmed')),
confirmed_by uuid REFERENCES profiles(id),
proof_url text,
created_at timestamptz NOT NULL DEFAULT now()
);

MIGRATION 8 — submissions table:
CREATE TABLE submissions (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
freelancer_id uuid NOT NULL REFERENCES profiles(id),
notes text,
file_urls text[] NOT NULL,
submitted_at timestamptz NOT NULL DEFAULT now()
);

MIGRATION 9 — reviews table:
CREATE TABLE reviews (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
booking_id uuid NOT NULL REFERENCES bookings(id),
reviewer_id uuid NOT NULL REFERENCES profiles(id),
reviewee_id uuid NOT NULL REFERENCES profiles(id),
rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
comment text,
created_at timestamptz NOT NULL DEFAULT now(),
UNIQUE (booking_id, reviewer_id)
);

MIGRATION 10 — Full-text search indexes:
Add tsvector columns and GIN indexes for keyword search.

ALTER TABLE jobs ADD COLUMN fts tsvector
GENERATED ALWAYS AS (
to_tsvector('english',
coalesce(title, '') || ' ' ||
coalesce(category, '') || ' ' ||
coalesce(description, '')
)
) STORED;
CREATE INDEX jobs_fts_idx ON jobs USING GIN (fts);

ALTER TABLE profiles ADD COLUMN fts tsvector
GENERATED ALWAYS AS (
to_tsvector('english',
coalesce(full_name, '') || ' ' ||
coalesce(profession, '') || ' ' ||
coalesce(bio, '')
)
) STORED;
CREATE INDEX profiles_fts_idx ON profiles USING GIN (fts);

MIGRATION 11 — GIN indexes for array fields:
CREATE INDEX jobs_tags_idx ON jobs USING GIN (tags);
CREATE INDEX profiles_skills_idx ON profiles USING GIN (skills);

MIGRATION 12 — RLS policies (one block per table):

profiles:
Enable RLS.
SELECT: authenticated users can read all profiles.
UPDATE: users can only update their own row.
INSERT: handled by trigger only (no direct inserts).

jobs:
Enable RLS.
SELECT: authenticated users can read all jobs where status = 'open',
plus all jobs where client_id = auth.uid() regardless of status.
INSERT: authenticated users where role = 'client' only.
UPDATE: only the client who owns the job (client_id = auth.uid()).
DELETE: only the client who owns the job.

applications:
Enable RLS.
SELECT: freelancer can read own applications.
Client can read applications where job belongs to them.
INSERT: authenticated users where role = 'freelancer' only.
UPDATE: only via server actions using service role (no direct client updates).

bookings:
Enable RLS.
SELECT: only users where client_id = auth.uid() OR freelancer_id = auth.uid().
INSERT: blocked for all direct inserts — only via RPC.
UPDATE: only via server actions using service role.

messages:
Enable RLS.
SELECT: only users who are client or freelancer of the related booking.
INSERT: only users who are client or freelancer of the related booking.

verifications:
Enable RLS.
SELECT: users can read only their own verification row.
INSERT: users can insert only their own (user_id = auth.uid()).
UPDATE: blocked for direct updates — only admin via service role.

payments:
Enable RLS.
SELECT: users who are client or freelancer of the related booking.
INSERT: only the client of the related booking.
UPDATE: only the freelancer of the related booking (for confirming).

submissions:
Enable RLS.
SELECT: client or freelancer of the related booking.
INSERT: only the freelancer of the related booking.

reviews:
Enable RLS.
SELECT: authenticated users can read all reviews.
INSERT: only authenticated users where reviewer_id = auth.uid().

MIGRATION 13 — Auto-create profile trigger:
Create a function handle_new_user() and a trigger on auth.users INSERT.
The function inserts into profiles:
id = new.id
full_name = coalesce(new.raw_user_meta_data->>'full_name',
split_part(new.email, '@', 1))
avatar_url = new.raw_user_meta_data->>'avatar_url'
role = new.raw_user_meta_data->>'role' (nullable — set during onboarding)
verified_status = 'unverified'

MIGRATION 14 — Storage buckets:
Create in Supabase Dashboard → Storage:
job-attachments (private)
verifications (private)
payment-proofs (private)
submissions (private)
avatars (public)
portfolios (private)
RLS on each bucket:
avatars: public read. Authenticated upload to own folder (avatars/{user_id}/).
All private buckets: authenticated read/upload to own folder only.

types/database.ts:
Export TypeScript types for all 9 tables:
Profile, Job, Application, Booking, Message, Verification,
Payment, Submission, Review.
Also export union types:
JobStatus = 'open' | 'in_progress' | 'completed'
ApplicationStatus = 'pending' | 'shortlisted' | 'hired' | 'rejected'
BookingStatus = 'active' | 'submitted' | 'completed'
PaymentStatus = 'unpaid' | 'downpaid' | 'fully_paid'
VerifiedStatus = 'unverified' | 'pending' | 'verified'
WorkMode = 'remote' | 'onsite' | 'hybrid'
BudgetType = 'fixed' | 'hourly'

Definition of Done:

- [ ] All 9 tables exist in Supabase Table Editor
- [ ] RLS is enabled and all policies are visible in Supabase Dashboard
- [ ] fts column exists on jobs and profiles tables
- [ ] GIN indexes exist on jobs.tags and profiles.skills
- [ ] Creating a new user triggers auto-creation of profiles row
- [ ] OAuth signup also creates a profiles row (test with Google)
- [ ] All 6 storage buckets are created
- [ ] types/database.ts has no TypeScript errors
- [ ] UNIQUE constraint on applications(job_id, freelancer_id) confirmed
- [ ] Querying jobs with fts @@ to_tsquery('english', 'engineer') returns rows
      </current_task>
