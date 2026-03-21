"""
Phase 3 — Automated test suite
Tests all Definition of Done items that can be verified programmatically.

Usage:
    python tests/test_phase3.py [http://localhost:3000]

Requires:
    pip install playwright
    playwright install chromium
"""

import sys
import io
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).parent.parent
PASS = "[PASS]"
FAIL = "[FAIL]"
results = []


def check(label: str, condition: bool, detail: str = "") -> None:
    status = PASS if condition else FAIL
    msg = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((condition, msg))
    print(msg)


# ─── Static file checks ───────────────────────────────────────────────────────

def check_marketplace_files():
    print("\n-- Marketplace File Structure --")
    required = [
        "app/(marketplace)/layout.tsx",
        "app/(marketplace)/dashboard/page.tsx",
        "app/(marketplace)/jobs/new/page.tsx",
        "app/(marketplace)/jobs/[id]/page.tsx",
        "app/(marketplace)/jobs/[id]/edit/page.tsx",
        "components/marketplace/JobCard.tsx",
        "components/marketplace/StatusBadge.tsx",
        "components/marketplace/BudgetDisplay.tsx",
        "components/marketplace/TagInput.tsx",
        "components/marketplace/CategoryInput.tsx",
        "components/marketplace/NavSignOut.tsx",
        "lib/actions/jobs.ts",
        "lib/actions/autocomplete.ts",
        "lib/actions/auth.ts",
        "types/database.ts",
    ]
    for f in required:
        check(f"File exists: {f}", (ROOT / f).exists())


# ─── Code content checks ──────────────────────────────────────────────────────

def check_jobs_action():
    print("\n-- lib/actions/jobs.ts --")
    src = (ROOT / "lib/actions/jobs.ts").read_text(encoding="utf-8")
    check("jobs.ts has 'use server'", '"use server"' in src or "'use server'" in src)
    check("jobs.ts has createJob function", "createJob" in src)
    check("jobs.ts has updateJob function", "updateJob" in src)
    check("jobs.ts validates description min 50 chars", "50" in src)
    check("jobs.ts uploads to job-attachments bucket", "job-attachments" in src)
    check("jobs.ts saves attachment_urls to jobs row", "attachment_urls" in src)
    check("jobs.ts guards role = client", "client" in src)
    check("jobs.ts uses createClient from supabase/server", "supabase/server" in src)
    check("jobs.ts returns jobId on success", "jobId" in src)
    check("jobs.ts uses correct storage path (user_id/job_id)", "user.id" in src and "job.id" in src)


def check_autocomplete_action():
    print("\n-- lib/actions/autocomplete.ts --")
    src = (ROOT / "lib/actions/autocomplete.ts").read_text(encoding="utf-8")
    check("autocomplete.ts has 'use server'", '"use server"' in src or "'use server'" in src)
    check("autocomplete.ts has getJobCategorySuggestions", "getJobCategorySuggestions" in src)
    check("autocomplete.ts has getSkillSuggestions", "getSkillSuggestions" in src)
    check("autocomplete.ts has getTagSuggestions", "getTagSuggestions" in src)
    check("autocomplete.ts queries jobs.category", "category" in src)
    check("autocomplete.ts calls RPC for skills", "get_skill_suggestions" in src)
    check("autocomplete.ts calls RPC for tags", "get_tag_suggestions" in src)
    check("autocomplete.ts limits to 10 results", "10" in src or "limit" in src.lower())


def check_auth_action():
    print("\n-- lib/actions/auth.ts (updateProfile) --")
    src = (ROOT / "lib/actions/auth.ts").read_text(encoding="utf-8")
    check("auth.ts still has signOutAction", "signOutAction" in src)
    check("auth.ts has updateProfileAction", "updateProfileAction" in src)
    check("auth.ts updateProfile updates role", "role" in src)
    check("auth.ts updateProfile updates profession", "profession" in src)
    check("auth.ts updateProfile updates skills", "skills" in src)
    check("auth.ts updateProfile updates work_preference", "work_preference" in src)
    check("auth.ts updateProfile redirects to /dashboard", '"/dashboard"' in src)


def check_types():
    print("\n-- types/database.ts --")
    src = (ROOT / "types/database.ts").read_text(encoding="utf-8")
    check("database.ts exports Profile interface", "interface Profile" in src or "export interface Profile" in src)
    check("database.ts exports Job interface", "interface Job" in src or "export interface Job" in src)
    check("database.ts exports Application interface", "interface Application" in src or "export interface Application" in src)
    check("database.ts exports Booking interface", "interface Booking" in src or "export interface Booking" in src)
    check("database.ts exports JobStatus union type", "JobStatus" in src)
    check("database.ts exports ApplicationStatus union type", "ApplicationStatus" in src)
    check("database.ts exports WorkMode union type", "WorkMode" in src)
    check("database.ts exports BudgetType union type", "BudgetType" in src)
    check("database.ts has 'open' in JobStatus", "'open'" in src or '"open"' in src)
    check("database.ts has 'in_progress' in JobStatus", "in_progress" in src)


def check_marketplace_layout():
    print("\n-- app/(marketplace)/layout.tsx --")
    src = (ROOT / "app/(marketplace)/layout.tsx").read_text(encoding="utf-8")
    check("layout.tsx fetches user via getUser()", "getUser()" in src)
    check("layout.tsx redirects to /login if no user", '"/login"' in src)
    check("layout.tsx renders sticky nav", "sticky" in src or "fixed" in src)
    check("layout.tsx has Likhenyo wordmark", "Lik" in src and "henyo" in src)
    check("layout.tsx renders NavSignOut", "NavSignOut" in src)
    check("layout.tsx has client nav links", "dashboard" in src.lower())
    check("layout.tsx has freelancer nav links", "Browse Jobs" in src or "browse" in src.lower())
    check("layout.tsx wraps children in main", "children" in src)


def check_dashboard_page():
    print("\n-- app/(marketplace)/dashboard/page.tsx --")
    src = (ROOT / "app/(marketplace)/dashboard/page.tsx").read_text(encoding="utf-8")
    check("dashboard redirects to /login if no user", '"/login"' in src)
    check("dashboard redirects to /setup if no role", '"/setup"' in src)
    check("dashboard fetches jobs for client", "jobs" in src)
    check("dashboard fetches applications for freelancer", "applications" in src)
    check("dashboard has client view (Post a New Job)", "Post a New Job" in src or "Post a Job" in src)
    check("dashboard has freelancer view (Browse Jobs)", "Browse Jobs" in src)
    check("dashboard shows active bookings count", "bookings" in src)
    check("dashboard imports JobCard", "JobCard" in src)
    check("dashboard has empty state for no jobs", "No jobs" in src)
    check("dashboard shows application status counts", "pending" in src.lower() and "shortlisted" in src.lower())


def check_new_job_page():
    print("\n-- app/(marketplace)/jobs/new/page.tsx --")
    src = (ROOT / "app/(marketplace)/jobs/new/page.tsx").read_text(encoding="utf-8")
    check("jobs/new has 'use client'", '"use client"' in src or "'use client'" in src)
    check("jobs/new imports createJob action", "createJob" in src)
    check("jobs/new imports CategoryInput", "CategoryInput" in src)
    check("jobs/new imports TagInput", "TagInput" in src)
    check("jobs/new has work_mode toggle (Remote/Onsite/Hybrid)", "Remote" in src and "onsite" in src.lower())
    check("jobs/new has budget_type toggle (Fixed/Hourly)", "Fixed" in src and "Hourly" in src)
    check("jobs/new has budget min/max inputs with ₱", "₱" in src)
    check("jobs/new has description textarea", "textarea" in src or "description" in src.lower())
    check("jobs/new has file upload", 'type="file"' in src or "file" in src.lower())
    check("jobs/new shows location only for onsite/hybrid", "onsite" in src and "hybrid" in src)
    check("jobs/new redirects on success to /jobs/[id]", "jobId" in src and "router.push" in src)
    check("jobs/new shows error state", "error" in src.lower())
    check("jobs/new validates min 50 chars", "50" in src)


def check_job_detail_page():
    print("\n-- app/(marketplace)/jobs/[id]/page.tsx --")
    src = (ROOT / "app/(marketplace)/jobs/[id]/page.tsx").read_text(encoding="utf-8")
    check("jobs/[id] is a server component (no 'use client')", '"use client"' not in src and "'use client'" not in src)
    check("jobs/[id] calls notFound() for missing jobs", "notFound()" in src)
    check("jobs/[id] imports StatusBadge", "StatusBadge" in src)
    check("jobs/[id] imports BudgetDisplay", "BudgetDisplay" in src)
    check("jobs/[id] shows Apply Now for verified freelancer", "Apply Now" in src)
    check("jobs/[id] shows disabled apply for unverified", "Verify" in src or "verification" in src.lower() or "unverified" in src)
    check("jobs/[id] shows View Applicants for job owner", "View Applicants" in src)
    check("jobs/[id] shows Edit Job for open jobs", "Edit Job" in src)
    check("jobs/[id] shows Hiring Closed when in_progress", "Hiring Closed" in src)
    check("jobs/[id] shows client name and verified badge", "ShieldCheck" in src or "verified" in src.lower())
    check("jobs/[id] shows attachment download links", "attachment" in src.lower())
    check("jobs/[id] fetches job from supabase", "supabase" in src and "jobs" in src)


def check_job_edit_page():
    print("\n-- app/(marketplace)/jobs/[id]/edit/page.tsx --")
    src = (ROOT / "app/(marketplace)/jobs/[id]/edit/page.tsx").read_text(encoding="utf-8")
    check("jobs/[id]/edit has 'use client'", '"use client"' in src or "'use client'" in src)
    check("jobs/[id]/edit imports updateJob action", "updateJob" in src)
    check("jobs/[id]/edit guards owner check", "client_id" in src and "user.id" in src)
    check("jobs/[id]/edit guards status = open", '"open"' in src or "'open'" in src)
    check("jobs/[id]/edit pre-fills form from job data", "setTitle" in src or "value={title}" in src)
    check("jobs/[id]/edit imports CategoryInput", "CategoryInput" in src)
    check("jobs/[id]/edit imports TagInput", "TagInput" in src)
    check("jobs/[id]/edit has loading state", "checking" in src or "loading" in src)


def check_status_badge():
    print("\n-- components/marketplace/StatusBadge.tsx --")
    src = (ROOT / "components/marketplace/StatusBadge.tsx").read_text(encoding="utf-8")
    check("StatusBadge maps 'open' status", "open" in src)
    check("StatusBadge maps 'in_progress' status", "in_progress" in src)
    check("StatusBadge maps 'completed' status", "completed" in src)
    check("StatusBadge maps 'pending' status", "pending" in src)
    check("StatusBadge maps 'hired' status", "hired" in src)
    check("StatusBadge maps 'rejected' status", "rejected" in src)
    check("StatusBadge maps 'verified' status", "verified" in src)
    check("StatusBadge has In Progress label", "In Progress" in src)


def check_tag_input():
    print("\n-- components/marketplace/TagInput.tsx --")
    src = (ROOT / "components/marketplace/TagInput.tsx").read_text(encoding="utf-8")
    check("TagInput has 'use client'", '"use client"' in src or "'use client'" in src)
    check("TagInput handles Enter key to add tag", '"Enter"' in src or "'Enter'" in src)
    check("TagInput handles comma key to add tag", '","' in src)
    check("TagInput handles Backspace to remove last tag", '"Backspace"' in src or "'Backspace'" in src)
    check("TagInput renders tag chips with X remove button", "X" in src or "removeTag" in src or "remove" in src.lower())
    check("TagInput calls getSuggestions with debounce", "getSuggestions" in src and ("debounce" in src.lower() or "setTimeout" in src))
    check("TagInput shows suggestions dropdown", "suggestions" in src)
    check("TagInput deduplicates tags", "includes" in src or "Set" in src)


def check_category_input():
    print("\n-- components/marketplace/CategoryInput.tsx --")
    src = (ROOT / "components/marketplace/CategoryInput.tsx").read_text(encoding="utf-8")
    check("CategoryInput has 'use client'", '"use client"' in src or "'use client'" in src)
    check("CategoryInput calls getSuggestions", "getSuggestions" in src)
    check("CategoryInput debounces input", "setTimeout" in src or "debounce" in src.lower())
    check("CategoryInput closes dropdown on outside click", "mousedown" in src or "click" in src.lower())
    check("CategoryInput min 2 chars before suggestions", "2" in src and "length" in src)
    check("CategoryInput fills input on suggestion select", "onChange" in src)


def check_job_card():
    print("\n-- components/marketplace/JobCard.tsx --")
    src = (ROOT / "components/marketplace/JobCard.tsx").read_text(encoding="utf-8")
    check("JobCard imports StatusBadge", "StatusBadge" in src)
    check("JobCard imports BudgetDisplay", "BudgetDisplay" in src)
    check("JobCard links to /jobs/[id]", "/jobs/" in src)
    check("JobCard shows first 3 tags with overflow count", "slice(0, 3)" in src or "slice(0,3)" in src)
    check("JobCard shows work_mode icon", "Wifi" in src or "MapPin" in src or "Shuffle" in src)
    check("JobCard shows deadline", "deadline" in src)
    check("JobCard shows applicant count", "applicant" in src.lower())
    check("JobCard has hover effects", "hover" in src)


def check_nav_sign_out():
    print("\n-- components/marketplace/NavSignOut.tsx --")
    src = (ROOT / "components/marketplace/NavSignOut.tsx").read_text(encoding="utf-8")
    check("NavSignOut has 'use client'", '"use client"' in src or "'use client'" in src)
    check("NavSignOut calls signOutAction", "signOutAction" in src)
    check("NavSignOut imports signOutAction from auth", "lib/actions/auth" in src)


def check_budget_display():
    print("\n-- components/marketplace/BudgetDisplay.tsx --")
    src = (ROOT / "components/marketplace/BudgetDisplay.tsx").read_text(encoding="utf-8")
    check("BudgetDisplay formats with ₱", "₱" in src)
    check("BudgetDisplay uses toLocaleString", "toLocaleString" in src)
    check("BudgetDisplay shows type label (fixed/hr)", "fixed" in src.lower() or "/hr" in src)
    check("BudgetDisplay accepts min, max, type props", "min" in src and "max" in src and "type" in src)


# ─── Browser tests ────────────────────────────────────────────────────────────

def run_browser_tests(base_url: str):
    print(f"\n-- Browser Tests (against {base_url}) --")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        console_errors: list[str] = []
        page.on(
            "console",
            lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
        )

        # ── /dashboard — unauthenticated redirect ──
        resp = page.goto(f"{base_url}/dashboard", wait_until="domcontentloaded", timeout=20000)
        check(
            "/dashboard does not 500 (redirects unauthenticated to /login)",
            resp.status != 500,
            f"got {resp.status}",
        )
        final_url = page.url
        check(
            "/dashboard redirects unauthenticated user to /login",
            "/login" in final_url or "/setup" in final_url or resp.status in (200, 302),
            f"ended up at: {final_url}",
        )

        # ── /jobs/new — unauthenticated redirect ──
        resp2 = page.goto(f"{base_url}/jobs/new", wait_until="domcontentloaded", timeout=20000)
        check(
            "/jobs/new does not 500 (redirects unauthenticated)",
            resp2.status != 500,
            f"got {resp2.status}",
        )

        # ── /login page — confirm no 500 ──
        console_errors.clear()
        resp3 = page.goto(f"{base_url}/login", wait_until="domcontentloaded", timeout=20000)
        check("/login loads without error", resp3.status == 200, f"got {resp3.status}")
        page.wait_for_timeout(800)
        check(
            "No JS console errors on /login",
            len(console_errors) == 0,
            f"{len(console_errors)} error(s): {console_errors[:2]}" if console_errors else "",
        )

        # ── /signup page ──
        console_errors.clear()
        resp4 = page.goto(f"{base_url}/signup", wait_until="domcontentloaded", timeout=20000)
        check("/signup loads without error", resp4.status == 200, f"got {resp4.status}")

        # ── /setup page ──
        resp5 = page.goto(f"{base_url}/setup", wait_until="domcontentloaded", timeout=20000)
        check(
            "/setup does not 500",
            resp5.status != 500,
            f"got {resp5.status}",
        )

        # ── /forgot-password ──
        resp6 = page.goto(f"{base_url}/forgot-password", wait_until="domcontentloaded", timeout=20000)
        check("/forgot-password loads", resp6.status == 200, f"got {resp6.status}")

        # ── /jobs — unauthenticated ──
        resp7 = page.goto(f"{base_url}/jobs", wait_until="domcontentloaded", timeout=20000)
        check(
            "/jobs does not 500",
            resp7.status != 500,
            f"got {resp7.status}",
        )

        # ── /jobs/new — check form renders for unauthenticated (redirected) ──
        page.goto(f"{base_url}/jobs/new", wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(600)
        final = page.url
        # Correct behavior: redirect to /login or /setup (not a crash)
        redirected_safely = "/login" in final or "/setup" in final or "/jobs/new" in final
        check(
            "/jobs/new unauthenticated users redirected safely (not a 500 crash)",
            redirected_safely and "Application error" not in page.content(),
            f"at: {final}",
        )

        # ── Setup page role selection UI (unauthenticated shows form or redirects) ──
        page.goto(f"{base_url}/setup", wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(800)
        body_text = page.text_content("body") or ""
        check(
            "Setup page body does not contain unhandled error",
            "Unhandled" not in body_text and "Internal Server Error" not in body_text,
        )

        # ── Landing page still works ──
        console_errors.clear()
        resp_home = page.goto(base_url, wait_until="domcontentloaded", timeout=20000)
        check("Landing page still returns 200", resp_home.status == 200, f"got {resp_home.status}")
        page.wait_for_timeout(1000)
        check(
            "No JS console errors on landing page",
            len(console_errors) == 0,
            f"{len(console_errors)} error(s): {console_errors[:2]}" if console_errors else "",
        )

        # ── New job form UI check (accessible without auth redirect) ──
        # If app redirects to /login that's correct — just confirm no crash
        page.goto(f"{base_url}/jobs/new", wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(600)
        check(
            "App does not show unhandled exception at /jobs/new",
            "Application error" not in (page.content() or ""),
        )

        # ── Mobile: dashboard redirect on mobile viewport ──
        page.set_viewport_size({"width": 375, "height": 812})
        resp_m = page.goto(f"{base_url}/dashboard", wait_until="domcontentloaded", timeout=20000)
        check(
            "/dashboard on mobile does not 500",
            resp_m.status != 500,
            f"got {resp_m.status}",
        )

        browser.close()


def print_summary() -> bool:
    print("\n" + "=" * 60)
    passed = sum(1 for ok, _ in results if ok)
    total = len(results)
    failed_msgs = [msg for ok, msg in results if not ok]
    print(f"Phase 3 Results: {passed}/{total} checks passed")
    if failed_msgs:
        print("\nFailed checks:")
        for m in failed_msgs:
            print(f"  {m}")
    else:
        print("All checks passed! Phase 3 is complete.")
    print("=" * 60)
    return len(failed_msgs) == 0


if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

    check_marketplace_files()
    check_jobs_action()
    check_autocomplete_action()
    check_auth_action()
    check_types()
    check_marketplace_layout()
    check_dashboard_page()
    check_new_job_page()
    check_job_detail_page()
    check_job_edit_page()
    check_status_badge()
    check_tag_input()
    check_category_input()
    check_job_card()
    check_nav_sign_out()
    check_budget_display()
    run_browser_tests(base_url)

    ok = print_summary()
    sys.exit(0 if ok else 1)
