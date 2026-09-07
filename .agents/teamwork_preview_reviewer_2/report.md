# Milestone 3 Review Report — Reviewer 2

**Reviewer**: Reviewer 2 (Reviewer & Adversarial Critic)  
**Target File**: `apps/web/src/App.tsx`  
**Authorities**: `docs/product-language-system.md`, `docs/inner-recognition-intelligence.md`, `AGENTS.md`, `docs/v0-visual-port-contract.md`, `.agents/skills/ui-contract-validator.mjs`  
**Date**: 2026-09-07T08:16:00Z  

---

## Review Summary

**Verdict**: **REQUEST_CHANGES**

While `apps/web/src/App.tsx` successfully achieves 100% exact-string parity for the Founder Hero, Three-Layer Scope sections, Sovereign Answer v2 Relational Triad, quiet Sources disclosure drawer, all 11 application routes, and Stripe voluntary support link ($1 floor with no higher tiers), adversarial inspection identified **1 Critical finding** (direct exposure of prohibited term `model context`), **3 Major language/copy findings** (prohibited systems intelligence dimension `authority`, prohibited placeholder phrase `Ask about your life`, and non-canonical Today heading `What would you like to understand?`), and **1 Major UI contract validation failure** (`pnpm validate:ui` failing on `backdrop-blur-md`).

---

## Findings

### [Critical] Finding 1: Direct UI Exposure of Prohibited Term "Model context"

- **What**: Prohibited implementation term `Model context` is rendered directly to the user in the authenticated workspace chat footer.
- **Where**: `apps/web/src/App.tsx`, line 1594:
  ```tsx
  <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
    Private by default · Model context is restricted to consenting data
  </div>
  ```
- **Why**: 
  - `USER_REQUEST`: "Verify zero exposure of prohibited terms (Basis, model context, provider names...)"
  - `docs/product-language-system.md`, line 130: *"Do not use `Basis`, `Example Basis`, `provenance`, `evidence`, `model context`, `server-approved`, or `authorized references` as unexplained interface labels."*
  - `docs/product-language-system.md`, line 585: *"Never use these as active product/interface language: ... `model context` as ordinary UI language;"*
  - `AGENTS.md`: *"Do not expose internal implementation terms such as Basis IDs, model/provider identifiers, `sovereign-answer.v2`, or model-safe context."*
- **Suggestion**: Replace `Model context is restricted to consenting data` with plain-language privacy copy, for example:
  ```tsx
  Private by default · Sovereign uses only consented information
  ```

---

### [Major] Finding 2: Prohibited Systems Intelligence Dimension "Authority" in Systems View

- **What**: The authenticated Systems view copy introduces `how authority flows` as a product intelligence dimension.
- **Where**: `apps/web/src/App.tsx`, line 1691:
  ```tsx
  <p className="font-explanation text-xs max-w-md mx-auto">
    When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
  </p>
  ```
- **Why**: 
  - `docs/product-language-system.md`, lines 70–72: *"`Authority` and `missing perspective` are not canonical product intelligence dimensions. Do not infer an absent person's perspective or turn non-participation into a hidden-state claim."*
  - `docs/product-language-system.md`, lines 603–605: *"Never use these as active product/interface language: ... `authority` or `missing perspective` as canonical Systems intelligence dimensions;"*
  - `docs/v0-visual-port-contract.md`, line 52: *"do not treat `authority` or `missing perspective` as product intelligence dimensions;"*
- **Suggestion**: Align the Systems explanation with canonical language from `docs/product-language-system.md` line 529:
  ```tsx
  When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who is involved, where pressure builds, how people respond to one another, and what may change when one person responds differently.
  ```

---

### [Major] Finding 3: Retired / Prohibited Phrasing in Chat Textarea Placeholder

- **What**: Textarea placeholder embeds the prohibited phrase `Ask ... about your life`.
- **Where**: `apps/web/src/App.tsx`, line 1584:
  ```tsx
  placeholder="Ask Sovereign about your life..."
  ```
- **Why**: 
  - `docs/product-language-system.md`, line 595: *"Never use these as active product/interface language: - `Ask about your life.`; - `Ask about your life. Get an answer built around you.`;"*
- **Suggestion**: Use an approved non-prohibited placeholder such as:
  ```tsx
  placeholder="Ask about a decision, relationship, or situation..."
  ```

---

### [Major] Finding 4: Non-Canonical Today Surface Heading

- **What**: Authenticated Today surface uses a generic inquiry heading `What would you like to understand?` instead of the canonical Today heading.
- **Where**: `apps/web/src/App.tsx`, line 1453:
  ```tsx
  <p className="font-utility text-[var(--sage)]">TODAY</p>
  <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
    What would you like to understand?
  </h1>
  ```
- **Why**: 
  - `docs/product-language-system.md`, lines 511–514 explicitly defines the authenticated Today copy:
    ```markdown
    Today:
    - `What is active for you now?`
    - `Begin with what remains steady in your Baseline, then see what may be louder today.`
    ```
  - `docs/product-language-system.md`, lines 597–599 explicitly prohibits:
    *"`What do you want to understand?`; generic variants such as `What would you like to explore?`, `Ask anything.`, or `Tell me what's on my mind.`;"*
  - `What would you like to understand?` is a prohibited generic variant.
- **Suggestion**: Update line 1453 to:
  ```tsx
  <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
    What is active for you now?
  </h1>
  ```
  and the subline to:
  ```tsx
  <p className="font-explanation text-sm max-w-lg">
    Begin with what remains steady in your Baseline, then see what may be louder today.
  </p>
  ```

---

### [Major] Finding 5: UI Contract Validator Script Failure on `backdrop-blur-md`

- **What**: Running `pnpm validate:ui` (`node .agents/skills/ui-contract-validator.mjs`) fails with exit code 1 due to forbidden token `backdrop-blur`.
- **Where**: `apps/web/src/App.tsx`, line 173:
  ```tsx
  <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#000000]/90 backdrop-blur-md">
  ```
- **Why**: 
  - `.agents/skills/ui-contract-validator.mjs` line 4 forbids `backdrop-blur` across `apps/web/src`.
  - Running `node .agents/skills/ui-contract-validator.mjs` outputs:
    `[UI Contract Violation Found]: - /Users/cjo/Sovereign.final/apps/web/src/App.tsx: Contains forbidden token 'backdrop-blur' per UI_UX_CONTRACT.md`
- **Suggestion**: Remove `backdrop-blur-md` from line 173:
  ```tsx
  <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#000000]/95">
  ```

---

## Verified Claims

| Claim / Requirement | Verification Method | Status | Evidence / Line Numbers |
|---|---|---|---|
| Zero exposure of `Basis` | `grep_search` case-insensitive for `basis` | **PASS** | UI uses "Sources:", "See source details", "Source details". `basis` exists solely in TypeScript types and internal state (lines 41, 62, 1325, 1522). |
| Zero exposure of `model context` | `grep_search` case-insensitive for `model context` | **FAIL** | Found at line 1594: `"Model context is restricted to consenting data"`. |
| Zero exposure of `provider names` | `grep_search` for `anthropic\|openai\|claude\|gpt\|mistral\|horizons\|cloudflare` | **PASS** | Zero user-facing provider names rendered. |
| Zero exposure of `sovereign-answer.v2` | `grep_search` in `App.tsx` | **PASS** | Zero occurrences. |
| Zero exposure of `provenance` | `grep_search` in `App.tsx` | **PASS** | Zero occurrences. |
| Zero exposure of `what is basis?` | `grep_search` in `App.tsx` | **PASS** | Zero occurrences. |
| Zero exposure of `one private foundation` | `grep_search` in `App.tsx` | **PASS** | Zero occurrences. |
| Zero exposure of `separate helping from carrying` | `grep_search` in `App.tsx` | **PASS** | Zero occurrences. |
| Founder Hero exact kicker | Exact string comparison | **PASS** | Line 267: `PERSONAL AI FOR REAL LIFE`. |
| Founder Hero exact headline | Exact string comparison | **PASS** | Lines 271–273: `Healing isn’t optional. Holding onto the pain is.`. |
| Founder Hero exact 2-sentence description | Exact string comparison | **PASS** | Lines 276–277: `Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.`. |
| Founder Hero exact trust line | Exact string comparison | **PASS** | Line 302: `Start free · No card required · Review, correct, or reject any interpretation`. |
| Three-Layer Scope headings & descriptions | Exact string comparison against `product-language-system.md` | **PASS** | Lines 334–389: All 3 cards (`01 · YOU`, `02 · YOU + YOUR PEOPLE`, `03 · FROM 1:1 TO THE WHOLE SYSTEM`) match canonical headings and descriptions verbatim. |
| Sovereign Answer v2 Demo Triad sections | Exact string comparison | **PASS** | Lines 481, 494, 506: `WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU`. |
| Quiet Sources disclosure affordance | Inspection of lines 518–571 | **PASS** | Collapsed button `See source details`, drawer title `Source details`, copy `These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state.`, deterministic tags (`HD G13.1`, `GK ACT13`, `☉ CAN 04.2°`, `N LP1`). Exact codes hidden by default. |
| All 11 Routes in App.tsx | Static routing logic audit | **PASS** | Routes `/`, `/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app` correctly handled in `currentRoute()` (lines 66–83) and dispatched in `App()` (lines 145–155). |
| Stripe Voluntary Support URL integrity | URL string verification | **PASS** | Lines 1858, 1932: Exact URL `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`. |
| Voluntary Support tier rules | Scan of dollar figures | **PASS** | Voluntary support stated as "from $1" / "one-time amount from $1". No donation tiers above $1 anywhere in UI. |
| Test suite execution | `pnpm test` | **PASS** | 69 test files passed, 399 tests passed. |
| Foundation verification | `pnpm verify:foundation` | **PASS** | 5 required files, JSON valid, core D1 tables present. |
| Typecheck & build | `pnpm typecheck && pnpm build` | **PASS** | Zero type errors, web client and worker bundles built cleanly. |
| Cloudflare build diagnostics | `pnpm verify:cloudflare-build` | **PASS** | Build gate complete at commit `e0cfc2075b2f8a751835e51da1958c2792521cf5`. |
| UI contract validation | `node .agents/skills/ui-contract-validator.mjs` | **FAIL** | Fails with exit code 1 due to `backdrop-blur-md` on line 173. |

---

## Coverage Gaps

- **Active browser rendering & visual regression**: Code inspection and CLI test suites verified string tokens and structure; pixel-level visual regression across Safari/Chrome mobile viewports requires Playwright / browser runtime. Risk level: Low. Recommendation: Accept risk for copy review; visual review covered by Worker M2 / Sentinel.

---

## Unverified Items

- **Live Stripe donation processing**: Live payment flow at `donate.stripe.com` was not submitted with live funds. Reason: Third-party payment gateway external to repository; URL string integrity verified.

---

## Adversarial Stress Test Results

1. **Adversarial Scenario: Case-insensitive / Substring Prohibited Term Leakage**
   - Result: Passed for `Basis`, `provenance`, `what is basis?`, `sovereign-answer.v2`, `separate helping from carrying`, `one private foundation`.
   - Result: **FAILED** for `model context` (rendered in footer at line 1594).

2. **Adversarial Scenario: Intelligence Dimension Smuggling**
   - Result: **FAILED** for `authority` (smuggled into Systems overview description at line 1691 as `how authority flows`).

3. **Adversarial Scenario: Route Tampering / Route Bypass**
   - Result: **PASSED**. All 11 paths resolve to their intended functional components. Unknown paths fallback safely to `/`. Deep query parameters (`/auth/redeem?token=...`) correctly preserve route identity.

4. **Adversarial Scenario: Donation Up-selling or Tier Elevation**
   - Result: **PASSED**. No preset buttons for $5, $10, $50, $100. Text strictly mentions "from $1" with direct link to the canonical one-time Stripe checkout.
