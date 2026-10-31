import sys
import io
import time
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

LIVE_URL = 'https://vignesh06-og.github.io/utsavpilot-event-planner/'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    
    print('Navigating to LIVE deployed GitHub Pages:', LIVE_URL)
    page.goto(LIVE_URL)
    page.wait_for_load_state('networkidle')
    time.sleep(1.5)
    
    # Check Hero images
    hero_imgs = page.locator('.hero-image-grid img').all()
    print(f'Hero images found: {len(hero_imgs)}')
    for idx, img in enumerate(hero_imgs):
        src = img.get_attribute('src')
        nw = img.evaluate('el => el.naturalWidth')
        nh = img.evaluate('el => el.naturalHeight')
        print(f'  Hero img [{idx}]: src={src}, naturalSize={nw}x{nh}')
        assert nw > 0 and nh > 0, f'Hero image {src} failed to load!'
        
    # Scroll to Curated Presets
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    time.sleep(1.5)
    preset_imgs = page.locator('.grid-4 img').all()
    print(f'Preset images found: {len(preset_imgs)}')
    for idx, img in enumerate(preset_imgs):
        src = img.get_attribute('src')
        nw = img.evaluate('el => el.naturalWidth')
        nh = img.evaluate('el => el.naturalHeight')
        print(f'  Preset img [{idx}]: src={src}, naturalSize={nw}x{nh}')
        assert nw > 0 and nh > 0, f'Preset image {src} failed to load!'

    # Check Wizard Archetype images
    print('\nTesting live Wizard Archetypes on GitHub Pages...')
    page.evaluate('window.scrollTo(0, 0)')
    page.locator('button:has-text("Plan Your Celebration"), button:has-text("Plan Celebration")').first.click()
    time.sleep(1.5)
    wizard_imgs = page.locator('#event-type-grid img').all()
    print(f'Wizard archetype images found: {len(wizard_imgs)}')
    for idx, img in enumerate(wizard_imgs):
        src = img.get_attribute('src')
        nw = img.evaluate('el => el.naturalWidth')
        nh = img.evaluate('el => el.naturalHeight')
        print(f'  Wizard archetype img [{idx}]: src={src}, naturalSize={nw}x{nh}')
        assert nw > 0 and nh > 0, f'Wizard archetype image {src} failed to load!'

    # Take live screenshot
    page.screenshot(path='C:/Users/gandh/.gemini/antigravity-ide/scratch/utsavpilot/docs/screenshots/live_deployed_verified_hero.png')
    browser.close()
    print('\nLIVE DEPLOYMENT 100% VERIFIED: ALL CELEBRATION IMAGES LOAD AND RENDER FLAWLESSLY ON GITHUB PAGES!')
