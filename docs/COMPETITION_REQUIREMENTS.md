# UTSAVPILOT — COMPETITION REQUIREMENTS SPECIFICATION
**Challenge:** PromptWars Virtual — Celebration & Event Planner  
**Project:** UtsavPilot (Adaptive Indian Celebration Planner)  
**Status:** Baseline Implementation Active; Comprehensive Hardening in Progress  
**Document Revision:** 1.0.0 (Production Submission Track)

---

## 1. Problem Statement & Context

### 1.1 Official Brief Summary
The PromptWars Virtual challenge requires an original, production-quality, GenAI-powered Celebration & Event Planner tailored for real-world event organizing.
- **Target Audience:** India-first hosts organizing weddings, milestone birthdays, family pujas/bhojan, college fests, and community celebrations.
- **Core Product Promise:** *"Create a realistic event plan, understand where the money goes, and adapt the plan intelligently whenever circumstances change."*
- **Primary Domain Challenge:** Traditional event planning in India suffers from opaque pricing, unbudgeted contingency drains, rigid timelines, and high failure rates when unforeseen disruptions occur (e.g. venue cancellations, sudden budget cuts, or guest surges). Generic LLM wrappers hallucinate vendor quotes, propose mathematically impossible budgets, and lack execution rigor.

---

## 2. Six Primary Evaluation Parameters

| Parameter | Weight / Critical Focus | Measurable Acceptance Standard |
|:---|:---|:---|
| **1. Code Quality** | Architecture, modularity, type safety, cleanliness | Strict TypeScript (`noUnusedLocals`, `verbatimModuleSyntax`), clean domain separation, 0 lint warnings via Oxlint, 0 build errors. |
| **2. Security** | Threat model, secret safety, injection defense | 0 exposed keys, strict client/server boundary, input sanitization against prompt injection, schema validation on all inputs/outputs, rate limiting. |
| **3. Efficiency** | Bundle size, render performance, memory, network | Minified asset footprint, zero unbounded re-renders, deterministic offline compute (<5ms) reducing costly LLM latency. |
| **4. Testing** | Comprehensive automated test coverage | Unit tests, boundary tests, scenario tests for budget & replan engines, deterministic fallbacks, 100% pass rate. |
| **5. Accessibility** | WCAG 2.2 AA conformance | Semantic HTML, full keyboard navigation, screen-reader compatibility (`sr-only` text, ARIA attributes), high contrast, strict `prefers-reduced-motion` compliance. |
| **6. Problem Alignment** | Defensibility, domain fidelity, utility | Complete end-to-end workflow: input wizard → feasibility analysis → budget allocation → task timeline → vendor checklists → adaptive replanning → printable dossier. |

---

## 3. Functional Requirements & Scope Boundaries

### FR-01: Multi-Category Celebration Modeling
- Support 6 authentic Indian celebration archetypes:
  1. *Wedding & Sangeet* (Baraat, Mandap, Sangeet, Hospitality)
  2. *Birthday Milestone* (Themes, entertainment, catering)
  3. *Puja & Family Bhojan* (Satyanarayan, Griha Pravesh, Prasad)
  4. *College Fest / Cultural Gala* (Stage, sound, security, licensing)
  5. *Community Festival* (Society pandals, Dandiya, logistics)
  6. *Corporate Celebration* (Annual day, gala dinner, awards)

### FR-02: Deterministic Budget Feasibility & Allocation Engine
- Mathematically rigorous budget allocation across 8 core celebration categories:
  - Venue & Infrastructure
  - Catering & Beverage
  - Photography & Cinematography
  - Decor, Florals & Lighting
  - Attire, Makeup & Styling
  - Entertainment & Sound
  - Invitations & Gifting
  - Logistics & Hospitality
- Dynamic contingency buffer calculation (10% standard, 15% luxury/destination, 8% budget).
- Regional cost per guest feasibility benchmark checking against minimum thresholds (e.g. Tier-1 Metro Wedding ₹2,500/guest vs ₹800/guest budget tier). Infeasible budgets must be explicitly flagged with actionable warning notes rather than misleading the user.

### FR-03: Actionable Milestone Timeline & Family Ownership
- Temporal milestone breakdown:
  - `months_before` (2-3 months prior)
  - `weeks_before` (2-4 weeks prior)
  - `days_before` (final prep)
  - `day_of` (run-of-show execution)
  - `post_event` (settlement & wrapup)
- Role assignment to specific family members/hosts (e.g., "Uncle Rajesh", "Brother Rohan").
- Interactive completion tracking with local storage persistence and celebration feedback.

### FR-04: Vendor Due Diligence & Negotiation Transparency
- Transparent market benchmark price ranges based on regional celebration tiers.
- Pro-verification checklists and crucial due diligence questions to ask vendors before signing contracts.
- Explicit disclosure: **Zero fabricated live quotes**; transparent benchmarks with contract protection tips.

### FR-05: Adaptive Replanning Under Disruption (Core Differentiator)
- Immediate recalculation when real-life event parameters change:
  - Emergency budget reduction (-10% to -40%)
  - Guest surge / drop
  - Venue cancellation or change
  - Priority shifts (e.g., prioritize food over decor)
- Automated delta generation explaining exactly which categories absorbed cuts, how contingency was deployed, and updated task deadlines.

### FR-06: Hybrid GenAI + Deterministic Architecture
- Server-side Gemini 1.5 Flash integration with prompt-injection filtering.
- Client-side deterministic fallback engine ensuring 100% availability even when offline, unauthenticated, or rate-limited.
- Strict Zod schema validation ensuring structural integrity before data reaches the UI.

### FR-07: Exportable Celebration Dossier
- Clean, printable executive summary, category financial breakdown, milestone checklist, and vendor questions formatted for paper distribution or PDF save.

---

## 4. Non-Functional Requirements (NFR)

- **NFR-01 (Performance):** Client-side deterministic replan execution under 10ms. Initial production page load under 1.5s on 4G networks.
- **NFR-02 (Reliability):** Zero fatal uncaught exceptions. All user modifications persist in browser `localStorage`.
- **NFR-03 (Security):** Zero client-side API secret leakage; strict CORS and input length truncation (max 1500 chars).
- **NFR-04 (Accessibility):** WCAG 2.2 AA compliant contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text); keyboard accessible dialogs.
- **NFR-05 (Cross-Device Responsiveness):** Fluid responsiveness across viewports (1440px desktop down to 360px mobile) with zero horizontal scroll clipping.

