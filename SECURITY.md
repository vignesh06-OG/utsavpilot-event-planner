# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The UtsavPilot team takes security, user privacy, and secret isolation seriously. If you discover a vulnerability, please do NOT disclose it publicly via GitHub issues.

### Reporting Process
- Please email security findings to the repository maintainer.
- Include a detailed description of the vulnerability, reproduction steps, and potential exploit impact.
- We will acknowledge receipt of your report within 48 hours and coordinate remediation.

## Security Architecture Principles

1. **Zero Client Secret Exposure:**
   - Client bundles never contain or access `GEMINI_API_KEY` or third-party provider credentials.
   - All AI interactions pass through the server-side Express proxy.

2. **Input Sanitization & Injection Defense:**
   - All user inputs are sanitized against prompt injection and malicious script payloads in `server/middleware/security.ts`.
   - String inputs are restricted to safe lengths (maximum 1,500 characters) to prevent token exhaustion.

3. **Deterministic Isolation:**
   - Budget calculations, feasibility checks, and contingency allocations are executed deterministically in TypeScript.
   - LLMs are never permitted to calculate or override financial totals.

4. **Rate Limiting:**
   - The backend API implements an in-memory sliding-window rate limiter (25 requests per minute per IP).

