---
name: sovereign-production-release
description: Autonomously performs pre-flight release hygiene, CSS authority verification, full gate testing (typecheck, build, test, verify:foundation, verify:cloudflare-build), multi-viewport visual QA (Playwright 1440x900 & 390x844), staging/commit, Cloudflare production deployment (production:release:text), and live /ready SHA parity validation. Supports verification-only, release-preparation, and production-release execution modes.
---

# Sovereign.OS Production Release & Verification Skill

## Overview

The `sovereign-production-release` skill provides an authoritative, multi-gate pre-flight and production deployment verification framework for **Sovereign.OS** (`defragapp/Sovereign.final`).

It enforces strict product-language contracts, CSS import precedence, zero-overflow visual QA, Cloudflare edge deployment verification, and `/ready` SHA parity without modifying underlying backend/runtime architecture.

---

## Modes of Operation

1. **`verification-only`** (Default):
   - Audits release hygiene, CSS precedence, contract terminology, 5 verification gates, and visual QA.
   - Zero source mutation, zero commit, zero push, zero deployment.
   - Ideal for continuous integration and pre-commit checks.

2. **`release-preparation`**:
   - Cleans temporary QA artifacts and fixes public contract leaks.
   - Executes 5 verification gates and visual QA.
   - Stages hygiene changes, commits with `chore(release): ...`, and pushes `origin/main`.
   - Does **not** execute production deployment.

3. **`production-release`**:
   - Executes all steps of `release-preparation`.
   - Invokes the repository's authoritative production release command (`pnpm production:release:text` by default, or `--release-command pnpm production:release:oauth` for optional Browser-audited releases).
   - Polls edge convergence and verifies live `https://sovereign.defrag.app/ready` and `https://app.defrag.app/ready` SHA parity against `main`.
   - Emits structured release disposition (`PASS`, `PASS_WITH_BLOCKER`, `FAIL`).

---

## Execution Command

Run the executable verifier directly from the repository:

```bash
node .agents/skills/sovereign-production-release/scripts/release-verifier.mjs --mode verification-only
```

Options:
- `--mode <verification-only | release-preparation | production-release>`
- `--target-ref <branch or sha>` (default: `main`)
- `--target-surface <url>` (default: `https://sovereign.defrag.app`)
- `--release-command <command>` (default: `pnpm production:release:text`; use `pnpm production:release:oauth` for optional Browser-audited release)
- `--output-json <path>` (default: `.tmp/release-evidence.json`)
- `--output-markdown <path>` (default: `.tmp/release-evidence.md`)

---

## Production Release Authorities

- **Text-First Production Release**: `pnpm production:release:text` (Default) — Canonical release path enforcing current `origin/main` SHA validation, token-based release execution, schema parity, and edge readiness.
- **Browser-Audited Production Release**: `pnpm production:release:oauth` (Optional Override) — Extended release path requiring interactive OAuth credentials and generating automated browser visual rendering evidence.

---

## Architectural Invariants (DO NOT VIOLATE)

This skill is **hygiene and release verification infrastructure**, not an architectural migration tool.
When running this skill, the agent MUST NOT:
- Replace or alter Cloudflare Workers, Durable Objects, D1 database schemas, or Workers AI configuration.
- Rewrite the `sovereign-answer.v2` contract or model context logic.
- Replace production API endpoints with mock fallbacks.
- Alter existing Wrangler bindings or environment variable structures.

---

## Verification Gates & Quality Checks

1. **Git State & Working Tree Audit**: Calculates current commit SHA dynamically from `git rev-parse HEAD` and checks drift against `origin/main`. Fails if `HEAD !== origin/main`.
2. **Copy Leak & CSS Precedence Audit**: Verifies `main.tsx` CSS import order (`design-system.css` → `public.css` → `workspace.css` → `styles.css`) and audits for raw internal labels (e.g. `BASIS:`).
3. **Five Verification Gates**:
   - `pnpm typecheck`
   - `pnpm build`
   - `pnpm test`
   - `pnpm verify:foundation`
   - `pnpm verify:cloudflare-build`
4. **Playwright Visual QA Audit**: Launches local preview server on `apps/web/dist` and tests 5 routes at `1440x900` (desktop) and `390x844` (mobile) for `0.0px` horizontal overflow, console errors, and missing/404 document routes.
5. **Deployment & Parity Audit**: Deploys via authoritative release script and verifies `/ready` SHA parity against the frozen release commit across both `sovereign.defrag.app` and `app.defrag.app`.

---

## Structured Release Evidence Output

```json
{
  "mode": "verification-only",
  "releaseDisposition": "PASS",
  "commitSha": "<calculated_sha>",
  "originMainSha": "<calculated_sha>",
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
    "routesAudited": 5,
    "passed": true
  },
  "deployment": {
    "executed": false,
    "releaseCommand": "pnpm production:release:text",
    "liveTarget": "https://sovereign.defrag.app",
    "readyStatus": null,
    "liveSha": null,
    "shaParity": null
  },
  "blockers": []
}
```
