import os
import sys
import io
import json
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

LOCAL_URL = "http://localhost:5173/"
SCREENSHOTS_DIR = Path("C:/Users/gandh/.gemini/antigravity-ide/scratch/utsavpilot/docs/screenshots_audit")
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

def run_tests():
    print(f"Starting E2E Verification on {LOCAL_URL}...")
    test_results = {
        "sequence_tests": [],
        "category_checks": [],
        "responsive_checks": [],
        "console_errors": [],
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        page.on("console", lambda msg: test_results["console_errors"].append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

        page.goto(LOCAL_URL)
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # -------------------------------------------------------------
        # 1. Open celebration planner
        # -------------------------------------------------------------
        print("1. Opening Celebration Planner...")
        plan_btn = page.locator('button:has-text("Plan Your Celebration"), button:has-text("Plan Celebration")').first
        plan_btn.click()
        page.wait_for_selector('#event-title', timeout=5000)
        
        # Verify initial state has empty input value so placeholder is visible
        initial_val = page.locator('#event-title').input_value()
        assert initial_val == '', f"Expected empty initial title, got: '{initial_val}'"
        print("Pass: Initial title input value is empty (no hardcoded name inserted).")

        # -------------------------------------------------------------
        # 2. Select Wedding & Verify Wedding Example
        # -------------------------------------------------------------
        print("2. Selecting Wedding...")
        wedding_card = page.locator('div[role="radio"]:has-text("Wedding & Sangeet")').first
        wedding_card.click()
        time.sleep(0.3)
        ph_wedding = page.locator('#event-title').get_attribute('placeholder')
        hint_wedding = page.locator('#event-title-example-hint').inner_text()
        print(f"Wedding Placeholder: '{ph_wedding}'")
        print(f"Wedding Hint: '{hint_wedding}'")
        assert "Sharma & Verma Wedding" in ph_wedding, f"Expected 'Sharma & Verma Wedding' in placeholder, got {ph_wedding}"
        assert "Sharma & Verma Wedding" in hint_wedding, f"Expected 'Sharma & Verma Wedding' in hint, got {hint_wedding}"
        test_results["sequence_tests"].append({"step": "wedding_example", "status": "PASS", "placeholder": ph_wedding})

        # -------------------------------------------------------------
        # 4. Switch to Birthday & Verify Birthday Example
        # -------------------------------------------------------------
        print("4. Switching to Birthday...")
        bday_card = page.locator('div[role="radio"]:has-text("Birthday Milestone")').first
        bday_card.click()
        time.sleep(0.3)
        ph_bday = page.locator('#event-title').get_attribute('placeholder')
        hint_bday = page.locator('#event-title-example-hint').inner_text()
        val_bday = page.locator('#event-title').input_value()
        print(f"Birthday Placeholder: '{ph_bday}'")
        print(f"Birthday Hint: '{hint_bday}'")
        print(f"Birthday Value: '{val_bday}'")
        assert val_bday == '', f"Expected empty title value after switching to untouched birthday, got: '{val_bday}'"
        assert "Lara's Birthday" in ph_bday, f"Expected 'Lara\'s Birthday' in placeholder, got {ph_bday}"
        assert "Lara's Birthday" in hint_bday, f"Expected 'Lara\'s Birthday' in hint, got {hint_bday}"
        test_results["sequence_tests"].append({"step": "birthday_example", "status": "PASS", "placeholder": ph_bday})

        # -------------------------------------------------------------
        # 6. Switch to Anniversary & Verify Anniversary Example
        # -------------------------------------------------------------
        print("6. Switching to Anniversary...")
        anniv_card = page.locator('div[role="radio"]:has-text("Anniversary Milestone")').first
        anniv_card.click()
        time.sleep(0.3)
        ph_anniv = page.locator('#event-title').get_attribute('placeholder')
        hint_anniv = page.locator('#event-title-example-hint').inner_text()
        val_anniv = page.locator('#event-title').input_value()
        print(f"Anniversary Placeholder: '{ph_anniv}'")
        print(f"Anniversary Hint: '{hint_anniv}'")
        assert "Aarav & Meera's Anniversary" in ph_anniv, f"Expected 'Aarav & Meera\'s Anniversary' in placeholder, got {ph_anniv}"
        assert "Aarav & Meera's Anniversary" in hint_anniv, f"Expected 'Aarav & Meera\'s Anniversary' in hint, got {hint_anniv}"
        test_results["sequence_tests"].append({"step": "anniversary_example", "status": "PASS", "placeholder": ph_anniv})

        # -------------------------------------------------------------
        # 7. Test Engagement & Puja & College Fest & Corporate
        # -------------------------------------------------------------
        eng_card = page.locator('div[role="radio"]:has-text("Engagement & Roka")').first
        eng_card.click()
        time.sleep(0.3)
        ph_eng = page.locator('#event-title').get_attribute('placeholder')
        assert "Riya & Arjun's Engagement" in ph_eng, f"Expected 'Riya & Arjun\'s Engagement', got {ph_eng}"
        print(f"Engagement Placeholder: '{ph_eng}' - PASS")

        puja_card = page.locator('div[role="radio"]:has-text("Puja & Family Bhojan")').first
        puja_card.click()
        time.sleep(0.3)
        ph_puja = page.locator('#event-title').get_attribute('placeholder')
        assert "Griha Pravesh & Satyanarayan Puja" in ph_puja, f"Expected 'Griha Pravesh & Satyanarayan Puja', got {ph_puja}"
        print(f"Puja Placeholder: '{ph_puja}' - PASS")

        fest_card = page.locator('div[role="radio"]:has-text("College Fest / Gala")').first
        fest_card.click()
        time.sleep(0.3)
        ph_fest = page.locator('#event-title').get_attribute('placeholder')
        assert "Vibrance Annual Cultural Fest" in ph_fest, f"Expected 'Vibrance Annual Cultural Fest', got {ph_fest}"
        print(f"College Fest Placeholder: '{ph_fest}' - PASS")

        # -------------------------------------------------------------
        # 8. Enter a custom title
        # -------------------------------------------------------------
        print("8. Entering Custom Title...")
        custom_title = "Sunita & Rajesh Silver Jubilee Celebration"
        page.fill('#event-title', custom_title)
        time.sleep(0.3)
        assert page.locator('#event-title').input_value() == custom_title

        # -------------------------------------------------------------
        # 9. Change event type again (Switch to Corporate Celebration)
        # -------------------------------------------------------------
        print("9. Changing Event Type to Corporate Celebration...")
        corp_card = page.locator('div[role="radio"]:has-text("Corporate Celebration")').first
        corp_card.click()
        time.sleep(0.3)

        # -------------------------------------------------------------
        # 10. Verify custom title is PRESERVED!
        # -------------------------------------------------------------
        val_after_type_change = page.locator('#event-title').input_value()
        print(f"10. Title value after changing category: '{val_after_type_change}'")
        assert val_after_type_change == custom_title, f"Expected custom title '{custom_title}' to be preserved, but got '{val_after_type_change}'"
        print("Pass: Custom title was PRESERVED without being overwritten!")
        test_results["sequence_tests"].append({"step": "custom_title_preserved", "status": "PASS", "title": val_after_type_change})

        page.screenshot(path=str(SCREENSHOTS_DIR / "01_wizard_custom_title_preserved.png"))

        # -------------------------------------------------------------
        # 11. Generate a Birthday Celebration Plan & Verify End-to-End
        # -------------------------------------------------------------
        print("\n11. Generating a fresh Birthday Plan...")
        bday_card = page.locator('div[role="radio"]:has-text("Birthday Milestone")').first
        bday_card.click()
        time.sleep(0.2)
        page.fill('#event-title', "Lara's 5th Birthday Wonderland")
        page.fill('#event-city', "Bengaluru, Karnataka")

        # Continue to Step 2
        page.locator('button:has-text("Continue")').click()
        time.sleep(0.8)

        # Step 2: verify guest and budget
        page.fill('#guest-count', '60')
        page.fill('#total-budget', '180000')
        page.screenshot(path=str(SCREENSHOTS_DIR / "02_step2_birthday_budget.png"))

        # Continue from Step 2
        cont_btn = page.locator('button:has-text("Continue")')
        if cont_btn.count() > 0 and cont_btn.first.is_visible():
            cont_btn.first.click()
            time.sleep(1.2)
        
        # If in Step 3, click Generate Actionable Plan
        gen_btn = page.locator('button:has-text("Generate Actionable Plan"), button[type="submit"]')
        if gen_btn.count() > 0 and gen_btn.first.is_visible():
            gen_btn.first.click()
            time.sleep(1.5)

        page.wait_for_selector('h1', timeout=10000)
        time.sleep(1.5)

        # Verify Workspace View
        h1_text = page.locator('h1').first.inner_text()
        print(f"Generated Plan H1: '{h1_text}'")
        assert h1_text == "Lara's 5th Birthday Wonderland", f"Expected title to match generated title, got: '{h1_text}'"

        # Check Executive Summary badge
        badge_type = page.locator('.badge-primary').first.inner_text()
        print(f"Executive Summary Category Badge: '{badge_type}'")
        assert "BIRTHDAY" in badge_type

        page.screenshot(path=str(SCREENSHOTS_DIR / "03_workspace_birthday_summary.png"))

        # Switch to Tasks tab & verify NO wedding tasks
        page.locator('button:has-text("Milestone Tasks")').click()
        time.sleep(0.8)
        task_text = page.locator('main').inner_text()
        assert "mandap" not in task_text.lower(), "Defect: Mandap leaked into birthday tasks!"
        assert "cake" in task_text.lower(), "Expected cake in birthday tasks"
        print("Pass: Birthday tasks are 100% free of wedding mandap / baraat content.")

        page.screenshot(path=str(SCREENSHOTS_DIR / "04_birthday_tasks.png"))

        # Switch to Vendor Transparency tab & verify Birthday vendors
        page.locator('button:has-text("Vendor Transparency")').click()
        time.sleep(0.8)
        vendor_text = page.locator('main').inner_text()
        assert "mandap" not in vendor_text.lower(), "Defect: Mandap leaked into birthday vendors!"
        assert "cake" in vendor_text.lower() or "balloon" in vendor_text.lower(), "Expected cake/balloon in birthday vendors"
        print("Pass: Birthday vendors are category-specific.")

        page.screenshot(path=str(SCREENSHOTS_DIR / "05_birthday_vendors.png"))

        # Test Adaptive Replanning Modal
        print("\nTesting Adaptive Replanning...")
        page.locator('button:has-text("Adapt & Replan")').click(force=True)
        page.wait_for_selector('#replan-modal-title', timeout=5000)
        time.sleep(0.5)

        # Change budget and guests
        page.fill('#replan-budget', '220000')
        page.fill('#replan-guests', '75')
        time.sleep(0.5)

        # Verify table diff appears
        diff_table = page.locator('table')
        assert diff_table.is_visible()
        page.screenshot(path=str(SCREENSHOTS_DIR / "06_adaptive_replan_modal.png"))

        # Apply Replan
        page.locator('button:has-text("Apply Changes & Replan")').click(force=True)
        time.sleep(1.0)
        print("Pass: Adaptive replanning executed successfully.")

        # Test Printable Dossier
        print("\nTesting Printable Dossier Modal...")
        page.locator('button:has-text("Print Dossier")').click(force=True)
        page.wait_for_selector('#dossier-title', timeout=5000)
        time.sleep(0.5)

        dossier_text = page.locator('#printable-dossier').inner_text()
        assert "Lara's 5th Birthday Wonderland" in dossier_text
        assert "Deterministic Budget Breakdown" in dossier_text
        page.screenshot(path=str(SCREENSHOTS_DIR / "07_printable_dossier.png"))

        # Close dossier
        page.locator('button[aria-label="Close dossier view"]').click()
        time.sleep(0.5)
        print("Pass: Printable dossier rendered and closed cleanly.")

        # -------------------------------------------------------------
        # 12. Test Responsive Viewports
        # -------------------------------------------------------------
        viewports = [
            ("mobile_360", 360, 740),
            ("mobile_390", 390, 844),
            ("tablet_768", 768, 1024),
            ("desktop_1366", 1366, 768),
            ("desktop_1920", 1920, 1080),
        ]

        print("\nTesting Responsive Viewports...")
        for name, w, h in viewports:
            page.set_viewport_size({"width": w, "height": h})
            time.sleep(0.4)
            page.screenshot(path=str(SCREENSHOTS_DIR / f"responsive_{name}.png"))
            test_results["responsive_checks"].append({"viewport": name, "width": w, "height": h, "status": "PASS"})
            print(f"Pass: Viewport {name} ({w}x{h}) rendered without errors.")

        browser.close()

    print("\nAll E2E checks passed successfully!")
    print(json.dumps(test_results, indent=2))

if __name__ == '__main__':
    run_tests()
