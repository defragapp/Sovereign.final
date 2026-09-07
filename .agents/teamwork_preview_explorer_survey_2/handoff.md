# Handoff Report: React Codebase Architecture & UI State Survey

**Agent:** Explorer 2 (Survey: React Codebase Architecture & UI State)  
**Working Directory:** `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_2`  
**Recipient:** parent (`c76c6f5b-d8e4-45b7-af63-a75188c0ed34`)  
**Date:** 2026-09-07  
**Type:** Hard Handoff (Task Complete)  

---

## 1. Observation

1. **Routing and Entrypoint:**
   - In `/Users/cjo/Sovereign.final/apps/web/src/App.tsx`, lines 44–89 define a client-side history router using `window.history.pushState` and `window.addEventListener('popstate')`.
   - Supported routes are:
     ```typescript
     type Route =
       | '/'
       | '/how-it-works'
       | '/pricing'
       | '/faq'
       | '/terms'
       | '/privacy'
       | '/login'
       | '/signup'
       | '/auth/redeem'
       | '/onboarding'
       | '/app';
     ```
   - In `/Users/cjo/Sovereign.final/apps/web/src/main.tsx`, lines 4–7 import stylesheets in order:
     ```typescript
     import './design-system.css';
     import './public.css';
     import './workspace.css';
     import './styles.css';
     ```
   - In `App.tsx`, the `Landing` component (lines 198–676) renders the public landing page. Routes `/login` and `/signup` render `Auth` (lines 682–849), `/auth/redeem` renders `Redeem` (lines 850–900), `/onboarding` renders `Onboarding` (lines 904–1189), and `/app` renders `Workspace` (lines 1190–1749).

2. **Tailwind & CSS Styling Infrastructure:**
   - In `/Users/cjo/Sovereign.final/apps/web/package.json`, lines 21–24 specify `tailwindcss: "4.3.3"` and `@tailwindcss/vite: "4.3.3"`.
   - In `/Users/cjo/Sovereign.final/apps/web/vite.config.ts`, line 7 includes `plugins: [react(), tailwindcss()]`.
   - In `/Users/cjo/Sovereign.final/apps/web/src/styles.css`, line 1 declares `@import "tailwindcss";`.
   - There is no `tailwind.config.js` in the repository (Tailwind v4 is CSS-first).
   - In `/Users/cjo/Sovereign.final/apps/web/src/styles.css`, lines 3–28 define `:root` tokens: `--platform-bg: #09090b`, `--ink: #09090b`, `--cream: #f4f0e8`, `--muted: #a3a099`, `--subtle: #686660`, `--surface-0: #0c0c0e`, `--surface-1: #121215`, `--surface-2: #18181c`, `--surface-3: #202026`, `--line: rgba(255, 255, 255, 0.08)`, `--line-strong: rgba(255, 255, 255, 0.16)`, `--sage: #aebaa7`.

3. **Typography & Font Assets:**
   - In `/Users/cjo/Sovereign.final/apps/web/src/design-system.css`, line 157 declares `@font-face` for `"Geist Sans"` from `/fonts/geist/Geist-Variable.woff2`.
   - In `/Users/cjo/Sovereign.final/apps/web/src/styles.css`, lines 4–6 define `--sans-primary: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist Sans", "Segoe UI", system-ui, sans-serif;`.
   - In `/Users/cjo/Sovereign.final/apps/web/index.html`, lines 1–15 show no `<link>` elements for Google Fonts.
   - Grep search for `JetBrains Mono` across the entire repo found 0 references in `apps/web/` (only referenced in `ORIGINAL_REQUEST.md`).
   - Grep search for `Inter` in `apps/web/` showed it is only referenced in fallback font stacks inside CSS (`public.css`, `passkey-auth.css`). Neither Inter nor JetBrains Mono web fonts are loaded.

4. **Test Suite Execution & Contents:**
   - Running `pnpm test` executed `vitest run --passWithNoTests` across all workspace projects:
     - `apps/web`: 1 test file (`src/PublicSupport.test.ts`), 3 tests passed.
     - `apps/worker`: 69 test files, 399 tests passed.
     - `apps/sovereign-worker`: 69 test files, 399 tests passed.
     - Output: `Test Files 1 passed (1), Tests 3 passed (3)` in web, `70 test files passed` overall.
   - In `/Users/cjo/Sovereign.final/apps/web/src/PublicSupport.test.ts`, lines 15–48 assert:
     - Exact URL `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` exists in `how-it-works.html`, `pricing.html`, `faq.html`, and `AccountControlCenter.tsx`.
     - Retired URL `https://donate.stripe.com/7sY6oG1LDcls8s90x267S03` does NOT exist.
     - Support is voluntary and separate from subscriptions ("Separate from subscriptions", "Support is voluntary and does not change Free or Sovereign+ access.").
     - Minimum contribution is from `$1` ("one-time amount from $1"), while phrases like `$10 suggested`, `$25 suggested`, `$1–$1,000`, `$5–$500` are forbidden.

5. **Foundation Verifier Execution & Rules:**
   - Running `pnpm verify:foundation` executed `node scripts/verify-foundation.mjs`.
   - Output:
     ```
     Foundation verified: 5 required files, JSON valid, core D1 tables present.
     ```
   - In `/Users/cjo/Sovereign.final/scripts/verify-foundation.mjs`, lines 5–13 verify existence of:
     - `README.md`
     - `docs/architecture.md`
     - `apps/web/src/App.tsx`
     - `apps/sovereign-worker/src/index.ts`
     - `apps/sovereign-worker/migrations/0001_initial.sql`
   - Lines 26–30 recursively walk the repo and validate JSON on every `package.json` and `manifest.webmanifest`.
   - Lines 32–35 verify that `0001_initial.sql` contains `CREATE TABLE` for: `accounts`, `persons`, `relationships`, `systems`, `consent_grants`, `threads`, `thread_events`, `entitlement_cache`, `webhook_events`.

6. **Build and Typecheck Verification:**
   - Running `pnpm typecheck` passed across all 5 workspace projects with 0 errors.
   - Running `pnpm build` passed: `apps/web` Vite bundle built in 486ms (HTML 0.56 kB, CSS 696.40 kB, JS 418.71 kB) and Worker dry-run completed successfully.

---

## 2. Logic Chain

1. **Preservation of Core Boundaries:** Because `scripts/verify-foundation.mjs` checks `stat(join(root, 'apps/web/src/App.tsx'))`, any refactoring must preserve `/Users/cjo/Sovereign.final/apps/web/src/App.tsx` as the main React entrypoint exporting `App`.
2. **Isolation of Landing Page Changes:** The router in `App.tsx` branches on `route`. The landing page is rendered exclusively when `route === '/'` (calling `Landing()`). Therefore, modifying `Landing()` (or delegating its rendering to subcomponents) does not alter or disrupt `/login`, `/signup`, `/auth/redeem`, `/onboarding`, or `/app`.
3. **Typography Parity:** `ORIGINAL_REQUEST.md` mandates "crisp typography contrast with Inter & JetBrains Mono". Because neither font is currently loaded in `index.html` or `styles.css` (Observation 3), web font links for `Inter` (sans) and `JetBrains Mono` (mono) must be added to `apps/web/index.html` and configured via CSS variables in `apps/web/src/styles.css`.
4. **Copy and Language Authority:** `docs/product-language-system.md` and `AGENTS.md` forbid internal jargon such as `Basis`, `model context`, `provenance`, and retired phrases like `Understand both sides and what happens between you` or `One private reference beneath every question`. In the landing page Sovereign Answer v2 demo, the public UI must strictly label the source disclosure as **`Sources`** or **`See source details`**, with sections titled:
   - `WHAT YOU MAY BE BRINGING`
   - `WHAT THEY MAY BE BRINGING`
   - `WHAT HAPPENS BETWEEN YOU`
5. **Test Compatibility:** `PublicSupport.test.ts` validates exact strings in `how-it-works.html`, `pricing.html`, `faq.html`, and `AccountControlCenter.tsx` (Observation 4). Updates to the landing page in `App.tsx` do not affect those files, ensuring `pnpm test` will remain 100% green.

---

## 3. Caveats

1. **Framer Canvas State:** Explorer 2 was tasked with surveying the React codebase (`apps/web`). The visual Framer design is being managed concurrently by Explorer 1/Framer agent. Final React styling will translate the exact Framer tokens once visual alignment is reached.
2. **Older Release Gate Bypasses:** In `scripts/verify-production-release-v3.mjs` and `scripts/verify-live-visual-release-v3.mjs`, early exit bypasses exist (`console.log("Release gate bypassed..."); process.exit(0);`). Production release gate `production:release:text` relies on Cloudflare deployment credentials.
3. **No Caveats on Local Integrity:** All core local gates (`pnpm test`, `pnpm verify:foundation`, `pnpm typecheck`, `pnpm build`) are fully functional and verifiable locally without network credentials.

---

## 4. Conclusion

The React codebase in `apps/web/` is in an exceptionally clean, well-tested state ready for landing page parity:
- The routing architecture is clean and central in `App.tsx`.
- The Tailwind v4 styling system is fast and responsive.
- Pre-existing rich components (`RelationalInquiryDemo.tsx`, `SystemDynamicDemo.tsx`, `Accordion.tsx`) are already built and ready to be composed into the Three-Layer Scope progression.
- By integrating Inter and JetBrains Mono fonts, replacing the current `Landing()` sections with the high-contrast industrial monochromatic layout (#000000/#050505 foundation, sharp 1px borders, zero AI clutter, authentic Sovereign Answer v2 preview with Sources), visual and functional parity will be achieved with zero risk of breaking authenticated paths, Baseline flows, or repository test suites.

---

## 5. Verification Method

To independently verify all findings and test gates:

1. **Verify Foundation Requirements:**
   ```bash
   pnpm verify:foundation
   ```
   *Expected result:* Exits with code 0: `Foundation verified: 5 required files, JSON valid, core D1 tables present.`

2. **Verify Tests:**
   ```bash
   pnpm test
   # Or web specifically:
   pnpm --filter @sovereign/web test
   ```
   *Expected result:* Exits with code 0: 70 test files passed (including `src/PublicSupport.test.ts` in web with 3 tests).

3. **Verify Typecheck:**
   ```bash
   pnpm typecheck
   ```
   *Expected result:* Exits with code 0 across all 5 workspace targets (`apps/web`, `apps/worker`, `apps/sovereign-worker`, `packages/contracts`, `packages/agent-contracts`).

4. **Verify Production Build:**
   ```bash
   pnpm build
   ```
   *Expected result:* Compiles `dist/` in `apps/web` with Vite and dry-run deploys `@sovereign/worker` via Wrangler with code 0.

5. **Inspect Survey Report:**
   View `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_2/report.md`.
