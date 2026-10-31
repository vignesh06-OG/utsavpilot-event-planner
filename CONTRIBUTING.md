# Contributing to UtsavPilot

Thank you for your interest in contributing to **UtsavPilot**, the open-source, adaptive Indian celebration and event planning platform.

## Code of Conduct
We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please treat all community members with respect and courtesy.

## Development Workflow

### 1. Prerequisites
- Node.js `v20.x` or higher (verified on `v24.x`)
- npm `v10.x` or higher

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/vignesh06-OG/utsavpilot-event-planner.git
cd utsavpilot-event-planner

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run local development server
npm run dev

# Optionally run backend API proxy (if using Gemini AI features)
npm run server
```

### 3. Quality Standards
Before submitting a pull request, ensure all checks pass locally:

```bash
# 1. Run Oxlint code linter
npm run lint

# 2. Run TypeScript strict type-check
npx tsc -b

# 3. Run automated Vitest test suite
npm test

# 4. Verify production bundle build
npm run build
```

### 4. Mathematical Engine Invariants
The domain calculation modules in `src/engine/budgetEngine.ts` and `src/engine/replanEngine.ts` enforce strict budget conservation rules:
- Sum of category allocations plus contingency reserve MUST always reconcile to 100% of the total budget.
- Rounding adjustments must never produce negative numbers or phantom deficits.
- All new features must include regression unit tests under `src/tests/`.

### 5. Pull Request Guidelines
- Branch naming: `feat/feature-name` or `fix/bug-description`.
- Keep commits clear, descriptive, and atomic.
- Include evidence of automated test passes in PR descriptions.
