import os
import sys
import io
import json
import time
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

LIVE_URL = "https://vignesh06-og.github.io/utsavpilot-event-planner/"

def verify_live():
    print(f"Connecting to deployed live production site: {LIVE_URL}")
    results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        page.goto(LIVE_URL)
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # 1. Open Wizard
        plan_btn = page.locator('button:has-text("Plan Your Celebration"), button:has-text("Plan Celebration")').first
        plan_btn.click()
        page.wait_for_selector('#event-title', timeout=8000)

        # Check initial title value
        initial_val = page.locator('#event-title').input_value()
        initial_ph = page.locator('#event-title').get_attribute('placeholder')
        initial_hint = page.locator('#event-title-example-hint').inner_text()
        print(f"Live Initial Title Value: '{initial_val}' (Expected empty)")
        print(f"Live Initial Title Placeholder: '{initial_ph}'")
        print(f"Live Initial Title Hint: '{initial_hint}'")
        assert initial_val == '', f"Defect: Live title input was not empty, got '{initial_val}'"
        results["initial_state"] = "PASS"

        # 2. Select Wedding
        wedding_card = page.locator('div[role="radio"]:has-text("Wedding & Sangeet")').first
        wedding_card.click()
        time.sleep(0.3)
        ph_wedding = page.locator('#event-title').get_attribute('placeholder')
        print(f"Live Wedding Placeholder: '{ph_wedding}'")
        assert "Sharma & Verma Wedding" in ph_wedding
        results["wedding_placeholder"] = "PASS"

        # 3. Switch to Birthday
        bday_card = page.locator('div[role="radio"]:has-text("Birthday Milestone")').first
        bday_card.click()
        time.sleep(0.3)
        ph_bday = page.locator('#event-title').get_attribute('placeholder')
        val_bday = page.locator('#event-title').input_value()
        print(f"Live Birthday Placeholder: '{ph_bday}'")
        print(f"Live Birthday Value: '{val_bday}'")
        assert val_bday == '', "Title value should remain empty"
        assert "Lara's Birthday" in ph_bday
        results["birthday_placeholder"] = "PASS"

        # 4. Switch to Anniversary
        anniv_card = page.locator('div[role="radio"]:has-text("Anniversary Milestone")').first
        anniv_card.click()
        time.sleep(0.3)
        ph_anniv = page.locator('#event-title').get_attribute('placeholder')
        print(f"Live Anniversary Placeholder: '{ph_anniv}'")
        assert "Aarav & Meera's Anniversary" in ph_anniv
        results["anniversary_placeholder"] = "PASS"

        # 5. Enter Custom Title & Change Category
        custom_title = "Kavita & Suresh Golden Jubilee 50th"
        page.fill('#event-title', custom_title)
        time.sleep(0.3)

        # Switch to Corporate Celebration
        corp_card = page.locator('div[role="radio"]:has-text("Corporate Celebration")').first
        corp_card.click()
        time.sleep(0.3)
        val_after_change = page.locator('#event-title').input_value()
        print(f"Live Value after category change: '{val_after_change}'")
        assert val_after_change == custom_title, f"Expected '{custom_title}' preserved, got '{val_after_change}'"
        results["custom_title_preserved"] = "PASS"

        browser.close()

    print("\nLive Production Verification Complete! All checks PASSED!")
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    verify_live()

