import os
import sys
import io
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

LIVE_URL = "https://vignesh06-og.github.io/utsavpilot-event-planner/"
REPO_ROOT = Path("C:/Users/gandh/.gemini/antigravity-ide/scratch/utsavpilot")
RAW_VIDEO_DIR = REPO_ROOT / "docs" / "demo_video" / "raw_117s"
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
  cursor.style.boxShadow = '0 0 16px rgba(232, 93, 63, 0.75), 0 0 4px rgba(0,0,0,0.5)';
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
  banner.style.fontSize = '16.5px';
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
        <span style="font-size: 40px; color: #E7A83E;">✦</span>
        <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 56px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #FAF5EE, #E7A83E); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">UtsavPilot</h1>
      </div>
      <p style="font-size: 22px; color: #E2E8F0; font-weight: 400; margin: 0 0 36px 0; letter-spacing: 0.5px;">Celebration Editorial meets Intelligent Planning</p>
      
      <div style="background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(231, 168, 62, 0.35); border-radius: 20px; padding: 28px 48px; max-width: 740px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
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
            <span style="color: #94A3B8; font-weight: 500;">Engineering Pillars</span>
            <span style="color: #10B981; font-weight: 600;">100% Deterministic Math • 0 Fabricated Quotes • 24 Pass Tests</span>
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
        ease = 1 - (1 - t) * (1 - t)
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

def run_choreography():
    print("Launching Chromium for exact 117.9s choreography...")
    master_start = time.time()
    
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
        
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        cur_pos = (960, 540)
        
        # =====================================================================
        # SCENE 1: 0:00 – 0:15 (15.0s) — The Problem & Introduction
        # =====================================================================
        print("Scene 1: Introduction & Problem Statement (0:00 - 0:15)...")
        set_caption(page, "Intelligent Indian Celebration Engineering: Budget & Constraint Mastery", "UTSAVPILOT")
        
        # Pause on beautiful hero cards with editorial imagery
        cur_pos = smooth_move_to(page, 720, 420, cur_pos, steps=20)
        time.sleep(3.5)
        
        # Move cursor to royal dining card
        cur_pos = smooth_move_to(page, 1280, 420, cur_pos, steps=20)
        time.sleep(2.5)
        
        # Smoothly scroll down to Before / After section
        set_caption(page, "Traditional Plans Collapse Under Disruption — UtsavPilot Dynamically Rebalances", "CORE DIFFERENTIATOR")
        smooth_scroll(page, 480, steps=25)
        time.sleep(1.2)
        
        # Toggle adapted plan button
        cur_pos = move_to_element(page, 'button:has-text("Adapted: ₹30 Lakhs • 350 Guests")', cur_pos, click=True)
        time.sleep(3.0)
        
        # Scroll back to hero
        smooth_scroll(page, 0, steps=20)
        time.sleep(1.0)
        
        # Ensure we hit exactly 15.0s mark
        elapsed = time.time() - master_start
        if elapsed < 15.0:
            time.sleep(15.0 - elapsed)
            
        # =====================================================================
        # SCENE 2: 0:15 – 0:34 (19.0s) — Event Creation Wizard
        # =====================================================================
        print("Scene 2: Event Creation Wizard (0:15 - 0:34)...")
        set_caption(page, "Step 1: Constraint-Driven Planning with 6 Celebration Archetypes", "EVENT CREATION")
        
        # Click Plan Celebration
        cur_pos = move_to_element(page, 'button:has-text("Plan Your Celebration"), button:has-text("Plan Celebration")', cur_pos, click=True)
        time.sleep(1.5)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Highlight Wedding archetype card with photo
        cur_pos = smooth_move_to(page, 480, 360, cur_pos, steps=15, click=True)
        time.sleep(1.5)
        
        # Enter Event Title
        title_box = page.locator('#event-title').first
        title_box.click()
        page.fill('#event-title', '')
        for char in "The Sharma & Verma Sangeet & Vivah":
            page.type('#event-title', char, delay=30)
        time.sleep(0.6)
        
        # Enter City
        city_box = page.locator('#event-city').first
        city_box.click()
        page.fill('#event-city', '')
        for char in "Jaipur, Rajasthan":
            page.type('#event-city', char, delay=30)
        time.sleep(0.8)
        
        # Click Continue to Step 2
        cur_pos = move_to_element(page, 'button:has-text("Continue")', cur_pos, click=True)
        time.sleep(1.5)
        
        set_caption(page, "Step 2: Guests, Scale & Mathematical Budget Anchor", "SCALE & BUDGET")
        guest_input = page.locator('#guest-count').first
        guest_input.click()
        page.fill('#guest-count', '300')
        time.sleep(0.8)
        
        # Click budget quick preset ₹35,00,000
        cur_pos = move_to_element(page, 'button:has-text("₹35,00,000")', cur_pos, click=True)
        time.sleep(1.5)
        
        # Click Continue into Workspace
        cur_pos = move_to_element(page, 'button:has-text("Continue")', cur_pos, click=True)
        time.sleep(2.0)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Synchronize to 34.0s mark
        elapsed = time.time() - master_start
        if elapsed < 34.0:
            time.sleep(34.0 - elapsed)
            
        # =====================================================================
        # SCENE 3: 0:34 – 0:55 (21.0s) — Budget Intelligence & Feasibility
        # =====================================================================
        print("Scene 3: Budget Intelligence & Feasibility (0:34 - 0:55)...")
        set_caption(page, "Executive Summary: 100% Reconciled Math, High Feasibility & Contingency Buffer", "BUDGET INTELLIGENCE")
        time.sleep(2.0)
        
        # Examine KPI cards
        cur_pos = smooth_move_to(page, 520, 270, cur_pos, steps=20)
        time.sleep(2.0)
        cur_pos = smooth_move_to(page, 950, 270, cur_pos, steps=20)
        time.sleep(2.0)
        cur_pos = smooth_move_to(page, 1380, 270, cur_pos, steps=20)
        time.sleep(1.5)
        
        # Switch to Budget & Feasibility tab
        set_caption(page, "Category Breakdown: Real-World Industry Benchmarks & Provenance Tags", "BUDGET ALLOCATION")
        cur_pos = move_to_element(page, 'button:has-text("Budget & Feasibility")', cur_pos, click=True)
        time.sleep(1.8)
        
        # Scroll down to categories
        smooth_scroll(page, 280, steps=15)
        time.sleep(1.2)
        
        # Expand first category (Venue & Stays)
        cat_cards = page.locator('.card button[aria-expanded]')
        if cat_cards.count() > 0:
            cur_pos = move_to_element(page, '.card button[aria-expanded]', cur_pos, click=True)
            time.sleep(3.0)
            
        smooth_scroll(page, 0, steps=15)
        time.sleep(1.0)
        
        # Synchronize to 55.0s mark
        elapsed = time.time() - master_start
        if elapsed < 55.0:
            time.sleep(55.0 - elapsed)
            
        # =====================================================================
        # SCENE 4: 0:55 – 1:15 (20.0s) — Execution Planning
        # =====================================================================
        print("Scene 4: Execution Planning & Milestone Tasks (0:55 - 1:15)...")
        set_caption(page, "Milestone Tasks: Real-World Timeline & Family Responsibility Delegation", "EXECUTION WORKFLOWS")
        cur_pos = move_to_element(page, 'button:has-text("Milestone Tasks")', cur_pos, click=True)
        time.sleep(1.8)
        
        smooth_scroll(page, 200, steps=15)
        time.sleep(1.5)
        
        # Check off task -> trigger confetti celebration!
        set_caption(page, "Interactive Task Completion: Live Progress Tracking & Celebration Confetti", "ACTIONABLE TASKS")
        task_cards = page.locator('div[role="checkbox"]')
        if task_cards.count() > 0:
            box = task_cards.first.bounding_box()
            if box:
                cur_pos = smooth_move_to(page, box['x'] + 30, box['y'] + 20, cur_pos, click=True)
                print("Task completed - confetti triggered!")
                time.sleep(3.2)
                
        # Switch to Vendor Transparency
        set_caption(page, "Vendor Transparency: Due Diligence Benchmarks & Negotiation Checklists", "VENDOR DUE DILIGENCE")
        smooth_scroll(page, 0, steps=15)
        cur_pos = move_to_element(page, 'button:has-text("Vendor Transparency")', cur_pos, click=True)
        time.sleep(1.8)
        
        smooth_scroll(page, 220, steps=15)
        q_btn = page.locator('button:has-text("Questions & Tips")').first
        if q_btn.is_visible():
            cur_pos = move_to_element(page, 'button:has-text("Questions & Tips")', cur_pos, click=True)
            time.sleep(3.2)
            
        smooth_scroll(page, 0, steps=15)
        time.sleep(1.0)
        
        # Synchronize to 75.0s mark (1:15)
        elapsed = time.time() - master_start
        if elapsed < 75.0:
            time.sleep(75.0 - elapsed)
            
        # =====================================================================
        # SCENE 5: 1:15 – 1:38 (23.0s) — Adaptive Replanning
        # =====================================================================
        print("Scene 5: Adaptive Replanning (1:15 - 1:38)...")
        set_caption(page, "Adaptive Replanning: Handling Real-World Budget Cuts & Guest Surges", "SIGNATURE INNOVATION")
        
        # Open Adapt & Replan modal
        cur_pos = move_to_element(page, 'button:has-text("Adapt & Replan")', cur_pos, click=True)
        time.sleep(2.0)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Disruption: Budget cut to 30L and guest surge to 350
        set_caption(page, "Simulating Disruption: Reducing Budget by ₹5 Lakhs, Guest Surge +50", "CONSTRAINTS CHANGED")
        budget_input = page.locator('#replan-budget').first
        if budget_input.is_visible():
            budget_input.click()
            page.fill('#replan-budget', '3000000')
            time.sleep(1.5)
            
        guest_input = page.locator('#replan-guests').first
        if guest_input.is_visible():
            guest_input.click()
            page.fill('#replan-guests', '350')
            time.sleep(1.5)
            
        # Inspect variance diff table
        set_caption(page, "Variance Analysis: Instant Mathematical Rebalancing with Preservation Guarantee", "DELTA CALCULATION")
        diff_table = page.locator('table').first
        if diff_table.is_visible():
            box = diff_table.bounding_box()
            if box:
                cur_pos = smooth_move_to(page, box['x'] + box['width']/2, box['y'] + 40, cur_pos)
                time.sleep(3.0)
                
        # Apply changes
        cur_pos = move_to_element(page, 'button:has-text("Apply Changes & Replan")', cur_pos, click=True)
        time.sleep(2.2)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Synchronize to 98.0s mark (1:38)
        elapsed = time.time() - master_start
        if elapsed < 98.0:
            time.sleep(98.0 - elapsed)
            
        # =====================================================================
        # SCENE 6: 1:38 – 1:49 (11.0s) — Resilience & Output
        # =====================================================================
        print("Scene 6: Resilience & Printable Master Dossier (1:38 - 1:49)...")
        set_caption(page, "Zero AI Hallucinations: Offline-First Deterministic Engine Active", "ENGINE RESILIENCE")
        
        # Hover over Deterministic Engine badge in Navbar
        cur_pos = smooth_move_to(page, 1530, 28, cur_pos, steps=20)
        time.sleep(2.5)
        
        # Open Print Dossier
        set_caption(page, "Execution Output: Print-Ready Master Dossier for Families & Banquet Teams", "MASTER DOSSIER")
        cur_pos = move_to_element(page, 'button:has-text("Print Dossier")', cur_pos, click=True)
        time.sleep(2.2)
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Scroll inside dossier dialog
        dossier_modal = page.locator('.modal-content').first
        if dossier_modal.is_visible():
            dossier_box = dossier_modal.bounding_box()
            if dossier_box:
                cur_pos = smooth_move_to(page, dossier_box['x'] + dossier_box['width']/2, dossier_box['y'] + 100, cur_pos)
                time.sleep(2.0)
                
        # Close dossier modal
        close_btn = page.locator('button[aria-label="Close dossier view"]').first
        if close_btn.is_visible():
            cur_pos = move_to_element(page, 'button[aria-label="Close dossier view"]', cur_pos, click=True)
            time.sleep(1.0)
        else:
            page.keyboard.press("Escape")
            time.sleep(1.0)
            
        page.evaluate(CURSOR_AND_OVERLAYS_SCRIPT)
        
        # Synchronize to 109.0s mark (1:49)
        elapsed = time.time() - master_start
        if elapsed < 109.0:
            time.sleep(109.0 - elapsed)
            
        # =====================================================================
        # SCENE 7: 1:49 – 1:57.9 (8.94s) — Closing
        # =====================================================================
        print("Scene 7: Closing Screen (1:49 - 1:57.9)...")
        hide_caption(page)
        page.evaluate("window.__showClosingCard && window.__showClosingCard()")
        cur_pos = smooth_move_to(page, 960, 540, cur_pos, steps=15)
        
        # Target total exact runtime = 117.94s
        TARGET_DURATION = 117.94
        elapsed = time.time() - master_start
        if elapsed < TARGET_DURATION:
            remaining = TARGET_DURATION - elapsed
            print(f"Holding closing card for remaining {remaining:.2f}s...")
            time.sleep(remaining)
            
        print("Closing context and saving video stream...")
        context.close()
        browser.close()
        
    actual_runtime = time.time() - master_start
    print(f"Choreography completed. Actual runtime: {actual_runtime:.2f} seconds.")

if __name__ == '__main__':
    run_choreography()

