// ─── Union Types ──────────────────────────────────────────────────────────────

export type JobStatus = 'open' | 'in_progress' | 'completed'
export type ApplicationStatus = 'pending' | 'shortlisted' | 'hired' | 'rejected'
export type BookingStatus = 'active' | 'submitted' | 'completed'
export type PaymentStatus = 'unpaid' | 'downpaid' | 'fully_paid'
export type VerifiedStatus = 'unverified' | 'pending' | 'verified'
export type WorkMode = 'remote' | 'onsite' | 'hybrid'
export type BudgetType = 'fixed' | 'hourly'
export type PaymentMethod = 'gcash' | 'qr_ph' | 'bank_transfer' | 'cash'
export type PaymentConfirmStatus = 'pending' | 'confirmed'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type WorkPreference = 'remote' | 'onsite' | 'hybrid'
export type Role = 'client' | 'freelancer'
export type PaymentType = 'downpayment' | 'final'

// ─── Table Types ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  role: Role | null
  profession: string | null
  skills: string[] | null
  work_preference: WorkPreference | null
  hourly_rate_min: number | null
  hourly_rate_max: number | null
  verified_status: VerifiedStatus
  rating: number
  review_count: number
  created_at: string
}

export interface Job {
  id: string
  client_id: string
  title: string
  category: string
  tags: string[] | null
  work_mode: WorkMode
  location: string | null
  budget_min: number
  budget_max: number
  budget_type: BudgetType
  deadline: string | null
  description: string
  attachment_urls: string[] | null
  metadata: Record<string, unknown> | null
  status: JobStatus
  created_at: string
}

export interface Application {
  id: string
  job_id: string
  freelancer_id: string
  proposal: string
  status: ApplicationStatus
  created_at: string
}

export interface Booking {
  id: string
  job_id: string
  application_id: string
  freelancer_id: string
  client_id: string
  agreed_price: number | null
  timeline: string | null
  payment_status: PaymentStatus
  status: BookingStatus
  created_at: string
}

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  message: string
  created_at: string
}

export interface Verification {
  id: string
  user_id: string
  id_url: string
  supplement_url: string | null
  supplement_label: string | null
  portfolio_url: string | null
  status: VerificationStatus
  submitted_at: string
  reviewed_at: string | null
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  payment_type: PaymentType
  method: PaymentMethod
  status: PaymentConfirmStatus
  confirmed_by: string | null
  proof_url: string | null
  created_at: string
}

export interface Submission {
  id: string
  booking_id: string
  freelancer_id: string
  notes: string | null
  file_urls: string[]
  submitted_at: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}
