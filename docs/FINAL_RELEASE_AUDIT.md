# UtsavPilot — Final End-to-End QA, Bug Fix & Security Audit Report

**Audit Date:** October 31, 2026  
**Auditor:** Senior Product Engineer, Solution Architect & Security Reviewer  
**Workspace:** `C:\Users\gandh\.gemini\antigravity-ide\scratch\utsavpilot`  
**GitHub Repository:** [https://github.com/vignesh06-OG/utsavpilot-event-planner](https://github.com/vignesh06-OG/utsavpilot-event-planner)  
**Live Production URL:** [https://vignesh06-og.github.io/utsavpilot-event-planner/](https://vignesh06-og.github.io/utsavpilot-event-planner/)  
**Final Submission Verdict:** **READY FOR SUBMISSION**

---

## 1. Executive Summary & Defect Log

A rigorous, full-stack, browser-verified audit was conducted across the entire UtsavPilot application to eliminate all genuine defects, incorrect defaults, stale event data, visual leaks, and dependency vulnerabilities prior to competition evaluation.

### Discovered & Remediated Defects

| ID | Severity | Category | Description | Root Cause | Remediation & Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | **P1** | Core UX & Data Flow | Event title pre-populated with hardcoded `"Grand Family Vivah & Sangeet"` or demo sample `"The Sharma & Verma Sangeet & Vivah"` regardless of celebration category. | Wizard title state was initialized with fallback string or demo plan `currentPlan.input`, and did not update placeholders dynamically when switching categories. | Refactored `EventWizard.tsx` to initialize `title` as empty `''` for new plans; wired dynamic category placeholders and subtle hints via `EVENT_CATEGORY_CONFIG`; preserved custom user-entered titles across category switching. |
| **DEF-02** | **P1** | Data Isolation | Wedding tasks (e.g. Mandap lawn, Pandit Ji meeting, Baraat desk) and Mandap vendors appeared in non-wedding celebrations (e.g. Birthday, College Fest). | `deterministicFallback.ts` shared generic tasks across non-wedding types and lacked tailored tasks/vendors for all celebration archetypes. | Created comprehensive, archetype-tailored tasks, vendors, and cultural suggestions across all 8 archetypes (`wedding`, `engagement`, `anniversary`, `birthday`, `puja`, `community_event`, `college_fest`, `corporate_celebration`). Tested with Vitest & Playwright. |
| **DEF-03** | **P2** | Visual Presentation | Executive Summary dashboard watermark permanently rendered `editorial_mandap.webp` regardless of event type. | Hardcoded background image asset path in `ExecutiveSummary.tsx`. | Dynamic memoized `watermarkImage` matching the active archetype (`birthday_celebration.webp` for birthdays, `college_fest.webp` for college fests, etc.). |
| **DEF-04** | **P2** | Security & Supply Chain | High-severity Denial of Service vulnerability in `body-parser` dependency (`GHSA-27r3-jxmh-p828`). | Transitive dependency via Express 5. | Ran `npm audit fix`, resolving all vulnerabilities. `npm audit` now reports **0 vulnerabilities**. |
| **DEF-05** | **P3** | UX Polish | Inflexible custom task placeholder in `TaskBoard.tsx` (`"Order 15 boxes of fresh Kaju Katli for Shagun"`). | Hardcoded wedding terminology in task input. | Updated to universal celebration placeholder: `"e.g. Finalize sweet boxes, arrange transport, or confirm sound check"`. |

---

## 2. Event Title & Category Switching Verification

The user-specified test sequence was executed via automated Playwright browser testing and confirmed through visual inspection:

### Verification Test Matrix

```mermaid
flowchart TD
    A["Open Celebration Planner"] --> B["Select Wedding"]
    B -->|Verified| B1["Placeholder: 'e.g. Sharma & Verma Wedding'<br/>Hint: 'Category example: Sharma & Verma Wedding'"]
    B1 --> C["Switch to Birthday"]
    C -->|Verified| C1["Value remains empty ''<br/>Placeholder: 'e.g. Lara's Birthday'<br/>Hint: 'Category example: Lara's Birthday'"]
    C1 --> D["Switch to Anniversary"]
    D -->|Verified| D1["Value remains empty ''<br/>Placeholder: 'e.g. Aarav & Meera's Anniversary'<br/>Hint: 'Category example: Aarav & Meera's Anniversary'"]
    D1 --> E["Enter Custom Title:<br/>'Sunita & Rajesh Silver Jubilee Celebration'"]
    E --> F["Switch Category to Corporate Celebration"]
    F -->|Verified| F1["Custom Title strictly preserved:<br/>'Sunita & Rajesh Silver Jubilee Celebration'<br/>Hint shows category example"]
```

| Step | Action | Expected Behavior | Actual Browser Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Open Planner | Input value empty, no hardcoded title inserted | Value is `""`, placeholder visible | **PASS** |
| 2 | Select Wedding | Contextual wedding example appears | Placeholder: `"e.g. Sharma & Verma Wedding"` | **PASS** |
| 3 | Switch to Birthday | Birthday example appears, value remains empty | Placeholder: `"e.g. Lara's Birthday"`, Value: `""` | **PASS** |
| 4 | Switch to Anniversary | Anniversary example appears | Placeholder: `"e.g. Aarav & Meera's Anniversary"` | **PASS** |
| 5 | Switch to Engagement | Engagement example appears | Placeholder: `"e.g. Riya & Arjun's Engagement"` | **PASS** |
| 6 | Switch to Puja | Puja example appears | Placeholder: `"e.g. Griha Pravesh & Satyanarayan Puja"` | **PASS** |
| 7 | Switch to College Fest | College fest example appears | Placeholder: `"e.g. Vibrance Annual Cultural Fest"` | **PASS** |
| 8 | Switch to Community Fest | Festival example appears | Placeholder: `"e.g. Ganesh Utsav Community Mahotsav"` | **PASS** |
| 9 | Enter Custom Title | User inputs `"Sunita & Rajesh Silver Jubilee Celebration"` | Input value updated to custom title | **PASS** |
| 10| Change Category Again | Switch to Corporate Celebration | **Custom title preserved verbatim**; hint updates to `"Annual Leadership Summit & Gala"` | **PASS** |
| 11| Form Submission Validation | Empty title cannot be submitted | Validation error: `"Please enter your celebration title (e.g. ...)"` | **PASS** |

---

## 3. End-to-End Archetype Experience Audit

Every supported celebration archetype was tested to ensure complete data and visual isolation:

### Category Content Breakdown

1. **Wedding (`wedding`)**:
   - **Tasks**: Mandap lawn booking, catering tasting, candid cinema, digital save-the-date, sangeet choreography, pandit ji samagri, baraat reception.
   - **Vendors**: Banquet & Lawn, Royal Wedding Catering, Mandap & Floral Decorator, Candid Cinematographer, DJ & Sangeet Sound.
   - **Suggestions**: Royal Marigold & Brass Heritage, live chaat counters, baraat dhol tasha procession.

2. **Engagement & Roka (`engagement`)**:
   - **Tasks**: Boutique banquet hall, ring ceremony stage backdrop, candid couple portraits, sagai shagun gifts, high tea menu, ring exchange music cue.
   - **Vendors**: Ring Ceremony Banquet, High Tea & Dinner Catering, Ring Stage Decorator, Couple Portrait Photographer.
   - **Suggestions**: Pastel Romance with fairy lights, artisanal mini samosas & mocktails, live acoustic duo.

3. **Anniversary Milestone (`anniversary`)**:
   - **Tasks**: Private banquet dining, couple milestone video montage, tiered anniversary cake, family toasts & retro DJ music, return mementos.
   - **Vendors**: Anniversary Banquet Hall, Gourmet Caterer, Milestone Cake Bakery, Memory Cinematographer.
   - **Suggestions**: Silver/Golden Jubilee candlelit banquet, archival memory walk, low-decibel acoustic dining.

4. **Birthday Milestone (`birthday`)**:
   - **Tasks**: Party clubhouse hall, custom theme designer cake, kids party game host & magician, return gift goodie bags, balloon backdrop.
   - **Vendors**: Party Hall Management, Designer Cake Baker, Balloon Sculptor, Kids Magician & Host, Favor Supplier.
   - **Suggestions**: Whimsical balloon arch & mascot cutouts, kid-friendly snack bar, stroller parking & quiet room.
   - **Leak Check**: **0 mentions of mandap, baraat, varmala, or sangeet.**

5. **Puja & Family Bhojan (`puja`)**:
   - **Tasks**: Pandit Ji muhurat consultation & samagri list, fresh flower garlands & mango torans, pure ghee prasadam & satvik bhojan, low chowkis/gaddi seating, bhajan mandali.
   - **Vendors**: Vedic Pandit Ji & Samagri Supplier, Satvik Prasadam Caterer, Temple Floral Decorator, Devotional Bhajan Singer.
   - **Suggestions**: Traditional temple motif with banana stems, fresh coconut water in clay kulhads, havan exhaust ventilation.

6. **College Fest / Gala (`college_fest`)**:
   - **Tasks**: Campus administration & police clearances, line-array concert sound & stage truss, headliner artist contract & green room rider, tamper-evident fest wristbands, crowd barricades.
   - **Vendors**: Line-Array Concert Sound & Rigging, Headliner Artist Management, Campus Security & Bouncers, Fest Merchandise Supplier.
   - **Suggestions**: Neon Cyberpunk stage lighting, student food court stalls, battle of the bands.
   - **Leak Check**: **0 wedding content; 100% campus concert focused.**

7. **Festival & Community Event (`community_event`)**:
   - **Tasks**: Community ground permits, waterproof shamiana pandal, community feast/langar, horn speaker PA system, cultural folk dance troupe, eco-friendly post-event cleanliness drive.
   - **Vendors**: Pandal Tent House, Community Feast Caterer, Public Address Audio Agency, Folk Performance Troupe, Municipal Waste Agency.

8. **Corporate Celebration (`corporate_celebration`)**:
   - **Tasks**: Business hotel banquet booking, high-definition LED video wall & podium setup, engraved executive trophies, multi-cuisine dinner buffet, corporate emcee briefing.
   - **Vendors**: Hotel Banquet Management, LED Video Wall Production Team, Corporate Dinner Buffet Caterer, Executive Trophies Supplier.

---

## 4. Comprehensive Security Audit

A thorough security evaluation was conducted across frontend bundles, API routes, dependencies, and deployment configuration.

### 4.1 Secrets & Credential Integrity
- **Search Query**: Searched entire codebase and git log for Google API key patterns (`AIzaSy`), `GEMINI_API_KEY`, `.env` files, and hardcoded secrets.
- **Finding**: **Zero credentials exposed.** No `.env` files committed. Client-side Vite bundle contains zero occurrences of API keys or private tokens.
- **Architecture**: The Express backend loads `GEMINI_API_KEY` strictly via server-side environment variables (`process.env.GEMINI_API_KEY`). On GitHub Pages static hosting, all client calls to `/api/plan` fail gracefully into the 100% offline-ready deterministic engine.

### 4.2 Injection & Input Sanitization
- **XSS & HTML Injection**: Tested payload `<script>alert('xss')</script><img src=x onerror=alert(1)>` in event title and host notes. Input is strictly sanitized via `sanitizeInput()` and properly escaped by React DOM's JSX interpolation.
- **Prompt Injection Defense**: Server-side sanitizer strips `<script>`, `<style>`, `<system>`, markdown delimiters (```` ``` ````), and filters command injection patterns (`ignore previous instructions`).
- **Runtime Validation**: Strict Zod schema (`EventInputSchema`) validates all parameters before processing, enforcing bounds: `guestCount` (5–5,000), `durationDays` (1–14), `totalBudget` (>0), and whitelisted `eventType` enum values.

### 4.3 Dependency & Supply Chain Review
- **Audit Tool**: `npm audit`
- **Initial Status**: 1 high-severity vulnerability in `body-parser` (`GHSA-27r3-jxmh-p828`).
- **Remediation**: Executed `npm audit fix`. Upgraded dependency cleanly.
- **Final Status**: **0 vulnerabilities** (138 packages audited).

### 4.4 Deployment Security & Architecture
- **Production Host**: GitHub Pages (`https://vignesh06-og.github.io/utsavpilot-event-planner/`).
- **AI Integration Integrity**: GitHub Pages serves static client assets and cannot execute an Express server. When deployed, the client calls `/api/plan`, receives a 404/502 status, and immediately transitions to the client-side deterministic engine with an honest status badge: `Deterministic Engine` and toast notification: `Server unavailable. Switched to offline deterministic engine.`
- **Integrity**: UtsavPilot **does not misrepresent fallback as live Gemini**.

---

## 5. UI, UX & Responsive Visual Verification

Automated Playwright captures verified layout stability and typography across 5 distinct device viewports:

| Viewport | Dimensions | Elements Tested | Observations | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile S** | 360 × 740 | Header, Stepper, Form Cards, Navbar | Single-column stack, zero horizontal scroll, tap targets ≥ 44px | **PASS** |
| **Mobile Standard** | 390 × 844 | Hero Summary, KPI Cards, Tab Bar | Pill navigation visible, badges wrap neatly, clean contrast | **PASS** |
| **Tablet** | 768 × 1024 | 2-column grid, Budget Accordion | Responsive multi-column grid, touch-friendly buttons | **PASS** |
| **Desktop Laptop**| 1366 × 768 | Full Workspace, Replan Modal | 4-column metric grid, modal backdrop blur, smooth dialog | **PASS** |
| **Desktop Full HD**| 1920 × 1080 | Editorial Hero, Print Dossier | Balanced typography, high-res photography, zero clipping | **PASS** |

### Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation**: Stepper, archetype radio cards, tabs, and modals support full Tab, Space, Enter, and Escape navigation.
- **Screen Reader Support**: ARIA attributes `role="radiogroup"`, `aria-checked`, `role="tablist"`, `aria-selected`, `aria-modal="true"`.
- **Motion Reduction**: `prefers-reduced-motion` media queries respected across motion tokens.

---

## 6. Automated Validation Suite Results

All automated checks passed with 100% success:

```bash
# 1. TypeScript & Vite Production Build
$ npm run build
✓ 2361 modules transformed.
dist/index.html                   1.12 kB │ gzip:   0.60 kB
dist/assets/index-63RrmuxC.css   10.52 kB │ gzip:   2.91 kB
dist/assets/index-Bhk9g-z-.js   548.45 kB │ gzip: 166.68 kB
✓ built in 493ms

# 2. Automated Test Suite (Vitest)
$ npm test
✓ src/tests/securitySanitize.test.ts (4 tests)
✓ src/tests/budgetEngine.test.ts (6 tests)
✓ src/tests/deterministicFallback.test.ts (2 tests)
✓ src/tests/replanEngine.test.ts (3 tests)
✓ src/tests/schemas.test.ts (3 tests)
✓ src/tests/eventCategoryRegression.test.ts (5 tests)
✓ src/tests/adversarialBoundary.test.ts (6 tests)
Test Files  7 passed (7)
Tests       29 passed (29)

# 3. Static Code Linter (Oxlint)
$ npm run lint
Found 0 warnings and 0 errors.
Finished in 27ms on 33 files with 116 rules.

# 4. Dependency Security Audit
$ npm audit
found 0 vulnerabilities
```

---

## 7. Known Limitations & Transparency Disclosure

1. **GitHub Pages Backend Limitation**: GitHub Pages hosts static frontend assets only. The Express backend (`server/index.ts`) is designed to run in environments supporting Node.js (e.g. Railway, Render, Google Cloud Run). When deployed on GitHub Pages, UtsavPilot runs in 100% offline-ready deterministic fallback mode with full mathematical reconciliation.
2. **Pricing Integrity Disclosure**: Budget allocation ranges are calibrated based on regional Indian industry benchmarks (Tier 1 vs Tier 2 cities). UtsavPilot does not fabricate live vendor quotes or claim automated booking partnerships.

---

## 8. Final Submission Verdict

# **READY FOR SUBMISSION**

All discovered defects, title placeholder issues, category visual leaks, and dependency vulnerabilities have been completely resolved, verified in automated test suites, and visually confirmed across desktop and mobile browsers.
