"""Phase 1 automated browser tests — landing page + auth routes"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
results = []

def check(label, condition, detail=""):
    status = "[PASS]" if condition else "[FAIL]"
    msg = f"{status} {label}"
    if detail:
        msg += f" -- {detail}"
    results.append((condition, msg))
    print(msg)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    console_errors = []
    # Ignore HMR WebSocket errors (expected in headless Playwright)
    page.on("console", lambda m: console_errors.append(m.text)
            if m.type == "error" and "webpack-hmr" not in m.text else None)

    def goto(path, wait="domcontentloaded", timeout=20000):
        console_errors.clear()
        r = page.goto(f"{BASE}{path}", wait_until=wait, timeout=timeout)
        page.wait_for_timeout(1500)
        return r

    # -- Landing page --
    print("\n-- Landing Page --")
    r = goto("/")
    check("/ returns 200", r.status == 200, f"got {r.status}")
    check("No console errors on /", len(console_errors) == 0, str(console_errors[:2]))

    # Logo
    logo = page.locator("text=WorkHubPH").first
    check("Logo visible", logo.is_visible())

    # Hero headline
    headline = page.locator("h1").first
    check("Hero h1 contains 'Philippines'", "Philippines" in (headline.inner_text() if headline.count() > 0 else ""))

    # Hero CTAs
    check("'Post a Job' CTA exists", page.locator("text=Post a Job").count() > 0)
    check("'Find Work' CTA exists", page.locator("text=Find Work").count() > 0)

    # Navigation
    check("'How It Works' nav link exists", page.locator("text=How It Works").count() > 0)
    check("'Browse Jobs' nav link exists", page.locator("text=Browse Jobs").count() > 0)
    check("'Find Freelancers' nav link exists", page.locator("text=Find Freelancers").count() > 0)

    # Sections
    check("HowItWorks section renders", page.locator("text=For Clients").count() > 0)
    check("Features section renders", page.locator("text=Verified Professionals").count() > 0)
    check("Testimonials section renders", page.locator("text=Trusted by professionals").count() > 0)
    check("CTA section renders", page.locator("text=Ready to get started").count() > 0)
    check("Footer renders", page.locator("text=All rights reserved").count() > 0)

    # Login/Get Started buttons (logged-out state)
    check("'Login' button in header", page.locator("header >> text=Login").count() > 0)
    check("'Get Started' button in header", page.locator("header >> text=Get Started").count() > 0)

    # -- Auth pages --
    print("\n-- Auth Pages --")

    r = goto("/login")
    check("/login returns 200", r.status == 200)
    check("/login has email input", page.locator("input[type=email]").count() > 0)
    check("/login has password input", page.locator("input[type=password]").count() > 0)
    check("/login has Google button", page.locator("text=Continue with Google").count() > 0)
    check("/login has Facebook button", page.locator("text=Continue with Facebook").count() > 0)
    check("/login has 'Forgot password' link", page.locator("text=Forgot password").count() > 0)
    check("/login has 'Sign up' link", page.locator("text=Sign up").count() > 0)
    check("No console errors on /login", len(console_errors) == 0, str(console_errors[:2]))

    r = goto("/signup")
    check("/signup returns 200", r.status == 200)
    check("/signup has email input", page.locator("input[type=email]").count() > 0)
    check("/signup has OAuth buttons", page.locator("text=Continue with Google").count() > 0)
    check("/signup has 'Log in' link", page.locator("text=Log in").count() > 0)
    check("No console errors on /signup", len(console_errors) == 0, str(console_errors[:2]))

    r = goto("/signup?role=client")
    check("/signup?role=client shows 'Client' label", page.locator("text=Client").count() > 0)

    r = goto("/signup?role=freelancer")
    check("/signup?role=freelancer shows 'Freelancer' label", page.locator("text=Freelancer").count() > 0)

    r = goto("/forgot-password")
    check("/forgot-password returns 200", r.status == 200)
    check("/forgot-password has email input", page.locator("input[type=email]").count() > 0)
    check("/forgot-password has submit button", page.locator("text=Send reset link").count() > 0)

    r = goto("/reset-password")
    check("/reset-password returns 200", r.status == 200)
    check("/reset-password has password inputs", page.locator("input[type=password]").count() >= 2)

    # Screenshot (Windows-safe path)
    import tempfile, pathlib
    shot_path = pathlib.Path(tempfile.gettempdir()) / "phase1_landing.png"
    try:
        goto("/")
        page.screenshot(path=str(shot_path), full_page=True)
        print(f"Screenshot: {shot_path}")
    except Exception:
        pass

    browser.close()

print("\n" + "="*50)
passed = sum(1 for ok, _ in results if ok)
total = len(results)
failed = [msg for ok, msg in results if not ok]
print(f"Phase 1 Results: {passed}/{total} passed")
if failed:
    print("\nFailed:")
    for m in failed:
        print(f"  {m}")
else:
    print("All checks passed!")
print("="*50)
sys.exit(0 if not failed else 1)
