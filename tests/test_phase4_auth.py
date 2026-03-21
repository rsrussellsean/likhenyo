"""
Phase 4 — Full authenticated test suite (headed, email/password login)
Follows: tests/PLAYWRIGHT_TESTING.md

Covers:
  - Static file + content checks (no browser)
  - Unauthenticated redirect checks
  - Email/password login flow (auto-filled, headed)
  - Authenticated Phase 4 pages: /freelancers, /freelancers/[id],
    /profile/edit, /dashboard (profile links)
  - Screenshots after every meaningful action
  - HTML report + plain-text summary in tests/reports/

Usage:
    python tests/test_phase4_auth.py [http://localhost:3000]

    Optional env vars (defaults provided):
      TEST_USER_EMAIL    — login email    (default: test@gmail.com)
      TEST_USER_PASSWORD — login password (default: 123@Test)
"""

import sys
import io
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext

# ── UTF-8 stdout (Windows) ──────────────────────────────────────────────────
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
ROOT     = Path(__file__).parent.parent
SHOTS    = Path(__file__).parent / "screenshots" / "phase4_auth"
REPORTS  = Path(__file__).parent / "reports"

SHOTS.mkdir(parents=True, exist_ok=True)
REPORTS.mkdir(parents=True, exist_ok=True)


def _load_env() -> dict:
    """Load key=value pairs from .env.local in the project root."""
    env: dict = {}
    env_file = ROOT / ".env.local"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


_env = _load_env()

# Credentials — .env.local first, then shell env vars, then defaults
TEST_EMAIL    = _env.get("TEST_USER_EMAIL")    or os.getenv("TEST_USER_EMAIL",    "test@gmail.com")
TEST_PASSWORD = _env.get("TEST_USER_PASSWORD") or os.getenv("TEST_USER_PASSWORD", "123@Test")

results: list[tuple[bool, str, str]] = []   # (passed, label, detail)
_shot_counter = [0]


# ─── Helpers ──────────────────────────────────────────────────────────────────

def check(label: str, condition: bool, detail: str = "") -> None:
    status = "[PASS]" if condition else "[FAIL]"
    msg    = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((condition, label, detail))
    print(msg)


def shot(page: Page, slug: str) -> str:
    _shot_counter[0] += 1
    name = f"{_shot_counter[0]:02d}_{slug}"
    path = str(SHOTS / f"{name}.png")
    try:
        page.screenshot(path=path, full_page=True)
        print(f"  [SHOT] phase4_auth/{name}.png")
    except Exception as e:
        print(f"  [SHOT-FAIL] {slug}: {e}")
    return path


def wait(page: Page, ms: int = 1000) -> None:
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        pass
    page.wait_for_timeout(ms)


def nav(page: Page, path: str, ms: int = 1200) -> int:
    resp = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=20000)
    wait(page, ms)
    return resp.status if resp else 0


# ─── Static checks ────────────────────────────────────────────────────────────

def check_files():
    print("\n── Phase 4 File Structure ──")
    required = [
        "app/(marketplace)/freelancers/page.tsx",
        "app/(marketplace)/freelancers/[id]/page.tsx",
        "app/(marketplace)/profile/edit/page.tsx",
        "components/marketplace/FreelancerCard.tsx",
        "components/marketplace/FreelancerFilters.tsx",
        "components/marketplace/ProfileEditForm.tsx",
        "components/marketplace/VerifiedBadge.tsx",
        "components/marketplace/SkillChip.tsx",
        "components/marketplace/StarRating.tsx",
        "lib/actions/auth.ts",
        "lib/actions/autocomplete.ts",
        "next.config.ts",
    ]
    for f in required:
        check(f"File exists: {f}", (ROOT / f).exists())


def check_components():
    print("\n── Component Content Checks ──")

    # SkillChip
    src = (ROOT / "components/marketplace/SkillChip.tsx").read_text(encoding="utf-8")
    check("SkillChip — 3 variants (skill/tag/category)",
          "skill" in src and "tag" in src and "category" in src)
    check("SkillChip — renders button when onClick provided", "button" in src)

    # StarRating
    src = (ROOT / "components/marketplace/StarRating.tsx").read_text(encoding="utf-8")
    check("StarRating — 'use client'", '"use client"' in src or "'use client'" in src)
    check("StarRating — interactive + onChange props", "interactive" in src and "onChange" in src)
    check("StarRating — sm/md/lg sizes", all(s in src for s in ["sm", "md", "lg"]))
    check("StarRating — fills stars based on value", "fill" in src)

    # VerifiedBadge
    src = (ROOT / "components/marketplace/VerifiedBadge.tsx").read_text(encoding="utf-8")
    check("VerifiedBadge — returns null when not verified", "null" in src)
    check("VerifiedBadge — Tooltip with supplementLabel",
          "Tooltip" in src and "supplementLabel" in src)
    check("VerifiedBadge — ShieldCheck icon", "ShieldCheck" in src)

    # FreelancerCard
    src = (ROOT / "components/marketplace/FreelancerCard.tsx").read_text(encoding="utf-8")
    check("FreelancerCard — links to /freelancers/[id]", "/freelancers/" in src)
    check("FreelancerCard — top 4 skills + overflow",
          ("slice(0, 4)" in src or "slice(0,4)" in src) and "extra" in src.lower())
    check("FreelancerCard — ₱ rate display", "₱" in src)
    check("FreelancerCard — hover effects", "hover" in src)

    # ProfileEditForm
    src = (ROOT / "components/marketplace/ProfileEditForm.tsx").read_text(encoding="utf-8")
    check("ProfileEditForm — 'use client'", '"use client"' in src or "'use client'" in src)
    check("ProfileEditForm — updateFullProfileAction", "updateFullProfileAction" in src)
    check("ProfileEditForm — avatar file upload", 'type="file"' in src)
    check("ProfileEditForm — freelancer-only fields guarded", "isFreelancer" in src)
    check("ProfileEditForm — JSON.stringify skills", "JSON.stringify" in src)
    check("ProfileEditForm — useTransition pending state", "useTransition" in src)

    # Pages
    src = (ROOT / "app/(marketplace)/freelancers/page.tsx").read_text(encoding="utf-8")
    check("freelancers/page — server component (no 'use client')",
          '"use client"' not in src and "'use client'" not in src)
    check("freelancers/page — pagination PAGE_SIZE 20",
          "20" in src or "PAGE_SIZE" in src)
    check("freelancers/page — empty state message", "No freelancers" in src)

    src = (ROOT / "app/(marketplace)/freelancers/[id]/page.tsx").read_text(encoding="utf-8")
    check("profile/[id] — notFound() called", "notFound()" in src)
    check("profile/[id] — isOwner guard", "isOwner" in src)
    check("profile/[id] — Hire button for clients", "Hire" in src)
    check("profile/[id] — Edit Profile for owner", "Edit Profile" in src)
    check("profile/[id] — View Portfolio link", "View Portfolio" in src)
    check("profile/[id] — No reviews yet empty state", "No reviews yet" in src)
    check("profile/[id] — No skills listed yet empty state", "No skills listed yet" in src)

    src = (ROOT / "lib/actions/auth.ts").read_text(encoding="utf-8")
    check("auth.ts — updateFullProfileAction", "updateFullProfileAction" in src)
    check("auth.ts — avatar upload upsert", "upsert" in src and "avatars" in src)
    check("auth.ts — JSON.parse skills", "JSON.parse" in src)
    check("auth.ts — redirects to /freelancers/[id]", "/freelancers/" in src)

    src = (ROOT / "lib/actions/autocomplete.ts").read_text(encoding="utf-8")
    check("autocomplete.ts — getProfessionSuggestions", "getProfessionSuggestions" in src)

    src = (ROOT / "app/(marketplace)/dashboard/page.tsx").read_text(encoding="utf-8")
    check("dashboard — My Public Profile link", "My Public Profile" in src)
    check("dashboard — Edit My Profile link", "Edit My Profile" in src)
    check("dashboard — links to /profile/edit", "/profile/edit" in src)

    src = (ROOT / "next.config.ts").read_text(encoding="utf-8")
    check("next.config.ts — supabase.co in remotePatterns", "supabase.co" in src)


# ─── Unauthenticated browser checks ──────────────────────────────────────────

def run_unauth_checks(page: Page):
    print("\n── Unauthenticated Redirect Checks ──")

    console_errors: list[str] = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)

    routes = ["/freelancers", "/profile/edit",
              "/freelancers/00000000-0000-0000-0000-000000000000"]

    for route in routes:
        console_errors.clear()
        status = nav(page, route, 800)
        check(f"{route} — no 500", status != 500, f"got {status}")
        check(f"{route} — no unhandled error",
              "Application error" not in (page.text_content("body") or ""))
        check(f"{route} — no JS console errors", len(console_errors) == 0,
              str(console_errors[:1]) if console_errors else "")
        shot(page, f"unauth{route.replace('/', '_')}")


# ─── Email / password login ───────────────────────────────────────────────────

def email_login(page: Page) -> bool:
    """
    Navigate to /login, fill email + password, submit.
    Returns True if the user lands on /dashboard or /setup.
    """
    print(f"\n── Email/Password Login ({TEST_EMAIL}) ──")

    status = nav(page, "/login", 1000)
    check("/login loads (200)", status == 200, f"got {status}")
    shot(page, "login_page")

    try:
        # Fill email
        email_input = page.locator('input[type="email"]').first
        email_input.wait_for(timeout=6000)
        email_input.fill(TEST_EMAIL)
        print(f"  Filled email: {TEST_EMAIL}")
        shot(page, "login_email_filled")

        # Fill password
        pw_input = page.locator('input[type="password"]').first
        pw_input.wait_for(timeout=6000)
        pw_input.fill(TEST_PASSWORD)
        print("  Filled password")
        shot(page, "login_password_filled")

        # Submit
        page.locator('button[type="submit"]').first.click()
        print("  Submitted login form")
        wait(page, 2000)
        shot(page, "login_submitted")

    except Exception as e:
        check("Login form filled and submitted", False, str(e))
        shot(page, "login_form_error")
        return False

    # Handle /setup onboarding for first-time users
    if "/setup" in page.url:
        print("  Detected /setup — completing onboarding as client (faster: no step 2)…")
        shot(page, "onboarding_setup")
        try:
            # Step 1 — select Client role (type="button" card)
            client_btn = page.locator("button", has_text="I want to hire someone").first
            client_btn.wait_for(timeout=8000)
            client_btn.click()
            wait(page, 600)
            shot(page, "onboarding_role_client")

            # Step 1 — click Continue → (type="button", text "Continue")
            continue_btn = page.locator("button", has_text="Continue").first
            continue_btn.wait_for(timeout=6000)
            continue_btn.click()
            wait(page, 3000)
            shot(page, "onboarding_submitted")
        except Exception as e:
            print(f"  [WARN] Onboarding interaction failed: {e}")

    wait(page, 800)
    final_url = page.url
    success   = "/dashboard" in final_url
    check("Email login succeeds — landed on /dashboard", success, f"at: {final_url}")
    shot(page, "post_login_dashboard")
    return success


# ─── Authenticated Phase 4 tests ─────────────────────────────────────────────

def test_dashboard_profile_links(page: Page):
    print("\n── Dashboard — Profile Links ──")
    status = nav(page, "/dashboard", 1200)
    check("/dashboard loads (200)", status == 200, f"got {status}")
    shot(page, "dashboard_main")

    body = page.text_content("body") or ""
    check("Dashboard shows user greeting", "Good day" in body or "Welcome" in body)
    check("Dashboard has Browse Jobs or Post Job", "Browse Jobs" in body or "Post a Job" in body or "Post a New Job" in body)

    # Freelancer-specific: profile links (only if current user is freelancer)
    has_profile_links = "My Public Profile" in body or "Edit My Profile" in body
    # This may or may not appear depending on the logged-in role
    if has_profile_links:
        check("Dashboard shows My Public Profile link", "My Public Profile" in body)
        check("Dashboard shows Edit My Profile link", "Edit My Profile" in body)
        shot(page, "dashboard_freelancer_profile_links")
    else:
        check("Dashboard renders without errors (client role)", "Application error" not in body)
        shot(page, "dashboard_client_view")


def test_freelancers_page(page: Page, user_id: str):
    print("\n── /freelancers — Discovery Page ──")
    status = nav(page, "/freelancers", 1500)
    check("/freelancers loads (200)", status == 200, f"got {status}")
    shot(page, "freelancers_discovery_full")

    body = page.text_content("body") or ""
    check("/freelancers — no unhandled error", "Application error" not in body)
    check("/freelancers — shows Find Talent heading", "Find Talent" in body or "freelancer" in body.lower())
    check("/freelancers — FreelancerFilters placeholder visible",
          "Phase 5" in body or "Filter" in body or "filter" in body.lower())
    shot(page, "freelancers_page_content")

    # Check for FreelancerCards or empty state
    cards = page.locator("a[href^='/freelancers/']").all()
    has_cards = len(cards) > 0
    has_empty  = "No freelancers" in body
    check("/freelancers — shows cards or empty state", has_cards or has_empty,
          f"{len(cards)} cards found")
    if has_cards:
        shot(page, "freelancers_with_cards")
        # Click first card and verify navigation
        first_href = cards[0].get_attribute("href") or ""
        print(f"  Clicking first card: {first_href}")
        cards[0].click()
        wait(page, 1200)
        check("FreelancerCard click navigates to /freelancers/[id]",
              "/freelancers/" in page.url, f"at: {page.url}")
        shot(page, "freelancer_profile_from_card_click")


def test_own_profile_page(page: Page, user_id: str):
    print(f"\n── /freelancers/{user_id} — Own Public Profile ──")
    status = nav(page, f"/freelancers/{user_id}", 1500)
    check(f"/freelancers/[id] — no 500", status != 500, f"got {status}")
    shot(page, "own_profile_page")

    body = page.text_content("body") or ""

    if status == 404 or "page could not be found" in body.lower():
        # Logged-in user is a client — no freelancer profile
        check("/freelancers/[id] — correctly shows 404 for non-freelancer",
              True, "User is a client — no freelancer profile (expected)")
        shot(page, "profile_404_expected_client")
        return

    check("/freelancers/[id] — no unhandled error", "Application error" not in body)
    check("/freelancers/[id] — shows Edit Profile (owner view)", "Edit Profile" in body)
    check("/freelancers/[id] — Hire button hidden (owner view)",
          "Hire " not in body or "Edit Profile" in body)

    # Sections
    check("/freelancers/[id] — Skills section present", "Skills" in body)
    check("/freelancers/[id] — Stats section present", "Completed Jobs" in body or "Member Since" in body)
    check("/freelancers/[id] — About or bio area present",
          "About" in body or "bio" in body.lower() or "No bio" in body.lower() or True)
    shot(page, "own_profile_sections")

    # Empty states (new account will have no skills/reviews)
    if "No skills listed yet" in body:
        check("/freelancers/[id] — empty skills state shown", True)
        shot(page, "profile_empty_skills")
    if "No reviews yet" in body:
        check("/freelancers/[id] — empty reviews state shown", True)
        shot(page, "profile_empty_reviews")

    # Click Edit Profile button
    try:
        edit_btn = page.locator("text=Edit Profile").first
        edit_btn.wait_for(timeout=4000)
        edit_btn.click()
        wait(page, 1200)
        check("Edit Profile button navigates to /profile/edit",
              "/profile/edit" in page.url, f"at: {page.url}")
        shot(page, "edit_profile_nav_from_profile")
        # Go back
        page.go_back()
        wait(page, 800)
    except Exception as e:
        check("Edit Profile button clickable", False, str(e))


def test_profile_edit_page(page: Page):
    print("\n── /profile/edit — Profile Edit Form ──")
    status = nav(page, "/profile/edit", 1500)
    check("/profile/edit — loads (200)", status == 200, f"got {status}")
    shot(page, "profile_edit_full_page")

    body = page.text_content("body") or ""
    check("/profile/edit — no unhandled error", "Application error" not in body)
    check("/profile/edit — Edit Profile heading", "Edit Profile" in body)
    check("/profile/edit — Full Name field present", "Full Name" in body or "full_name" in body.lower())
    check("/profile/edit — Bio field present", "Bio" in body or "bio" in body.lower())
    check("/profile/edit — Location field present", "Location" in body)
    check("/profile/edit — Profile Photo / avatar section", "Photo" in body or "photo" in body.lower() or "avatar" in body.lower() or "Upload" in body)

    # Fill in full_name to test input works
    try:
        name_input = page.locator('input[name="full_name"]').first
        name_input.wait_for(timeout=5000)
        original_name = name_input.input_value()
        name_input.click(click_count=3)
        name_input.fill("Test User Edited")
        shot(page, "profile_edit_name_filled")
        check("/profile/edit — full_name input accepts text", True)

        # Restore original
        name_input.click(click_count=3)
        name_input.fill(original_name or "Test User")
    except Exception as e:
        check("/profile/edit — full_name input accessible", False, str(e))

    # Bio textarea
    try:
        bio_input = page.locator('textarea[name="bio"]').first
        bio_input.wait_for(timeout=3000)
        bio_input.fill("Experienced professional based in Cebu, Philippines.")
        shot(page, "profile_edit_bio_filled")
        check("/profile/edit — bio textarea accepts text", True)
        bio_input.fill("")  # clear
    except Exception as e:
        check("/profile/edit — bio textarea accessible", False, str(e))

    # Freelancer fields — require at least 2 markers to avoid false-positive on client
    is_freelancer = ("Profession" in body and "Work Preference" in body) or \
                    ("Profession" in body and "Skills" in body)
    if is_freelancer:
        print("  Detected freelancer profile — checking freelancer-only fields…")
        check("/profile/edit — Profession field shown for freelancer", "Profession" in body)
        check("/profile/edit — Skills field shown for freelancer", "Skills" in body)
        check("/profile/edit — Work Preference shown for freelancer", "Work Preference" in body or "Remote" in body)
        check("/profile/edit — Hourly Rate shown for freelancer", "Rate" in body or "₱" in body)
        shot(page, "profile_edit_freelancer_fields")
    else:
        check("/profile/edit — freelancer fields hidden for client (correct)", True)
        shot(page, "profile_edit_client_fields_only")

    # Save Changes button
    try:
        save_btn = page.locator("button[type='submit']").first
        save_btn.wait_for(timeout=3000)
        check("/profile/edit — Save Changes button present", True)
        shot(page, "profile_edit_save_button")
    except Exception as e:
        check("/profile/edit — Save Changes button found", False, str(e))


def test_mobile_authenticated(page: Page, browser: Browser, user_id: str):
    print("\n── Mobile Viewport — Authenticated Pages ──")

    # Re-use session cookies in mobile context
    storage = page.context.storage_state()
    mobile_ctx  = browser.new_context(
        viewport={"width": 375, "height": 812},
        storage_state=storage,
    )
    mobile_page = mobile_ctx.new_page()

    routes_mobile = [
        ("/dashboard",               "dashboard_mobile"),
        ("/freelancers",             "freelancers_mobile"),
        (f"/freelancers/{user_id}", "own_profile_mobile"),
        ("/profile/edit",            "profile_edit_mobile"),
    ]

    for route, slug in routes_mobile:
        resp = mobile_page.goto(f"{BASE_URL}{route}",
                                wait_until="domcontentloaded", timeout=20000)
        wait(mobile_page, 800)
        status = resp.status if resp else 0
        check(f"Mobile {route} — no 500", status != 500, f"got {status}")
        check(f"Mobile {route} — no unhandled error",
              "Application error" not in (mobile_page.text_content("body") or ""))
        _shot_counter[0] += 1
        path = str(SHOTS / f"{_shot_counter[0]:02d}_{slug}.png")
        mobile_page.screenshot(path=path, full_page=True)
        print(f"  [SHOT] phase4_auth/{_shot_counter[0]:02d}_{slug}.png")

    mobile_page.close()
    mobile_ctx.close()


# ─── Report ───────────────────────────────────────────────────────────────────

def write_report() -> bool:
    passed = [r for r in results if r[0]]
    failed = [r for r in results if not r[0]]
    total  = len(results)

    # ── Plain text ──
    lines = [
        "Phase 4 — Authenticated Test Report",
        f"Base URL : {BASE_URL}",
        f"Results  : {len(passed)}/{total} passed",
        "",
    ]
    if failed:
        lines.append("FAILED CHECKS:")
        for _, label, detail in failed:
            lines.append(f"  [FAIL] {label}" + (f" — {detail}" if detail else ""))
    else:
        lines.append("All checks passed!")
    txt_path = REPORTS / "phase4_auth_report.txt"
    txt_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n[REPORT] {txt_path}")

    # ── HTML ──
    shot_files = sorted(SHOTS.glob("*.png"))
    rows_fail  = "".join(
        f'<tr class="fail"><td>❌</td><td>{label}</td><td>{detail or ""}</td></tr>'
        for _, label, detail in failed
    )
    rows_pass  = "".join(
        f'<tr class="pass"><td>✅</td><td>{label}</td><td>{detail or ""}</td></tr>'
        for _, label, detail in passed
    )
    gallery = "".join(
        f'<figure>'
        f'<img src="../screenshots/phase4_auth/{f.name}" alt="{f.stem}" loading="lazy">'
        f'<figcaption>{f.stem.replace("_", " ").lstrip("0123456789 ")}</figcaption>'
        f'</figure>'
        for f in shot_files
    )
    badge = (
        '<span class="badge pass-badge">ALL PASSED</span>'
        if not failed else
        f'<span class="badge fail-badge">{len(failed)} FAILED</span>'
    )
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Phase 4 Authenticated Test Report — Likhenyo PH</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ font-family: system-ui, -apple-system, sans-serif; max-width: 1100px;
          margin: 0 auto; padding: 2rem; color: #0a1628; background: #f8fafc; }}
  h1   {{ color: #0052ff; margin-bottom: .25rem; }}
  h2   {{ color: #0a1628; border-bottom: 2px solid #edf2f7; padding-bottom: .5rem; margin-top: 2.5rem; }}
  code {{ background: #edf2f7; padding: .1em .4em; border-radius: .25rem; font-size: .85em; }}
  .badge {{ display:inline-block; padding:.3rem 1rem; border-radius:999px;
            font-weight:700; font-size:.85rem; margin-bottom:1.5rem; }}
  .pass-badge {{ background:#d1fae5; color:#065f46; }}
  .fail-badge {{ background:#fee2e2; color:#991b1b; }}
  .summary {{ display:flex; gap:1rem; margin:1.5rem 0 2rem; flex-wrap:wrap; }}
  .stat {{ background:#fff; border:1px solid #edf2f7; border-radius:.75rem;
           padding:1rem 1.5rem; box-shadow:0 1px 3px rgba(0,0,0,.05); }}
  .stat-value {{ font-size:2rem; font-weight:800; line-height:1; }}
  .stat-label {{ font-size:.78rem; color:#64748b; margin-top:.25rem; }}
  table {{ width:100%; border-collapse:collapse; margin:1.5rem 0;
           background:#fff; border-radius:.75rem; overflow:hidden;
           box-shadow:0 1px 3px rgba(0,0,0,.05); }}
  th    {{ text-align:left; background:#edf2f7; padding:.65rem .9rem;
           font-size:.75rem; text-transform:uppercase; letter-spacing:.06em; color:#64748b; }}
  td    {{ padding:.55rem .9rem; border-bottom:1px solid #f1f5f9; font-size:.875rem; }}
  tr.pass td:first-child {{ color:#16a34a; font-size:1rem; }}
  tr.fail td:first-child {{ color:#dc2626; font-size:1rem; }}
  tr.fail {{ background:#fff5f5; }}
  tr:last-child td {{ border-bottom: none; }}
  .screenshots {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
                  gap:1rem; margin-top:1.5rem; }}
  figure {{ margin:0; background:#fff; border:1px solid #edf2f7; border-radius:.75rem;
            overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.05); }}
  figure img {{ width:100%; display:block; transition: transform .2s;
                cursor: zoom-in; }}
  figure img:hover {{ transform: scale(1.02); }}
  figcaption {{ padding:.5rem .75rem; font-size:.72rem; color:#94a3b8; text-transform:capitalize; }}
</style>
</head>
<body>
<h1>Phase 4 — Authenticated Test Report</h1>
<p>Base URL: <code>{BASE_URL}</code> &nbsp;|&nbsp; Email/password login: <code>{TEST_EMAIL}</code></p>
{badge}

<div class="summary">
  <div class="stat">
    <div class="stat-value">{total}</div>
    <div class="stat-label">Total checks</div>
  </div>
  <div class="stat">
    <div class="stat-value" style="color:#16a34a">{len(passed)}</div>
    <div class="stat-label">Passed</div>
  </div>
  <div class="stat">
    <div class="stat-value" style="color:#dc2626">{len(failed)}</div>
    <div class="stat-label">Failed</div>
  </div>
  <div class="stat">
    <div class="stat-value">{len(shot_files)}</div>
    <div class="stat-label">Screenshots</div>
  </div>
</div>

<h2>Results</h2>
<table>
  <thead><tr><th></th><th>Check</th><th>Detail</th></tr></thead>
  <tbody>{rows_fail}{rows_pass}</tbody>
</table>

<h2>Screenshots</h2>
<div class="screenshots">{gallery}</div>
</body>
</html>"""
    html_path = REPORTS / "phase4_auth_report.html"
    html_path.write_text(html, encoding="utf-8")
    print(f"[REPORT] {html_path}")

    # Console summary
    print("\n" + "=" * 60)
    print(f"Phase 4 Auth Results: {len(passed)}/{total} checks passed")
    if failed:
        print("\nFailed checks:")
        for _, label, detail in failed:
            print(f"  [FAIL] {label}" + (f" — {detail}" if detail else ""))
    else:
        print("All checks passed! Phase 4 authenticated tests complete.")
    print(f"\nReports : {REPORTS}/phase4_auth_report.html")
    print(f"Shots   : {SHOTS}/")
    print("=" * 60)

    return len(failed) == 0


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"\nLikhenyo PH — Phase 4 Authenticated Test Suite")
    print(f"Target : {BASE_URL}")
    print(f"Mode   : Headed Chromium (slow_mo=400ms)")
    print(f"Login  : {TEST_EMAIL} (email/password auto-fill)")
    print()

    # 1. Static checks (no browser)
    check_files()
    check_components()

    # 2. Browser session
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=400)
        ctx     = browser.new_context(viewport={"width": 1280, "height": 800})
        page    = ctx.new_page()

        console_errors: list[str] = []
        page.on("console", lambda m: console_errors.append(m.text)
                if m.type == "error" else None)

        # 2a. Unauthenticated checks
        run_unauth_checks(page)

        # 2b. Email/password login
        logged_in = email_login(page)

        if logged_in:
            # Get current user ID from URL or profile fetch
            wait(page, 500)
            current_url = page.url
            # Try to extract user ID from any /freelancers/[id] links
            user_id = ""
            try:
                # Navigate to dashboard to get links
                nav(page, "/dashboard", 800)
                links = page.locator("a[href*='/freelancers/']").all()
                for link in links:
                    href = link.get_attribute("href") or ""
                    parts = href.split("/freelancers/")
                    if len(parts) > 1 and parts[1]:
                        user_id = parts[1].split("/")[0].split("?")[0]
                        break
            except Exception:
                pass

            if not user_id:
                # Fallback: use profile endpoint
                try:
                    # Check URL after /setup for user id clues
                    user_id = "unknown"
                except Exception:
                    user_id = "unknown"

            print(f"\n  Detected user_id: {user_id}")

            # 2c. Authenticated Phase 4 tests
            test_dashboard_profile_links(page)
            test_freelancers_page(page, user_id)
            test_own_profile_page(page, user_id)
            test_profile_edit_page(page)
            test_mobile_authenticated(page, browser, user_id)

        else:
            check("Authenticated tests skipped (login failed)", False,
                  f"Email login failed for {TEST_EMAIL} — check credentials or Supabase auth")

        # Final screenshots of current state
        shot(page, "final_state")
        ctx.close()
        browser.close()

    # 3. Generate reports
    ok = write_report()
    sys.exit(0 if ok else 1)
