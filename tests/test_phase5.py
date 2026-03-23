"""
Phase 5 — Job Search + Filter System: Playwright E2E Tests (headed)

Tests the /jobs and /freelancers pages with all filter controls,
URL param state, empty states, pagination, and Clear All Filters.

Usage:
  python tests/test_phase5.py                  # headed, manual login
  python tests/test_phase5.py --email X --pw Y # headed, auto login
"""

import argparse
import os
import sys
import time
from playwright.sync_api import sync_playwright, expect

BASE = "http://localhost:3000"
SCREENSHOT_DIR = "tests/screenshots"


# ── Helpers ────────────────────────────────────────────────────────────────

def screenshot(page, name):
    page.screenshot(path=f"{SCREENSHOT_DIR}/{name}.png", full_page=True)
    print(f"  [screenshot] {name}.png")


def wait_and_settle(page, ms=1500):
    """Wait for network + extra settle time for React transitions."""
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(ms)


def login_auto(page, email, password):
    """Fill the login form and submit."""
    page.goto(f"{BASE}/login", timeout=120000)  # dev mode compiles slowly
    wait_and_settle(page, 2000)

    page.locator("#email").fill(email)
    page.locator("#password").fill(password)
    page.locator('button[type="submit"]').click()
    wait_and_settle(page, 5000)


def login_manual(page):
    """Open login page and wait for the user to log in manually."""
    page.goto(f"{BASE}/login")
    wait_and_settle(page)
    print("\n  +==================================================+")
    print("  |  Please log in manually in the browser window.  |")
    print("  |  Tests will continue once you reach /dashboard. |")
    print("  +==================================================+\n")

    # Poll until user navigates away from login
    for _ in range(120):  # 2 min timeout
        if "/login" not in page.url and "/signup" not in page.url:
            break
        page.wait_for_timeout(1000)
    else:
        print("  [timeout] Manual login timed out after 2 minutes")
        sys.exit(1)

    wait_and_settle(page, 2000)
    print(f"  [info] Logged in — now at {page.url}")


def ensure_on(page, path):
    """Navigate to path, follow redirects, return True if we landed there."""
    page.goto(f"{BASE}{path}", timeout=60000)
    wait_and_settle(page)
    return path in page.url


# ── Tests ──────────────────────────────────────────────────────────────────

def run_tests(page):
    passed = 0
    failed = 0
    errors = []

    def ok(name):
        nonlocal passed
        print(f"  PASSED")
        passed += 1

    def fail(name, e):
        nonlocal failed
        print(f"  FAILED: {e}")
        failed += 1
        errors.append((name, str(e)))
        screenshot(page, f"fail_{name.replace(' ', '_').lower()}")

    # ═══════════════════════════════════════════════════════════════
    # JOBS PAGE TESTS
    # ═══════════════════════════════════════════════════════════════

    # TEST 1: Page loads
    name = "T1 Jobs page loads"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs")
        screenshot(page, "01_jobs_loaded")

        expect(page.locator("h1")).to_contain_text("Browse Jobs")
        expect(page.locator('input[placeholder*="Search"]').first).to_be_visible()
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 2: Keyword search via hero bar
    name = "T2 Keyword search"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs")
        hero_input = page.locator('input[placeholder*="Search"]').first
        hero_input.fill("developer")
        page.locator('button:has-text("Search")').click()
        wait_and_settle(page)

        assert "keyword=developer" in page.url, f"URL: {page.url}"
        screenshot(page, "02_keyword_search")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 3: Work mode filter
    name = "T3 Work mode filter"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs")

        # Find the "Remote" button inside the filters (case-insensitive)
        remote_btns = page.locator("button").filter(has_text="remote")
        # Click the first segmented button (not the nav link)
        for i in range(remote_btns.count()):
            btn = remote_btns.nth(i)
            classes = btn.get_attribute("class") or ""
            if "rounded-lg" in classes:  # segmented button styling
                btn.click()
                break
        wait_and_settle(page)

        assert "work_mode=remote" in page.url, f"URL: {page.url}"
        screenshot(page, "03_work_mode")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 4: Budget type filter
    name = "T4 Budget type filter"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs")

        fixed_btns = page.locator("button").filter(has_text="fixed")
        for i in range(fixed_btns.count()):
            btn = fixed_btns.nth(i)
            classes = btn.get_attribute("class") or ""
            if "rounded-lg" in classes:
                btn.click()
                break
        wait_and_settle(page)

        assert "budget_type=fixed" in page.url, f"URL: {page.url}"
        screenshot(page, "04_budget_type")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 5: Posted within dropdown
    name = "T5 Posted within filter"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs")

        # Find select with "Any time" option
        selects = page.locator("select")
        found = False
        for i in range(selects.count()):
            sel = selects.nth(i)
            if "Any time" in (sel.inner_text() or ""):
                sel.select_option("week")
                found = True
                break
        assert found, "Could not find posted_within select"
        wait_and_settle(page)

        assert "posted_within=week" in page.url, f"URL: {page.url}"
        screenshot(page, "05_posted_within")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 6: Sort dropdown
    name = "T6 Sort filter"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs")

        selects = page.locator("select")
        for i in range(selects.count()):
            sel = selects.nth(i)
            text = sel.inner_text() or ""
            if "Newest" in text and "Budget" in text:
                sel.select_option("budget_high")
                break
        wait_and_settle(page)

        assert "sort=budget_high" in page.url, f"URL: {page.url}"
        screenshot(page, "06_sort")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 7: Clear All Filters
    name = "T7 Clear All Filters (jobs)"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs?work_mode=remote&budget_type=fixed&sort=budget_high")

        clear_btn = page.locator("button:has-text('Clear All Filters')").first
        expect(clear_btn).to_be_visible()
        clear_btn.click()
        wait_and_settle(page)

        assert "work_mode" not in page.url and "budget_type" not in page.url, f"URL: {page.url}"
        screenshot(page, "07_clear_all")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 8: Empty state
    name = "T8 Empty state (jobs)"
    try:
        print(f"\n{name}")
        ensure_on(page, "/jobs?keyword=zzzznonexistent99999")

        empty = page.locator("text=No jobs match your filters")
        expect(empty).to_be_visible()
        screenshot(page, "08_empty_state")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 9: URL reload preserves state
    name = "T9 URL reload preserves filters"
    try:
        print(f"\n{name}")
        url = f"{BASE}/jobs?work_mode=remote&sort=budget_high"
        page.goto(url)
        wait_and_settle(page)

        assert "work_mode=remote" in page.url, f"URL: {page.url}"
        assert "sort=budget_high" in page.url, f"URL: {page.url}"
        screenshot(page, "09_url_preserved")
        ok(name)
    except Exception as e:
        fail(name, e)

    # ═══════════════════════════════════════════════════════════════
    # FREELANCERS PAGE TESTS
    # ═══════════════════════════════════════════════════════════════

    # TEST 10: Page loads
    name = "T10 Freelancers page loads"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers")
        screenshot(page, "10_freelancers_loaded")

        expect(page.locator("h1")).to_contain_text("Find Talent")
        expect(page.locator('input[placeholder*="Search"]').first).to_be_visible()
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 11: Freelancer keyword search
    name = "T11 Freelancer keyword search"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers")

        hero_input = page.locator('input[placeholder*="Search"]').first
        hero_input.fill("engineer")
        page.locator('button:has-text("Search")').click()
        wait_and_settle(page)

        assert "keyword=engineer" in page.url, f"URL: {page.url}"
        screenshot(page, "11_freelancer_keyword")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 12: Work preference filter
    name = "T12 Freelancer work preference"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers")

        remote_btns = page.locator("button").filter(has_text="remote")
        for i in range(remote_btns.count()):
            btn = remote_btns.nth(i)
            classes = btn.get_attribute("class") or ""
            if "rounded-lg" in classes:
                btn.click()
                break
        wait_and_settle(page)

        assert "work_preference=remote" in page.url, f"URL: {page.url}"
        screenshot(page, "12_freelancer_work_pref")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 13: Verified only toggle
    name = "T13 Verified only toggle"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers")

        # Target the desktop sidebar toggle (inside role="complementary")
        toggle_btn = page.get_by_role("complementary").locator("button.relative.w-11.h-6.rounded-full")
        toggle_btn.scroll_into_view_if_needed()
        toggle_btn.click()
        wait_and_settle(page)

        assert "verified_only=true" in page.url, f"URL: {page.url}"
        screenshot(page, "13_verified_only")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 14: Freelancer sort
    name = "T14 Freelancer sort"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers")

        selects = page.locator("select")
        for i in range(selects.count()):
            sel = selects.nth(i)
            text = sel.inner_text() or ""
            if "Highest Rated" in text:
                sel.select_option("newest")
                break
        wait_and_settle(page)

        assert "sort=newest" in page.url, f"URL: {page.url}"
        screenshot(page, "14_freelancer_sort")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 15: Clear All Filters (freelancers)
    name = "T15 Clear All Filters (freelancers)"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers?work_preference=remote&verified_only=true&sort=newest")

        clear_btn = page.locator("button:has-text('Clear All Filters')").first
        expect(clear_btn).to_be_visible()
        clear_btn.click()
        wait_and_settle(page)

        assert "work_preference" not in page.url and "verified_only" not in page.url, f"URL: {page.url}"
        screenshot(page, "15_freelancer_clear_all")
        ok(name)
    except Exception as e:
        fail(name, e)

    # TEST 16: Freelancer empty state
    name = "T16 Empty state (freelancers)"
    try:
        print(f"\n{name}")
        ensure_on(page, "/freelancers?keyword=zzzznonexistent99999")

        empty = page.locator("text=No freelancers match your filters")
        expect(empty).to_be_visible()
        screenshot(page, "16_freelancer_empty")
        ok(name)
    except Exception as e:
        fail(name, e)

    # ═══════════════════════════════════════════════════════════════
    # Summary
    # ═══════════════════════════════════════════════════════════════
    total = passed + failed
    print("\n" + "=" * 60)
    print(f"  Phase 5 Results: {passed}/{total} passed, {failed} failed")
    print("=" * 60)

    if errors:
        print("\n  Failed:")
        for n, e in errors:
            print(f"    {n}: {e[:80]}")

    return failed


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Phase 5 E2E tests")
    parser.add_argument("--email", help="Login email")
    parser.add_argument("--pw", help="Login password")
    args = parser.parse_args()

    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Auth
        if args.email and args.pw:
            login_auto(page, args.email, args.pw)
        else:
            login_manual(page)

        # Verify we're logged in
        page.goto(f"{BASE}/jobs", timeout=120000)
        wait_and_settle(page, 2000)
        if "/login" in page.url:
            print("  [error] Not logged in — aborting tests")
            browser.close()
            sys.exit(1)

        failures = run_tests(page)

        page.wait_for_timeout(2000)
        browser.close()

    sys.exit(1 if failures > 0 else 0)


if __name__ == "__main__":
    main()
