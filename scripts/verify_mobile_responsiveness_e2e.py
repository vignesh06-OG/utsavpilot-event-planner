import sys
import io
import os
import json
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

os.makedirs('docs/screenshots_responsive', exist_ok=True)

VIEWPORTS = [
    (320, 667, "320px_iPhone_SE_1"),
    (360, 800, "360px_Galaxy_S8"),
    (375, 667, "375px_iPhone_SE_2"),
    (390, 844, "390px_iPhone_14"),
    (414, 896, "414px_iPhone_XR"),
    (430, 932, "430px_iPhone_15_Max"),
    (768, 1024, "768px_iPad_Portrait"),
    (1024, 768, "1024px_iPad_Landscape"),
    (1366, 768, "1366px_Desktop"),
]

JS_CHECK_OVERFLOW = """
() => {
    const innerWidth = window.innerWidth;
    const docScrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    
    const isInsideScrollContainer = (el) => {
        let parent = el.parentElement;
        while (parent && parent !== document.body && parent !== document.documentElement) {
            const style = window.getComputedStyle(parent);
            if (['auto', 'scroll'].includes(style.overflowX)) {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    };
    
    const offenders = [];
    for (const el of document.querySelectorAll('*')) {
        if (['SCRIPT', 'STYLE', 'path', 'defs', 'linearGradient', 'g'].includes(el.tagName)) continue;
        if (isInsideScrollContainer(el)) continue;
        
        const rect = el.getBoundingClientRect();
        if (rect.right > innerWidth + 1.5 && rect.width > 0) {
            offenders.push({
                tag: el.tagName,
                cls: el.className?.toString?.() || '',
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflow: Math.round(rect.right - innerWidth),
                text: (el.innerText || el.textContent || '').trim().substring(0, 40).replace(/\\n/g, ' ')
            });
        }
    }
    return {
        innerWidth,
        docScrollWidth,
        bodyScrollWidth,
        hasHorizontalScroll: docScrollWidth > innerWidth || bodyScrollWidth > innerWidth,
        overflowCount: offenders.length,
        offenders: offenders.slice(0, 5)
    };
}
"""

def test_all_viewports(base_url):
    print(f"\n=======================================================")
    print(f"VERIFYING MOBILE RESPONSIVENESS ACROSS 9 VIEWPORTS")
    print(f"Target: {base_url}")
    print(f"=======================================================")
    
    results = {}
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # Test 1: Landing Page Overflow across all 9 viewports
        print("\n--- VIEWPORT AUDIT: LANDING PAGE ---")
        for w, h, name in VIEWPORTS:
            page = browser.new_page(viewport={'width': w, 'height': h})
            page.goto(base_url, wait_until='networkidle')
            page.wait_for_timeout(500)
            
            chk = page.evaluate(JS_CHECK_OVERFLOW)
            is_pass = (chk['overflowCount'] == 0) and (not chk['hasHorizontalScroll'])
            status = "PASS" if is_pass else "FAIL"
            print(f"[{status}] {name} ({w}x{h}): docScrollWidth={chk['docScrollWidth']}px, innerWidth={chk['innerWidth']}px, overflows={chk['overflowCount']}")
            if not is_pass:
                for off in chk['offenders']:
                    print(f"   -> OFFENDER: <{off['tag']} class='{off['cls']}'> w={off['width']}, r={off['right']} (+{off['overflow']}px) '{off['text']}'")
            
            results[f"landing_{w}px"] = status
            
            # Save screenshots for key viewports
            if w in [320, 360, 390, 768, 1366]:
                page.screenshot(path=f"docs/screenshots_responsive/{w}px_landing.png", full_page=False)
            
            page.close()

        # Test 2: Full interactive mobile workflow at 360px Mobile
        print("\n--- DEEP INTERACTIVE WORKFLOW TESTS (360px Mobile) ---")
        page = browser.new_page(viewport={'width': 360, 'height': 800})
        page.goto(base_url, wait_until='networkidle')
        page.wait_for_timeout(500)
        
        # 1. Test Mobile Hamburger Navigation Menu
        print("1. Testing Mobile Hamburger Navigation Menu...")
        menu_toggle = page.locator('.mobile-nav-toggle')
        menu_toggle.click(force=True)
        page.wait_for_timeout(350)
        page.screenshot(path="docs/screenshots_responsive/360px_nav_menu.png")
        drawer_visible = page.locator('.mobile-nav-drawer').is_visible()
        print(f"   -> Mobile Menu Drawer visible: {drawer_visible}")
        
        # 2. Start Celebration Planner from Drawer
        print("2. Starting Celebration Planner Wizard from Mobile Menu...")
        page.locator('.mobile-nav-drawer button:has-text("Plan New Celebration")').click(force=True)
        page.wait_for_timeout(600)
        page.screenshot(path="docs/screenshots_responsive/360px_wizard_step1.png")
        
        chk_wiz1 = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Wizard Step 1: docScrollWidth={chk_wiz1['docScrollWidth']}px (overflows={chk_wiz1['overflowCount']})")
        
        # 3. Category Switching on Mobile
        print("3. Switching Categories on Mobile (Birthday -> Anniversary -> Wedding)...")
        page.locator('div[role="radio"]:has-text("Birthday")').click(force=True)
        page.wait_for_timeout(200)
        page.locator('div[role="radio"]:has-text("Anniversary")').click(force=True)
        page.wait_for_timeout(200)
        page.locator('div[role="radio"]:has-text("Wedding")').click(force=True)
        page.wait_for_timeout(200)
        
        # 4. Fill custom title with very long text to test word wrapping
        print("4. Entering long custom title to test word wrapping...")
        title_in = page.locator('#event-title')
        long_title = "The Majestic Royal Palace Vivah & Sangeet Extravaganza with Extended Family"
        title_in.fill(long_title)
        
        # 5. Progressing through Stepper tabs
        print("5. Progressing through Stepper tabs...")
        page.locator('button:has-text("Continue")').click(force=True)
        page.wait_for_timeout(400)
        chk_wiz2 = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Wizard Step 2: docScrollWidth={chk_wiz2['docScrollWidth']}px (overflows={chk_wiz2['overflowCount']})")
        
        page.locator('button:has-text("Continue")').click(force=True)
        page.wait_for_timeout(400)
        chk_wiz3 = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Wizard Step 3: docScrollWidth={chk_wiz3['docScrollWidth']}px (overflows={chk_wiz3['overflowCount']})")
        
        # 6. Generate Actionable Plan
        print("6. Generating Plan on Mobile...")
        page.locator('button[type="submit"]:has-text("Generate Actionable Plan")').click(force=True)
        page.wait_for_timeout(1000)
        
        # 7. Check Dashboard Summary & Metrics
        print("7. Inspecting Executive Summary & Financial Metric Cards at 360px...")
        page.screenshot(path="docs/screenshots_responsive/360px_dashboard.png")
        chk_dash = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Dashboard: docScrollWidth={chk_dash['docScrollWidth']}px (overflows={chk_dash['overflowCount']})")
        
        # 8. Check Budget Tab
        print("8. Inspecting Budget & Feasibility Tab at 360px...")
        page.locator('button[role="tab"]:has-text("Budget")').click(force=True)
        page.wait_for_timeout(400)
        chk_budget = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Budget Tab: docScrollWidth={chk_budget['docScrollWidth']}px (overflows={chk_budget['overflowCount']})")
        
        # 9. Check Tasks Tab
        print("9. Inspecting Milestone Tasks & Toggling Task...")
        page.locator('button[role="tab"]:has-text("Tasks")').click(force=True)
        page.wait_for_timeout(400)
        first_task = page.locator('div[role="checkbox"]').first
        if first_task.count() > 0:
            first_task.click(force=True)
            page.wait_for_timeout(300)
        chk_tasks = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Tasks Tab: docScrollWidth={chk_tasks['docScrollWidth']}px (overflows={chk_tasks['overflowCount']})")
        
        # 10. Check Vendors Tab
        print("10. Inspecting Vendor Due Diligence Tab...")
        page.locator('button[role="tab"]:has-text("Vendor")').click(force=True)
        page.wait_for_timeout(400)
        expand_vendor = page.locator('button:has-text("Questions & Tips")').first
        if expand_vendor.count() > 0:
            expand_vendor.click(force=True)
            page.wait_for_timeout(300)
        chk_vendors = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Vendors Tab: docScrollWidth={chk_vendors['docScrollWidth']}px (overflows={chk_vendors['overflowCount']})")
        
        # 11. Check Cultural Ideas Tab
        print("11. Inspecting Cultural Ideas Tab...")
        page.locator('button[role="tab"]:has-text("Ideas")').click(force=True)
        page.wait_for_timeout(400)
        chk_ideas = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Cultural Ideas Tab: docScrollWidth={chk_ideas['docScrollWidth']}px (overflows={chk_ideas['overflowCount']})")
        
        # 12. Check Adaptive Replanning Modal at 360px
        print("12. Triggering Adaptive Replanning Modal on Mobile...")
        page.locator('button:has-text("Adapt & Replan")').click(force=True)
        page.wait_for_timeout(500)
        page.screenshot(path="docs/screenshots_responsive/360px_replan_modal.png")
        chk_replan = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Replan Modal: docScrollWidth={chk_replan['docScrollWidth']}px (overflows={chk_replan['overflowCount']})")
        page.locator('button:has-text("Cancel")').first.click(force=True)
        page.wait_for_timeout(300)
        
        # 13. Open Printable Dossier on Mobile via Hamburger Menu
        print("13. Opening Printable Dossier on Mobile...")
        page.locator('.mobile-nav-toggle').click(force=True)
        page.wait_for_timeout(300)
        page.locator('.mobile-nav-drawer button:has-text("Print / PDF Dossier")').click(force=True)
        page.wait_for_timeout(600)
        page.screenshot(path="docs/screenshots_responsive/360px_dossier.png")
        chk_dossier = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"   -> Print Dossier: docScrollWidth={chk_dossier['docScrollWidth']}px (overflows={chk_dossier['overflowCount']})")
        page.locator('button[aria-label="Close dossier view"]').click(force=True)
        page.wait_for_timeout(300)
        
        # 14. Check Tablet (768px) and Desktop (1366px) non-regression
        print("\n--- TABLET & DESKTOP NON-REGRESSION CHECKS ---")
        page.set_viewport_size({'width': 768, 'height': 1024})
        page.wait_for_timeout(400)
        page.screenshot(path="docs/screenshots_responsive/768px_dashboard.png")
        chk_768 = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"[PASS={chk_768['overflowCount'] == 0 and not chk_768['hasHorizontalScroll']}] 768px Tablet: docScrollWidth={chk_768['docScrollWidth']}px (overflows={chk_768['overflowCount']})")
        
        page.set_viewport_size({'width': 1366, 'height': 768})
        page.wait_for_timeout(400)
        page.screenshot(path="docs/screenshots_responsive/1366px_dashboard.png")
        chk_1366 = page.evaluate(JS_CHECK_OVERFLOW)
        print(f"[PASS={chk_1366['overflowCount'] == 0 and not chk_1366['hasHorizontalScroll']}] 1366px Desktop: docScrollWidth={chk_1366['docScrollWidth']}px (overflows={chk_1366['overflowCount']})")
        
        page.close()
        browser.close()
        
    print("\n=======================================================")
    print("ALL RESPONSIVE AUDIT CHECKS COMPLETE!")
    print("=======================================================")

if __name__ == '__main__':
    test_all_viewports("http://localhost:5173")
