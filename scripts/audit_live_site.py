import os
import sys
import json
import time
from playwright.sync_api import sync_playwright

LIVE_URL = "https://vignesh06-og.github.io/utsavpilot-event-planner/"

def run_audit():
    print(f"Starting browser audit on {LIVE_URL}...")
    results = {
        "console_errors": [],
        "failed_requests": [],
        "wizard_defaults": {},
        "category_switching": {},
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        # Track console errors
        page.on("console", lambda msg: results["console_errors"].append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        # Track failed network requests
        page.on("requestfailed", lambda req: results["failed_requests"].append(f"{req.method} {req.url} - {req.failure}"))
        
        # 1. Visit landing page
        page.goto(LIVE_URL)
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        
        # 2. Open Wizard
        plan_btn = page.locator('button:has-text("Plan Your Celebration"), button:has-text("Plan Celebration")').first
        plan_btn.click()
        page.wait_for_selector('#event-title', timeout=5000)
        
        # Inspect Title input initial value and placeholder
        title_val = page.locator('#event-title').input_value()
        title_ph = page.locator('#event-title').get_attribute('placeholder')
        results["wizard_defaults"]["initial_title_value"] = title_val
        results["wizard_defaults"]["initial_title_placeholder"] = title_ph
        print(f"Initial Title Value: '{title_val}'")
        print(f"Initial Title Placeholder: '{title_ph}'")
        
        # Inspect City input initial value and placeholder
        city_val = page.locator('#event-city').input_value()
        city_ph = page.locator('#event-city').get_attribute('placeholder')
        results["wizard_defaults"]["initial_city_value"] = city_val
        results["wizard_defaults"]["initial_city_placeholder"] = city_ph
        print(f"Initial City Value: '{city_val}'")
        
        # 3. Test Category Switching: Wedding -> Birthday -> Puja -> College Fest
        # Birthday
        bday_card = page.locator('div[role="radio"]:has-text("Birthday")').first
        if bday_card.is_visible():
            bday_card.click()
            time.sleep(0.5)
            val_after_bday = page.locator('#event-title').input_value()
            ph_after_bday = page.locator('#event-title').get_attribute('placeholder')
            results["category_switching"]["birthday"] = {"value": val_after_bday, "placeholder": ph_after_bday}
            print(f"After selecting Birthday: value='{val_after_bday}', placeholder='{ph_after_bday}'")
            
        # Puja
        puja_card = page.locator('div[role="radio"]:has-text("Puja")').first
        if puja_card.is_visible():
            puja_card.click()
            time.sleep(0.5)
            val_after_puja = page.locator('#event-title').input_value()
            ph_after_puja = page.locator('#event-title').get_attribute('placeholder')
            results["category_switching"]["puja"] = {"value": val_after_puja, "placeholder": ph_after_puja}
            print(f"After selecting Puja: value='{val_after_puja}', placeholder='{ph_after_puja}'")
            
        browser.close()
        
    print("\nAudit Summary:")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    run_audit()
