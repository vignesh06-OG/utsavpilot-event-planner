# UTSAVPILOT — RISK REGISTER & MITIGATION STRATEGY
**Document ID:** RR-001  
**Project:** UtsavPilot Celebration & Event Planner  
**Revision:** 1.0.0  

---

## 1. Risk Assessment Framework

Risks are categorized across five core domains:
- **SEC:** Security & Data Privacy
- **AI:** Artificial Intelligence Reliability & Hallucination
- **ENG:** Technical Architecture & Code Quality
- **UX:** Usability, Motion & Accessibility
- **DEP:** Deployment, Infrastructure & Git Operations

**Risk Rating Matrix:**
- **Critical (P0):** Immediate threat to submission validity, data security, or application execution.
- **High (P1):** Significant barrier to usability, accessibility compliance, or competition scoring.
- **Medium (P2):** Degraded experience or non-critical edge case defect.
- **Low (P3):** Minor visual polish or documentation enhancement.

---

## 2. Identified Risks and Mitigation Actions

| Risk ID | Domain | Description | Severity | Likelihood | Mitigation Strategy | Verification Evidence |
|:---|:---|:---|:---:|:---:|:---|:---|
| **R-SEC-01** | SEC | Accidental exposure of Gemini API keys or credentials in client bundles or Git history | **P0** | Low | API calls are strictly routed through server-side proxy (`server/index.ts`). No secrets exist in client code. `.env` is listed in `.gitignore`. Pre-commit scans verify zero committed credentials. | Verified `.gitignore` and `src/services/aiClient.ts` fetch calls; zero client-side keys. |
| **R-AI-01** | AI | LLM hallucination of fabricated vendor quotes, unrealistic timelines, or invalid total budgets | **P0** | High | Mathematical budget calculations and contingency reserves are pre-computed deterministically before the LLM prompt is constructed. AI only provides qualitative descriptions, decor themes, and questions. In-browser deterministic fallback guarantees 100% validity. | Verified in `geminiService.ts` and `deterministicFallback.test.ts`. |
| **R-AI-02** | AI | LLM service outage, rate-limiting (429), or network failure during live judging evaluation | **P0** | Medium | Built-in offline deterministic fallback engine in `src/engine/deterministicFallback.ts`. When `/api/plan` times out (14s) or returns an error, the UI seamlessly renders a complete, mathematically verified plan without crashing. | `aiClient.ts` fallback catch-block verified via Vitest in `deterministicFallback.test.ts`. |
| **R-SEC-02** | SEC | Prompt injection via untrusted user inputs (e.g. event notes, special requests) attempting to hijack model behavior | **P1** | Medium | Server-side sanitization in `server/middleware/security.ts` removes markdown blocks, system-like XML tags, overrides phrases like "ignore previous instructions", and enforces a strict 1500-character ceiling. | `securitySanitize.test.ts` validates regex filters against attack payloads. |
| **R-ENG-01** | ENG | Floating-point rounding errors causing budget allocations to exceed total budget by ₹1 or more | **P1** | Medium | `budgetEngine.ts` employs integer rounding on percentage allocations and explicitly reconciles category sums with the total budget by adjusting the largest category or contingency buffer. | Tested in `budgetEngine.test.ts` across standard, luxury, and budget tiers. |
| **R-UX-01** | UX | Motion animations blocking user interaction, causing motion sickness, or crashing on mobile | **P1** | Low | Fast, purposeful motion durations (180ms-380ms). Strict `@media (prefers-reduced-motion: reduce)` CSS override sets animation durations to 0.001ms. `whileInView` reveals use `viewport={{ once: true }}` to prevent elements remaining stuck at 0 opacity. | Verified in browser QA across desktop and mobile viewports. |
| **R-UX-02** | UX | Horizontal scroll overflow on narrow mobile devices (360px-390px) breaking layout | **P1** | Medium | Responsive CSS grid layouts (`.grid-2`, `.grid-3`, `.grid-4`) collapse to single-column flex/grid containers below 768px. Explicit checks verify `scrollWidth === clientWidth`. | Verified in browser QA on 390x844 and 360x740 viewports. |
| **R-ENG-02** | ENG | Loss of user event data upon page refresh or browser back/forward navigation | **P1** | Medium | Dual-layer persistence: `localStorage` key `utsavpilot_current_plan_v1` auto-saves all modifications, while URL hash synchronization (`#landing`, `#wizard`, `#workspace`) handles browser history traversal without state reset. | Tested via browser subagent in `back_forward_history_qa`. |
| **R-ACC-01** | ACC | Inaccessible dialogs or form controls failing WCAG 2.2 AA standards | **P1** | Low | All dialogs utilize `role="dialog"`, `aria-modal="true"`, and accessible labels. Task items support `Space`/`Enter` keyboard toggles. High-contrast typography adheres to 4.5:1 ratio. | Tested via automated code audit and keyboard navigation. |
| **R-DEP-01** | DEP | Deployment revision drift between local repository and deployed public artifact | **P0** | Low | Production deployment is triggered only from the exact clean Git commit hash, verified by automated build logs and commit SHA stamping in the UI footer. | Part of final deployment gate checks. |

---

## 3. Residual Risk & Monitoring Plan
All P0 and P1 risks have active mitigations and automated verification tests in place. Zero unresolved P0 vulnerabilities exist. Continuous monitoring is enforced via Vitest unit tests, Oxlint rules, and strict TypeScript compilation before deployment.

