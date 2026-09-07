# Milestone 3 Remediation: Test Impact & Regression Analysis Report

**Investigator**: Explorer Fix 3  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_3`  
**Parent Agent**: `c76c6f5b-d8e4-45b7-af63-a75188c0ed34`  
**Target Code**: `apps/web/src/App.tsx` (Lines 173, 1453, 1584, 1594, 1691)  
**Date**: 2026-09-07T08:24:30Z  

---

## Executive Summary

Reviewer 2 flagged 5 line-level violations in `apps/web/src/App.tsx`:
1. **Line 173**: Forbidden token `backdrop-blur-md` in sticky `<header>`.
2. **Line 1453**: Non-canonical Today headline `What would you like to understand?`.
3. **Line 1584**: Prohibited input placeholder phrase `Ask Sovereign about your life...`.
4. **Line 1594**: Prohibited term `Model context is restricted to consenting data`.
5. **Line 1691**: Prohibited Systems dimension `how authority flows`.

This investigation rigorously evaluated:
- All test suites in `apps/web/src/` (`LandingParity.test.ts`, `PublicSupport.test.ts`).
- Monorepo integration and E2E suites (`tests/e2e/`, `apps/worker`, `apps/sovereign-worker`, `scripts/`).
- The risk of test failure or behavioral regressions when applying the 5 fixes.
- Necessary enhancements to `LandingParity.test.ts` to permanently lock in the fixes and prevent recurrence.
- The exact verification commands required to validate the remediations.

**Key Finding**: None of the 5 targeted changes will break existing tests or cause regressions. Crucially, fixing Line 173 resolves an active failure in `pnpm validate:ui` (`.agents/skills/ui-contract-validator.mjs`). Furthermore, adding 6 specific assertions to `LandingParity.test.ts` closes the gaps that permitted these prohibited strings to bypass tests initially.

---

## 1. Codebase Test Environment & Baseline Analysis

### 1.1 Test Suites in `apps/web`
`apps/web/src/` contains two test files with 10 total passing test cases:

1. **`apps/web/src/LandingParity.test.ts`** (7 test cases):
   - Integrates Google Fonts for Inter and JetBrains Mono in `index.html`.
   - Prioritizes Inter and JetBrains Mono in `styles.css`.
   - Implements Founder Hero with exact copy and typographic apostrophe.
   - Implements Three-Layer Scope progression (01, 02, 03) with exact copy.
   - Implements Sovereign Answer Demo window with relational triad and inline sources drawer.
   - Checks zero prohibited terms in user-facing UI copy (currently checks 10 phrases).
   - Preserves all non-landing routes and voluntary support URL integrity.

2. **`apps/web/src/PublicSupport.test.ts`** (3 test cases):
   - Keeps one Stripe-hosted support path visible across public information surfaces.
   - Keeps voluntary support separate from subscriptions and entitlement projection.
   - Preserves the current custom contribution minimum ($1) and disclosure.
   - *Note*: Does not import or assert anything in `App.tsx`.

### 1.2 Full Repository Baseline Verification Results
All repo-wide quality gates were executed and recorded:

| Gate / Command | Current Status | Details |
|---|---|---|
| `pnpm --filter @sovereign/web test` | **PASS (10/10)** | `LandingParity.test.ts` (7), `PublicSupport.test.ts` (3) |
| `pnpm test` (monorepo) | **PASS (399/399)** | 69 test files across worker, sovereign-worker, and web |
| `pnpm verify:foundation` | **PASS** | 5 required files, JSON validity, core D1 tables confirmed |
| `pnpm typecheck` | **PASS** | 0 TypeScript errors across 5 workspace projects |
| `pnpm build` | **PASS** | Vite bundle generated (dist: 422kB JS, 699kB CSS), worker bundle packaged |
| `node .agents/skills/ui-contract-validator.mjs` (`pnpm validate:ui`) | **FAIL (Exit Code 1)** | `apps/web/src/App.tsx: Contains forbidden token 'backdrop-blur' per UI_UX_CONTRACT.md` |
| `pnpm verify:cloudflare-build` | **PASS** | Upload size 237.23 KiB (well under 2500 KiB budget), 40 D1 tables & 100 indexes verified |

---

## 2. Regression & Side-Effect Assessment for the 5 Fixes

| Target Line | Current Content | Proposed Fix | Existing Test Impact | Regression Risk |
|---|---|---|---|---|
| **Line 173** | `bg-[#000000]/90 backdrop-blur-md` | `bg-[#000000]/90` (remove `backdrop-blur-md`) | Zero impact on `LandingParity.test.ts` or E2E tests. **Fixes active failure** in `pnpm validate:ui`. | **Zero Risk** (strictly positive) |
| **Line 1453** | `What would you like to understand?` | `What is active for you now?` | No existing tests assert this string. Aligns with `SovereignIntelligenceWorkspace.tsx` and `scripts/verify-intelligence-release.mjs`. | **Zero Risk** |
| **Line 1584** | `placeholder="Ask Sovereign about your life..."` | `placeholder="Ask about a decision, relationship, or situation..."` | No existing tests assert this placeholder. Eliminates violation of `docs/product-language-system.md` line 595. | **Zero Risk** |
| **Line 1594** | `Private by default · Model context is restricted to consenting data` | `Private by default · Sovereign uses only consented information` | No existing tests assert this string. Eliminates prohibited term `model context`. | **Zero Risk** |
| **Line 1691** | `When three or more people interact... Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.` | `When three or more people interact... Sovereign maps who is involved, where pressure builds, how people respond to one another, and what may change when one person responds differently.` | `LandingParity.test.ts` line 58 tests Layer 03 landing copy (lines 386-388), not line 1691. Eliminates prohibited dimension `authority`. | **Zero Risk** |

---

## 3. Why Existing Tests Permitted These Violations (Gaps)

1. **`LandingParity.test.ts` Prohibited Terms List Gap**:
   - The test searched for `'model-safe context'`, but **not** `'model context'`. Line 1594 bypassed the check.
   - The test searched for `'Ask about your life'`. Line 1584 used `'Ask Sovereign about your life...'`. Because the word `"Sovereign"` was intercalated, the exact substring match failed.
   - The test did **not** search for `'authority'` or `'how authority flows'`.
   - The test did **not** search for `'What would you like to understand'`.

2. **Style Contract Disconnect**:
   - `LandingParity.test.ts` only evaluated text strings, fonts, and routes, leaving CSS token validation entirely to `ui-contract-validator.mjs`.
   - Because `ui-contract-validator.mjs` is run via `pnpm validate:ui` and not inside `pnpm test`, developers running only `pnpm test` received a false sense of security.

3. **Authenticated Workspace Coverage**:
   - `LandingParity.test.ts` primarily focused on the public landing page (Hero, 3 Layers, Demo triad). Lines 1453, 1584, 1594, and 1691 reside in the authenticated view of `App.tsx` (`activeTab === 'today'` and `activeTab === 'systems'`).

---

## 4. Recommended Test Additions for `LandingParity.test.ts`

To lock in these 5 fixes permanently, the following updates should be made to `apps/web/src/LandingParity.test.ts`:

### 4.1 Update `prohibitedTerms` array in `LandingParity.test.ts`
Add the following entries to `prohibitedTerms`:
- `'model context'` (catches line 1594 and any future variations)
- `'about your life'` (catches line 1584 and any variation containing "about your life")
- `'how authority flows'` (catches line 1691)
- `'authority'` (or `'authority flows'`)
- `'What would you like to understand'` (catches line 1453)
- `'What do you want to understand'`

### 4.2 Add UI Styling Constraint Test
Add an explicit test case to `LandingParity.test.ts` mirroring `ui-contract-validator.mjs`:
```typescript
  it('strictly complies with the UI contract styling constraints in App.tsx', () => {
    const forbiddenTokens = [
      'backdrop-blur',
      'bg-gradient-to-r',
      'bg-gradient-to-l',
      'bg-gradient-to-t',
      'bg-gradient-to-b',
      'animate-spin-slow',
      'neon-glow'
    ];
    for (const token of forbiddenTokens) {
      expect(appTsx).not.toContain(token);
    }
  });
```

### 4.3 Add Authenticated Surface Parity Test
Add an explicit test asserting canonical wording on the authenticated surfaces within `App.tsx`:
```typescript
  it('implements authenticated workspace canonical copy and privacy notes', () => {
    // Today view
    expect(appTsx).toContain('What is active for you now?');
    expect(appTsx).not.toContain('What would you like to understand?');
    
    // Privacy note
    expect(appTsx).toContain('Private by default · Sovereign uses only consented information');
    expect(appTsx).not.toContain('Model context');

    // Composer placeholder
    expect(appTsx).toContain('placeholder="Ask about a decision, relationship, or situation..."');
    expect(appTsx).not.toContain('about your life');

    // Systems view
    expect(appTsx).not.toContain('how authority flows');
  });
```

---

## 5. Required Verification Commands

When applying the fixes in `apps/web/src/App.tsx` and updating `LandingParity.test.ts`, the following command suite must be executed:

1. **`pnpm test`**
   - Runs vitest across `@sovereign/web`, `@sovereign/worker`, and `@sovereign/sovereign-worker`.
   - Confirms all 399+ tests pass, including the new assertions in `LandingParity.test.ts`.

2. **`pnpm validate:ui`** (`node .agents/skills/ui-contract-validator.mjs`)
   - Verifies zero forbidden tokens (`backdrop-blur`, gradients, glows) in `apps/web/src`.
   - Confirms exit code 0 (previously exit code 1).

3. **`pnpm verify:foundation`**
   - Verifies file integrity, JSON validity, and core database tables.

4. **`pnpm typecheck`**
   - Confirms zero TypeScript diagnostics across all 5 workspace projects.

5. **`pnpm build`**
   - Confirms clean Vite client production build and Cloudflare Worker dry-run packaging.

6. **`pnpm verify:cloudflare-build`**
   - Confirms production bundle size and D1 migration parity for release deployment.

---

## 6. Proposed Code Changes for Implementer

### File 1: `apps/web/src/App.tsx`

```diff
@@ -173,1 +173,1 @@
-    <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#000000]/90 backdrop-blur-md">
+    <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#000000]/90">

@@ -1453,1 +1453,1 @@
-                      What would you like to understand?
+                      What is active for you now?

@@ -1584,1 +1584,1 @@
-                    placeholder="Ask Sovereign about your life..."
+                    placeholder="Ask about a decision, relationship, or situation..."

@@ -1594,1 +1594,1 @@
-                Private by default · Model context is restricted to consenting data
+                Private by default · Sovereign uses only consented information

@@ -1691,1 +1691,1 @@
-                When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
+                When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who is involved, where pressure builds, how people respond to one another, and what may change when one person responds differently.
```

### File 2: `apps/web/src/LandingParity.test.ts`

```diff
@@ -83,4 +83,8 @@
       'Ask about your life',
+      'about your life',
+      'model context',
+      'how authority flows',
+      'What would you like to understand',
+      'What do you want to understand',
       'What is Basis?',
       'What does Basis prove?'
     ];
@@ -111,2 +115,28 @@
     expect(appTsx).toContain(generalSupportUrl);
   });
+
+  it('strictly complies with the UI contract styling constraints in App.tsx', () => {
+    const forbiddenTokens = [
+      'backdrop-blur',
+      'bg-gradient-to-r',
+      'bg-gradient-to-l',
+      'bg-gradient-to-t',
+      'bg-gradient-to-b',
+      'animate-spin-slow',
+      'neon-glow'
+    ];
+    for (const token of forbiddenTokens) {
+      expect(appTsx).not.toContain(token);
+    }
+  });
+
+  it('implements authenticated workspace canonical copy and privacy notes', () => {
+    expect(appTsx).toContain('What is active for you now?');
+    expect(appTsx).not.toContain('What would you like to understand?');
+    expect(appTsx).toContain('Private by default · Sovereign uses only consented information');
+    expect(appTsx).not.toContain('Model context');
+    expect(appTsx).toContain('placeholder="Ask about a decision, relationship, or situation..."');
+    expect(appTsx).not.toContain('how authority flows');
+  });
 });
```
