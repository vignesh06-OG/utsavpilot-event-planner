import os
import sys
import io
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

# Set stdout encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

LIVE_URL = "https://vignesh06-og.github.io/utsavpilot-event-planner/"
REPO_ROOT = Path("C:/Users/gandh/.gemini/antigravity-ide/scratch/utsavpilot")
RAW_VIDEO_DIR = REPO_ROOT / "docs" / "demo_video" / "raw"
RAW_VIDEO_DIR.mkdir(parents=True, exist_ok=True)

CURSOR_AND_OVERLAYS_SCRIPT = """
(() => {
  if (document.getElementById('demo-cursor')) return;

  // Custom high-visibility cursor
  const cursor = document.createElement('div');
  cursor.id = 'demo-cursor';
  cursor.style.position = 'fixed';
  cursor.style.width = '24px';
  cursor.style.height = '24px';
  cursor.style.borderRadius = '50%';
  cursor.style.backgroundColor = 'rgba(232, 93, 63, 0.45)';
  cursor.style.border = '2.5px solid #E85D3F';
  cursor.style.boxShadow = '0 0 16px rgba(232, 93, 63, 0.7), 0 0 4px rgba(0,0,0,0.5)';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '999999';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.transition = 'transform 0.08s ease-out, background-color 0.15s ease';
  cursor.style.left = '960px';
  cursor.style.top = '540px';
  
  const dot = document.createElement('div');
  dot.style.position = 'absolute';
  dot.style.width = '6px';
  dot.style.height = '6px';
  dot.style.borderRadius = '50%';
  dot.style.backgroundColor = '#FFFFFF';
  dot.style.top = '50%';
  dot.style.left = '50%';
  dot.style.transform = 'translate(-50%, -50%)';
  cursor.appendChild(dot);
  document.body.appendChild(cursor);
  
  window.__updateCursor = (x, y, click=false) => {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    if (click) {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.65)';
      cursor.style.backgroundColor = 'rgba(231, 168, 62, 0.9)';
      setTimeout(() => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(232, 93, 63, 0.45)';
      }, 200);
    }
  };

  // Sleek lower-third caption banner
  const banner = document.createElement('div');
  banner.id = 'demo-caption-banner';
  banner.style.position = 'fixed';
  banner.style.bottom = '36px';
  banner.style.left = '50%';
  banner.style.transform = 'translateX(-50%) translateY(20px)';
  banner.style.backgroundColor = 'rgba(24, 18, 30, 0.94)';
  banner.style.backdropFilter = 'blur(12px)';
  banner.style.webkitBackdropFilter = 'blur(12px)';
  banner.style.color = '#FAF5EE';
  banner.style.padding = '12px 28px';
  banner.style.borderRadius = '32px';
  banner.style.fontFamily = 'Inter, -apple-system, sans-serif';
  banner.style.fontSize = '17px';
  banner.style.fontWeight = '600';
  banner.style.letterSpacing = '0.3px';
  banner.style.boxShadow = '0 12px 36px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(231, 168, 62, 0.5)';
  banner.style.zIndex = '999998';
  banner.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
  banner.style.opacity = '0';
  banner.style.pointerEvents = 'none';
  banner.style.display = 'flex';
  banner.style.alignItems = 'center';
  banner.style.gap = '12px';
  document.body.appendChild(banner);

  window.__showCaption = (text, tag='DEMO') => {
    banner.innerHTML = `<span style="background: linear-gradient(135deg, #E85D3F, #E7A83E); color: #fff; font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">${tag}</span> <span>${text}</span>`;
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) translateY(0)';
  };

  window.__hideCaption = () => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(20px)';
  };

  // Fullscreen Closing Card
  window.__showClosingCard = () => {
    const card = document.createElement('div');
    card.id = 'demo-closing-card';
    card.style.position = 'fixed';
    card.style.inset = '0';
    card.style.backgroundColor = 'rgba(24, 18, 30, 0.96)';
    card.style.backdropFilter = 'blur(16px)';
    card.style.webkitBackdropFilter = 'blur(16px)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.zIndex = '9999999';
    card.style.color = '#FAF5EE';
    card.style.textAlign = 'center';
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.6s ease';
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
        <span style="font-size: 38px; color: #E7A83E;">✦</span>
        <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 54px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #FAF5EE, #E7A83E); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">UtsavPilot</h1>
      </div>
      <p style="font-size: 22px; color: #E2E8F0; font-weight: 400; margin: 0 0 36px 0; letter-spacing: 0.5px;">Celebration Editorial meets Intelligent Planning</p>
      
      <div style="background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(231, 168, 62, 0.35); border-radius: 20px; padding: 28px 48px; max-width: 720px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
        <div style="font-size: 13px; font-weight: 800; color: #E7A83E; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 18px;">PROMPTWARS VIRTUAL CHALLENGE SUBMISSION</div>
        
        <div style="display: flex; flex-direction: column; gap: 14px; text-align: left; font-size: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
            <span style="color: #94A3B8; font-weight: 500;">Live Application</span>
            <span style="color: #FAF5EE; font-family: monospace; font-size: 15px; font-weight: 600;">https://vignesh06-og.github.io/utsavpilot-event-planner/</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
            <span style="color: #94A3B8; font-weight: 500;">GitHub Repository</span>
            <span style="color: #FAF5EE; font-family: monospace; font-size: 15px; font-weight: 600;">https://github.com/vignesh06-OG/utsavpilot-event-planner</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #94A3B8; font-weight: 500;">Core Pillars</span>
            <span style="color: #10B981; font-weight: 600;">100% Deterministic Arithmetic • Zero Fabricated Quotes • 24 Pass Vitest</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(card);
    setTimeout(() => { card.style.opacity = '1'; }, 50);
  };
})();
"""

def smooth_move_to(page, target_x, target_y, current_pos, steps=20, click=False):
    cx, cy = current_pos
    for i in range(1, steps + 1):
        t = i / steps
        ease = 1 - (1 - t) * (1 - t) # quadratic ease out
        nx = cx + (target_x - cx) * ease
        ny = cy + (target_y - cy) * ease
        page.mouse.move(nx, ny)
        page.evaluate(f"window.__updateCursor && window.__updateCursor({nx}, {ny}, false)")
        time.sleep(0.015)
    if click:
        page.evaluate(f"window.__updateCursor && window.__updateCursor({target_x}, {target_y}, true)")
        page.mouse.click(target_x, target_y)
        time.sleep(0.3)
    return (target_x, target_y)

def move_to_element(page, selector, current_pos, click=False, timeout=6000):
    loc = page.locator(selector).first
    loc.wait_for(state="visible", timeout=timeout)
    box = loc.bounding_box()
    if box:
        tx = box['x'] + box['width'] / 2
        ty = box['y'] + box['height'] / 2
        return smooth_move_to(page, tx, ty, current_pos, click=click)
    return current_pos

def smooth_scroll(page, target_y, steps=25):
    current_scroll = page.evaluate("window.scrollY")
    diff = target_y - current_scroll
    for i in range(1, steps + 1):
        t = i / steps
        ease = 1 - (1 - t) * (1 - t)
        sy = current_scroll + diff * ease
        page.evaluate(f"window.scrollTo(0, {sy})")
        time.sleep(0.02)

def set_caption(page, text, tag="OVERVIEW"):
    page.evaluate(f"window.__showCaption('{text}', '{tag}')")

def hide_caption(page):
    page.evaluate("window.__hideCaption()")

def run_recording():
    print("Launching Chromium with 1920x1080 viewport and video recording enabled...")
    start_time = time.time()
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--font-render-hinting=none',
                '--no-sandbox'
            ]
        )
        
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            record_video_dir=str(RAW_VIDEO_DIR),
            record_video_size={'width': 1920, 'height': 1080}
        )
        
        page = context.new_page()
        
        print("Navigating to live application:", LIVE_URL)
        page.goto(LIVE_URL)
        page.wait_for_load_state('networkidle')
        
        # Inject cursor and overlay script
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        cur_pos = (960, 540)
        
        # =====================================================================
        # 1. OPENING (0 – 12 sec)
        # =====================================================================
        print("Phase 1: Opening & Problem Statement...")
        set_caption(page, "Intelligent Indian Celebration Engineering: Budget & Constraint Mastery", "UTSAVPILOT")
        time.sleep(2.0)
        
        # Hover brand link
        cur_pos = move_to_element(page, ".brand-link", cur_pos, click=False)
        time.sleep(1.5)
        
        # Smoothly scroll down to Before / After interactive section
        smooth_scroll(page, 450, steps=25)
        time.sleep(1.2)
        
        set_caption(page, "Dynamic Rebalancing: Traditional Plans Collapse Under Disruption, UtsavPilot Adapts", "CORE DIFFERENTIATOR")
        # Click the 'Adapted: ₹30 Lakhs • 350 Guests' toggle
        cur_pos = move_to_element(page, 'button:has-text("Adapted: ₹30 Lakhs • 350 Guests")', cur_pos, click=True)
        time.sleep(2.5)
        
        # Click back to base plan toggle
        cur_pos = move_to_element(page, 'button:has-text("Base Plan: ₹35 Lakhs • 300 Guests")', cur_pos, click=True)
        time.sleep(1.5)
        
        # Scroll back up to hero
        smooth_scroll(page, 0, steps=20)
        time.sleep(1.0)
        
        # =====================================================================
        # 2. EVENT CREATION WIZARD (12 – 32 sec)
        # =====================================================================
        print("Phase 2: Event Creation Wizard...")
        set_caption(page, "Creating a Realistic Plan: Constraint-Driven 3-Step Wizard", "WIZARD STEP 1")
        
        # Click 'Plan Celebration' button
        cur_pos = move_to_element(page, 'button:has-text("Plan Celebration")', cur_pos, click=True)
        time.sleep(1.2)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Step 1: Input Title and City
        title_box = page.locator('#event-title').first
        title_box.click()
        page.fill('#event-title', '')
        # Realistic typing
        for char in "Meera & Kabir Grand Vivah":
            page.type('#event-title', char, delay=35)
        time.sleep(0.5)
        
        city_box = page.locator('#event-city').first
        city_box.click()
        page.fill('#event-city', '')
        for char in "Jaipur, Rajasthan":
            page.type('#event-city', char, delay=35)
        time.sleep(0.8)
        
        # Click 'Continue' to Step 2
        cur_pos = move_to_element(page, 'button:has-text("Continue")', cur_pos, click=True)
        time.sleep(1.2)
        
        set_caption(page, "Step 2: Guests, Scale & Mathematical Budget Anchor", "WIZARD STEP 2")
        # Change guest count to 350
        guest_input = page.locator('#guest-count').first
        guest_input.click()
        page.fill('#guest-count', '350')
        time.sleep(0.8)
        
        # Select ₹35,00,000 budget preset button
        cur_pos = move_to_element(page, 'button:has-text("₹35,00,000")', cur_pos, click=True)
        time.sleep(1.2)
        
        # Click 'Continue' into workspace
        cur_pos = move_to_element(page, 'button:has-text("Continue")', cur_pos, click=True)
        time.sleep(1.5)
        
        # Re-inject cursor in workspace view
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # =====================================================================
        # 3. BUDGET INTELLIGENCE (32 – 52 sec)
        # =====================================================================
        print("Phase 3: Budget Intelligence & Feasibility...")
        set_caption(page, "Executive Summary: 100% Reconciled Math, High Feasibility & Contingency Buffer", "BUDGET INTELLIGENCE")
        time.sleep(2.0)
        
        # Smoothly examine executive cards
        cur_pos = smooth_move_to(page, 520, 260, cur_pos, steps=20)
        time.sleep(1.5)
        cur_pos = smooth_move_to(page, 950, 260, cur_pos, steps=20)
        time.sleep(1.5)
        
        # Switch to 'Budget & Feasibility' tab
        set_caption(page, "Category Breakdown: Real-World Industry Benchmarks & Provenance Tags", "BUDGET ALLOCATION")
        cur_pos = move_to_element(page, 'button:has-text("Budget & Feasibility")', cur_pos, click=True)
        time.sleep(1.5)
        
        # Scroll down slightly to view categories
        smooth_scroll(page, 280, steps=15)
        time.sleep(1.0)
        
        # Click to expand first category (Catering / Venue)
        cat_cards = page.locator('.card-interactive, [role="button"]')
        if cat_cards.count() > 0:
            box = cat_cards.first.bounding_box()
            if box:
                cur_pos = smooth_move_to(page, box['x'] + 150, box['y'] + 25, cur_pos, click=True)
                time.sleep(2.5)
                
        # Scroll back to top
        smooth_scroll(page, 0, steps=15)
        time.sleep(1.0)
        
        # =====================================================================
        # 4. EXECUTION PLANNING (52 – 72 sec)
        # =====================================================================
        print("Phase 4: Execution Planning & Tasks...")
        set_caption(page, "Milestone Tasks: Real-World Timeline & Family Delegation", "EXECUTION WORKFLOWS")
        cur_pos = move_to_element(page, 'button:has-text("Milestone Tasks")', cur_pos, click=True)
        time.sleep(1.5)
        
        smooth_scroll(page, 200, steps=15)
        time.sleep(1.2)
        
        # Click an unchecked task to complete it and trigger confetti celebration!
        set_caption(page, "Interactive Task Completion: Live Progress Tracking & Celebration Confetti", "ACTIONABLE TASKS")
        task_cards = page.locator('div[role="checkbox"]')
        if task_cards.count() > 0:
            box = task_cards.first.bounding_box()
            if box:
                cur_pos = smooth_move_to(page, box['x'] + 30, box['y'] + 20, cur_pos, click=True)
                print("Task toggled - confetti triggered!")
                time.sleep(3.0)
                
        # Switch to Vendor Transparency tab
        set_caption(page, "Vendor Transparency: Due Diligence Benchmarks & Negotiation Checklists", "VENDOR DUE DILIGENCE")
        smooth_scroll(page, 0, steps=15)
        cur_pos = move_to_element(page, 'button:has-text("Vendor Transparency")', cur_pos, click=True)
        time.sleep(1.8)
        
        smooth_scroll(page, 220, steps=15)
        # Expand Questions & Tips
        q_btn = page.locator('button:has-text("Questions & Tips")').first
        if q_btn.is_visible():
            cur_pos = move_to_element(page, 'button:has-text("Questions & Tips")', cur_pos, click=True)
            time.sleep(3.0)
            
        smooth_scroll(page, 0, steps=15)
        time.sleep(1.0)
        
        # =====================================================================
        # 5. ADAPTIVE REPLANNING (72 – 94 sec)
        # =====================================================================
        print("Phase 5: Adaptive Replanning...")
        set_caption(page, "Adaptive Replanning: Handling Real-World Surges & Budget Adjustments", "SIGNATURE INNOVATION")
        
        # Click 'Adapt & Replan' button
        cur_pos = move_to_element(page, 'button:has-text("Adapt & Replan")', cur_pos, click=True)
        time.sleep(1.8)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Reduce budget by clicking '- ₹1 Lakh' multiple times or typing
        set_caption(page, "Simulating Disruption: Reducing Budget by ₹5 Lakhs, Guest Surge +30", "CONSTRAINTS CHANGED")
        budget_input = page.locator('#replan-budget').first
        if budget_input.is_visible():
            budget_input.click()
            page.fill('#replan-budget', '3000000')
            time.sleep(1.2)
            
        guest_input = page.locator('#replan-guests').first
        if guest_input.is_visible():
            guest_input.click()
            page.fill('#replan-guests', '380')
            time.sleep(1.2)
            
        # Hover and examine Category Diff Mini-Table
        set_caption(page, "Variance Analysis: Instant Mathematical Rebalancing with Preservation Guarantee", "DELTA CALCULATION")
        diff_table = page.locator('table').first
        if diff_table.is_visible():
            box = diff_table.bounding_box()
            if box:
                cur_pos = smooth_move_to(page, box['x'] + box['width']/2, box['y'] + 40, cur_pos)
                time.sleep(2.5)
                
        # Click 'Apply Changes & Replan'
        cur_pos = move_to_element(page, 'button:has-text("Apply Changes & Replan")', cur_pos, click=True)
        time.sleep(2.0)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # =====================================================================
        # 6. RESILIENCE & OUTPUT (94 – 106 sec)
        # =====================================================================
        print("Phase 6: Resilience & Printable Master Dossier...")
        set_caption(page, "Zero AI Hallucinations: Offline-First Deterministic Engine Active", "ENGINE RESILIENCE")
        
        # Hover over Deterministic Engine badge in Navbar
        cur_pos = smooth_move_to(page, 1530, 28, cur_pos, steps=20)
        time.sleep(2.2)
        
        # Click 'Print Dossier' button
        set_caption(page, "Execution Output: Print-Ready Master Dossier for Families & Banquet Teams", "MASTER DOSSIER")
        cur_pos = move_to_element(page, 'button:has-text("Print Dossier")', cur_pos, click=True)
        time.sleep(2.0)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Scroll inside dossier dialog if present
        dossier_modal = page.locator('.modal-content').first
        if dossier_modal.is_visible():
            dossier_box = dossier_modal.bounding_box()
            if dossier_box:
                cur_pos = smooth_move_to(page, dossier_box['x'] + dossier_box['width']/2, dossier_box['y'] + 100, cur_pos)
                time.sleep(1.5)
                
        # Close dossier modal
        close_btn = page.locator('button[aria-label="Close dossier view"]').first
        if close_btn.is_visible():
            cur_pos = move_to_element(page, 'button[aria-label="Close dossier view"]', cur_pos, click=True)
            time.sleep(1.5)
        else:
            page.keyboard.press("Escape")
            time.sleep(1.5)
            
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # =====================================================================
        # 7. CLOSING (106 – 116 sec)
        # =====================================================================
        print("Phase 7: Closing Screen...")
        hide_caption(page)
        page.evaluate("window.__showClosingCard && window.__showClosingCard()")
        cur_pos = smooth_move_to(page, 960, 540, cur_pos, steps=15)
        time.sleep(9.0)
        
        print("Closing context and flushing video stream...")
        context.close()
        browser.close()
        
    duration = time.time() - start_time
    print(f"Recording script finished in {duration:.1f} seconds.")

if __name__ == '__main__':
    run_recording()

