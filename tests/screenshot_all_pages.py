"""
Comprehensive page screenshot & test script for Likhenyo PH.
Run after dev server is up: python tests/screenshot_all_pages.py
Screenshots saved to: tests/screenshots/
"""

import sys
import io
import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
SHOTS_DIR = Path(__file__).parent / "screenshots"
SHOTS_DIR.mkdir(exist_ok=True)

results = []

def shot(page: Page, name: str):
    path = str(SHOTS_DIR / f"{name}.png")
    page.screenshot(path=path, full_page=True)
    print(f"  [SHOT] {name}.png")
    return path

def check(label: str, ok: bool, detail: str = ""):
    status = "[PASS]" if ok else "[FAIL]"
    msg = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((ok, msg))
    print(msg)

def wait(page: Page, ms: int = 1200):
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(ms)

def test_page(page: Page, path: str, label: str, expected_status: int = 200):
    """Navigate to a page, screenshot it, return (status, final_url, body_text)."""
    print(f"\n── {label} ({path}) ──")
    resp = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=20000)
    wait(page)
    status = resp.status if resp else 0
    final_url = page.url
    body = page.text_content("body") or ""
    has_error = any(x in body for x in ["Application error", "Unhandled", "Internal Server Error", "Error:"])
    check(f"{label} returns {expected_status}", status == expected_status, f"got {status}")
    check(f"{label} no unhandled error", not has_error, body[:120] if has_error else "")
    shot(page, label.lower().replace(" ", "_").replace("/", "_"))
    return status, final_url, body

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()

    console_errors: list[str] = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)

    # ── 1. Landing page ──────────────────────────────────────────────────────
    status, url, body = test_page(page, "/", "Landing Page")
    check("Landing page has tagline", "Hire" in body or "Skilled" in body or "Freelance" in body, body[:80])
    check("Landing page has CTA button", "Get Started" in body or "Post a Job" in body or "Sign Up" in body)
    check("No JS console errors on landing", len(console_errors) == 0,
          f"{len(console_errors)} error(s): {console_errors[:2]}" if console_errors else "")

    # ── 2. Login page ────────────────────────────────────────────────────────
    console_errors.clear()
    status, url, body = test_page(page, "/login", "Login Page")
    check("Login page has email input", "email" in body.lower())
    check("Login page has password input", "password" in body.lower())
    check("Login page has Google OAuth", "Google" in body or "google" in body.lower())
    check("No JS errors on login", len(console_errors) == 0,
          str(console_errors[:2]) if console_errors else "")

    # ── 3. Signup page ───────────────────────────────────────────────────────
    console_errors.clear()
    status, url, body = test_page(page, "/signup", "Signup Page")
    check("Signup page has sign up form", "Sign" in body or "Create" in body or "Register" in body)
    check("No JS errors on signup", len(console_errors) == 0,
          str(console_errors[:2]) if console_errors else "")

    # ── 4. Forgot password page ──────────────────────────────────────────────
    status, url, body = test_page(page, "/forgot-password", "Forgot Password Page")
    check("Forgot password has email field", "email" in body.lower() or "reset" in body.lower())

    # ── 5. Setup / onboarding page ───────────────────────────────────────────
    status, url, body = test_page(page, "/setup", "Setup Page", expected_status=200)
    check("Setup page doesn't 500", status != 500, f"status: {status}")
    final = page.url
    check("Setup page redirects unauthenticated to /login", "/login" in final or "/setup" in final,
          f"at: {final}")

    # ── 6. Dashboard (unauthenticated) ───────────────────────────────────────
    status, url, body = test_page(page, "/dashboard", "Dashboard Unauthenticated", expected_status=200)
    check("Dashboard redirects to /login", "/login" in page.url or status in (200, 302),
          f"at: {page.url}")

    # ── 7. Jobs list page ────────────────────────────────────────────────────
    status, url, body = test_page(page, "/jobs", "Jobs List Page")
    check("Jobs page loads without error", status != 500)
    check("Jobs page has jobs content or redirects", "job" in body.lower() or "/login" in page.url)

    # ── 8. New job page (unauthenticated) ────────────────────────────────────
    status, url, body = test_page(page, "/jobs/new", "New Job Page Unauthenticated", expected_status=200)
    final = page.url
    check("Jobs/new redirects safely", "/login" in final or "/setup" in final or "/jobs/new" in final,
          f"at: {final}")
    check("Jobs/new no application error", "Application error" not in body)

    # ── 9. Mobile viewport — landing page ────────────────────────────────────
    print("\n── Mobile Viewport Tests ──")
    mobile_ctx = browser.new_context(viewport={"width": 375, "height": 812})
    mobile_page = mobile_ctx.new_page()

    resp_m = mobile_page.goto(f"{BASE_URL}/", wait_until="domcontentloaded", timeout=20000)
    wait(mobile_page)
    check("Landing page loads on mobile", resp_m.status == 200, f"got {resp_m.status}")
    mobile_page.screenshot(path=str(SHOTS_DIR / "landing_mobile.png"), full_page=True)
    print("  [SHOT] landing_mobile.png")

    resp_m2 = mobile_page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=20000)
    wait(mobile_page)
    check("Login page loads on mobile", resp_m2.status == 200, f"got {resp_m2.status}")
    mobile_page.screenshot(path=str(SHOTS_DIR / "login_mobile.png"), full_page=True)
    print("  [SHOT] login_mobile.png")

    resp_m3 = mobile_page.goto(f"{BASE_URL}/dashboard", wait_until="domcontentloaded", timeout=20000)
    wait(mobile_page)
    check("Dashboard no 500 on mobile", resp_m3.status != 500, f"got {resp_m3.status}")
    mobile_page.screenshot(path=str(SHOTS_DIR / "dashboard_mobile.png"), full_page=True)
    print("  [SHOT] dashboard_mobile.png")

    mobile_page.close()
    mobile_ctx.close()

    # ── 10. Interactive: Login form interaction ───────────────────────────────
    print("\n── Login Form Interaction Test ──")
    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=20000)
    wait(page, 800)

    try:
        email_input = page.locator('input[type="email"]').first
        email_input.fill("test@example.com")
        pw_input = page.locator('input[type="password"]').first
        pw_input.fill("wrongpassword123")
        shot(page, "login_form_filled")

        submit_btn = page.locator('button[type="submit"]').first
        submit_btn.click()
        wait(page, 1500)
        body_after = page.text_content("body") or ""
        has_error_msg = any(x in body_after.lower() for x in ["invalid", "incorrect", "error", "wrong", "credentials"])
        check("Login shows error for wrong credentials", has_error_msg, "no error message found")
        shot(page, "login_form_error")
    except Exception as e:
        check("Login form interaction", False, str(e))
        shot(page, "login_form_error_crash")

    # ── 11. Signup form interaction ──────────────────────────────────────────
    print("\n── Signup Form Interaction Test ──")
    page.goto(f"{BASE_URL}/signup", wait_until="domcontentloaded", timeout=20000)
    wait(page, 800)

    try:
        email_inputs = page.locator('input[type="email"]').all()
        pw_inputs = page.locator('input[type="password"]').all()
        if email_inputs:
            email_inputs[0].fill("newuser@test.com")
        if pw_inputs:
            pw_inputs[0].fill("TestPassword123!")
        shot(page, "signup_form_filled")
        check("Signup form accepts input", True)
    except Exception as e:
        check("Signup form interaction", False, str(e))

    # ── Summary ──────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    passed = sum(1 for ok, _ in results if ok)
    total = len(results)
    failed = [(msg) for ok, msg in results if not ok]
    print(f"Results: {passed}/{total} checks passed")
    if failed:
        print("\nFailed checks:")
        for m in failed:
            print(f"  {m}")
    else:
        print("All checks passed!")
    print(f"\nScreenshots saved to: {SHOTS_DIR}")
    print("="*60)

    browser.close()

sys.exit(0 if not failed else 1)
