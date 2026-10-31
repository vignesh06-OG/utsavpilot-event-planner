import sys
import io
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUTPUT_DIR = Path("C:/Users/gandh/.gemini/antigravity-ide/scratch/utsavpilot/docs/screenshots_visual_qa")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    {"name": "1440x900_desktop", "width": 1440, "height": 900},
    {"name": "1280x800_laptop", "width": 1280, "height": 800},
    {"name": "390x844_mobile", "width": 390, "height": 844},
    {"name": "360x740_compact", "width": 360, "height": 740},
]

def run_qa():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for vp in VIEWPORTS:
            print(f"\n--- Testing Viewport: {vp['name']} ({vp['width']}x{vp['height']}) ---")
            page = browser.new_page(viewport={"width": vp["width"], "height": vp["height"]})
            page.goto("http://localhost:5173/")
            page.wait_for_load_state("networkidle")
            time.sleep(1.0)
            
            # Check horizontal overflow
            scroll_width = page.evaluate("document.documentElement.scrollWidth")
            client_width = page.evaluate("document.documentElement.clientWidth")
            overflow = scroll_width > client_width
            print(f"Scroll width: {scroll_width}, Client width: {client_width}, Overflow: {overflow}")
            assert not overflow, f"Horizontal overflow detected on {vp['name']}!"
            
            # Scroll down to trigger lazy loading for below-the-fold images
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(1.0)
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(0.5)

            # Audit all images in DOM
            images = page.locator("img").all()
            print(f"Total <img> tags found: {len(images)}")
            for idx, img in enumerate(images):
                src = img.get_attribute("src")
                vis = img.is_visible()
                natural_w = img.evaluate("el => el.naturalWidth")
                natural_h = img.evaluate("el => el.naturalHeight")
                print(f"  Img [{idx}]: src={src}, visible={vis}, naturalSize={natural_w}x{natural_h}")
                assert natural_w > 0, f"Image {src} failed to load! (naturalWidth is 0)"
                
            # Screenshot hero section
            screenshot_path = OUTPUT_DIR / f"hero_{vp['name']}.png"
            page.screenshot(path=str(screenshot_path))
            print(f"Saved screenshot: {screenshot_path}")
            
            # If desktop, also test Wizard Step 1 archetype cards
            if vp["width"] == 1440:
                print("\nTesting Wizard Archetype Cards on Desktop...")
                page.locator('button:has-text("Plan Celebration"), button:has-text("Plan Your Celebration")').first.click()
                time.sleep(1.0)
                
                wizard_images = page.locator(".card-interactive img").all()
                print(f"Wizard archetype <img> tags found: {len(wizard_images)}")
                for idx, img in enumerate(wizard_images):
                    src = img.get_attribute("src")
                    nw = img.evaluate("el => el.naturalWidth")
                    nh = img.evaluate("el => el.naturalHeight")
                    print(f"  Archetype Img [{idx}]: src={src}, naturalSize={nw}x{nh}")
                    assert nw > 0, f"Wizard archetype image {src} failed to load!"
                    
                wizard_shot = OUTPUT_DIR / "wizard_archetypes_desktop.png"
                page.screenshot(path=str(wizard_shot))
                print(f"Saved wizard screenshot: {wizard_shot}")
                
            page.close()
            
        browser.close()
    print("\nALL VIEWPORT QA CHECKS PASSED WITH 100% IMAGE LOAD SUCCESS!")

if __name__ == '__main__':
    run_qa()
