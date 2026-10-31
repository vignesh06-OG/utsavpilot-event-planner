import time
import os
import sys
import io
from playwright.sync_api import sync_playwright

# Setup encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CURSOR_SCRIPT = """
(() => {
  if (document.getElementById('demo-cursor')) return;
  const cursor = document.createElement('div');
  cursor.id = 'demo-cursor';
  cursor.style.position = 'fixed';
  cursor.style.width = '24px';
  cursor.style.height = '24px';
  cursor.style.borderRadius = '50%';
  cursor.style.backgroundColor = 'rgba(232, 93, 63, 0.45)';
  cursor.style.border = '2.5px solid #E85D3F';
  cursor.style.boxShadow = '0 0 12px rgba(232, 93, 63, 0.6), 0 0 4px rgba(0,0,0,0.4)';
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
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      cursor.style.backgroundColor = 'rgba(231, 168, 62, 0.85)';
      setTimeout(() => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(232, 93, 63, 0.45)';
      }, 180);
    }
  };

  // Banner overlay helper for editorial captions
  const banner = document.createElement('div');
  banner.id = 'demo-caption-banner';
  banner.style.position = 'fixed';
  banner.style.bottom = '32px';
  banner.style.left = '50%';
  banner.style.transform = 'translateX(-50%)';
  banner.style.backgroundColor = 'rgba(24, 18, 30, 0.92)';
  banner.style.color = '#FAF5EE';
  banner.style.padding = '12px 28px';
  banner.style.borderRadius = '30px';
  banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  banner.style.fontSize = '17px';
  banner.style.fontWeight = '600';
  banner.style.letterSpacing = '0.3px';
  banner.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(231, 168, 62, 0.4)';
  banner.style.zIndex = '999998';
  banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  banner.style.opacity = '0';
  banner.style.pointerEvents = 'none';
  banner.style.display = 'flex';
  banner.style.alignItems = 'center';
  banner.style.gap = '10px';
  document.body.appendChild(banner);

  window.__showCaption = (text, tag='DEMO') => {
    banner.innerHTML = `<span style="background: linear-gradient(135deg, #E85D3F, #E7A83E); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 12px; font-weight: 800; text-transform: uppercase;">${tag}</span> <span>${text}</span>`;
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) translateY(0)';
  };

  window.__hideCaption = () => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(12px)';
  };
})();
"""

def smooth_move_to(page, target_x, target_y, current_pos, steps=25, click=False):
    cx, cy = current_pos
    for i in range(1, steps + 1):
        # Ease out interpolation
        t = i / steps
        ease = 1 - (1 - t) * (1 - t)
        nx = cx + (target_x - cx) * ease
        ny = cy + (target_y - cy) * ease
        page.mouse.move(nx, ny)
        page.evaluate(f"window.__updateCursor && window.__updateCursor({nx}, {ny}, false)")
        time.sleep(0.012)
    if click:
        page.evaluate(f"window.__updateCursor && window.__updateCursor({target_x}, {target_y}, true)")
        page.mouse.click(target_x, target_y)
        time.sleep(0.25)
    return (target_x, target_y)

def move_to_element(page, selector, current_pos, click=False, timeout=5000):
    loc = page.locator(selector).first
    loc.wait_for(state="visible", timeout=timeout)
    box = loc.bounding_box()
    if box:
        tx = box['x'] + box['width'] / 2
        ty = box['y'] + box['height'] / 2
        return smooth_move_to(page, tx, ty, current_pos, click=click)
    return current_pos

print("Test script loaded successfully.")

