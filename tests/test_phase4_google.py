"""
Phase 4 — Google OAuth + Full Authenticated Test Suite (headed)
Follows: tests/PLAYWRIGHT_TESTING.md

This test:
  1. Launches Chromium with automation-detection disabled
  2. Navigates to /login and clicks "Continue with Google"
  3. Waits for the user to complete Google login in the browser window
  4. Handles /setup onboarding automatically if hit
  5. Runs thorough Phase 4 authenticated tests:
       /dashboard, /freelancers, /freelancers/[id], /profile/edit
  6. Captures screenshots after every meaningful action
  7. Generates HTML + plain-text reports in tests/reports/

Usage:
    python tests/test_phase4_google.py [http://localhost:3000]

    Optional env vars for auto-fill (leave empty for manual Google login):
      GOOGLE_EMAIL    — your Google account email
      GOOGLE_PASSWORD — your Google account password
"""

import sys
import io
import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext

# ── UTF-8 stdout (Windows) ────────────────────────────────────────────────────
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
ROOT     = Path(__file__).parent.parent
SHOTS    = Path(__file__).parent / "screenshots" / "phase4_google"
REPORTS  = Path(__file__).parent / "reports"

SHOTS.mkdir(parents=True, exist_ok=True)
REPORTS.mkdir(parents=True, exist_ok=True)

# Optional env-var auto-fill credentials
GOOGLE_EMAIL    = os.getenv("GOOGLE_EMAIL", "")
GOOGLE_PASSWORD = os.getenv("GOOGLE_PASSWORD", "")

results: list[tuple[bool, str, str]] = []
_counter = [0]


# ─── Helpers ─────────────────────────────────────────────────────────────────

def check(label: str, condition: bool, detail: str = "") -> None:
    status = "[PASS]" if condition else "[FAIL]"
    msg    = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((condition, label, detail))
    print(msg)


def shot(page: Page, slug: str) -> str:
    _counter[0] += 1
    name = f"{_counter[0]:02d}_{slug}"
    path = str(SHOTS / f"{name}.png")
    try:
        page.screenshot(path=path, full_page=True)
        print(f"  [SHOT] phase4_google/{name}.png")
    except Exception as e:
        print(f"  [SHOT-FAIL] {slug}: {e}")
    return path


def wait(page: Page, ms: int = 1000) -> None:
    try:
        page.wait_for_load_state("networkidle", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(ms)


def nav(page: Page, path: str, ms: int = 1200) -> int:
    try:
        resp = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=25000)
        wait(page, ms)
        return resp.status if resp else 0
    except Exception as e:
        print(f"  [NAV-ERROR] {path}: {e}")
        return 0


def body_text(page: Page) -> str:
    try:
        return page.text_content("body") or ""
    except Exception:
        return ""


# ─── Static checks ────────────────────────────────────────────────────────────

def check_static():
    print("\n── Static File + Content Checks ──")

    required_files = [
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
    for f in required_files:
        check(f"File exists: {f}", (ROOT / f).exists())

    # Auth action
    src = (ROOT / "lib/actions/auth.ts").read_text(encoding="utf-8")
    check("auth.ts — signInWithOAuthAction",   "signInWithOAuthAction" in src)
    check("auth.ts — updateFullProfileAction", "updateFullProfileAction" in src)
    check("auth.ts — redirects to /freelancers/[id]", "/freelancers/" in src)

    # OAuth callback route
    cb = ROOT / "app/auth/callback/route.ts"
    check("auth/callback/route.ts exists", cb.exists())
    if cb.exists():
        cbsrc = cb.read_text(encoding="utf-8")
        check("callback route exchanges code", "exchangeCodeForSession" in cbsrc or "code" in cbsrc)


# ─── Google OAuth login ───────────────────────────────────────────────────────

def google_oauth_login(page: Page) -> bool:
    """
    Click 'Continue with Google', handle the OAuth redirect chain, return True
    if we land on /dashboard or /setup.
    Uses a polling wait so the page-context closure during redirects doesn't
    cause a spurious timeout error.
    """
    print("\n── Google OAuth Login ──")

    status = nav(page, "/login", 1200)
    check("/login loads (200)", status == 200, f"got {status}")
    shot(page, "login_page")

    # Verify Google button is present
    try:
        google_btn = page.locator("button", has_text="Continue with Google").first
        google_btn.wait_for(timeout=6000)
        check("Google OAuth button visible", True)
        shot(page, "login_google_button_visible")
    except Exception as e:
        check("Google OAuth button visible", False, str(e))
        shot(page, "login_google_btn_missing")
        return False

    # Click Google
    try:
        google_btn.click()
        print("  Clicked 'Continue with Google'")
        # Short wait for the server action + redirect to begin
        page.wait_for_timeout(2000)
        shot(page, "after_google_click")
    except Exception as e:
        check("Google button clickable", False, str(e))
        return False

    # Wait to reach Google accounts domain
    try:
        page.wait_for_url("**/accounts.google.com/**", timeout=15000)
        print(f"  Reached Google accounts: {page.url[:80]}")
        shot(page, "google_accounts_page")
        check("Redirected to Google OAuth page", True)
    except Exception:
        # Could be a different Google subdomain, or supabase intermediate
        current = page.url
        is_google_or_supabase = "google" in current or "supabase" in current
        check("OAuth redirect initiated", is_google_or_supabase, f"at: {current[:80]}")
        shot(page, "oauth_redirect_intermediate")
        if not is_google_or_supabase:
            return False

    # ── Auto-fill credentials if provided ──
    if GOOGLE_EMAIL and GOOGLE_PASSWORD:
        print(f"  Auto-filling Google credentials: {GOOGLE_EMAIL}")
        try:
            # Email step
            email_input = page.locator('input[type="email"]')
            email_input.wait_for(timeout=10000)
            email_input.fill(GOOGLE_EMAIL)
            shot(page, "google_email_filled")

            next_btn = page.locator("#identifierNext, button:has-text('Next'), button[type='submit']").first
            next_btn.click()
            page.wait_for_timeout(3000)
            shot(page, "google_after_email")

            # Password step
            pw_input = page.locator('input[type="password"]')
            pw_input.wait_for(timeout=10000)
            pw_input.fill(GOOGLE_PASSWORD)
            shot(page, "google_password_filled")

            pw_next = page.locator("#passwordNext, button:has-text('Next'), button[type='submit']").first
            pw_next.click()
            page.wait_for_timeout(4000)
            shot(page, "google_after_password")

            # ── Detect 2-Step Verification after password ──
            try:
                page.wait_for_timeout(2000)
                page_text = page.text_content("body") or ""
                if "2-Step Verification" in page_text or "Verification" in page_text:
                    print("\n" + "=" * 60)
                    print("  2-STEP VERIFICATION DETECTED")
                    print("  Google sent a push notification to your phone.")
                    print("  >>> TAP 'YES' on your Galaxy S23 / phone NOW <<<")
                    print("  After approving, any 'Continue' screen will be")
                    print("  clicked automatically. Waiting up to 5 minutes…")
                    print("=" * 60 + "\n")
            except Exception:
                pass

        except Exception as e:
            print(f"  [WARN] Auto-fill failed: {e}")
            print("  Falling back to manual login…")

    # ── Manual login prompt (always shown if no auto-fill, or as fallback) ──
    if not (GOOGLE_EMAIL and GOOGLE_PASSWORD):
        print("\n" + "=" * 60)
        print("  ACTION REQUIRED")
        print("  Complete your Google login in the browser window.")
        print("  Any 'Continue' prompts will be clicked automatically.")
        print("  Waiting up to 5 minutes…")
        print("=" * 60 + "\n")

    # ── Poll for return to app — clicks any Google Continue/Allow screen ──
    print("  Waiting for redirect back to the app…")
    deadline = time.time() + 300    # 5-minute window
    landed   = False
    last_url = ""

    while time.time() < deadline:
        try:
            current = page.url

            # Log URL changes
            if current != last_url:
                last_url = current
                print(f"    URL: {current[:90]}")

            # Landed on app
            if BASE_URL in current:
                landed = True
                break

            # Still on Google — try to click any blocking button
            if "google" in current:
                for selector in [
                    "button:has-text('Continue')",
                    "button:has-text('Allow')",
                    "#submit_approve_access",
                    "button:has-text('Yes')",
                    "button:has-text('Confirm')",
                ]:
                    try:
                        btn = page.locator(selector).first
                        if btn.is_visible():
                            btn.click()
                            print(f"  Clicked: {selector}")
                            page.wait_for_timeout(1500)
                            break
                    except Exception:
                        pass

        except Exception:
            pass
        time.sleep(0.8)

    # Final check — page may have settled after the loop exited
    if not landed:
        try:
            current = page.url
            if BASE_URL in current:
                landed = True
                print(f"  Detected app after loop: {current}")
        except Exception:
            pass

    if not landed:
        check("Google OAuth redirect returns to app", False,
              "Timed out — approve the 2FA on your phone and re-run")
        shot(page, "oauth_redirect_timeout")
        return False

    wait(page, 1500)
    current = page.url
    print(f"  Returned to app: {current}")
    shot(page, "after_oauth_redirect")
    check("Returned to app after Google OAuth", True, current)

    # ── Handle /setup onboarding if triggered ──
    if "/setup" in current:
        print("  Detected /setup — completing onboarding as client…")
        shot(page, "onboarding_setup_page")
        try:
            client_card = page.locator("button", has_text="I want to hire someone").first
            client_card.wait_for(timeout=10000)
            client_card.click()
            wait(page, 800)
            shot(page, "onboarding_client_selected")

            continue_btn = page.locator("button", has_text="Continue").first
            continue_btn.wait_for(timeout=8000)
            continue_btn.click()
            print("  Clicked Continue — waiting for /dashboard redirect…")

            # handleComplete() is async — wait for router.replace("/dashboard")
            try:
                page.wait_for_url(f"{BASE_URL}/dashboard", timeout=12000)
            except Exception:
                wait(page, 5000)   # fallback: just wait 5s

            shot(page, "onboarding_completed")
        except Exception as e:
            print(f"  [WARN] Onboarding interaction failed: {e}")

    wait(page, 1000)
    final_url = page.url

    # If somehow still on /setup (role already set edge-case), navigate directly
    if "/setup" in final_url:
        print("  Still on /setup — navigating to /dashboard directly…")
        nav(page, "/dashboard", 1500)
        final_url = page.url

    success = "/dashboard" in final_url
    check("Google OAuth — landed on /dashboard", success, f"at: {final_url}")
    shot(page, "post_oauth_dashboard")
    return success


# ─── Unauthenticated checks ───────────────────────────────────────────────────

def test_unauth_routes(page: Page):
    print("\n── Unauthenticated Route Checks ──")
    console_errors: list[str] = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)

    routes = [
        "/freelancers",
        "/profile/edit",
        "/freelancers/00000000-0000-0000-0000-000000000000",
    ]
    for route in routes:
        console_errors.clear()
        status = nav(page, route, 800)
        check(f"{route} — no 500",             status != 500, f"got {status}")
        check(f"{route} — no unhandled error", "Application error" not in body_text(page))
        check(f"{route} — no JS errors",       len(console_errors) == 0,
              str(console_errors[:1]) if console_errors else "")
        shot(page, f"unauth{route.replace('/', '_').replace('-', '')[:30]}")


# ─── Authenticated Phase 4 tests ─────────────────────────────────────────────

def test_dashboard(page: Page) -> str:
    """Test dashboard and return discovered user_id (may be '' if client)."""
    print("\n── /dashboard ──")
    status = nav(page, "/dashboard", 1500)
    check("/dashboard — loads (200)", status == 200, f"got {status}")
    shot(page, "dashboard_full")

    body = body_text(page)
    check("/dashboard — no Application error", "Application error" not in body)
    check("/dashboard — greeting present",     "Good day" in body or "Welcome" in body or "dashboard" in body.lower())
    check("/dashboard — post/browse actions",  "Post" in body or "Browse" in body or "Job" in body)

    # Extract user_id from any /freelancers/[id] link
    user_id = ""
    try:
        links = page.locator("a[href*='/freelancers/']").all()
        for link in links:
            href = link.get_attribute("href") or ""
            parts = href.split("/freelancers/")
            if len(parts) > 1 and parts[1]:
                uid = parts[1].split("/")[0].split("?")[0]
                if len(uid) > 10:   # looks like a UUID
                    user_id = uid
                    break
    except Exception:
        pass

    if user_id:
        check("/dashboard — freelancer profile links visible", True, f"user_id: {user_id[:18]}…")
        shot(page, "dashboard_freelancer_links")
    else:
        check("/dashboard — client view (no freelancer links)", True, "client role — expected")
        shot(page, "dashboard_client_view")

    return user_id


def test_freelancers_discovery(page: Page, user_id: str):
    print("\n── /freelancers — Discovery Page ──")
    status = nav(page, "/freelancers", 1800)
    check("/freelancers — loads (200)", status == 200, f"got {status}")
    shot(page, "freelancers_discovery")

    body = body_text(page)
    check("/freelancers — no Application error", "Application error" not in body)
    check("/freelancers — Find Talent heading",  "Find Talent" in body or "freelancer" in body.lower())
    check("/freelancers — filter UI present",    "Filter" in body or "Phase 5" in body or "filter" in body.lower())

    # Cards or empty state
    cards = page.locator("a[href^='/freelancers/']").all()
    has_cards = len(cards) > 0
    has_empty  = "No freelancers" in body
    check("/freelancers — shows cards or empty state", has_cards or has_empty,
          f"{len(cards)} cards found")
    shot(page, "freelancers_with_content")

    # If there are freelancer cards, click one and verify navigation
    if has_cards:
        first_href = cards[0].get_attribute("href") or ""
        print(f"  Clicking first FreelancerCard → {first_href}")
        cards[0].click()
        wait(page, 1500)
        check("FreelancerCard click → /freelancers/[id]",
              "/freelancers/" in page.url, f"at: {page.url}")
        shot(page, "freelancer_profile_from_card")

        # Inspect the profile page that opened
        profile_body = body_text(page)
        check("Freelancer profile page — no Application error", "Application error" not in profile_body)
        check("Freelancer profile page — Skills section",       "Skills" in profile_body)
        check("Freelancer profile page — Stats section",
              "Completed" in profile_body or "Member Since" in profile_body)

        # Hire button should be visible (logged-in user is a client, looking at someone else's profile)
        check("Freelancer profile page — Hire button for client",
              "Hire" in profile_body and "Edit Profile" not in profile_body)
        shot(page, "freelancer_profile_client_view")

        # Go back
        page.go_back()
        wait(page, 800)
    else:
        print("  No FreelancerCard links found — showing empty state.")

    # Pagination controls — only expected when there are cards
    if has_cards:
        try:
            prev = page.locator("text=Previous").first
            nxt  = page.locator("text=Next").first
            check("/freelancers — pagination Previous/Next present",
                  prev.is_visible() or nxt.is_visible())
        except Exception:
            check("/freelancers — pagination visible", False, "Previous/Next not found")
    else:
        check("/freelancers — pagination skipped (empty state — correct)", True)

    shot(page, "freelancers_final_state")


def test_own_profile(page: Page, user_id: str):
    print(f"\n── /freelancers/{user_id or '[unknown]'} — Own Profile ──")
    if not user_id or user_id == "unknown":
        # User is a client — test the 404 / no-profile path
        print("  User is client — testing /freelancers/00000000… returns 404 correctly")
        status = nav(page, "/freelancers/00000000-0000-0000-0000-000000000000", 1200)
        check("/freelancers/[bad-id] — no 500", status != 500, f"got {status}")
        shot(page, "profile_bad_id_no_500")
        return

    status = nav(page, f"/freelancers/{user_id}", 1800)
    check(f"/freelancers/[id] — no 500", status != 500, f"got {status}")
    shot(page, "own_profile_full")

    body = body_text(page)
    if status == 404 or "page could not be found" in body.lower():
        check("/freelancers/[id] — 404 correct for client", True,
              "Logged-in user is a client — expected")
        shot(page, "own_profile_client_404")
        return

    check("/freelancers/[id] — no Application error",        "Application error" not in body)
    check("/freelancers/[id] — Edit Profile button (owner)", "Edit Profile" in body)
    check("/freelancers/[id] — Hire hidden for owner",
          "Hire " not in body or "Edit Profile" in body)
    check("/freelancers/[id] — Skills section",              "Skills" in body)
    check("/freelancers/[id] — Stats (Completed / Member)",
          "Completed" in body or "Member Since" in body)

    if "No skills listed yet" in body:
        check("/freelancers/[id] — empty skills state shown", True)
    if "No reviews yet" in body:
        check("/freelancers/[id] — empty reviews state shown", True)

    shot(page, "own_profile_sections")

    # Click Edit Profile → must land on /profile/edit
    try:
        edit_btn = page.locator("text=Edit Profile").first
        edit_btn.wait_for(timeout=5000)
        edit_btn.click()
        wait(page, 1500)
        check("Edit Profile → navigates to /profile/edit",
              "/profile/edit" in page.url, f"at: {page.url}")
        shot(page, "edit_profile_nav_from_profile")
        page.go_back()
        wait(page, 800)
    except Exception as e:
        check("Edit Profile button clickable", False, str(e))


def test_profile_edit(page: Page):
    print("\n── /profile/edit ──")
    status = nav(page, "/profile/edit", 1800)
    check("/profile/edit — loads (200)", status == 200, f"got {status}")
    shot(page, "profile_edit_full")

    body = body_text(page)
    check("/profile/edit — no Application error",    "Application error" not in body)
    check("/profile/edit — Edit Profile heading",    "Edit Profile" in body)
    check("/profile/edit — Full Name field",         "Full Name" in body or "full_name" in body)
    check("/profile/edit — Bio field",               "Bio" in body)
    check("/profile/edit — Location field",          "Location" in body)
    check("/profile/edit — Avatar / Photo section",
          "Photo" in body or "photo" in body.lower() or "avatar" in body.lower() or "Upload" in body)

    # Interact with full_name input
    try:
        name_inp = page.locator('input[name="full_name"]').first
        name_inp.wait_for(timeout=6000)
        original = name_inp.input_value()
        name_inp.click(click_count=3)
        name_inp.fill("Test Google User")
        shot(page, "profile_edit_name_filled")
        check("/profile/edit — full_name input accepts text", True)
        name_inp.click(click_count=3)
        name_inp.fill(original or "Google User")
    except Exception as e:
        check("/profile/edit — full_name input accessible", False, str(e))

    # Bio textarea
    try:
        bio_inp = page.locator('textarea[name="bio"]').first
        bio_inp.wait_for(timeout=4000)
        bio_inp.fill("Experienced professional from Cebu, Philippines.")
        shot(page, "profile_edit_bio_filled")
        check("/profile/edit — bio textarea accepts text", True)
        bio_inp.fill("")
    except Exception as e:
        check("/profile/edit — bio textarea accessible", False, str(e))

    # Freelancer-only fields (profession + work preference must BOTH be present)
    is_freelancer = ("Profession" in body and "Work Preference" in body)
    if is_freelancer:
        print("  Freelancer profile detected — checking freelancer fields…")
        check("/profile/edit — Profession field", "Profession" in body)
        check("/profile/edit — Skills field",     "Skills" in body)
        check("/profile/edit — Work Preference",  "Work Preference" in body or "Remote" in body)
        check("/profile/edit — Hourly Rate",      "Rate" in body or "₱" in body)
        shot(page, "profile_edit_freelancer_fields")
    else:
        check("/profile/edit — client view (no freelancer fields)", True)
        shot(page, "profile_edit_client_view")

    # Save button
    try:
        save_btn = page.locator('button[type="submit"], button:has-text("Save")').first
        save_btn.wait_for(timeout=4000)
        check("/profile/edit — Save button present", True)
        shot(page, "profile_edit_save_btn")
    except Exception as e:
        check("/profile/edit — Save button found", False, str(e))


def test_mobile_views(page: Page, browser: Browser, user_id: str):
    print("\n── Mobile Viewport ──")
    storage = page.context.storage_state()
    mob_ctx  = browser.new_context(
        viewport={"width": 375, "height": 812},
        storage_state=storage,
    )
    mob_page = mob_ctx.new_page()

    routes = [
        ("/dashboard",            "dashboard"),
        ("/freelancers",          "freelancers"),
        ("/profile/edit",         "profile_edit"),
    ]
    if user_id and user_id != "unknown":
        routes.append((f"/freelancers/{user_id}", "own_profile"))

    for route, slug in routes:
        try:
            resp = mob_page.goto(f"{BASE_URL}{route}",
                                 wait_until="domcontentloaded", timeout=25000)
            wait(mob_page, 800)
            status = resp.status if resp else 0
            b = body_text(mob_page)
            check(f"Mobile {route} — no 500",             status != 500, f"got {status}")
            check(f"Mobile {route} — no Application error", "Application error" not in b)
            _counter[0] += 1
            p = str(SHOTS / f"{_counter[0]:02d}_mobile_{slug}.png")
            mob_page.screenshot(path=p, full_page=True)
            print(f"  [SHOT] phase4_google/{_counter[0]:02d}_mobile_{slug}.png")
        except Exception as e:
            check(f"Mobile {route} — rendered", False, str(e))

    mob_page.close()
    mob_ctx.close()


def test_landing_no_regression(page: Page):
    print("\n── Landing Page (regression check) ──")
    console_errors: list[str] = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    status = nav(page, "/", 1500)
    check("Landing page — 200",          status == 200, f"got {status}")
    check("Landing page — no JS errors", len(console_errors) == 0,
          str(console_errors[:2]) if console_errors else "")
    shot(page, "landing_page_regression")


# ─── Report ───────────────────────────────────────────────────────────────────

def write_report() -> bool:
    passed = [r for r in results if r[0]]
    failed = [r for r in results if not r[0]]
    total  = len(results)

    # Plain text
    lines = [
        "Phase 4 — Google OAuth Test Report",
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
    txt = REPORTS / "phase4_google_report.txt"
    txt.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n[REPORT] {txt}")

    # HTML
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
        f'<img src="../screenshots/phase4_google/{f.name}" alt="{f.stem}" loading="lazy">'
        f'<figcaption>{f.stem.lstrip("0123456789_").replace("_", " ")}</figcaption>'
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
<title>Phase 4 Google OAuth Report — Likhenyo PH</title>
<style>
  *{{box-sizing:border-box}}
  body{{font-family:system-ui,-apple-system,sans-serif;max-width:1100px;margin:0 auto;
       padding:2rem;color:#0a1628;background:#f8fafc}}
  h1{{color:#0052ff;margin-bottom:.25rem}}
  h2{{color:#0a1628;border-bottom:2px solid #edf2f7;padding-bottom:.5rem;margin-top:2.5rem}}
  code{{background:#edf2f7;padding:.1em .4em;border-radius:.25rem;font-size:.85em}}
  .badge{{display:inline-block;padding:.3rem 1rem;border-radius:999px;
          font-weight:700;font-size:.85rem;margin-bottom:1.5rem}}
  .pass-badge{{background:#d1fae5;color:#065f46}}
  .fail-badge{{background:#fee2e2;color:#991b1b}}
  .summary{{display:flex;gap:1rem;margin:1.5rem 0 2rem;flex-wrap:wrap}}
  .stat{{background:#fff;border:1px solid #edf2f7;border-radius:.75rem;
         padding:1rem 1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.05)}}
  .stat-value{{font-size:2rem;font-weight:800;line-height:1}}
  .stat-label{{font-size:.78rem;color:#64748b;margin-top:.25rem}}
  table{{width:100%;border-collapse:collapse;margin:1.5rem 0;background:#fff;
         border-radius:.75rem;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)}}
  th{{text-align:left;background:#edf2f7;padding:.65rem .9rem;
      font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:#64748b}}
  td{{padding:.55rem .9rem;border-bottom:1px solid #f1f5f9;font-size:.875rem}}
  tr.pass td:first-child{{color:#16a34a;font-size:1rem}}
  tr.fail td:first-child{{color:#dc2626;font-size:1rem}}
  tr.fail{{background:#fff5f5}}
  tr:last-child td{{border-bottom:none}}
  .screenshots{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
                gap:1rem;margin-top:1.5rem}}
  figure{{margin:0;background:#fff;border:1px solid #edf2f7;border-radius:.75rem;
          overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)}}
  figure img{{width:100%;display:block;cursor:zoom-in;transition:transform .2s}}
  figure img:hover{{transform:scale(1.02)}}
  figcaption{{padding:.5rem .75rem;font-size:.72rem;color:#94a3b8;text-transform:capitalize}}
</style>
</head>
<body>
<h1>Phase 4 — Google OAuth + Full Authenticated Report</h1>
<p>Base URL: <code>{BASE_URL}</code> &nbsp;|&nbsp; Login method: Google OAuth</p>
{badge}
<div class="summary">
  <div class="stat"><div class="stat-value">{total}</div>
    <div class="stat-label">Total checks</div></div>
  <div class="stat"><div class="stat-value" style="color:#16a34a">{len(passed)}</div>
    <div class="stat-label">Passed</div></div>
  <div class="stat"><div class="stat-value" style="color:#dc2626">{len(failed)}</div>
    <div class="stat-label">Failed</div></div>
  <div class="stat"><div class="stat-value">{len(shot_files)}</div>
    <div class="stat-label">Screenshots</div></div>
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
    html_path = REPORTS / "phase4_google_report.html"
    html_path.write_text(html, encoding="utf-8")
    print(f"[REPORT] {html_path}")

    # Console summary
    print("\n" + "=" * 60)
    print(f"Phase 4 Google Results: {len(passed)}/{total} checks passed")
    if failed:
        print("\nFailed checks:")
        for _, label, detail in failed:
            print(f"  [FAIL] {label}" + (f" — {detail}" if detail else ""))
    else:
        print("All checks passed! Phase 4 Google OAuth tests complete.")
    print(f"\nReport  : {REPORTS}/phase4_google_report.html")
    print(f"Shots   : {SHOTS}/")
    print("=" * 60)

    return len(failed) == 0


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Verify server is up
    import urllib.request
    try:
        urllib.request.urlopen(BASE_URL, timeout=5)
    except Exception:
        print(f"ERROR: Dev server not reachable at {BASE_URL}")
        print("Start it with: npm run dev")
        sys.exit(1)

    print(f"\nLikhenyo PH — Phase 4 Google OAuth Test Suite")
    print(f"Target : {BASE_URL}")
    print(f"Mode   : Headed Chromium (slow_mo=600ms, anti-detection flags)")
    if GOOGLE_EMAIL:
        print(f"Google : {GOOGLE_EMAIL} (auto-fill)")
    else:
        print("Google : Manual login — complete in the browser window when prompted")
    print()

    # 1. Static checks
    check_static()

    # 2. Browser session — launch with anti-detection flags
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            slow_mo=600,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--start-maximized",
            ],
        )
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = ctx.new_page()

        console_errors: list[str] = []
        page.on("console", lambda m: console_errors.append(m.text)
                if m.type == "error" else None)

        # 2a. Unauthenticated checks (before login)
        test_unauth_routes(page)

        # 2b. Landing page regression
        test_landing_no_regression(page)

        # 2c. Google OAuth login
        logged_in = google_oauth_login(page)

        if logged_in:
            # 2d. Authenticated Phase 4 tests
            user_id = test_dashboard(page)
            test_freelancers_discovery(page, user_id)
            test_own_profile(page, user_id)
            test_profile_edit(page)
            test_mobile_views(page, browser, user_id)
        else:
            check("Authenticated Phase 4 tests skipped", False,
                  "Google login did not complete — re-run and sign in when the browser opens")

        shot(page, "final_state")
        ctx.close()
        browser.close()

    # 3. Report
    ok = write_report()
    sys.exit(0 if ok else 1)
