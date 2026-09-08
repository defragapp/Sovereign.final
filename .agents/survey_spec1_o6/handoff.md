# Sovereign.OS Specification & Invariant Discovery Report

**Agent**: `teamwork_preview_spec_miner`  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/survey_spec1_o6`  
**Timestamp**: 2026-09-07T22:26:00Z  
**Target System**: Sovereign.OS (`defragapp/Sovereign.final`)  

---

## 1. Observation

Direct observations extracted from authoritative repository source files, test suites, documentation, and verification scripts:

### 1.1 Core Mission & Product Boundaries (from `AGENTS.md`)
- **Mission**: "Ship a working private personal AI product rapidly without weakening the proven Sovereign runtime." (`AGENTS.md:3-5`)
- **Source authority**: "`defragapp/OPENAPI` as the source of proven backend behavior. Prefer extraction and minimal adaptation over reinvention." (`AGENTS.md:7-9`)
- **Product boundary**: "The public product is `Sovereign.OS` at `https://sovereign.defrag.app`." (`AGENTS.md:11-13`)
- **Language law**: "User-facing language should be plain, direct, and centered on what the product helps a person do. Do not expose internal implementation terms such as Basis IDs, model/provider identifiers, `sovereign-answer.v2`, or model-safe context." (`AGENTS.md:15-17`)
- **UI rule**: "The product is chat-first. Keep the public/authenticated visual system cohesive: near-black foundation, warm readable typography, restrained sage accent, generous whitespace, subtle borders, and source-owned shadcn-style primitives. Avoid dashboard card walls, fake metrics, decorative AI effects, and framework-heavy navigation." (`AGENTS.md:19-21`)
- **Engineering rule**: "Never replace a protected production path merely to simplify the new repository. Auth, Baseline, consent, answer validation/safety, billing, persistence, and server-side entitlement checks remain server authoritative." (`AGENTS.md:23-25`)
- **Launch rule**: "The first acceptance path is: `account → Baseline → first real AI turn → rendered answer`. No mocked AI answer, simulated entitlement, or fake account state may be presented as production capability. Current canonical migration target is `0019_deprecate_manual_capacity`. The verified deployment command is `pnpm production:release:text`. Release evidence must describe what actually ran. Worlds/video generation is not part of the current launch runtime." (`AGENTS.md:27-35`)

### 1.2 Product Language System & Forbidden Phrasing (from `docs/product-language-system.md`)
- **Category**: "Private personal AI for real life." (`lines 167-169`)
- **Root product promise**: "Understand yourself. Understand your people. See the whole system." (`lines 171-173`)
- **Founder root hero**: "Healing isn’t optional. Holding onto the pain is." with kicker "PERSONAL AI FOR REAL LIFE" (`lines 183-187, 291-300`)
- **Supporting hero copy**: "Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change." (`lines 295-296`)
- **Trust line**: "Start free · No card required · Review, correct, or reject any interpretation" (`line 298`)
- **Three-layer scope progression**:
  - `01 · YOU`: "Explore how you think, decide, communicate, create, connect, and grow." Description: "Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score." (`lines 305-314`)
  - `02 · YOU + YOUR PEOPLE`: "See why the same moment lands differently—and how to bridge the gap." Description: "With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently." (`lines 324-333`)
  - `03 · FROM 1:1 TO THE WHOLE SYSTEM`: "See the whole system." Description: "Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently." (`lines 342-351`)
- **Sources vs. Basis**:
  - Internal/server contract name: `Basis` (`line 247`)
  - User-facing UI labels: strictly `Sources`, `See source details`, `Source details`, and explanation `These are the source values Sovereign used for this answer.` or `These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state.` (`lines 123-128, 249-254, 541-546`)
  - Raw codes / internal IDs collapsed by default; never show `>Basis<` or `Example Basis` (`lines 118, 547`)
- **Prohibited and retired phrasing** (`docs/product-language-system.md:577-624`):
  - `Ordinary questions. More context when it belongs.`
  - `What is Basis?` / `What does Basis prove?`
  - `Basis` or `Example Basis` as an unexplained user-facing source label
  - `server-approved`, `authorized references`, `provenance`, `evidence levels`, `model context`, `model-safe context`, `sovereign-answer.v2`
  - `permitted context`, `consented people`, `permitted perspectives`, `confirmed responsibilities` as public explanation of People or Systems
  - `exact source positions`, `Baseline profile`, `facet profile`, `interpretive uncertainty` as onboarding UI language
  - `One private reference beneath every question.` / `One private foundation...`
  - `Separate helping from carrying the outcome.`
  - `See where responsibility keeps landing.`
  - `Understand both sides and what happens between you.`
  - `foundation`, `personal foundation`, `private foundation` as primary public Baseline metaphor
  - `Ask about your life.` / `Ask about your life. Get an answer built around you.`
  - `What do you want to understand?` / `What would you like to explore?` / `Ask anything.` / `Tell me what's on my mind.`
  - `server-confirmed Stripe subscription state` in customer-facing billing copy
  - `authority` or `missing perspective` as canonical Systems intelligence dimensions
  - `healing journey`, `unlock your potential`, `become your highest self`, `break the cycle`, `your chart says`, `the universe is telling you`, `this transit means`, `choose yourself`, `return to yourself`, `do the work`
- **Typography authority**:
  - `Sovereign Display` serif font is retired and strictly prohibited from rendered UI use (`lines 454-468`).
  - Approved rendered title stack: native enterprise sans (`Onest`, `Inter`, Apple system/SF Pro Display, Segoe Variable, system-ui). Display accent: `Gambarino` (`LandingParity.test.ts:15`, `styles.css:21`).

### 1.3 Exact Test Assertions Enforced in `apps/web/src/`
- **`apps/web/src/LandingParity.test.ts`**:
  - `index.html` must contain Google Fonts & Fontshare links: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `family=Fragment+Mono`, `family=Onest:wght@400;500;600;700`, `font-family: "Gambarino"`.
  - `styles.css` must contain `--font-sans: "Onest"`, `--font-mono: "Fragment Mono"`, `--font-display: "Gambarino"`, `--sans-primary: var(--font-sans)`, `--platform-bg: #000000`, `--sage: #9fbaa1`.
  - `App.tsx` must contain exact Founder Hero copy: `PERSONAL AI FOR REAL LIFE`, `Healing isn’t optional.<br />\n              Holding onto the pain is.` (with typographic curly apostrophe `’`), full supporting paragraph, and trust line `Start free · No card required · Review, correct, or reject any interpretation`.
  - `App.tsx` must contain exact Three-Layer Scope text for `01 · YOU`, `02 · YOU + YOUR PEOPLE`, `03 · FROM 1:1 TO THE WHOLE SYSTEM`.
  - `App.tsx` must contain relational triad in Sovereign Answer demo: `Why does the same conversation feel urgent to me and pressuring to them?`, `Ask Sovereign`, `WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU`, `See source details`, `These are the source values Sovereign used for this answer.`. Must NOT contain `alert('Sources details` or `alert(`.
  - `App.tsx` must contain zero prohibited terms (case-insensitive): `sovereign-answer.v2`, `model-safe context`, `model context`, `server-approved`, `One private foundation`, `Separate helping from carrying`, `See where responsibility keeps landing`, `Understand both sides and what happens between you`, `Ask about your life`, `Ask Sovereign about your life`, `authority`, `What is Basis?`, `What does Basis prove?`, `What would you like to understand`.
  - `App.tsx` must NOT contain `backdrop-blur`; must contain `bg-[#000000]`.
  - `App.tsx` Today authenticated surface must contain `What is active for you now?`, `placeholder="Ask Sovereign…"`, `Private by default · Sovereign uses only consented data`, `how pressure moves`.
  - `App.tsx` must preserve all 10 non-landing routes as string literals `'<route>'`: `'/how-it-works'`, `'/pricing'`, `'/faq'`, `'/terms'`, `'/privacy'`, `'/login'`, `'/signup'`, `'/auth/redeem'`, `'/onboarding'`, `'/app'`.
  - `App.tsx` must contain general support URL: `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`.
- **`apps/web/src/PublicSupport.test.ts`**:
  - `apps/web/public/how-it-works.html` must contain `id="support"`, `Separate from subscriptions`, `Support is voluntary and does not change Free or Sovereign+ access.`, `Support Sovereign.OS from $1.`, `one-time amount from $1`. Must NOT contain `$10 suggested`, `$25 suggested`, `$1–$1,000`, `$5–$500`.
  - `apps/web/public/pricing.html` must contain `Support is separate from a subscription.`, `Support does not unlock paid features or change your account access.`, `one-time amount from $1`.
  - `apps/web/public/faq.html` must contain `Can I support Sovereign.OS without subscribing?`, `does not unlock paid features or change your plan`, `one-time amount from $1`, `is not presented as tax-deductible`.
  - `apps/web/src/AccountControlCenter.tsx` must contain `one-time amount from $1`, must NOT contain `$5 to $500`.
  - All four sources (`how-it-works.html`, `pricing.html`, `faq.html`, `AccountControlCenter.tsx`) must contain canonical general support URL `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` and must NOT contain retired URL `https://donate.stripe.com/7sY6oG1LDcls8s90x267S03`.
  - `docs/launch-product-contract.md` and `docs/release-gates.md` contracts are asserted for voluntary support separation from subscriptions.
- **`apps/web/src/components/chat/SovereignThread.test.ts`**:
  - Valid React component function exported as `SovereignThread`.
  - Sources drawer must not match `/>\s*Basis\s*</i`, `Example Basis`, `What is Basis?`, `What does Basis prove?`. Must contain `Sources`, `See source details`, `Source details`, and exact explanation text.
  - Zero prohibited terms: `sovereign-answer.v2`, `model-safe context`, `server-approved`, `provenance score`.
  - Textarea auto-resize on input: contains `scrollHeight`, matches `/style\.height/`, contains `Math.min(Math.max(scrollHeight, 44), 200)`, and `e.key === 'Enter' && !e.shiftKey`.
  - Passkey badge: matches `/hasPasskey|passkeyVerified|hasVerifiedPasskey/`, contains `Passkey Verified`, `border-[#9fbaa1]/30`, `bg-[#9fbaa1]/10`, `text-[#9fbaa1]`.
  - SSE endpoint integration: contains `x-idempotency-key`, `crypto.randomUUID()`, `/api/v1/threads/`, `text/event-stream`.
  - Three distinct blocks: Block 1 user prompt (`ml-auto max-w-[85%]`), Block 2 synthesis (`SOVEREIGN SYNTHESIS`, `answer-direct`), Block 3 collapsible sources drawer (`toggleSourceDrawer`, `aria-expanded`, `aria-label="Sources. Open source details."`).
  - Motion: `from 'framer-motion'`, `duration: 0.22`, `ease: [0.16, 1, 0.3, 1]`.
  - Does NOT contain `backdrop-blur`.

### 1.4 Release Gate Scripts & Pre-flight Architecture
- **Five Primary Verification Gates**:
  1. `pnpm typecheck` (`pnpm -r typecheck`): Zero TypeScript compile errors in `@sovereign/web` and `@sovereign/worker`.
  2. `pnpm build`: Vite build for web (`tsc -b && vite build`) producing `apps/web/dist`, and Wrangler deploy dry-run for worker (`wrangler deploy --dry-run --config wrangler.jsonc --outdir dist`).
  3. `pnpm test` (`pnpm -r test`): Vitest suite across all workspaces.
  4. `pnpm verify:foundation` (`node scripts/verify-foundation.mjs`):
     - Validates existence of 5 required files: `README.md`, `docs/architecture.md`, `apps/web/src/App.tsx`, `apps/sovereign-worker/src/index.ts`, `apps/sovereign-worker/migrations/0001_initial.sql`.
     - Validates JSON parsing of every `package.json` and `manifest.webmanifest`.
     - Validates that `apps/sovereign-worker/migrations/0001_initial.sql` creates 9 required tables: `accounts`, `persons`, `relationships`, `systems`, `consent_grants`, `threads`, `thread_events`, `entitlement_cache`, `webhook_events`.
  5. `pnpm verify:cloudflare-build` (`node scripts/cloudflare-build-diagnostics.mjs`):
     - Sequentially executes 24 verification stages:
       1. `main-release` (`scripts/assert-main-release.mjs`)
       2. `foundation` (`pnpm verify:foundation`)
       3. `migrations` (`pnpm verify:migrations`)
       4. `secrets-scan` (`pnpm scan:secrets`)
       5. `production-fixtures` (`pnpm scan:production-fixtures`)
       6. `public-contact` (`node scripts/verify-public-contact.mjs`)
       7. `release-config` (`pnpm verify:release-config`)
       8. `production-release` (`pnpm verify:production-release`)
       9. `intelligence-release` (`pnpm verify:intelligence-release`)
       10. `visual-intelligence` (`pnpm verify:visual-intelligence`)
       11. `premium-platform` (`pnpm verify:premium-platform`)
       12. `typecheck` (`pnpm typecheck`)
       13. `tests` (`pnpm test`)
       14. `auth-smoke` (`pnpm smoke:auth`)
       15. `baseline-smoke` (`pnpm smoke:baseline`)
       16. `jobs-smoke` (`pnpm smoke:jobs`)
       17. `worker-gateway-smoke` (`pnpm smoke:worker-gateway`)
       18. `stripe-smoke` (`pnpm smoke:stripe`)
       19. `product-smoke` (`pnpm smoke:product`)
       20. `release-closure-smoke` (`pnpm smoke:release-closure`)
       21. `build` (`pnpm build`)
       22. `public-source-maps` (`node scripts/verify-no-public-source-maps.mjs`)
       23. `worker-bundle-size` (`pnpm verify:worker-bundle-size`)
       24. `production-d1-parity` (`node scripts/verify-production-d1-parity.mjs`)
- **Authoritative Release Verifier (`release-verifier.mjs`)**:
  - Located at `.agents/skills/sovereign-production-release/scripts/release-verifier.mjs`.
  - Modes: `verification-only` (default), `release-preparation`, `production-release`.
  - Git Drift Audit: Asserts `HEAD === origin/main`.
  - Diff Guard: Fails if changes touch protected paths: `apps/worker/`, `apps/sovereign-worker/`, `apps/web/src/lib/api.ts`, `migrations/`, `scripts/production-release-oauth.sh`, `scripts/cloudflare-production-deploy-v3.mjs`, `scripts/assert-main-release.mjs`, `wrangler.jsonc`.
  - Copy Leak: Audits `apps/web/src/App.tsx` for uppercase `BASIS:`.
  - CSS Precedence: Verifies `apps/web/src/main.tsx` imports in order:
    1. `import './design-system.css';`
    2. `import './public.css';`
    3. `import './workspace.css';`
    4. `import './styles.css';`
  - Playwright Visual QA: Launches local server on `apps/web/dist` across 5 routes (`/`, `/workspace.html`, `/how-it-works.html`, `/faq.html`, `/security.html`) at desktop (`1440x900`) and mobile (`390x844`), asserting:
    - 0 desktop horizontal overflow (`scrollWidth > clientWidth`)
    - 0 mobile horizontal overflow
    - 0 console error messages
    - 0 missing/404 routes, valid `rootDocExists`
  - Dual Domain Readiness & SHA Parity: In `production-release` mode, curls `https://sovereign.defrag.app/ready` and `https://app.defrag.app/ready`, asserting `ready === true`, `sha === releaseSha`, and matching `migrationVersion`.

### 1.5 Additional Integrity Scans & Hard Invariants
- **Public Contact Fail-Closed Separation (`verify-public-contact.mjs`)**:
  - Approved public contact identity: `info@sovereign.os` (configuration/metadata only, never routable mailto).
  - Operational contact: `info@sovereign.defrag.app` (transactional sender/reply/support inbox).
  - Prohibited addresses: `info@defrag.app`, `support@defrag.app`, and personal `@gmail.com`.
  - Exact allowlist occurrence counts enforced per file (e.g. `consent.html`: 3, `faq.html`: 2, `PublicLanding.v2.tsx`: 1).
- **Secrets Scanning (`scan-secrets.mjs`)**:
  - Forbids committed strings matching `(sk-live-|sk_test_|whsec_|OPENAI_API_KEY=sk-|cf_[A-Za-z0-9_-]{20,})`.
- **Production Fixtures Scanning (`scan-production-fixtures.mjs`)**:
  - Scans `apps/web/src`, `apps/worker/src`, `apps/sovereign-worker/src` for forbidden tokens like `billing.test`, `test-billing.invalid`, `price_test_`, `fixture checkout`, `demo thread`, `TODO`, `not implemented`, `placeholder="fixture..."`.
- **Worker Bundle Size (`verify-worker-bundle-size.mjs`)**:
  - Cloudflare Workers Free limit: 3 MiB (3,145,728 bytes).
  - Sovereign.OS internal release budget: 2,500 KiB (2,560,000 bytes).
- **Public Source Maps (`verify-no-public-source-maps.mjs`)**:
  - Zero `.map` files allowed in `apps/web/public` or `apps/web/dist`.
- **D1 Migration Rules (`validate-migrations.mjs`, `verify-migration-upgrade.mjs`)**:
  - Destructive `DROP TABLE` is strictly forbidden.
  - Immutable sequence up to `0019_deprecate_manual_capacity.sql`. No new migrations should be introduced.
- **Static Page Dark-Mode Unification (`apps/web/public/tokens.css`)**:
  - All 5 static public HTML pages (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`) link `/tokens.css?v=20260908-v2`.

---

## 2. Logic Chain

The step-by-step logical reasoning connecting observations to operational constraints:

1. **Brand & Product Story Precedence**: `AGENTS.md` lines 11-21 and `docs/product-language-system.md` establish that Sovereign.OS is private personal AI for real life. The primary narrative unfolds strictly outward across three layers: `01 · YOU` → `02 · YOU + YOUR PEOPLE` → `03 · FROM 1:1 TO THE WHOLE SYSTEM`. Any attempt to invert this sequence (e.g., presenting framework mechanics, astrology, Human Design, or system dynamics first) breaks both the brand architecture and the test assertions in `LandingParity.test.ts:38-62`.
2. **Internal Terminology vs. User-Facing Surfaces**: The backend runtime (`defragapp/OPENAPI`, `apps/sovereign-worker/src/index.ts:48-49`, `lib/api.ts:81-90`) utilizes data contracts named `Basis`, `BasisRegistryItem`, `sovereign-answer.v2`, and `model-safe context`. However, `docs/product-language-system.md:113-132`, `LandingParity.test.ts:76-96`, and `SovereignThread.test.ts:12-38` strictly forbid these terms from appearing in user-facing JSX/DOM. The user-facing label MUST be "Sources" or "See source details". In `App.tsx`, `release-verifier.mjs:302` specifically scans for uppercase `BASIS:` and triggers a preflight failure if found.
3. **The Glassmorphism & `backdrop-blur` Edge Case**: `visual-design-system/SKILL.md` and `.agents/skills/ui-contract-validator.mjs` mandate glassmorphism with `/(?:backdrop-blur|backdrop-filter:\s*blur)/` and fluid 200-240ms motion across the design system. However, `LandingParity.test.ts:98-101` and `SovereignThread.test.ts:85-87` explicitly assert `expect(appTsx).not.toContain('backdrop-blur')` and `expect(threadSource).not.toContain('backdrop-blur')`. Therefore, the Tailwind class `backdrop-blur` is forbidden inside `App.tsx` and `SovereignThread.tsx`, and glassmorphic blur must be delivered through CSS stylesheets (`tokens.css`, `design-system.css`, `styles.css`) using CSS variables and `backdrop-filter: blur(...)`.
4. **CSS Precedence and Main Entry Point Integrity**: `release-verifier.mjs:276-297` parses `apps/web/src/main.tsx` and requires that imports occur in the strict order: `design-system.css` → `public.css` → `workspace.css` → `styles.css`. Furthermore, `verify-visual-intelligence-release-v2.mjs` requires that `passkey-auth.css` is terminal and no local stylesheet imports appear after it. Violating this import sequence causes pre-flight release gates to fail immediately.
5. **Support Link & Donation Invariants**: `PublicSupport.test.ts:12-48` and `docs/launch-product-contract.md:136-137` require that voluntary support contributions be kept strictly separate from subscription billing. Across `how-it-works.html`, `pricing.html`, `faq.html`, `AccountControlCenter.tsx`, and `App.tsx`, the Stripe donation URL must strictly be `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` (the retired URL `...7S03` is forbidden). The minimum contribution disclosure must state "one-time amount from $1" or "Support Sovereign.OS from $1.", and no suggested amounts (`$10 suggested`, `$25 suggested`, `$5–$500`) may appear. In `how-it-works.html`, the element must have `id="support"`.
6. **Billing Webhook & Tier Guard Contracts**: R4 in `ORIGINAL_REQUEST.md` and `stripe-webhook-route-r4.test.ts` mandate that `/api/billing/webhook` must reject requests missing `stripe-signature` with HTTP 400. It must process `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, and `customer.subscription.deleted`. It must read `env.STRIPE_WEBHOOK_SECRET` rather than hardcoding credentials. Protected workspace routes requiring `sovereign_pro` tier (such as `/api/v1/workspace/pro`) must execute `requireProTier()` and return HTTP 402 Payment Required for non-pro accounts.
7. **Release Gate Progression**: Any build or release requires satisfying all five verification gates (`typecheck`, `build`, `test`, `verify:foundation`, `verify:cloudflare-build`). In particular, `cloudflare-build-diagnostics.mjs` executes 24 separate sub-stages, including secret scans, fixture checks, public contact validation, and bundle size checks. The release is published text-first via `pnpm production:release:text`.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Public Brand | Founder Hero Section | Editorial high-contrast hero with kicker, founder quotation, and unhackable personal AI description | None (static presentation) | Formatted DOM with typographic curly apostrophe `’` | Build/test failure if copy drifts or straight `'` is used | `LandingParity.test.ts:27-36`, `docs/product-language-system.md:183-187` |
| 2 | Public Brand | Three-Layer Scope (01, 02, 03) | Progression: 01 · YOU (Explore yourself), 02 · YOU + YOUR PEOPLE (Relational), 03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics) | User scroll / viewport inspection | Rendered pillar cards & question examples | Test failure in `LandingParity.test.ts` if numbers, headings, or copy deviate | `LandingParity.test.ts:38-62`, `docs/product-language-system.md:305-351` |
| 3 | Public Demo | Sovereign Answer Demo Window | Preview terminal showing relational triad (What you bring, What they bring, Between you) with inline sources drawer | Demo query input or static prompt | Triad cards and collapsible Sources disclosure | Must NOT invoke `alert()`; must not label drawer "Basis" | `LandingParity.test.ts:64-74`, `PublicLanding.v2.tsx` |
| 4 | Chat Thread | Auto-Resizing Textarea | Composer textarea automatically expands up to 200px based on scrollHeight | User keystrokes / multi-line input | Dynamic `style.height` between 44px and 200px | Keypress Enter without Shift submits; Shift+Enter creates newline | `SovereignThread.test.ts:40-45`, `SovereignThread.tsx` |
| 5 | Chat Thread | Three-Block Message Structure | Distinct visual blocks: User prompt (`ml-auto max-w-[85%]`), Sovereign synthesis (`SOVEREIGN SYNTHESIS`, `answer-direct`), Collapsible Sources drawer | Chat message payload (assistant response) | Structured semantic message blocks | Fallback to text if answer payload missing | `SovereignThread.test.ts:62-77`, `SovereignThread.tsx` |
| 6 | Chat Thread | Passkey Verification Badge | Sage status indicator showing user has an authenticated WebAuthn credential | Session prop (`hasPasskey` / `passkeyVerified`) | `Passkey Verified` badge with `border-[#9fbaa1]/30 bg-[#9fbaa1]/10 text-[#9fbaa1]` | Hidden if passkey is unverified | `SovereignThread.test.ts:47-53`, `SovereignThread.tsx` |
| 7 | Chat Thread | SSE Realtime Streaming | Streaming message intake via Server-Sent Events with client idempotency key | `POST /api/v1/threads/{id}/messages` with `x-idempotency-key: crypto.randomUUID()` | SSE stream (`text/event-stream`) delivering partial/complete turns | Error notification if SSE disconnects or capacity exceeded | `SovereignThread.test.ts:55-60`, `lib/api.ts:91-115` |
| 8 | Sources / Basis | Quiet Source Details Drawer | Collapsible drawer explaining exact source inputs used for inference without exposing raw internal IDs | User clicks `Sources` / `See source details` | Drawer titled `Source details` with explanatory disclaimer and category tags | Throws error if UI labels drawer "Basis" or "Example Basis" | `docs/product-language-system.md:123-131`, `SovereignThread.test.ts:12-26` |
| 9 | Authentication | Passkey & Email Magic Link Flow | WebAuthn passkey registration/login with email magic link fallback | Email, WebAuthn credentials | Authenticated session cookie / token (`AuthSession`) | Invalid/expired link returns 400; rate limit returns 429 | `PasskeyAuthentication.tsx`, `apps/sovereign-worker/src/index.ts:93-100` |
| 10 | Baseline | Baseline Intake & Onboarding | Private onboarding collecting birth date, place, time, and time certainty ('exact'/'approximate'/'unknown') | `BaselineInput` payload | Private Baseline Design reference; unknown time omits time-dependent facets | Missing required birth date returns 400; unknown time gracefully handled | `docs/product-language-system.md:483-508`, `apps/sovereign-worker/src/baseline.ts` |
| 11 | Billing | Stripe Webhook Processing | Webhook endpoint `/api/billing/webhook` and `/api/v1/stripe/webhook` handling subscription lifecycles | Stripe webhook POST with `stripe-signature` header | Idempotent insertion into `webhook_events`, customer link, entitlement cache update | Missing/invalid signature returns 400; unhandled event returns 200 `{projected: false}` | `apps/sovereign-worker/src/routes/stripe.ts`, `stripe-webhook-route-r4.test.ts` |
| 12 | Billing | 402 Payment Required Guard | Middleware `requireProTier` protecting workspace routes (e.g. `/api/v1/workspace/pro`) | Authenticated request from account | Allowed access if `sovereign_pro`; otherwise HTTP 402 | Throws HTTP 402 with structured problem JSON and upgrade URL | `apps/sovereign-worker/src/security/tier-guard.ts`, `stripe-webhook-route-r4.test.ts` |
| 13 | Billing | Voluntary Support Link | Separate Stripe one-time contribution starting at $1 | User click on support anchor | Navigation to Stripe-hosted checkout `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` | Zero impact on account entitlement or plan tier | `PublicSupport.test.ts:12-48`, `how-it-works.html` |
| 14 | Relational | Two-Person Shared Baseline | Relationship intelligence using two separate consented Baselines | Private invitation code accepted by invitee | Comparison view keeping both individuals distinct | Blocked immediately upon invitee consent revocation | `docs/launch-product-contract.md:102-115`, `apps/sovereign-worker/src/db/people.ts` |
| 15 | Systems | System Dynamics Modeling | Models family, household, team, workplace, group systems | Consented participants, confirmed roles/responsibilities | System graph / relational dynamics without assigning villain | Absent person's perspective marked unknown | `docs/launch-product-contract.md:112-115`, `docs/product-language-system.md:65-72` |
| 16 | Covenant | Biblical Lens Exploration | Optional Christian scripture contextualization | Explicit user confirmation per question/thread | Grounded scripture, teaching, application, and boundary | Must never claim divine verdict or mandate submission to abuse | `docs/launch-product-contract.md:116-125`, `docs/product-language-system.md:256-263` |
| 17 | Static Pages | Shared Design Token Unification | Static pages (`how-it-works`, `pricing`, `faq`, `consent`, `404`) sharing dark-mode design system | HTML request | Consistent `#000000` base, typography tokens, glass variables via `/tokens.css` | 404 page maintains same visual grammar | `apps/web/public/tokens.css`, `ORIGINAL_REQUEST.md:119` |
| 18 | Verification | Edge Readiness Parity (`/ready`) | Health check on `sovereign.defrag.app/ready` and `app.defrag.app/ready` | HTTP GET `/ready` | JSON `{ ready: true, sha: string, migrationVersion: "0019_deprecate_manual_capacity", migrationParity: "current" }` | Preflight fails if live SHA != frozen commit SHA | `release-verifier.mjs:427-457`, `apps/sovereign-worker/src/index.ts:59-77` |
| 19 | UI Quality | Multi-Viewport Visual QA | Playwright automated audit verifying 0.0px horizontal overflow and 0 console errors | Local HTTP server on `apps/web/dist` at 1440x900 and 390x844 | Metric assertion: `scrollWidth <= clientWidth` across 5 routes | Preflight fails if any overflow, page error, or HTTP status >= 400 | `release-verifier.mjs:76-175`, `release-verifier.mjs:368-392` |
| 20 | Code Hygiene | Public Contact Email Separation | Strict architectural split between identity address (`info@sovereign.os`) and operational inbox (`info@sovereign.defrag.app`) | Static file scan across repo | Validates exact allowlisted occurrence count per file | Fails if `mailto:info@sovereign.os`, personal `@gmail.com`, or unallowlisted defrag address found | `scripts/verify-public-contact.mjs` |

---

## 4. Edge Cases & Boundary Conditions

| # | Feature | Input / Condition | Observed Behavior |
|---|---------|-------------------|-------------------|
| 1 | Public Copy Leak | App.tsx contains uppercase string `BASIS:` | `release-verifier.mjs:302` detects copy leak; in `verification-only` mode it marks `copyLeaks.passed = false` and blocks release; in preparation mode it auto-remediates to `Sources:`. |
| 2 | Styling Law | `App.tsx` or `SovereignThread.tsx` contains Tailwind class `backdrop-blur` | `LandingParity.test.ts:98` (`expect(appTsx).not.toContain('backdrop-blur')`) and `SovereignThread.test.ts:85` fail immediately. Glassmorphism must be applied via CSS rules or variables. |
| 3 | Typographic Apostrophe | Founder hero copy uses straight apostrophe `'` instead of curly apostrophe `’` | `LandingParity.test.ts:27` fails: `expect(appTsx).toContain('Healing isn’t optional.<br />\n Holding onto the pain is.')`. |
| 4 | CSS Import Precedence | `apps/web/src/main.tsx` imports CSS out of order (e.g. `styles.css` before `design-system.css`) | `release-verifier.mjs:276-297` parses import order and sets `cssIntegrity.importPrecedenceValid = false`, causing `releaseDisposition: 'FAIL'`. |
| 5 | Visual QA Horizontal Overflow | An element width exceeds container on mobile (390px) or desktop (1440px) by even 0.5px | `page.evaluate` in `release-verifier.mjs:148` evaluates `document.documentElement.scrollWidth > document.documentElement.clientWidth`, increments `mobileOverflow`/`desktopOverflow`, and fails Visual QA. |
| 6 | Console Error in Production Build | Missing asset, uncaught promise, or undefined property warning emitted as console error during Playwright crawl | `page.on('console', msg.type() === 'error')` records error into `results.consoleErrors`; `release-verifier.mjs` marks Visual QA as failed. |
| 7 | Static Page Support URL Drift | Developer uses retired Stripe donation URL (`...7S03`) or modifies suggested dollar amounts | `PublicSupport.test.ts:20, 41-47` fails immediately. Must strictly match canonical link `...67S02` and disclosure `one-time amount from $1`. |
| 8 | Stripe Webhook Missing Header | Incoming POST to `/api/billing/webhook` without `stripe-signature` header | `handleStripeWebhook()` checks `verifyStripeSignature()`, fails verification, and immediately returns HTTP 400 `Invalid signature`. |
| 9 | Non-Pro User Accessing Pro Route | Request to `/api/v1/workspace/pro` from an account on `free` or `sovereign_plus` tier | `requireProTier()` throws a `Response.json` with HTTP status `402`, error `'payment_required'`, and upgrade link `https://sovereign.defrag.app/pricing`. |
| 10 | Protected Path Mutation (Diff Guard) | Staged or unstaged changes touch `apps/worker/`, `apps/sovereign-worker/`, `apps/web/src/lib/api.ts`, `migrations/`, or `wrangler.jsonc` | `release-verifier.mjs:320-339` flags Diff Guard violation and halts release preparation/deployment with blocker `Protected paths modified`. |
| 11 | Git Branch Drift | Local `HEAD` commit SHA differs from `origin/main` commit SHA | `release-verifier.mjs:269` detects git drift, logs `Git drift detected: HEAD !== origin/main`, and marks disposition as `FAIL`. |
| 12 | Worker Upload Exceeds Budget | Compressed worker gzip bundle exceeds 2,500 KiB (internal budget) or 3 MiB (Cloudflare Free limit) | `scripts/verify-worker-bundle-size.mjs` runs dry-run deploy and throws error: `Compressed Worker upload exceeds the 2,500 KiB Sovereign.OS release budget.` |
| 13 | Public Source Map Leak | Production build outputs `.map` files into `apps/web/public` or `apps/web/dist` | `scripts/verify-no-public-source-maps.mjs` throws error: `Public source maps are forbidden`, halting the Cloudflare build gate. |
| 14 | Operational Email Misplacement | `info@sovereign.defrag.app` occurs in an unallowlisted file or exceeds allowlisted count | `scripts/verify-public-contact.mjs` exits with code 1: `operational contact is not allowlisted here` or `occurrence drift`. |
| 15 | Routable Public Identity | A file contains `mailto:info@sovereign.os` | `scripts/verify-public-contact.mjs` throws error: `public contact identity must never be a routable mailto target while its zone is not resolvable`. |
| 16 | D1 Schema Mutation | A migration file contains `DROP TABLE` or modifies applied migrations 0001-0018 | `scripts/validate-migrations.mjs` and `scripts/verify-migration-upgrade.mjs` throw error; destructive table drops are rejected. Current canonical target is strictly `0019_deprecate_manual_capacity.sql`. |
| 17 | Unknown Birth Time | User selects `birthTimeCertainty: 'unknown'` during Baseline onboarding | Baseline engine omits time-dependent astrological houses / fine facets without invalidating the Baseline; UI explicitly explains what is unavailable without showing raw error codes. |
| 18 | Dual Domain Parity Desynchronization | Live deployment to Cloudflare returns different SHAs on `sovereign.defrag.app/ready` vs. `app.defrag.app/ready` | `release-verifier.mjs:440` asserts `surfaceJson.sha === releaseSha && appJson.sha === releaseSha`; preflight flags blocker if edge has not converged. |

---

## 5. Hard Invariants Checklist

Use this checklist as an unconditional gate before committing code or initiating release verifications:

### 5.1 Language & Vocabulary Laws
- [ ] Zero presence of `Basis` or `Example Basis` as user-facing UI labels. Always use `Sources` or `See source details`.
- [ ] Zero presence of uppercase `BASIS:` in `App.tsx`.
- [ ] Zero presence of `sovereign-answer.v2`, `model-safe context`, `model context`, `server-approved`, `provenance score` in user-facing UI copy.
- [ ] Zero presence of retired marketing phrases: `One private foundation`, `Separate helping from carrying`, `See where responsibility keeps landing`, `Understand both sides and what happens between you`, `Ask about your life`, `What would you like to understand`.
- [ ] No spiritual clichés or fatalistic claims (`healing journey`, `unlock your potential`, `become your highest self`, `your chart says`, `the universe is telling you`).
- [ ] Typographic curly apostrophe `’` strictly preserved in Founder Hero: `Healing isn’t optional.<br />\n              Holding onto the pain is.`.

### 5.2 Visual & Styling Invariants
- [ ] Monochrome near-black foundation: `#000000` / `#0a0a0a`.
- [ ] Restrained sage accent: `#9fbaa1`.
- [ ] Warm cream text: `#f5f5f7` / `#ffffff`.
- [ ] Typography stack: `Onest` (sans primary), `Fragment Mono` (mono), `Gambarino` (display accent). `Sovereign Display` serif is strictly prohibited in active CSS.
- [ ] Class `backdrop-blur` is strictly forbidden inside `App.tsx` and `SovereignThread.tsx`. Glassmorphism must be styled via CSS variables (`--sov-glass-blur`, `--sov-glass-border`) or stylesheet rules.
- [ ] Atmospheric semi-transparent glass borders (`rgba(255, 255, 255, 0.10)` / `border-white/10`) instead of stark 1px white lines.
- [ ] Fluid motion timing: 200–240ms (`duration: 0.22`, `cubic-bezier(0.16, 1, 0.3, 1)`).

### 5.3 CSS Import Precedence (`apps/web/src/main.tsx`)
Must preserve exact import order:
1. `import './tokens.css';`
2. `import './design-system.css';`
3. `import './public.css';`
4. `import './workspace.css';`
5. `import './app-shell.css';`
6. `import './styles.css';`
...
and terminal `import './passkey-auth.css';` (no local stylesheet imports after passkey-auth).

### 5.4 Visual QA Requirements (Playwright)
- [ ] Exactly 0.0px horizontal overflow (`scrollWidth <= clientWidth`) on desktop (`1440x900`).
- [ ] Exactly 0.0px horizontal overflow (`scrollWidth <= clientWidth`) on mobile (`390x844`).
- [ ] Exactly 0 console errors or unhandled page errors.
- [ ] Audited routes (`/`, `/workspace.html`, `/how-it-works.html`, `/faq.html`, `/security.html`) return HTTP 200 with valid root document element.

### 5.5 Static Page Anchors & Support Links
- [ ] All 5 static HTML pages (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`) link `/tokens.css?v=20260908-v2`.
- [ ] Support contribution URL must strictly be `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` across `how-it-works.html`, `pricing.html`, `faq.html`, `AccountControlCenter.tsx`, `App.tsx`.
- [ ] Retired URL `https://donate.stripe.com/7sY6oG1LDcls8s90x267S03` is strictly forbidden.
- [ ] `how-it-works.html` must contain `id="support"`.
- [ ] Mandatory disclosure: "one-time amount from $1" / "Support Sovereign.OS from $1.", "Separate from subscriptions", "Support is voluntary and does not change Free or Sovereign+ access.".
- [ ] Prohibited suggested amounts: `$10 suggested`, `$25 suggested`, `$1–$1,000`, `$5–$500`.

### 5.6 Route Integrity in `App.tsx`
The 10 non-landing routes must exist as string literals:
- `'/how-it-works'`
- `'/pricing'`
- `'/faq'`
- `'/terms'`
- `'/privacy'`
- `'/login'`
- `'/signup'`
- `'/auth/redeem'`
- `'/onboarding'`
- `'/app'`

### 5.7 Stripe Billing & Worker Routes
- [ ] `/api/billing/webhook` returns HTTP 400 when `stripe-signature` header is missing.
- [ ] Handles `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
- [ ] Webhook secret read from `env.STRIPE_WEBHOOK_SECRET` (no hardcoded secrets).
- [ ] Protected route `/api/v1/workspace/pro` returns HTTP 402 Payment Required for non-pro accounts.
- [ ] Current canonical migration target: `0019_deprecate_manual_capacity.sql`. Zero new migration files.

### 5.8 Pre-flight Gate Pipeline
- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm build` exits 0.
- [ ] `pnpm test` exits 0 (all Vitest tests green).
- [ ] `pnpm verify:foundation` exits 0.
- [ ] `pnpm verify:cloudflare-build` exits 0 (all 24 stages green).
- [ ] `node .agents/skills/sovereign-production-release/scripts/release-verifier.mjs --mode verification-only` exits 0 with `PASS`.
- [ ] Text-first release command: `pnpm production:release:text`.

---

## 6. Caveats

1. **Remote Cloudflare D1 Live Check**: `verify-production-d1-parity.mjs` checks remote D1 schema against local migrations only when `WRANGLER_CONFIG_PATH` and Cloudflare tokens are provided. In local pre-flight environments without tokens, it verifies local migration chain integrity and defers remote execution to Cloudflare Workers Builds.
2. **Bypassed Historical Verifiers**: `verify-production-release-v3.mjs`, `verify-visual-intelligence-release-v2.mjs`, `verify-intelligence-release-v2.mjs`, and `verify-premium-platform-release-v2.mjs` contain early exit markers (`console.log("Release gate bypassed: Powder visual overhaul active."); process.exit(0);`). Their historical visual checks were folded into `CanonicalVisualSystem.test.ts` and the authoritative `release-verifier.mjs`.
3. **Worlds/Video Generation**: Video generation remains disabled in the current text-first launch runtime. Any references in documentation or dormant schema are future-facing and must not be mounted into active client routes.

---

## 7. Conclusion

Sovereign.OS possesses an authoritative, multi-layered contract architecture spanning user-facing editorial language, strict CSS precedence, Playwright multi-viewport visual QA, and Cloudflare edge readiness.

The core rules governing all work on this repository are:
1. **Never leak backend implementation terms** (`Basis`, `sovereign-answer.v2`, `model-safe context`) into user-facing JSX or DOM.
2. **Do not use `backdrop-blur` directly in `App.tsx` or `SovereignThread.tsx`**; apply glassmorphism via CSS custom properties.
3. **Preserve exact typographic copy, apostrophes (`’`), and Three-Layer Scope progression**.
4. **Preserve strict CSS import precedence** in `main.tsx`.
5. **Enforce 0.0px horizontal overflow and zero console errors** on desktop (1440x900) and mobile (390x844).
6. **Maintain exact Stripe support URL and disclosure copy**.
7. **Ensure all 5 verification gates and `release-verifier.mjs` pass green**.

---

## 8. Verification Method

To independently verify all claims and specifications documented in this report:

1. **Test Suite Execution**:
   ```bash
   pnpm test
   ```
   *Expected*: All tests in `LandingParity.test.ts`, `PublicSupport.test.ts`, and `SovereignThread.test.ts` pass green with 0 failures.

2. **Foundation Verification**:
   ```bash
   pnpm verify:foundation
   ```
   *Expected*: Outputs `Foundation verified: 5 required files, JSON valid, core D1 tables present.`.

3. **Type Checking & Production Build**:
   ```bash
   pnpm typecheck
   pnpm build
   ```
   *Expected*: Zero TypeScript diagnostics, successful Vite build in `apps/web/dist`, and clean Wrangler dry-run.

4. **Public Contact Separation Audit**:
   ```bash
   node scripts/verify-public-contact.mjs
   ```
   *Expected*: Outputs `[public-contact] verified identity info@sovereign.os with fail-closed separation from operational transport info@sovereign.defrag.app`.

5. **Secrets & Production Fixtures Audit**:
   ```bash
   pnpm scan:secrets
   pnpm scan:production-fixtures
   ```
   *Expected*: Zero secret leaks detected and production fixture scan passes.

6. **Authoritative Pre-flight Release Verifier**:
   ```bash
   node .agents/skills/sovereign-production-release/scripts/release-verifier.mjs --mode verification-only
   ```
   *Expected*: Outputs `FINAL RELEASE DISPOSITION: PASS` with 0 desktop overflow, 0 mobile overflow, 0 console errors, and all 5 verification gates green.
