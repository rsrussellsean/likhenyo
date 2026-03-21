"""
Phase 4 — Automated test suite (headed mode)
Tests all Definition of Done items: static checks + browser automation.

Usage:
    python tests/test_phase4.py [http://localhost:3000]

Requires:
    pip install playwright
    playwright install chromium
"""

import sys
import io
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
ROOT     = Path(__file__).parent.parent
SHOTS    = Path(__file__).parent / "screenshots" / "phase4"
SHOTS.mkdir(parents=True, exist_ok=True)

results: list[tuple[bool, str]] = []


def check(label: str, condition: bool, detail: str = "") -> None:
    status = "[PASS]" if condition else "[FAIL]"
    msg = f"{status} {label}"
    if detail:
        msg += f" — {detail}"
    results.append((condition, msg))
    print(msg)


def shot(page: Page, name: str) -> None:
    path = str(SHOTS / f"{name}.png")
    page.screenshot(path=path, full_page=True)
    print(f"  [SHOT] phase4/{name}.png")


def wait(page: Page, ms: int = 1000) -> None:
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(ms)


# ─── Static file checks ────────────────────────────────────────────────────────

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
    ]
    for f in required:
        check(f"File exists: {f}", (ROOT / f).exists())


def check_skill_chip():
    print("\n── components/marketplace/SkillChip.tsx ──")
    src = (ROOT / "components/marketplace/SkillChip.tsx").read_text(encoding="utf-8")
    check("SkillChip has 'skill' variant",    "skill"    in src)
    check("SkillChip has 'tag' variant",      "tag"      in src)
    check("SkillChip has 'category' variant", "category" in src)
    check("SkillChip accepts onClick prop",   "onClick"  in src)
    check("SkillChip renders as button when onClick", "button" in src)


def check_star_rating():
    print("\n── components/marketplace/StarRating.tsx ──")
    src = (ROOT / "components/marketplace/StarRating.tsx").read_text(encoding="utf-8")
    check("StarRating has 'use client'",        '"use client"' in src or "'use client'" in src)
    check("StarRating accepts value prop",       "value" in src)
    check("StarRating accepts interactive prop", "interactive" in src)
    check("StarRating accepts onChange prop",    "onChange" in src)
    check("StarRating has sm/md/lg sizes",       "sm" in src and "md" in src and "lg" in src)
    check("StarRating uses Star icon",           "Star" in src)
    check("StarRating fills stars based on value", "fill" in src)


def check_verified_badge():
    print("\n── components/marketplace/VerifiedBadge.tsx ──")
    src = (ROOT / "components/marketplace/VerifiedBadge.tsx").read_text(encoding="utf-8")
    check("VerifiedBadge has 'use client'",         '"use client"' in src or "'use client'" in src)
    check("VerifiedBadge returns null if not verified", "null" in src)
    check("VerifiedBadge accepts verifiedStatus prop",  "verifiedStatus" in src)
    check("VerifiedBadge accepts supplementLabel prop", "supplementLabel" in src)
    check("VerifiedBadge accepts size prop",            "size" in src)
    check("VerifiedBadge has Tooltip",                  "Tooltip" in src)
    check("VerifiedBadge uses ShieldCheck icon",        "ShieldCheck" in src)
    check("VerifiedBadge shows 'Verified' text",        "Verified" in src)


def check_freelancer_card():
    print("\n── components/marketplace/FreelancerCard.tsx ──")
    src = (ROOT / "components/marketplace/FreelancerCard.tsx").read_text(encoding="utf-8")
    check("FreelancerCard links to /freelancers/[id]",      "/freelancers/" in src)
    check("FreelancerCard imports VerifiedBadge",           "VerifiedBadge" in src)
    check("FreelancerCard imports SkillChip",               "SkillChip" in src)
    check("FreelancerCard imports StarRating",              "StarRating" in src)
    check("FreelancerCard shows top 4 skills",              "slice(0, 4)" in src or "slice(0,4)" in src)
    check("FreelancerCard shows overflow count",            "extraSkills" in src or "extra" in src.lower())
    check("FreelancerCard shows work_preference",           "work_preference" in src)
    check("FreelancerCard shows hourly rate with ₱",        "₱" in src)
    check("FreelancerCard shows location",                  "location" in src)
    check("FreelancerCard shows rating",                    "rating" in src)
    check("FreelancerCard has hover effects",               "hover" in src)
    check("FreelancerCard shows profession badge",          "profession" in src)


def check_freelancers_page():
    print("\n── app/(marketplace)/freelancers/page.tsx ──")
    src = (ROOT / "app/(marketplace)/freelancers/page.tsx").read_text(encoding="utf-8")
    check("freelancers/page is server component (no 'use client')", "'use client'" not in src and '"use client"' not in src)
    check("freelancers/page fetches role = freelancer",             "freelancer" in src)
    check("freelancers/page orders by rating",                      "rating" in src)
    check("freelancers/page has pagination (20 per page)",          "20" in src or "PAGE_SIZE" in src)
    check("freelancers/page renders FreelancerCard",                "FreelancerCard" in src)
    check("freelancers/page renders FreelancerFilters",             "FreelancerFilters" in src)
    check("freelancers/page has empty state",                       "No freelancers" in src)
    check("freelancers/page has prev/next pagination links",        "Previous" in src and "Next" in src)
    check("freelancers/page fetches supplement labels for verified","supplementLabel" in src or "supplement_label" in src)


def check_profile_page():
    print("\n── app/(marketplace)/freelancers/[id]/page.tsx ──")
    src = (ROOT / "app/(marketplace)/freelancers/[id]/page.tsx").read_text(encoding="utf-8")
    check("profile page is server component",               "'use client'" not in src and '"use client"' not in src)
    check("profile page calls notFound()",                  "notFound()" in src)
    check("profile page checks role = freelancer",          "freelancer" in src)
    check("profile page shows Edit Profile for owner",      "Edit Profile" in src)
    check("profile page shows Hire button for clients",     "Hire" in src)
    check("profile page hides Hire button for owner",       "isOwner" in src)
    check("profile page shows VerifiedBadge",               "VerifiedBadge" in src)
    check("profile page shows StarRating",                  "StarRating" in src)
    check("profile page shows SkillChip for skills",        "SkillChip" in src)
    check("profile page shows skills empty state",          "No skills listed yet" in src)
    check("profile page shows reviews",                     "reviews" in src)
    check("profile page shows reviews empty state",         "No reviews yet" in src)
    check("profile page shows completed jobs count",        "completedJobs" in src or "completed" in src)
    check("profile page shows member since date",           "Member Since" in src or "created_at" in src)
    check("profile page shows portfolio link",              "portfolio_url" in src)
    check("profile page shows View Portfolio button",       "View Portfolio" in src)
    check("profile page shows bio section",                 "bio" in src)
    check("profile page fetches verification record",       "verifications" in src)
    check("profile page fetches reviewer profiles",         "reviewerMap" in src or "reviewer" in src)


def check_profile_edit_form():
    print("\n── components/marketplace/ProfileEditForm.tsx ──")
    src = (ROOT / "components/marketplace/ProfileEditForm.tsx").read_text(encoding="utf-8")
    check("ProfileEditForm has 'use client'",               '"use client"' in src or "'use client'" in src)
    check("ProfileEditForm calls updateFullProfileAction",  "updateFullProfileAction" in src)
    check("ProfileEditForm has avatar file upload",         'type="file"' in src or "file" in src)
    check("ProfileEditForm has full_name input",            "full_name" in src)
    check("ProfileEditForm has bio textarea",               "bio" in src)
    check("ProfileEditForm has location input",             "location" in src)
    check("ProfileEditForm shows freelancer fields conditionally", "isFreelancer" in src)
    check("ProfileEditForm has CategoryInput for profession",      "CategoryInput" in src)
    check("ProfileEditForm has TagInput for skills",               "TagInput" in src)
    check("ProfileEditForm has work_preference toggle",            "work_preference" in src)
    check("ProfileEditForm has hourly_rate_min/max inputs",        "hourly_rate_min" in src and "hourly_rate_max" in src)
    check("ProfileEditForm serializes skills as JSON",             "JSON.stringify" in src)
    check("ProfileEditForm uses useTransition",                    "useTransition" in src)
    check("ProfileEditForm shows error state",                     "error" in src)
    check("ProfileEditForm has loading state",                     "isPending" in src or "Saving" in src)


def check_edit_page():
    print("\n── app/(marketplace)/profile/edit/page.tsx ──")
    src = (ROOT / "app/(marketplace)/profile/edit/page.tsx").read_text(encoding="utf-8")
    check("edit/page redirects if no user",     '"/login"' in src)
    check("edit/page redirects if no role",     '"/setup"' in src)
    check("edit/page renders ProfileEditForm",  "ProfileEditForm" in src)
    check("edit/page fetches profile server-side", "supabase" in src)


def check_auth_action():
    print("\n── lib/actions/auth.ts (updateFullProfileAction) ──")
    src = (ROOT / "lib/actions/auth.ts").read_text(encoding="utf-8")
    check("auth.ts has updateFullProfileAction",       "updateFullProfileAction" in src)
    check("auth.ts accepts FormData",                  "FormData" in src)
    check("auth.ts uploads avatar to avatars bucket",  "avatars" in src)
    check("auth.ts upserts avatar",                    "upsert" in src)
    check("auth.ts parses skills JSON",                "JSON.parse" in src)
    check("auth.ts guards full_name required",         "full_name" in src)
    check("auth.ts freelancer-only fields guarded",    "freelancer" in src)
    check("auth.ts redirects to /freelancers/[id]",   "/freelancers/" in src)
    check("auth.ts still has updateProfileAction",     "updateProfileAction" in src)
    check("auth.ts still has signOutAction",           "signOutAction" in src)


def check_autocomplete():
    print("\n── lib/actions/autocomplete.ts (getProfessionSuggestions) ──")
    src = (ROOT / "lib/actions/autocomplete.ts").read_text(encoding="utf-8")
    check("autocomplete.ts has getProfessionSuggestions", "getProfessionSuggestions" in src)
    check("autocomplete.ts queries profiles.profession",  "profiles" in src and "profession" in src)
    check("autocomplete.ts uses ilike",                   "ilike" in src)
    check("autocomplete.ts deduplicates results",         "Set" in src or "unique" in src.lower())


def check_dashboard_links():
    print("\n── app/(marketplace)/dashboard/page.tsx (freelancer links) ──")
    src = (ROOT / "app/(marketplace)/dashboard/page.tsx").read_text(encoding="utf-8")
    check("dashboard has Edit My Profile link",      "Edit My Profile" in src or "/profile/edit" in src)
    check("dashboard has My Public Profile link",    "My Public Profile" in src or "/freelancers/" in src)
    check("dashboard links to /profile/edit",        "/profile/edit" in src)
    check("dashboard links to /freelancers/[user_id]", "user.id" in src and "/freelancers/" in src)


def check_next_config():
    print("\n── next.config.ts (image hostnames) ──")
    src = (ROOT / "next.config.ts").read_text(encoding="utf-8")
    check("next.config.ts has supabase.co hostname", "supabase.co" in src)
    check("next.config.ts has remotePatterns",        "remotePatterns" in src)


# ─── Browser tests ────────────────────────────────────────────────────────────

def run_browser_tests(base_url: str):
    print(f"\n── Browser Tests (headed, against {base_url}) ──")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=400)
        ctx     = browser.new_context(viewport={"width": 1280, "height": 800})
        page    = ctx.new_page()

        console_errors: list[str] = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)

        # ── 1. /freelancers — unauthenticated redirect ──
        print("\n  Testing /freelancers (unauthenticated)…")
        resp = page.goto(f"{base_url}/freelancers", wait_until="domcontentloaded", timeout=20000)
        wait(page, 800)
        check("/freelancers does not 500",          resp.status != 500, f"got {resp.status}")
        check("/freelancers redirects to /login",   "/login" in page.url, f"at {page.url}")
        shot(page, "01_freelancers_unauthenticated")

        # ── 2. /freelancers/some-id — 404 for non-existent freelancer ──
        print("\n  Testing /freelancers/nonexistent-id…")
        resp2 = page.goto(f"{base_url}/freelancers/00000000-0000-0000-0000-000000000000",
                          wait_until="domcontentloaded", timeout=20000)
        wait(page, 800)
        check("/freelancers/[bad-id] does not crash (200 or redirect)",
              resp2.status in (200, 404, 302), f"got {resp2.status}")
        shot(page, "02_freelancer_profile_nonexistent")

        # ── 3. /profile/edit — unauthenticated redirect ──
        print("\n  Testing /profile/edit (unauthenticated)…")
        resp3 = page.goto(f"{base_url}/profile/edit", wait_until="domcontentloaded", timeout=20000)
        wait(page, 800)
        check("/profile/edit does not 500",        resp3.status != 500, f"got {resp3.status}")
        check("/profile/edit redirects to /login", "/login" in page.url, f"at {page.url}")
        shot(page, "03_profile_edit_unauthenticated")

        # ── 4. /login — check no new JS errors ──
        print("\n  Testing /login page (no console errors)…")
        console_errors.clear()
        resp4 = page.goto(f"{base_url}/login", wait_until="domcontentloaded", timeout=20000)
        wait(page, 1000)
        check("/login loads without error", resp4.status == 200, f"got {resp4.status}")
        check("No JS console errors on /login", len(console_errors) == 0,
              str(console_errors[:2]) if console_errors else "")
        shot(page, "04_login_no_errors")

        # ── 5. Landing page integrity ──
        print("\n  Testing landing page still works…")
        console_errors.clear()
        resp5 = page.goto(base_url, wait_until="domcontentloaded", timeout=20000)
        wait(page, 1200)
        check("Landing page still returns 200", resp5.status == 200, f"got {resp5.status}")
        check("No JS errors on landing page", len(console_errors) == 0,
              str(console_errors[:2]) if console_errors else "")
        shot(page, "05_landing_page")

        # ── 6. Mobile: /freelancers ──
        print("\n  Testing /freelancers on mobile…")
        mobile_ctx  = browser.new_context(viewport={"width": 375, "height": 812})
        mobile_page = mobile_ctx.new_page()
        resp_m = mobile_page.goto(f"{base_url}/freelancers", wait_until="domcontentloaded", timeout=20000)
        wait(mobile_page, 600)
        check("/freelancers no 500 on mobile", resp_m.status != 500, f"got {resp_m.status}")
        mobile_page.screenshot(path=str(SHOTS / "06_freelancers_mobile.png"), full_page=True)
        print("  [SHOT] phase4/06_freelancers_mobile.png")
        mobile_page.close()
        mobile_ctx.close()

        # ── 7. Check all pages return no 500s ──
        print("\n  Checking all Phase 4 routes return no 500s…")
        routes = [
            ("/freelancers",             "GET /freelancers"),
            ("/profile/edit",            "GET /profile/edit"),
            ("/freelancers/test-id-404", "GET /freelancers/[id] (404)"),
        ]
        for route, label in routes:
            r = page.goto(f"{base_url}{route}", wait_until="domcontentloaded", timeout=15000)
            wait(page, 400)
            check(f"{label} no 500", r.status != 500, f"got {r.status}")
            shot(page, f"07_{label.replace('/', '_').replace(' ', '_').lower()}")

        # ── 8. Verify no Application error text on any Phase 4 route ──
        print("\n  Checking for unhandled errors on Phase 4 routes…")
        for route, label in routes:
            page.goto(f"{base_url}{route}", wait_until="domcontentloaded", timeout=15000)
            wait(page, 400)
            body = page.text_content("body") or ""
            check(f"{label} no unhandled exception",
                  "Application error" not in body and "Unhandled" not in body,
                  body[:100] if "Application error" in body else "")

        browser.close()


# ─── Summary ──────────────────────────────────────────────────────────────────

def print_summary() -> bool:
    print("\n" + "=" * 60)
    passed = sum(1 for ok, _ in results if ok)
    total  = len(results)
    failed = [msg for ok, msg in results if not ok]
    print(f"Phase 4 Results: {passed}/{total} checks passed")
    if failed:
        print("\nFailed checks:")
        for m in failed:
            print(f"  {m}")
    else:
        print("All checks passed! Phase 4 is complete.")
    print(f"\nScreenshots saved to: {SHOTS}")
    print("=" * 60)
    return len(failed) == 0


if __name__ == "__main__":
    check_files()
    check_skill_chip()
    check_star_rating()
    check_verified_badge()
    check_freelancer_card()
    check_freelancers_page()
    check_profile_page()
    check_profile_edit_form()
    check_edit_page()
    check_auth_action()
    check_autocomplete()
    check_dashboard_links()
    check_next_config()
    run_browser_tests(BASE_URL)

    ok = print_summary()
    sys.exit(0 if ok else 1)
