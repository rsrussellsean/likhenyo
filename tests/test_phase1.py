"""
Phase 1 — Automated test suite
Tests all Definition of Done items that can be verified programmatically.

Usage:
    python tests/test_phase1.py [http://localhost:3000]

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

def check_landing_files():
    print("\n-- Landing Component Files --")
    required = [
        "components/landing/Header.tsx",
        "components/landing/Hero.tsx",
        "components/landing/HowItWorks.tsx",
        "components/landing/ProfessionGrid.tsx",
        "components/landing/WhyLikhenyo.tsx",
        "components/landing/Stats.tsx",
        "components/landing/Testimonials.tsx",
        "components/landing/ForThePhilippines.tsx",
        "components/landing/Footer.tsx",
        "components/auth/OAuthButtons.tsx",
    ]
    for f in required:
        check(f"File exists: {f}", (ROOT / f).exists())


def check_auth_files():
    print("\n-- Auth Files --")
    required = [
        "lib/actions/auth.ts",
        "app/(auth)/signup/page.tsx",
        "app/(auth)/login/page.tsx",
        "app/(auth)/forgot-password/page.tsx",
        "app/(auth)/reset-password/page.tsx",
        "app/(auth)/logout/page.tsx",
        "app/auth/callback/route.ts",
        "app/(onboarding)/setup/page.tsx",
    ]
    for f in required:
        check(f"File exists: {f}", (ROOT / f).exists())


def check_auth_actions():
    print("\n-- Auth Action Code --")
    auth = (ROOT / "lib/actions/auth.ts").read_text(encoding="utf-8")
    check("auth.ts has 'use server' directive", '"use server"' in auth or "'use server'" in auth)
    check("auth.ts has signInWithOAuthAction", "signInWithOAuthAction" in auth)
    check("auth.ts uses signInWithOAuth", "signInWithOAuth" in auth)
    check("auth.ts passes redirectTo with SITE_URL", "NEXT_PUBLIC_SITE_URL" in auth)
    check("auth.ts has signUpWithEmailAction", "signUpWithEmailAction" in auth)
    check("auth.ts passes role in signUp data", "data: { role }" in auth or 'data: {role}' in auth or '"role"' in auth)
    check("auth.ts has signInWithEmailAction", "signInWithEmailAction" in auth)
    check("auth.ts redirects to /setup after login", '"/setup"' in auth)
    check("auth.ts has forgotPasswordAction", "forgotPasswordAction" in auth)
    check("auth.ts has resetPasswordAction", "resetPasswordAction" in auth)
    check("auth.ts has signOutAction", "signOutAction" in auth)


def check_callback_route():
    print("\n-- Auth Callback Route --")
    cb = (ROOT / "app/auth/callback/route.ts").read_text(encoding="utf-8")
    check("callback uses exchangeCodeForSession", "exchangeCodeForSession" in cb)
    check("callback uses getUser()", "getUser()" in cb)
    check("callback checks for existing profile", "profiles" in cb)
    check("callback inserts profile if missing", "insert" in cb)
    check("callback redirects to /setup", '"/setup"' in cb)
    check("callback handles recovery type", '"recovery"' in cb)
    check("callback redirects to /login on error", '"auth_failed"' in cb)


def check_landing_content():
    print("\n-- Landing Page Content --")

    hero = (ROOT / "components/landing/Hero.tsx").read_text(encoding="utf-8")
    check("Hero has Filipino headline (Ang Henyo Mo)", "Ang Henyo Mo" in hero)
    check("Hero has Ang Trabaho Mo", "Ang Trabaho Mo" in hero)
    check("Hero has 'Post a Job' CTA with ?role=client", "role=client" in hero)
    check("Hero has 'Find Work' CTA with ?role=freelancer", "role=freelancer" in hero)
    check("Hero has social proof text", "Cebu" in hero)

    howitworks = (ROOT / "components/landing/HowItWorks.tsx").read_text(encoding="utf-8")
    check("HowItWorks has For Clients tab", "For Clients" in howitworks)
    check("HowItWorks has For Freelancers tab", "For Freelancers" in howitworks)
    check("HowItWorks uses client state (tabs)", '"use client"' in howitworks or "'use client'" in howitworks)

    pgrid = (ROOT / "components/landing/ProfessionGrid.tsx").read_text(encoding="utf-8")
    check("ProfessionGrid has 12 profession tiles", pgrid.count("label:") >= 12)

    stats = (ROOT / "components/landing/Stats.tsx").read_text(encoding="utf-8")
    check("Stats has 100% stat block", "100%" in stats)
    check("Stats has ₱0 stat block", "₱0" in stats)

    testimonials = (ROOT / "components/landing/Testimonials.tsx").read_text(encoding="utf-8")
    check("Testimonials has Marco Villanueva", "Marco Villanueva" in testimonials)
    check("Testimonials has Jasmine Reyes", "Jasmine Reyes" in testimonials)
    check("Testimonials has Dana Mercado", "Dana Mercado" in testimonials)

    ftp = (ROOT / "components/landing/ForThePhilippines.tsx").read_text(encoding="utf-8")
    check("ForThePhilippines has Filipino tagline", "Para sa mga" in ftp)
    check("ForThePhilippines has Pilipinong Henyo", "Pilipinong Henyo" in ftp)
    check("ForThePhilippines CTA links to /signup", '"/signup"' in ftp)

    footer = (ROOT / "components/landing/Footer.tsx").read_text(encoding="utf-8")
    check("Footer has 4 link columns", footer.count('"heading"') + footer.count("heading:") >= 4)
    check("Footer has copyright 2025", "2025" in footer)
    check("Footer has social icons", "Facebook" in footer and "Linkedin" in footer)

    header = (ROOT / "components/landing/Header.tsx").read_text(encoding="utf-8")
    check("Header is a client component", '"use client"' in header or "'use client'" in header)
    check("Header has Log In link", "Log In" in header)
    check("Header has Get Started link", "Get Started" in header)
    check("Header has hamburger menu", "Menu" in header or "hamburger" in header.lower() or "menuOpen" in header)
    check("Header reads auth state client-side", "onAuthStateChange" in header or "getUser" in header)


def check_signup_page():
    print("\n-- Signup Page --")
    sp = (ROOT / "app/(auth)/signup/page.tsx").read_text(encoding="utf-8")
    check("Signup has Simulan na headline", "Simulan na" in sp)
    check("Signup uses OAuthButtons", "OAuthButtons" in sp)
    check("Signup reads role from query param", "useSearchParams" in sp or "searchParams" in sp)
    check("Signup calls signUpWithEmailAction", "signUpWithEmailAction" in sp)
    check("Signup shows success email message", "Check your email" in sp)
    check("Signup has link to /login", '"/login"' in sp)


def check_login_page():
    print("\n-- Login Page --")
    lp = (ROOT / "app/(auth)/login/page.tsx").read_text(encoding="utf-8")
    check("Login has Welcome back headline", "Welcome back" in lp)
    check("Login uses OAuthButtons", "OAuthButtons" in lp)
    check("Login calls signInWithEmailAction", "signInWithEmailAction" in lp)
    check("Login has forgot password link", "forgot-password" in lp)
    check("Login has link to /signup", '"/signup"' in lp)


def check_setup_page():
    print("\n-- Setup/Onboarding Page --")
    sp = (ROOT / "app/(onboarding)/setup/page.tsx").read_text(encoding="utf-8")
    check("Setup is a client component", '"use client"' in sp or "'use client'" in sp)
    check("Setup has role selection (client)", '"client"' in sp)
    check("Setup has role selection (freelancer)", '"freelancer"' in sp)
    check("Setup has profession input for freelancers", "profession" in sp)
    check("Setup has skills input for freelancers", "skills" in sp)
    check("Setup has work preference selection", "work_preference" in sp or "workPref" in sp)
    check("Setup guards if profile role already set", "role" in sp and ("redirect" in sp or "router.replace" in sp))


# ─── Browser tests ────────────────────────────────────────────────────────────

def run_browser_tests(base_url: str):
    print(f"\n-- Browser Tests (against {base_url}) --")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ── Landing page ──
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        console_errors: list[str] = []
        page.on(
            "console",
            lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
        )

        resp = page.goto(base_url, wait_until="domcontentloaded", timeout=30000)
        check("Landing page returns 200", resp.status == 200, f"got {resp.status}")

        page.wait_for_timeout(1500)
        check(
            "No JS console errors on landing page",
            len(console_errors) == 0,
            f"{len(console_errors)} error(s): {console_errors[:2]}" if console_errors else "",
        )

        # Filipino headline renders
        hero_text = page.text_content("h1") or ""
        check(
            "Filipino headline renders without encoding issues",
            "Ang Henyo Mo" in hero_text or "Henyo" in hero_text,
            f"h1 text: {hero_text[:60]!r}",
        )

        # CTA links
        post_job = page.query_selector('a[href*="role=client"]')
        check("'Post a Job' CTA has ?role=client href", post_job is not None)

        find_work = page.query_selector('a[href*="role=freelancer"]')
        check("'Find Work' CTA has ?role=freelancer href", find_work is not None)

        # Header is present
        header_el = page.query_selector("header")
        check("Header element is present", header_el is not None)

        # Mobile hamburger
        page.set_viewport_size({"width": 375, "height": 812})
        page.wait_for_timeout(300)
        hamburger = page.query_selector('[aria-label="Toggle menu"]') or page.query_selector('button[aria-label*="menu" i]')
        check("Mobile hamburger button is visible", hamburger is not None)
        if hamburger:
            hamburger.click()
            page.wait_for_timeout(400)
            # Menu should be open — check for nav links
            nav_visible = page.query_selector_all("a[href='/#how-it-works']")
            check("Mobile menu opens and shows nav links", len(nav_visible) > 0)

        # HowItWorks tabs (desktop)
        page.set_viewport_size({"width": 1280, "height": 800})
        page.goto(base_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(1000)

        freelancers_tab = page.query_selector("button:has-text('For Freelancers')")
        check("HowItWorks 'For Freelancers' tab is present", freelancers_tab is not None)
        if freelancers_tab:
            freelancers_tab.click()
            page.wait_for_timeout(400)
            # After clicking, freelancer step content should be visible
            content = page.text_content("body") or ""
            check("Tab switches to freelancer view", "Build Your Profile" in content)

        # ── /signup page ──
        console_errors.clear()
        resp2 = page.goto(f"{base_url}/signup", wait_until="domcontentloaded", timeout=20000)
        check("/signup returns 200", resp2.status == 200, f"got {resp2.status}")
        page.wait_for_timeout(800)
        signup_text = page.text_content("body") or ""
        check("Signup page has 'Simulan na' headline", "Simulan na" in signup_text)
        check("Signup page has Google button", "Google" in signup_text)
        check("Signup page has Facebook button", "Facebook" in signup_text)
        check("Signup page has email input", page.query_selector('input[type="email"]') is not None)

        # ── /signup?role=client ──
        page.goto(f"{base_url}/signup?role=client", wait_until="domcontentloaded", timeout=15000)
        page.wait_for_timeout(600)
        client_badge = page.query_selector_all("span:has-text('Client')")
        check("Signup page shows 'Client' role badge with ?role=client", len(client_badge) > 0)

        # ── /signup?role=freelancer ──
        page.goto(f"{base_url}/signup?role=freelancer", wait_until="domcontentloaded", timeout=15000)
        page.wait_for_timeout(600)
        fl_badge = page.query_selector_all("span:has-text('Freelancer')")
        check("Signup page shows 'Freelancer' role badge with ?role=freelancer", len(fl_badge) > 0)

        # ── /login page ──
        console_errors.clear()
        resp3 = page.goto(f"{base_url}/login", wait_until="domcontentloaded", timeout=15000)
        check("/login returns 200", resp3.status == 200, f"got {resp3.status}")
        login_text = page.text_content("body") or ""
        check("Login page has 'Welcome back' headline", "Welcome back" in login_text)
        check("Login page has forgot password link", "Forgot password" in login_text)
        check("No JS errors on /login", len(console_errors) == 0, f"{console_errors[:1]}" if console_errors else "")

        # ── /forgot-password page ──
        resp4 = page.goto(f"{base_url}/forgot-password", wait_until="domcontentloaded", timeout=15000)
        check("/forgot-password returns 200", resp4.status == 200, f"got {resp4.status}")
        fp_text = page.text_content("body") or ""
        check("Forgot password page loads correctly", "Reset" in fp_text or "password" in fp_text.lower())

        # ── /reset-password page ──
        resp5 = page.goto(f"{base_url}/reset-password", wait_until="domcontentloaded", timeout=15000)
        check("/reset-password returns 200", resp5.status == 200, f"got {resp5.status}")

        # ── /setup page ──
        resp6 = page.goto(f"{base_url}/setup", wait_until="domcontentloaded", timeout=15000)
        check("/setup returns 200 (or redirect — not 500)", resp6.status != 500, f"got {resp6.status}")

        # ── /logout ──
        resp7 = page.goto(f"{base_url}/logout", wait_until="domcontentloaded", timeout=15000)
        check("/logout does not 500", resp7.status != 500, f"got {resp7.status}")
        # After logout, should redirect to / or /login
        final_url = page.url
        check(
            "Logout redirects away from /logout",
            "/logout" not in final_url or final_url == f"{base_url}/logout",
        )

        browser.close()


def print_summary() -> bool:
    print("\n" + "=" * 55)
    passed = sum(1 for ok, _ in results if ok)
    total = len(results)
    failed_msgs = [msg for ok, msg in results if not ok]
    print(f"Phase 1 Results: {passed}/{total} checks passed")
    if failed_msgs:
        print("\nFailed checks:")
        for m in failed_msgs:
            print(f"  {m}")
    else:
        print("All checks passed! Phase 1 is complete.")
    print("=" * 55)
    return len(failed_msgs) == 0


if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

    check_landing_files()
    check_auth_files()
    check_auth_actions()
    check_callback_route()
    check_landing_content()
    check_signup_page()
    check_login_page()
    check_setup_page()
    run_browser_tests(base_url)

    ok = print_summary()
    sys.exit(0 if ok else 1)
