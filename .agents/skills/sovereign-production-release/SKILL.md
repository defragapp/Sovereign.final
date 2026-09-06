---
name: sovereign-production-release
description: Autonomously performs pre-flight release hygiene, CSS authority verification, full gate testing (typecheck, build, test, verify:foundation, verify:cloudflare-build), multi-viewport visual QA (Playwright 1440x900 & 390x844), staging/commit, Cloudflare production deployment (production:release:oauth), and live /ready SHA parity validation. Supports verification-only, release-preparation, and production-release execution modes.
---

# Sovereign.OS Production Release & Verification Skill

## Overview

The `sovereign-production-release` skill provides an authoritative, multi-gate pre-flight and production deployment verification framework for **Sovereign.OS** (`defragapp/Sovereign.final`).

It enforces strict product-language contracts, CSS import precedence, zero-overflow visual QA, Cloudflare edge deployment verification, and `/ready` SHA parity without modifying underlying backend/runtime architecture.

---

## Modes of Operation

1. **`verification-only`**:
   - Audits release hygiene, CSS precedence, contract terminology, 5 verification gates, and visual QA.
   - Does **not** modify code, commit, or deploy.
   - Ideal for continuous integration and pre-commit checks.

2. **`release-preparation`**:
   - Cleans temporary QA artifacts and fixes public contract leaks.
   - Executes 5 verification gates and visual QA.
   - Stages hygiene changes, commits with `chore(release): ...`, and pushes `origin/main`.
   - Does **not** execute production deployment.

3. **`production-release`**:
   - Executes all steps of `release-preparation`.
   - Invokes `pnpm production:release:oauth`.
   - Polls edge convergence and verifies live `https://sovereign.defrag.app/ready` SHA parity against `main`.
   - Emits structured release disposition (`PASS`, `PASS_WITH_BLOCKER`, `FAIL`).

---

## Architectural Invariants (DO NOT VIOLATE)

This skill is **hygiene and release verification infrastructure**, not an architectural migration tool.
When running this skill, the agent MUST NOT:
- Replace or alter Cloudflare Workers, Durable Objects, D1 database schemas, or Workers AI configuration.
- Rewrite the `sovereign-answer.v2` contract or model context logic.
- Replace production API endpoints with mock fallbacks.
- Alter existing Wrangler bindings or environment variable structures.

---

## Execution Protocol

### Step 1 — Release Hygiene & Contract Audit
1. Inspect `git status`, current branch, and drift vs `origin/main`.
2. Remove any temporary QA scripts (e.g. `scripts/capture-visual-qa.mjs`) or scratch artifacts.
3. Grep public TSX/HTML/CSS for exposed internal terms (e.g., raw uppercase `BASIS:`, `Baseline Active`, exposed framework badges).
4. Correct public copy to use founder product vocabulary (e.g., `Sources:` instead of `BASIS:`).

### Step 2 — Frontend & CSS Integrity Audit
1. Verify stylesheet import order in `apps/web/src/main.tsx`:
   ```tsx
   import './design-system.css';
   import './public.css';
   import './workspace.css';
   import './styles.css';
   ```
2. Confirm `styles.css` defines base utilities and CSS variables without undermining `design-system.css`.

### Step 3 — Verification Gates
Execute and verify each gate independently:
```bash
pnpm typecheck
pnpm build
pnpm test
pnpm verify:foundation
pnpm verify:cloudflare-build
```

### Step 4 — Multi-Viewport Visual QA
1. Launch local static server on `apps/web/dist`.
2. Run Playwright across all 5 public & web app routes:
   - `/`
   - `/workspace.html`
   - `/how-it-works.html`
   - `/faq.html`
   - `/security.html`
3. Evaluate at **Desktop (1440x900)** and **Mobile (390x844)**.
4. Gate requirement: `scrollWidth > clientWidth === false` (**0.0px horizontal overflow**).

### Step 5 — Release & Deployment Verification
1. Commit hygiene pass: `git commit -m "chore(release): final launch hygiene"`
2. Push to remote: `git push origin main`
3. Run release script: `pnpm production:release:oauth`
4. Query live production target: `curl -s https://sovereign.defrag.app/ready`
5. Assert SHA parity: `live_sha === git_head_sha`.

---

## Final Release Report Format

Every execution ends with a human-readable & machine-readable report:

```json
{
  "releaseDisposition": "PASS",
  "commitSha": "9ee195feb4b2b1f33e526ae754ff3c1a773e5ff0",
  "workingTreeClean": true,
  "verificationGates": {
    "typecheck": true,
    "build": true,
    "test": true,
    "verifyFoundation": true,
    "verifyCloudflareBuild": true
  },
  "visualQa": {
    "desktopOverflow": 0,
    "mobileOverflow": 0,
    "routesAudited": 5
  },
  "deployment": {
    "executed": true,
    "liveTarget": "https://sovereign.defrag.app",
    "readyStatus": true,
    "liveSha": "9ee195feb4b2b1f33e526ae754ff3c1a773e5ff0",
    "shaParity": true
  },
  "blockers": []
}
```
