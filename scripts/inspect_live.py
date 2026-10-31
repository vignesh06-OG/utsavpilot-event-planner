import sys
import io
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('https://vignesh06-og.github.io/utsavpilot-event-planner/')
    page.wait_for_load_state('networkidle')
    
    # Go directly to Planner Workspace
    page.locator('button:has-text("Planner Workspace")').click()
    page.wait_for_timeout(800)
    
    print("\n--- CLICKING 'Adapt & Replan' ---")
    page.locator('button:has-text("Adapt & Replan")').click()
    page.wait_for_timeout(800)
    
    print("Replan modal visible. Inputs in modal:")
    for idx, inp in enumerate(page.locator('input, select, textarea').all()):
        print(f"Modal Input [{idx}]: type={inp.get_attribute('type')}, id={inp.get_attribute('id')}, name={inp.get_attribute('name')}, val={inp.input_value()}")

    print("Buttons in modal:")
    for idx, b in enumerate(page.locator('button').all()):
        text = b.inner_text().strip().replace('\n', ' ')
        if text and b.is_visible():
            print(f"Modal btn [{idx}]: {text}")

    print("\n--- CLICKING 'Print Dossier' ---")
    # Close replan modal first if there's a close or cancel button
    close_btn = page.locator('button:has-text("Close"), button:has-text("Cancel"), button[aria-label="Close"]').first
    if close_btn.is_visible():
        close_btn.click()
        page.wait_for_timeout(500)
        
    page.locator('button:has-text("Print Dossier")').click()
    page.wait_for_timeout(800)
    print("Print Dossier dialog opened. Text snippet:")
    dialog = page.locator('[role="dialog"]')
    if dialog.count() > 0:
        print(dialog.first.inner_text()[:300])

    browser.close()
