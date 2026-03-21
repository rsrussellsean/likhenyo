"""
Phase 0 — Automated test suite
Tests all Definition of Done items that can be verified programmatically.
"""

import os
import re
import sys
import io
from pathlib import Path
from playwright.sync_api import sync_playwright

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = Path(__file__).parent
PASS = "[PASS]"
FAIL = "[FAIL]"
results = []

def check(label, condition, detail=""):
    status = PASS if condition else FAIL
    msg = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((condition, msg))
    print(msg)

# --Static file checks ──────────────────────────────────────────────────────

def check_files():
    print("\n--File Structure --")

    required_files = [
        "lib/supabase/client.ts",
        "lib/supabase/server.ts",
        "lib/supabase/middleware.ts",
        "middleware.ts",
        ".env.local",
        "lib/actions/auth.ts",
        "lib/actions/jobs.ts",
        "lib/actions/applications.ts",
        "lib/actions/hire.ts",
        "lib/actions/bookings.ts",
        "lib/actions/payments.ts",
        "lib/actions/reviews.ts",
        "lib/actions/verifications.ts",
        "lib/utils/chatFilter.ts",
        "lib/utils/formatters.ts",
        "lib/types/database.ts",
        "app/(auth)/login/page.tsx",
        "app/(auth)/signup/page.tsx",
        "app/(auth)/forgot-password/page.tsx",
        "app/(auth)/reset-password/page.tsx",
        "app/(auth)/logout/page.tsx",
        "app/auth/callback/route.ts",
        "app/(onboarding)/setup/page.tsx",
        "app/(marketplace)/dashboard/page.tsx",
        "app/(marketplace)/jobs/page.tsx",
        "app/(marketplace)/jobs/new/page.tsx",
        "app/(marketplace)/jobs/[id]/page.tsx",
        "app/(marketplace)/jobs/[id]/apply/page.tsx",
        "app/(marketplace)/jobs/[id]/applicants/page.tsx",
        "app/(marketplace)/freelancers/page.tsx",
        "app/(marketplace)/freelancers/[id]/page.tsx",
        "app/(marketplace)/applications/page.tsx",
        "app/(marketplace)/bookings/page.tsx",
        "app/(marketplace)/bookings/[id]/page.tsx",
        "app/(marketplace)/bookings/[id]/chat/page.tsx",
        "app/(marketplace)/bookings/[id]/payment/page.tsx",
        "app/(marketplace)/bookings/[id]/submit/page.tsx",
        "app/(marketplace)/bookings/[id]/review/page.tsx",
        "app/admin/verifications/page.tsx",
        "components/ui/button.tsx",
        "components/ui/input.tsx",
        "components/ui/textarea.tsx",
        "components/ui/select.tsx",
        "components/ui/badge.tsx",
        "components/ui/card.tsx",
        "components/ui/avatar.tsx",
        "components/ui/dialog.tsx",
        "components/ui/dropdown-menu.tsx",
        "components/ui/tabs.tsx",
        "components/ui/sonner.tsx",
        "components/ui/tooltip.tsx",
        "components/ui/separator.tsx",
        "components/ui/label.tsx",
        "components/ui/form.tsx",
        "components/ui/popover.tsx",
        "components/ui/command.tsx",
        "components/landing/.gitkeep",
        "components/marketplace/.gitkeep",
        "components/auth/.gitkeep",
    ]

    for f in required_files:
        exists = (ROOT / f).exists()
        check(f"File exists: {f}", exists)

def check_supabase_clients():
    print("\n--Supabase Client Code --")

    client = (ROOT / "lib/supabase/client.ts").read_text()
    check(
        "client.ts uses createBrowserClient",
        "createBrowserClient" in client
    )
    check(
        "client.ts exports createClient()",
        "export function createClient" in client
    )

    server = (ROOT / "lib/supabase/server.ts").read_text()
    check("server.ts uses createServerClient", "createServerClient" in server)
    check("server.ts exports createClient()", "export async function createClient" in server)
    check("server.ts handles cookies (getAll)", "getAll" in server)
    check("server.ts handles cookies (setAll)", "setAll" in server)

    mw = (ROOT / "lib/supabase/middleware.ts").read_text()
    check("middleware.ts exports updateSession", "export async function updateSession" in mw)
    check("middleware.ts calls getUser()", "getUser()" in mw)

    root_mw = (ROOT / "middleware.ts").read_text()
    check("root middleware.ts imports updateSession", "updateSession" in root_mw)
    check("root middleware.ts has matcher config", "matcher" in root_mw)
    check("root middleware.ts excludes _next/static", "_next/static" in root_mw)

def check_env():
    print("\n--Environment --")

    env_path = ROOT / ".env.local"
    env_text = env_path.read_text()
    check(".env.local has SUPABASE_URL set", "NEXT_PUBLIC_SUPABASE_URL=https://" in env_text)
    check(".env.local has ANON_KEY set", len([l for l in env_text.splitlines() if l.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY=") and len(l) > 40]) > 0)
    check(".env.local has SITE_URL", "NEXT_PUBLIC_SITE_URL=" in env_text)
    check(".env.local has ADMIN_EMAIL", "ADMIN_EMAIL=" in env_text and "ADMIN_EMAIL=\n" not in env_text)

    gitignore = (ROOT / ".gitignore").read_text()
    check(".gitignore covers .env.local", ".env" in gitignore or ".env.local" in gitignore)

def check_shadcn():
    print("\n--Shadcn Config --")

    cj = (ROOT / "components.json").read_text()
    check("components.json base color is neutral", '"baseColor": "neutral"' in cj)
    check("components.json has rsc: true", '"rsc": true' in cj)

def run_browser_tests(base_url: str):
    print(f"\n--Browser Tests (against {base_url}) --")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # Test 1: homepage loads (200) — use commit to avoid Supabase keepalive blocking networkidle
        response = page.goto(base_url, wait_until="commit", timeout=30000)
        page.wait_for_load_state("domcontentloaded", timeout=30000)
        check("Homepage returns 200", response.status == 200, f"got {response.status}")

        # Test 2: no console errors on homepage
        page.wait_for_timeout(2000)
        check("No JS console errors on homepage", len(console_errors) == 0,
              f"{len(console_errors)} error(s): {console_errors[:2]}" if console_errors else "")

        # Test 3: /dashboard route (middleware runs on it)
        console_errors.clear()
        r2 = page.goto(f"{base_url}/dashboard", wait_until="commit", timeout=15000)
        check("Middleware allows /dashboard (no 500)", r2.status != 500, f"got {r2.status}")

        # Test 4: /login route
        r3 = page.goto(f"{base_url}/login", wait_until="commit", timeout=15000)
        check("/login route is reachable (no 500)", r3.status != 500, f"got {r3.status}")

        # Test 5: /setup route
        r4 = page.goto(f"{base_url}/setup", wait_until="commit", timeout=15000)
        check("/setup route is reachable (no 500)", r4.status != 500, f"got {r4.status}")

        # Test 6: /jobs route
        r5 = page.goto(f"{base_url}/jobs", wait_until="commit", timeout=15000)
        check("/jobs route is reachable (no 500)", r5.status != 500, f"got {r5.status}")

        browser.close()

def print_summary():
    print("\n" + "="*50)
    passed = sum(1 for ok, _ in results if ok)
    total = len(results)
    failed = [(msg) for ok, msg in results if not ok]
    print(f"Phase 0 Results: {passed}/{total} checks passed")
    if failed:
        print("\nFailed checks:")
        for m in failed:
            print(f"  {m}")
    else:
        print("All checks passed! Phase 0 is complete.")
    print("="*50)
    return len(failed) == 0


if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    check_files()
    check_supabase_clients()
    check_env()
    check_shadcn()
    run_browser_tests(base_url)
    ok = print_summary()
    sys.exit(0 if ok else 1)
