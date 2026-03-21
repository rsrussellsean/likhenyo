# Likhenyo PH — Playwright Test Prompt

Use this document as the authoritative prompt whenever running or writing
Playwright tests for this project. Follow every section exactly.

---

## 1. Role & Objective

You are a QA automation engineer running Playwright tests against the
Likhenyo PH Next.js application. Your job is to:

1. Run **static file + content checks** (no browser needed) for every
   phase under test.
2. Run **headed browser automation** so the developer can watch the
   tests execute in real time (`headless=False`, `slow_mo=400`).
3. Capture a **screenshot after every meaningful action** — both pass
   and fail scenarios.
4. Produce a **self-contained HTML report** + a **plain-text summary**
   at the end of every run.
5. Cover **only the phases explicitly requested** — never add checks
   from future phases or unrelated pages.

---

## 2. Project Conventions

| Item | Value |
|------|-------|
| Base URL (default) | `http://localhost:3000` |
| Dev server command | `npm run dev` (from project root) |
| Screenshots root | `tests/screenshots/phase<N>/` |
| Reports root | `tests/reports/` |
| Test scripts | `tests/test_phase<N>.py` |
| Python interpreter | `python` |
| Playwright package | `playwright` (sync API) |
| Browser | Chromium only |
| Viewport (desktop) | 1280 × 800 |
| Viewport (mobile) | 375 × 812 |

Always encode stdout as UTF-8 on Windows:
```python
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
```

---

## 3. Test Script Structure

Every phase test file must follow this exact skeleton:

```python
"""
Phase <N> — Automated test suite (headed mode)

Usage:
    python tests/test_phase<N>.py [http://localhost:3000]

Requires:
    pip install playwright
    playwright install chromium
"""

import sys, io, json
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
ROOT     = Path(__file__).parent.parent
SHOTS    = Path(__file__).parent / "screenshots" / "phase<N>"
REPORTS  = Path(__file__).parent / "reports"
SHOTS.mkdir(parents=True, exist_ok=True)
REPORTS.mkdir(parents=True, exist_ok=True)

results: list[tuple[bool, str, str]] = []   # (passed, label, detail)


def check(label: str, condition: bool, detail: str = "") -> None:
    status = "[PASS]" if condition else "[FAIL]"
    msg    = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((condition, label, detail))
    print(msg)


def shot(page: Page, name: str) -> str:
    path = str(SHOTS / f"{name}.png")
    page.screenshot(path=path, full_page=True)
    print(f"  [SHOT] phase<N>/{name}.png")
    return path


def wait(page: Page, ms: int = 1000) -> None:
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(ms)


# ── Static checks (one function per file) ──────────────────────────────────────
def check_<component>():
    print("\n── <component> ──")
    src = (ROOT / "path/to/file.tsx").read_text(encoding="utf-8")
    check("Has 'use server'", '"use server"' in src)
    # … more checks …


# ── Browser tests ──────────────────────────────────────────────────────────────
def run_browser_tests(base_url: str):
    print(f"\n── Browser Tests (headed) against {base_url} ──")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=400)
        ctx     = browser.new_context(viewport={"width": 1280, "height": 800})
        page    = ctx.new_page()

        console_errors: list[str] = []
        page.on("console", lambda m: console_errors.append(m.text)
                if m.type == "error" else None)

        # … test cases …

        browser.close()


# ── Report + summary ───────────────────────────────────────────────────────────
def write_report() -> bool:
    passed = [r for r in results if r[0]]
    failed = [r for r in results if not r[0]]
    total  = len(results)

    # Plain text summary
    summary_lines = [
        f"Phase <N> Test Report",
        f"Run against: {BASE_URL}",
        f"Results: {len(passed)}/{total} passed",
        "",
    ]
    if failed:
        summary_lines.append("FAILED CHECKS:")
        for _, label, detail in failed:
            summary_lines.append(f"  [FAIL] {label}" + (f" — {detail}" if detail else ""))
    else:
        summary_lines.append("All checks passed!")

    txt_path = REPORTS / "phase<N>_report.txt"
    txt_path.write_text("\n".join(summary_lines), encoding="utf-8")
    print(f"\n[REPORT] {txt_path}")

    # HTML report
    _write_html_report(passed, failed, total)

    # Console summary
    print("\n" + "=" * 60)
    print(f"Phase <N> Results: {len(passed)}/{total} checks passed")
    if failed:
        print("\nFailed checks:")
        for _, label, detail in failed:
            print(f"  [FAIL] {label}" + (f" — {detail}" if detail else ""))
    else:
        print("All checks passed! Phase <N> is complete.")
    print("=" * 60)

    return len(failed) == 0


def _write_html_report(passed, failed, total):
    shot_files = sorted(SHOTS.glob("*.png"))
    rows_pass  = "".join(
        f'<tr class="pass"><td>✅</td><td>{label}</td><td>{detail}</td></tr>'
        for _, label, detail in passed
    )
    rows_fail  = "".join(
        f'<tr class="fail"><td>❌</td><td>{label}</td><td>{detail}</td></tr>'
        for _, label, detail in failed
    )
    screenshots = "".join(
        f'<figure>'
        f'<img src="../screenshots/phase<N>/{f.name}" alt="{f.stem}" loading="lazy">'
        f'<figcaption>{f.stem.replace("_", " ")}</figcaption>'
        f'</figure>'
        for f in shot_files
    )
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Phase &lt;N&gt; Test Report</title>
<style>
  body {{ font-family: system-ui, sans-serif; max-width: 1100px; margin: 0 auto; padding: 2rem; color: #0a1628; }}
  h1   {{ color: #0052ff; }}
  .badge {{ display:inline-block; padding:.25rem .75rem; border-radius:999px; font-weight:700; font-size:.85rem; }}
  .pass-badge {{ background:#d1fae5; color:#065f46; }}
  .fail-badge {{ background:#fee2e2; color:#991b1b; }}
  table {{ width:100%; border-collapse:collapse; margin:1.5rem 0; }}
  th    {{ text-align:left; background:#edf2f7; padding:.6rem .75rem; font-size:.8rem; text-transform:uppercase; letter-spacing:.05em; }}
  td    {{ padding:.55rem .75rem; border-bottom:1px solid #edf2f7; font-size:.9rem; }}
  tr.pass td:first-child {{ color:#16a34a; }}
  tr.fail td:first-child {{ color:#dc2626; }}
  tr.fail {{ background:#fff5f5; }}
  .screenshots {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem; margin-top:1.5rem; }}
  figure {{ margin:0; background:#f8fafc; border:1px solid #edf2f7; border-radius:.75rem; overflow:hidden; }}
  figure img {{ width:100%; display:block; }}
  figcaption {{ padding:.5rem .75rem; font-size:.75rem; color:#64748b; }}
  .summary {{ display:flex; gap:1rem; margin:1rem 0 2rem; flex-wrap:wrap; }}
  .stat {{ background:#f8fafc; border:1px solid #edf2f7; border-radius:.75rem; padding:1rem 1.5rem; }}
  .stat-value {{ font-size:2rem; font-weight:800; color:#0052ff; line-height:1; }}
  .stat-label {{ font-size:.8rem; color:#64748b; margin-top:.25rem; }}
</style>
</head>
<body>
<h1>Phase &lt;N&gt; — Test Report</h1>
<p>Base URL: <code>{BASE_URL}</code></p>
<div class="summary">
  <div class="stat"><div class="stat-value">{total}</div><div class="stat-label">Total checks</div></div>
  <div class="stat"><div class="stat-value" style="color:#16a34a">{len(passed)}</div><div class="stat-label">Passed</div></div>
  <div class="stat"><div class="stat-value" style="color:#dc2626">{len(failed)}</div><div class="stat-label">Failed</div></div>
</div>
{'<span class="badge pass-badge">ALL PASSED</span>' if not failed else '<span class="badge fail-badge">FAILURES DETECTED</span>'}

<h2>Results</h2>
<table>
  <thead><tr><th></th><th>Check</th><th>Detail</th></tr></thead>
  <tbody>{rows_fail}{rows_pass}</tbody>
</table>

<h2>Screenshots</h2>
<div class="screenshots">{screenshots}</div>
</body>
</html>"""
    html_path = REPORTS / "phase<N>_report.html"
    html_path.write_text(html, encoding="utf-8")
    print(f"[REPORT] {html_path}")


if __name__ == "__main__":
    # 1. Static checks
    check_<component>()
    # … more static check functions …

    # 2. Browser tests
    run_browser_tests(BASE_URL)

    # 3. Report
    ok = write_report()
    sys.exit(0 if ok else 1)
```

---

## 4. Screenshot Rules

### Naming convention
```
tests/screenshots/phase<N>/<NN>_<slug>.png
```

- `NN` — two-digit sequence number (01, 02, … 99)
- `slug` — snake_case description of the action or state being captured

### What to screenshot

| Scenario | Required? |
|----------|-----------|
| Every page load (pass or fail) | Yes |
| After form fill (before submit) | Yes |
| After form submit (success state) | Yes |
| After form submit (error state) | Yes |
| After each navigation step | Yes |
| Mobile viewport equivalents | Yes (for key pages) |
| Empty state renders | Yes |
| Auth redirect destinations | Yes |

### Full-page screenshots
Always use `full_page=True` so the entire scrollable content is captured:
```python
page.screenshot(path=str(SHOTS / "01_page.png"), full_page=True)
```

### Mobile screenshots
```python
mobile_ctx  = browser.new_context(viewport={"width": 375, "height": 812})
mobile_page = mobile_ctx.new_page()
# … navigate and test …
mobile_page.screenshot(path=str(SHOTS / "02_page_mobile.png"), full_page=True)
mobile_page.close()
mobile_ctx.close()
```

---

## 5. Report Rules

Every test run must produce **two report files** in `tests/reports/`:

| File | Contents |
|------|----------|
| `phase<N>_report.txt` | Plain-text summary — pass count, fail list |
| `phase<N>_report.html` | Self-contained HTML — results table + embedded screenshot gallery |

The HTML report must:
- Include every check result (pass shown in green, fail in red)
- Show failed checks first in the table
- Embed a screenshot gallery linking to `tests/screenshots/phase<N>/`
- Be openable directly in a browser with no server

---

## 6. Browser Test Rules

### Always headed with slow_mo
```python
browser = p.chromium.launch(headless=False, slow_mo=400)
```

`slow_mo=400` (milliseconds) gives the developer time to follow each action.

### Always wait for networkidle
```python
page.wait_for_load_state("networkidle")
page.wait_for_timeout(800)    # extra buffer for JS hydration
```

### Always capture console errors
```python
console_errors: list[str] = []
page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
# … navigate …
check("No JS console errors", len(console_errors) == 0,
      str(console_errors[:2]) if console_errors else "")
console_errors.clear()   # reset between pages
```

### Never assert pixel positions
Check text content, URLs, and status codes — not CSS coordinates.

### Fail gracefully
Wrap interaction sequences in `try/except` so one broken element does not
abort the entire run:
```python
try:
    page.locator('input[name="email"]').fill("user@test.com")
    shot(page, "05_form_filled")
    check("Email input accepts text", True)
except Exception as e:
    check("Email input interaction", False, str(e))
    shot(page, "05_form_error")
```

---

## 7. Phase Coverage Map

Only test the phases explicitly requested. Do not add checks from
phases not yet implemented.

### Phase 0 — Project Setup
- `package.json` exists with Next.js, Supabase, Tailwind, Shadcn
- `.env.local` contains required Supabase keys
- `next.config.ts` is valid
- `app/layout.tsx` exists
- Dev server starts without errors (GET / returns 200)

### Phase 1 — Landing Page + Auth
- `app/page.tsx` — landing page renders (200, no JS errors)
- `app/(auth)/login/page.tsx` — login form renders
- `app/(auth)/signup/page.tsx` — signup form renders
- `app/(auth)/forgot-password/page.tsx` — reset form renders
- `app/auth/callback/route.ts` — exists
- `lib/actions/auth.ts` — has `signInWithOAuthAction`, `signUpWithEmailAction`,
  `signInWithEmailAction`, `forgotPasswordAction`, `signOutAction`
- Browser: /login renders Google + Facebook OAuth buttons
- Browser: /login form submits and shows error for wrong credentials
- Browser: /signup form accepts input

### Phase 2 — Database Schema + RLS
- Supabase migration files exist (check `supabase/migrations/`)
- `types/database.ts` — all interfaces and union types exported
- All tables exist in Supabase (`profiles`, `jobs`, `applications`,
  `bookings`, `messages`, `verifications`, `payments`, `submissions`,
  `reviews`)
- Full-text search indexes exist on `jobs.title`, `jobs.description`
- GIN indexes exist on `jobs.tags`, `profiles.skills`
- RLS is enabled on every table

### Phase 3 — Job Posting System
- `app/(marketplace)/layout.tsx` — auth guard, sticky nav, Likhenyo wordmark
- `app/(marketplace)/dashboard/page.tsx` — client + freelancer views
- `app/(marketplace)/jobs/new/page.tsx` — full job form (client component)
- `app/(marketplace)/jobs/[id]/page.tsx` — job detail (server component)
- `app/(marketplace)/jobs/[id]/edit/page.tsx` — edit form (client component)
- `components/marketplace/JobCard.tsx` — status, budget, tags, deadline
- `components/marketplace/StatusBadge.tsx` — all status labels
- `components/marketplace/BudgetDisplay.tsx` — ₱ formatting
- `components/marketplace/TagInput.tsx` — Enter/comma/Backspace handling
- `components/marketplace/CategoryInput.tsx` — debounced autocomplete
- `components/marketplace/NavSignOut.tsx` — calls signOutAction
- `lib/actions/jobs.ts` — createJob, updateJob, attachment upload
- `lib/actions/autocomplete.ts` — category, skill, tag suggestions
- Browser: /dashboard redirects unauthenticated → /login
- Browser: /jobs/new redirects unauthenticated → /login
- Browser: /login, /signup, /forgot-password return 200, no JS errors
- Browser: landing page returns 200, no JS errors

### Phase 4 — Freelancer Profile System
- `app/(marketplace)/freelancers/page.tsx` — discovery grid, pagination
- `app/(marketplace)/freelancers/[id]/page.tsx` — public profile page
- `app/(marketplace)/profile/edit/page.tsx` — edit page (server wrapper)
- `components/marketplace/FreelancerCard.tsx` — avatar, skills, rate, rating
- `components/marketplace/FreelancerFilters.tsx` — placeholder
- `components/marketplace/ProfileEditForm.tsx` — avatar upload, freelancer fields
- `components/marketplace/VerifiedBadge.tsx` — Tooltip, supplement label
- `components/marketplace/SkillChip.tsx` — 3 variants, onClick
- `components/marketplace/StarRating.tsx` — display + interactive modes
- `lib/actions/auth.ts` — `updateFullProfileAction` (FormData, avatar upload)
- `lib/actions/autocomplete.ts` — `getProfessionSuggestions`
- `next.config.ts` — Supabase Storage hostname in `remotePatterns`
- Browser: /freelancers redirects unauthenticated → /login
- Browser: /profile/edit redirects unauthenticated → /login
- Browser: /freelancers/[bad-id] does not 500
- Browser: all routes free of "Application error" text

### Phase 5 — Job Search + Filter System
- `app/(marketplace)/jobs/page.tsx` — server component with URL filter params
- `components/marketplace/JobFilters.tsx` — full filter UI (client component)
- Filters: keyword, category, tags, work_mode, location, budget_type,
  budget range, posted_within, sort
- URL params update on filter change (no full page reload)
- Supabase query uses `to_tsvector` / `to_tsquery` for keyword search
- Tag filter uses `&&` overlap operator
- `lib/actions/autocomplete.ts` — category + tag suggestions used in filters
- Browser: /jobs loads, shows filter UI
- Browser: filter changes update URL search params
- Browser: empty filter state shows all jobs

### Phase 6 — Application System
- `app/(marketplace)/jobs/[id]/apply/page.tsx` — application form
- `lib/actions/applications.ts` — `applyToJob`, `withdrawApplication`
- `components/marketplace/ApplicationCard.tsx`
- Unverified freelancers: apply button disabled, verification warning shown
- Duplicate application: blocked by UNIQUE constraint (error shown)
- Browser: apply form submits proposal, redirects to job page

### Phase 7 — Hiring System
- `lib/actions/hire.ts` — `hireFreelancerAction` calls Supabase RPC
- Supabase RPC `hire_freelancer(job_id, application_id)` exists
- RPC atomically: sets selected application → hired, others → rejected,
  job → in_progress, creates booking row
- `app/(marketplace)/jobs/[id]/applicants/page.tsx`
- Browser: hire button triggers RPC, shows booking confirmation

### Phase 8 — Booking + Agreement System
- `app/(marketplace)/bookings/[id]/page.tsx`
- `lib/actions/bookings.ts` — `setAgreement`, `completeBooking`
- Agreed price and timeline lock after confirmation
- Browser: booking page shows agreed price, timeline, status

### Phase 9 — Verification + Trust System
- `app/(marketplace)/verify/page.tsx` — ID upload form
- `lib/actions/verifications.ts` — `submitVerification`
- Supabase Storage bucket `verifications` exists with correct RLS
- Admin review page (if implemented)
- Browser: /verify form accepts ID upload, shows pending state

### Phase 10 — In-App Chat
- `app/(marketplace)/bookings/[id]/chat/page.tsx`
- Chat only accessible after booking exists
- Non-dismissible safety banner present in chat UI
- Phone number / email warning in chat input
- `lib/actions/messages.ts` — `sendMessage`
- Browser: chat page renders, message input present, safety banner visible

### Phase 11 — Downpayment Tracking
- `app/(marketplace)/bookings/[id]/payment/page.tsx`
- `lib/actions/payments.ts` — `logPayment`, `confirmPayment`
- Payment methods: gcash, qr_ph, bank_transfer, cash
- Proof upload to Supabase Storage
- Browser: payment log form submits, status updates

### Phase 12 — Work Submission + Reviews
- `app/(marketplace)/bookings/[id]/submit/page.tsx`
- `app/(marketplace)/bookings/[id]/review/page.tsx`
- `lib/actions/reviews.ts` — `leaveReview`
- `StarRating` in interactive mode used in review form
- UNIQUE constraint on (booking_id, reviewer_id)
- Profile rating recalculated after review submitted
- Browser: submit form uploads files, review form submits stars + comment

---

## 8. What NOT to Test

- Do not test Supabase internal auth endpoints directly
- Do not test OAuth provider flows (Google, Facebook) — they require
  live credentials and are not automatable in CI
- Do not test admin-only pages unless the phase explicitly builds them
- Do not test phases not yet implemented
- Do not test payment processing (there is no payment gateway in MVP)
- Do not hardcode test user credentials in test files — use environment
  variables (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`) if auth is needed

---

## 9. Running Tests

### Prerequisites
```bash
# Ensure dev server is running
npm run dev

# In a second terminal, run the phase test
python tests/test_phase<N>.py http://localhost:3000
```

### Verify server is up before running
```python
import urllib.request
try:
    urllib.request.urlopen(base_url, timeout=5)
except Exception:
    print("ERROR: Dev server is not running. Start with: npm run dev")
    sys.exit(1)
```

### Environment variables for authenticated tests
```bash
# .env.test (never commit this file)
TEST_USER_EMAIL=test@gmail.com
TEST_USER_PASSWORD=123@Test
TEST_FREELANCER_EMAIL=freelancer@example.com
TEST_FREELANCER_PASSWORD=TestPassword123!
```

```python
import os
TEST_EMAIL = os.getenv("TEST_USER_EMAIL", "test@gmail.com")
TEST_PASS  = os.getenv("TEST_USER_PASSWORD", "123@Test")
```

### Default test credentials (email/password login)
| Field    | Value            |
|----------|------------------|
| Email    | `test@gmail.com` |
| Password | `123@Test`       |

These credentials are used for all email/password authenticated test flows.
Always fill `input[type="email"]` with the email and `input[type="password"]`
with the password, then click `button[type="submit"]`.

---

## 10. Authenticated Test Flow

When a phase requires testing pages that need a logged-in user, use
this pattern:

```python
def login(page: Page, email: str, password: str, base_url: str) -> bool:
    """Returns True if login succeeded."""
    page.goto(f"{base_url}/login", wait_until="domcontentloaded")
    wait(page, 600)
    try:
        page.locator('input[type="email"]').fill(email)
        page.locator('input[type="password"]').fill(password)
        page.locator('button[type="submit"]').click()
        wait(page, 1500)
        return "/dashboard" in page.url or "/setup" in page.url
    except Exception:
        return False


def test_authenticated_pages(base_url: str):
    email = os.getenv("TEST_USER_EMAIL", "")
    pw    = os.getenv("TEST_USER_PASSWORD", "")
    if not email or not pw:
        print("  [SKIP] No TEST_USER_EMAIL / TEST_USER_PASSWORD set")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=400)
        ctx     = browser.new_context(viewport={"width": 1280, "height": 800})
        page    = ctx.new_page()

        logged_in = login(page, email, pw, base_url)
        check("Login succeeds with test credentials", logged_in,
              f"ended at {page.url}")
        shot(page, "auth_dashboard")

        if logged_in:
            # … run authenticated test cases …
            pass

        browser.close()
```

---

## 11. Output Checklist

After every test run, confirm these outputs exist:

- [ ] `tests/screenshots/phase<N>/` — at minimum one screenshot per
  browser test case
- [ ] `tests/reports/phase<N>_report.txt` — plain-text pass/fail summary
- [ ] `tests/reports/phase<N>_report.html` — HTML report with screenshot
  gallery, openable in browser
- [ ] Console output ends with `Phase <N> Results: X/X checks passed`
- [ ] Exit code 0 if all pass, exit code 1 if any fail
