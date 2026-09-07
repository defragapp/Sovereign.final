# Sovereign.OS Release Specification Report: UI Simplification, Route Integrity & Guarded Contracts

- **Document Version**: 1.0.0
- **Mining Date**: 2026-09-07T15:40:00Z
- **Author**: Release Spec Miner (`survey_spec_miner_1`)
- **Governing Directives**: `AGENTS.md`, `ORIGINAL_REQUEST.md`, `docs/product-language-system.md`, `docs/inner-recognition-intelligence.md`, `docs/product-positioning-canonical.md`, `docs/baseline-question-universe-and-demonstration-strategy.md`, `docs/launch-product-contract.md`, `docs/UI_UX_CONTRACT.md`, `docs/release-gates.md`

---

## 1. Authority Hierarchy & Document Governance

Per `docs/product-language-system.md` § Documentation authority and inheritance:
1. **`docs/product-language-system.md`** governs all user-facing language, voice, terminology, and explanatory sequence.
2. **`docs/launch-product-contract.md`** governs the included product and approval boundary.
3. **`docs/inner-recognition-intelligence.md`** governs intelligence, answer, and Basis behavior.
4. **`AGENTS.md`**, safety, privacy, consent, visual (`docs/UI_UX_CONTRACT.md`), architecture, tool, and release contracts govern their named implementation boundaries while inheriting the first three.
5. **`docs/baseline-question-universe-and-demonstration-strategy.md`** provides product reference and question mapping.
6. Audits, strategies, implementation plans, deployment markers, and release records provide context or evidence only.
7. **Release tests or verifiers are NEVER a source of product language.** They enforce approved wording only after that wording is defined in `product-language-system.md`. Historical compatibility strings must not be restored to the interface merely because an older verifier still expects them.

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Landing & Brand | Founder Root Hero | Displays the founder locked headline and supporting copy with exact typographic apostrophe | Page load at `/` | Kicker: `PERSONAL AI FOR REAL LIFE`, H1: `Healing isn’t optional.<br />Holding onto the pain is.`, 2-sentence description, trust line | Fallback to sans typography, no crash | `docs/product-language-system.md:291-300`, `apps/web/src/LandingParity.test.ts:25-34` |
| 2 | Landing & Brand | Three-Layer Scope Progression | Editorial cards demonstrating the 3 outward layers: 01 · YOU, 02 · YOU + YOUR PEOPLE, 03 · FROM 1:1 TO THE WHOLE SYSTEM | User viewport scroll / inspection | 3 semantic cards with kicker, sub-badge, h3 heading, and exact canonical body copy | Responsive 1-col on mobile, 3-col on desktop | `docs/product-language-system.md:303-359`, `apps/web/src/LandingParity.test.ts:36-60` |
| 3 | Landing & Brand | Sovereign Answer Demo Window | Intake question preview rendering relational triad and collapsible source details | Click "Ask Sovereign" or sample prompt | Relational triad: `WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU`, plus `See source details` disclosure | Never alert/crash, drawer expands inline | `apps/web/src/LandingParity.test.ts:62-73`, `docs/product-language-system.md:278-280` |
| 4 | Landing & Brand | Comparison Section | Explains how Sovereign differs from prompt-based AI | Section scroll | Kicker: `WHY THIS AI IS DIFFERENT`, H2: `Most AI starts with the prompt. Sovereign starts with you.` | Plain language without "foundation" | `docs/product-language-system.md:391-401` |
| 5 | Landing & Brand | Root Closing & CTA | Closing brand statement and primary acquisition trigger | Bottom of landing page | H2: `Know yourself. Understand your people. See the whole system.`, Supporting copy: `Start free. Build your Baseline, then explore what you want to understand next.` | Links to `/signup` | `docs/product-language-system.md:403-411` |
| 6 | Navigation | Header Navigation | Responsive navigation with Sovereign mark, layer links, pricing, sign-in, and get started | Route change or click | Sticky top bar with links, collapses to compact on `<768px` | Zero horizontal scroll overflow | `apps/web/src/App.tsx:161-203`, `scripts/verify-framer-react-challenge.mjs:196` |
| 7 | Auth Flow | Account Signup (`/signup`) | Dedicated email/name signup form with Turnstile protection | Name, email, submission | Sends verification code / magic link | Displays error banner; rejects invalid email | `docs/product-language-system.md:471-475`, `apps/web/src/App.tsx:795-870` |
| 8 | Auth Flow | Account Login (`/login`) | Dedicated email sign-in form | Email, submission | Sends sign-in code / link | Displays error banner; rate limiting handles 429 | `docs/product-language-system.md:476-480`, `apps/web/src/App.tsx:795-870` |
| 9 | Auth Flow | Code Redemption (`/auth/redeem`) | Exchanges code/token from email for active authenticated session | Email, code (6-digit) or URL query token | Session cookie set; redirects to `res.next` or `/app` | "Code redemption failed", allows re-entry | `apps/web/src/App.tsx:968-1021`, `apps/worker/src/email-code-recovery.test.ts` |
| 10 | Baseline Onboarding | Baseline Intake (`/onboarding`) | Collects birth details to establish private Baseline Reference | Date, birthplace, timezone, certainty (exact/approx/unknown), optional time | Submits to `/api/baseline/submit`; transitions to progress | Incomplete/invalid birthplace triggers validation error; unknown time supported | `docs/product-language-system.md:484-491`, `apps/web/src/App.tsx:1022-1225` |
| 11 | Baseline Onboarding | Baseline Progress / Completion | Real-time status polling while Baseline facets and Horizon coordinates calculate | Polling `/api/baseline/status` | Approved states: `Checking your details`, `Building your Baseline`, `Preparing your Baseline`, `Opening Sovereign.OS` | Retries up to 15 times before graceful timeout | `docs/product-language-system.md:492-504`, `apps/web/src/App.tsx:1076-1094` |
| 12 | Baseline Onboarding | Plan Selection (`/onboarding` step 2) | Selection between permanent Free and Sovereign+ tiers | Select plan (`free` / `sovereign_plus`) | Calls `completeAccountOnboarding`; routes to `/app` | Fails gracefully if network error | `apps/web/src/App.tsx:1101-1111`, `apps/worker/src/workspace-onboarding-contract.test.ts` |
| 13 | Authenticated Workspace | Today View (`/app` tab: today) | Primary text-first thinking and conversation surface | User prompt via textarea, Enter key | Streams/renders `sovereign-answer.v2` response with direct answer and structured sections | Turn denied message if monthly turn allowance exhausted | `docs/product-language-system.md:511-515`, `apps/web/src/App.tsx:1488-1655` |
| 14 | Authenticated Workspace | Explore View (`/app` tab: explore) | Exploration of personal patterns, decisions, pressure, communication | Prompt selection or direct question | Populates textarea and switches to Today tab | No hard crash if prompt empty | `docs/product-language-system.md:516-520`, `apps/web/src/App.tsx:1765-1801` |
| 15 | Authenticated Workspace | People View (`/app` tab: people) | Relational intelligence across distinct participants | Add person (name, role) | Generates distinct participant cards with comparison prompt triggers | Prevents duplicate empty entries | `docs/product-language-system.md:521-525`, `apps/web/src/App.tsx:1658-1731` |
| 16 | Authenticated Workspace | Systems View (`/app` tab: systems) | Systemic dynamic mapping across families, teams, and groups | Group scenario prompt selection | Shows Spatial Reference motif and dynamic prompt starter | Graceful empty fallback | `docs/product-language-system.md:526-530`, `apps/web/src/App.tsx:1732-1764` |
| 17 | Authenticated Workspace | Library View (`/app` tab: library) | Retention of enduring insights and active thread references | Tab view | Displays active thread ID, 30-day retention indicator | Shows empty state if no saved insights | `docs/product-language-system.md:531-535`, `apps/web/src/App.tsx:1804-1830` |
| 18 | Authenticated Workspace | You View (`/app` tab: you) | Baseline reference status, facet dimensions, and privacy assurance | Tab view | Displays Baseline status (`GROUNDED & ACTIVE`), cognitive framing facets | Displays `INITIALIZING` if computation pending | `docs/product-language-system.md:536-539`, `apps/web/src/App.tsx:1832-1876` |
| 19 | Public Secondary Pages | How It Works (`/how-it-works`) | Canonical 4-step explanation of Baseline, real situations, people, and systems | Page navigation | Editorial numbered steps, voluntary support section | Clean rendering, back navigation to `/` | `apps/web/src/App.tsx:1885-1940`, `apps/web/public/how-it-works.html` |
| 20 | Public Secondary Pages | Pricing (`/pricing`) | Canonical Free ($0, 10 turns) vs Sovereign+ ($20/mo, 300 turns) comparison | Page navigation | Two pricing cards, feature breakdown, separate support link | Links to `/signup` | `docs/product-language-system.md:551-576`, `apps/web/src/App.tsx:1941-2001` |
| 21 | Public Secondary Pages | FAQ (`/faq`) | Expandable FAQ questions answering capability, privacy, and limits | Question accordion click | Plain language explanations; zero "What is Basis?" | Accessible keyboard toggle | `docs/product-language-system.md:442-452`, `apps/web/src/App.tsx:2002-2035` |
| 22 | Public Secondary Pages | Legal Terms & Privacy (`/terms`, `/privacy`) | Mandatory legal notices, privacy guarantees, data isolation | Page navigation | Full legal policy content, effective dates, back link | Clean text layout, responsive | `apps/web/src/App.tsx:2037-2054` |
| 23 | Public Support | Voluntary Support Link | Separate Stripe-hosted voluntary contribution path ($1 minimum) | Click external link | Opens `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` in new tab | Separate from plan; does not modify entitlements | `docs/launch-product-contract.md:134-136`, `apps/web/src/PublicSupport.test.ts:12-48` |
| 24 | AI Synthesis & Answer | Structured Answer Contract (`sovereign-answer.v2`) | Server-validated structured response containing headline, direct answer, sections, basis refs | Prompt to `/api/thread/:id/message` | JSON payload conforming to `SovereignAnswerV2` schema | Graceful fallback to text if non-structured | `docs/inner-recognition-intelligence.md:83-115`, `apps/web/src/App.tsx:1545-1615` |
| 25 | AI Answer Inspection | Quiet Source Details Drawer | Expandable drawer showing server-authorized source values beneath an answer | Click `See source details` | Collapsed control `Sources`, expanded drawer with exact values and provenance | Truncated to max 5 on desktop, 3 + N on mobile | `docs/inner-recognition-intelligence.md:116-148`, `docs/product-language-system.md:123-131` |
| 26 | Answer Correction | Qualitative Correction / Feedback | Non-binary feedback prompt: `yes`, `partly`, `not_today` | User button click on answer | Calls `submitCorrection`; stores recorded feedback | Non-fatal on failure | `docs/inner-recognition-intelligence.md:98`, `apps/web/src/App.tsx:1592-1609` |
| 27 | UI Feedback / Loading | Iridescent Shimmer Loader | High-fidelity shimmer animation during inference | `sending === true` state | Active `.sov-shimmer-bar` and `.sov-typing-dot` animation with sage/cream gradient | Resets cleanly on response or error | `apps/web/src/components/IridescentLoader.tsx`, `apps/web/src/styles.css:168-208` |
| 28 | Style System | Industrial Monochromatic Foundation | Near-black palette, subtle 1px lines, warm typography | Global CSS | `--platform-bg: #000000`, `--surface: #050505`, `--line: rgba(255,255,255,0.08)`, `--sage: #9fbaa1` | Validated by `validate:ui` and `LandingParity.test.ts` | `docs/UI_UX_CONTRACT.md:12-22`, `apps/web/src/styles.css:3-32` |

---

## 3. Edge Cases & Observed Behavior

| # | Feature | Input / Condition | Observed Behavior | Enforced In |
|---|---------|-------------------|-------------------|-------------|
| 1 | Baseline Intake | Unknown birth time selected | Form hides birth time input; server calculates noon/date-only horizon coordinates; omits unavailable house/minute facets without hallucinating | `docs/product-language-system.md:505`, `apps/web/src/App.tsx:1204` |
| 2 | Free Tier Allowance | 11th turn requested in same UTC month | Worker atomics reject turn (`status: 429`); returns `ai_turn_denied` with `allowance: 10` and `retryAfter`; turn is refunded in ledger | `apps/worker/src/billing/usage.test.ts`, `apps/worker/src/ai/free-tier-capacity.test.ts` |
| 3 | Source Drawer Display | Answer has >5 Basis references | Displays max 5 chips on desktop, max 3 chips on mobile followed by `+N` indicator | `docs/inner-recognition-intelligence.md:140-141` |
| 4 | Model Basis Tampering | Model generates unauthorized Basis ID | Server strips or rejects unauthorized Basis reference; never allows hallucinated Basis refs to reach UI | `docs/inner-recognition-intelligence.md:65, 81` |
| 5 | Shared People Consent | Workspace owner attempts to query unconsented invitee Baseline | Gateway rejects with 403; requires active, identity-bound, scope-specific consent grant; owner cannot grant consent for invitee | `docs/launch-product-contract.md:104-108`, `apps/worker/src/db/people.test.ts` |
| 6 | Consent Revocation | Invitee revokes consent mid-thread | Future turns immediately fail closed; shared context stripped from subsequent prompt assembly | `docs/launch-product-contract.md:108` |
| 7 | Safety / Abuse Boundary | Input mentions abuse, coercion, domestic violence, or immediate danger | Mutualizing pattern/feedback-loop language suppressed; safety response contract triggers grounded referral resources; normal Basis chips suppressed | `docs/inner-recognition-intelligence.md:16-17`, `apps/worker/src/agent/safety.test.ts` |
| 8 | Covenant Exploration | Prompt touches spiritual/religious inquiry without prior confirmation | Baseline answer generated normally; Covenant section remains inactive; offers explicit contextual action: `Explore through Christian Scripture` | `docs/product-language-system.md:256-263`, `docs/inner-recognition-intelligence.md:190-198` |
| 9 | Covenant Activation | User confirms Covenant exploration | Injects verified Scripture retrieval from World English Bible (WEB); structures output into Biblical parallel, Scripture, Teaching, Application, Boundary; fails closed if passage unverified | `apps/worker/src/covenant/scripture.test.ts` |
| 10 | Browser Rendering | Client has `prefers-reduced-motion: reduce` | All animations, transitions, and smooth-scroll behaviors disabled (`animation: none !important; transition: none !important`) | `apps/web/src/styles.css:224-230`, `docs/UI_UX_CONTRACT.md:127` |
| 11 | Viewport Responsiveness | Viewport at mobile 390px width | Stacks header nav, hero CTA buttons, and 3-layer scope grid; compresses padding (`p-6`); zero horizontal scroll overflow | `scripts/verify-framer-react-challenge.mjs:188-212`, `apps/web/src/styles.css` |
| 12 | Viewport Responsiveness | Viewport at desktop 1440px width | Expands 3-layer scope to 3 columns, centers conversation column within max-w-3xl, preserves generous whitespace | `apps/web/src/App.tsx:174-202`, `docs/UI_UX_CONTRACT.md:64-70` |
| 13 | Voluntary Support URL | User clicks voluntary support contribution | Redirects to exact Stripe-hosted URL `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`; retired dev URL `...0x267S03` strictly prohibited | `apps/web/src/PublicSupport.test.ts:12-21` |
| 14 | Source Maps | Production build generated in `apps/web/dist` | Build script generates zero `.map` files; verified by `scripts/verify-no-public-source-maps.mjs` | `scripts/verify-no-public-source-maps.mjs:27-30` |
| 15 | Worker Bundle Limit | Worker bundle compressed size | Total upload gzip must not exceed 2,500 KiB internal budget (Cloudflare Free limit is 3,072 KiB); currently 237.23 KiB | `scripts/verify-worker-bundle-size.mjs:42-52` |

---

## 4. Strict Constraints & Architectural Boundaries

1. **Text-First Launch Boundary**:
   - The product is strictly text-first.
   - `WORLDS_VIDEO_ENABLED="false"`. No video generation, spatial rendering, RunwayML integration, or media turn charges may be mounted or advertised.
2. **Server-Authoritative Runtime**:
   - Auth, Baseline computation, consent grants, answer safety validation, Stripe billing, entitlement checks, and data retention are 100% server authoritative.
   - No mock accounts, simulated entitlements, or fake AI responses are permitted in production or staging.
3. **First Acceptance Path**:
   - `account → Baseline → first real AI turn → rendered answer`.
4. **Canonical Migration Target**:
   - Canonical target schema: `0019_deprecate_manual_capacity`.
   - Applied migration `0017_privacy_access_and_eligibility` is immutable.
5. **Verified Release Command**:
   - Verified executable release command is: `pnpm production:release:text`.
   - Requires green `pnpm verify:cloudflare-build`.
6. **Data Isolation & Privacy**:
   - Raw birth coordinates, exact birth minute, passwords, auth tokens, and private session notes NEVER enter LLM prompt context or operational logs.
   - Unsaved threads scheduled for deletion after 30 days.
   - Operational logs capped at 90 days.
   - Library understandings preserved until account deletion.
   - Account deletion enforces a 14-day grace period and Stripe subscription cancellation.

---

## 5. Exhaustive Prohibited Terms & Phrasing Dictionary

The following table details all terms strictly prohibited in user-facing code, UI labels, marketing copy, onboarding, and documentation per `docs/product-language-system.md:578-624` and guarded tests (`apps/web/src/LandingParity.test.ts:75-94`, `scripts/verify-framer-react-challenge.mjs:217-237`).

| Prohibited Term / Phrase | Context Where Forbidden | Why Prohibited | Approved Replacement |
|---|---|---|---|
| `sovereign-answer.v2` | User-facing UI, labels, answers | Internal schema identifier | "Answer", direct response |
| `Basis` / `Example Basis` | Unexplained user-facing source label | Internal data contract name | `Sources`, `See source details`, `Source details` |
| `What is Basis?` / `What does Basis prove?` | Public FAQ, landing, copy | Exposes technical jargon | "Can I see what information Sovereign used for an answer?" |
| `model-safe context` / `model context` | UI copy, marketing, explanations | Internal architecture term | "Your private reference", "what is happening now" |
| `server-approved` / `authorized references` | Interface labels, answers | Infrastructure jargon | "Source details", "sources Sovereign used" |
| `provenance` / `evidence levels` / `source layers` | UI labels, error messages | Internal evidence taxonomy | Clear, adult plain language |
| `server-confirmed state` / `server-confirmed Stripe...` | Customer billing copy | Backend implementation leak | "Your subscription is active", "Free Plan" |
| `One private foundation...` / `foundation` | Root marketing, Baseline description | Misrepresents Baseline as rigid | `A private reference built around you` |
| `Separate helping from carrying the outcome.` | Category heading for Self | Over-indexes on conflict/burden | `Explore how you think, decide, communicate, create, connect, and grow.` |
| `See where responsibility keeps landing.` | Category heading for Systems | Over-indexes on single dimension | `See the whole system.` |
| `Understand both sides and what happens between you.` | Category heading / copy | Reduces relational dynamic | `See why the same moment lands differently—and how to bridge the gap.` |
| `Ask about your life.` / `Ask about your life. Get an answer...` | Root hero, secondary copy | Generic chatbot phrasing | `PERSONAL AI FOR REAL LIFE` / `Healing isn’t optional. Holding onto the pain is.` |
| `What do you want to understand?` / `What would you like to explore?` / `Ask anything.` | Empty workspace state | Generic chatbot cliché | `What is active for you now?` / `Begin with what remains steady in your Baseline...` |
| `authority` | Canonical Systems dimension / UI | Uncomputed framework claim | Role, responsibility, or communication style |
| `missing perspective` | Systems dimension / claim | Avoids inferring absent state | Factual roles and confirmed observations |
| `exact source positions` / `Baseline profile` / `facet profile` | Onboarding UI | Technical calculation jargon | "Build your Baseline", "Checking your details" |
| `source_computing` / `facet_profile_preparing` | Onboarding progress spinners | Internal task state codes | `Checking your details`, `Building your Baseline`, `Preparing your Baseline` |
| `interpretive uncertainty` | Onboarding / UI copy | Backend metric leak | Plain language description of what is clear vs unknown |
| `permitted context` / `consented people` | Public explanation of People/Systems | Legalistic implementation terms | "With permission", "people you choose to include" |
| `emotional vector` / `vector` | Expression Field UI labels | Mathematical abstraction | Lines, interaction themes, relative emphasis |
| `calculated solution` / `your chart says` / `the universe is telling you` / `this transit means` | AI answers, marketing | Spiritual certainty / fatalism | Grounded, conditional possibility language (`may`, `can`) |
| `choose yourself` / `return to yourself` / `do the work` / `healing journey` / `unlock your potential` / `become your highest self` | Product copy, marketing, answers | Inspirational cliché / therapy voice | Calm, direct, adult language |
| Compatibility score / Alignment score (%) | Relationship / Alignment answers | Falsely quantifies human dynamics | Qualitative structured comparison: Supports fit, Pulls against it, Tradeoff |

---

## 6. Required UI Characteristics & Design System Specifications

Per `docs/UI_UX_CONTRACT.md` and `apps/web/src/styles.css`:

### 6.1 Visual Tokens & Color Palette
- **Canvas Base**: Pure black `--platform-bg: #000000` (`#000000` / `#050505`).
- **Primary Ink**: Pure black `--ink: #000000`.
- **Primary Text**: Warm cream `--cream: #f4f0e8`.
- **Secondary Text**: Muted gray `--muted: #a3a099`.
- **Subtle Text / Utility**: `--subtle: #686660`.
- **Elevated Surfaces**:
  - Base surface: `--surface: #050505`
  - Container surface: `--surface-1: #0c0c0e`
  - Elevated card: `--surface-2: #121215`
  - High elevation: `--surface-3: #18181c`
- **Border Lines**:
  - Subtle line: `--line: rgba(255, 255, 255, 0.08)` (1px solid)
  - Strong line: `--line-strong: rgba(255, 255, 255, 0.16)`
- **Sage Accent**:
  - Primary sage: `--sage: #9fbaa1`
  - Muted sage: `--sage-muted: rgba(159, 186, 161, 0.14)`
- **Clay Accent**: `--clay: #c4aba1`.

### 6.2 Typography Hierarchy
- **Font Sans**: `"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist Sans", "Segoe UI", system-ui, sans-serif`.
- **Font Mono**: `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.
- **Retired Fonts**: `Sovereign Display` and all serifs (Georgia, Palatino, Iowan Old Style) are strictly RETIRED from rendered UI use.
- **Answer Typography**:
  - Mobile: `1rem` (`16px`), line-height `1.72`.
  - Tablet/Desktop (`md:`): `1.0625rem` (`17px`), line-height `1.72`.
  - Color: `--cream: #f4f0e8`.

### 6.3 Forbidden Styling Rules (Strict Enforcement)
- Zero `backdrop-blur` (glassmorphism is forbidden).
- Zero decorative animated gradients (`bg-gradient-to-r`, `bg-gradient-to-l`, etc.).
- Zero bronze tints (`var(--bronze-accent)`).
- Zero `animate-spin-slow` or `neon-glow`.
- Zero dashboard card walls or fake metrics.
- Zero decorative 3D hero art or pulsing robot icons.

### 6.4 Key Animations
- **Shimmer Bar (`.sov-shimmer-bar`)**: Height 2px, radius 1px, background linear-gradient (sage/cream/clay), 2.4s infinite shimmer.
- **Typing Dots (`.sov-typing-dot`)**: 4px diameter, sage background, 1.4s ease-in-out infinite staggered bounce.
- **Tab Transition (`.sov-tab-content`)**: 0.18s ease-out fade-and-slide (`translateY(6px)` to `0`).

---

## 7. Guarded Test Contracts & Validation Gates Specification

The repository enforces a strict multi-stage verification pipeline. Any modification to `apps/web/src/App.tsx`, `styles.css`, or other source files must pass all gates:

### Gate 1: `pnpm verify:foundation` (`scripts/verify-foundation.mjs`)
- Validates existence of 5 required files: `README.md`, `docs/architecture.md`, `apps/web/src/App.tsx`, `apps/sovereign-worker/src/index.ts`, `apps/sovereign-worker/migrations/0001_initial.sql`.
- Asserts all `package.json` and `manifest.webmanifest` files parse as valid JSON.
- Confirms 9 core D1 tables in initial migration: `accounts`, `persons`, `relationships`, `systems`, `consent_grants`, `threads`, `thread_events`, `entitlement_cache`, `webhook_events`.

### Gate 2: `pnpm validate:ui` (`.agents/skills/ui-contract-validator.mjs`)
- Scans `apps/web/src` recursively for forbidden tokens: `backdrop-blur`, `bg-gradient-to-r`, `bg-gradient-to-l`, `bg-gradient-to-t`, `bg-gradient-to-b`, `animate-spin-slow`, `neon-glow`.
- Asserts presence of required canonical copy strings.

### Gate 3: `pnpm typecheck` (`pnpm -r typecheck`)
- Runs `tsc --noEmit` across all 5 workspace projects:
  - `@sovereign/web`
  - `@sovereign/contracts`
  - `@sovereign/agent-contracts`
  - `@sovereign/worker`
  - `@sovereign/sovereign-worker`
- Zero TypeScript errors permitted.

### Gate 4: `pnpm test` (`pnpm -r test`)
- Executes 71 test files and 411 tests across web and workers.
- Key web suites:
  - `apps/web/src/LandingParity.test.ts`: Enforces fonts, styles.css tokens, founder hero copy, 3-layer scope cards, answer demo window, prohibited terms list, zero backdrop-blur, Today authenticated headline, and 10 application routes.
  - `apps/web/src/PublicSupport.test.ts`: Enforces Stripe support URL `...O67S02`, absence of retired URL `...S03`, separation from subscriptions, $1 minimum disclosure, non-tax-deductible notice.

### Gate 5: `pnpm verify:cloudflare-build` (`scripts/cloudflare-build-diagnostics.mjs`)
Executes 24 sequential release stages:
1. `main-release` (`scripts/assert-main-release.mjs`)
2. `foundation` (`pnpm verify:foundation`)
3. `migrations` (`pnpm verify:migrations`)
4. `secrets-scan` (`pnpm scan:secrets`)
5. `production-fixtures` (`pnpm scan:production-fixtures`)
6. `public-contact` (`scripts/verify-public-contact.mjs`)
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
22. `public-source-maps` (`scripts/verify-no-public-source-maps.mjs`)
23. `worker-bundle-size` (`pnpm verify:worker-bundle-size`) - budget 2,500 KiB gzip
24. `production-d1-parity` (`scripts/verify-production-d1-parity.mjs`)

---

## 8. Complete Flow & Route Integrity Verification (All 10 Routes)

| # | Route | Component | Purpose & Guarded Requirements | Navigation & Transitions |
|---|-------|-----------|--------------------------------|--------------------------|
| 1 | `/` | `<Landing />` | Public root landing page. Contains founder hero, 3-layer scope cards, interactive intake demo, comparison, closing CTA, header and footer. Zero prohibited terms. | Navigates to `/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup` |
| 2 | `/how-it-works` | `<InfoPage />` | Canonical 4-step walkthrough: 01 Start with you, 02 Bring real situations, 03 Understand what happens between people, 04 See the whole system. Includes voluntary support block ($1 min). | Back button calls `go('/')` |
| 3 | `/pricing` | `<Pricing />` | Canonical Free ($0, 10 turns/mo) vs Sovereign+ ($20/mo or $99/yr, 300 turns/mo) breakdown. Stripe billing disclosure. Voluntary contribution card. | CTA buttons call `go('/signup')`; back button calls `go('/')` |
| 4 | `/faq` | `<FAQ />` | Expandable accordion answering core product definition, Baseline explanation, absence of mind-reading, voluntary support separation. No "What is Basis?". | Back button calls `go('/')` |
| 5 | `/terms` | `<LegalPage title="Terms of Service" />` | Terms of service detailing data isolation, account rights, no commercial sale of data, 18+ requirement. | Back button calls `go('/')` |
| 6 | `/privacy` | `<LegalPage title="Privacy Policy" />` | Privacy policy detailing 30-day unsaved thread deletion, zero training on private data, strict isolation of birth coordinates. | Back button calls `go('/')` |
| 7 | `/login` | `<Auth mode="login" />` | Single-task authentication modal for returning users. Headline: `Sign in to Sovereign.OS.`, Body: `Use your email and the secure sign-in method available for your account.` | On success / code entry routes to `res.next` or `/app` |
| 8 | `/signup` | `<Auth mode="signup" />` | Single-task account creation. Headline: `Create your Sovereign.OS account.`, Body: `Start free. Verify your email, then build your Baseline.` Includes name and email inputs. | On verification transitions to `/onboarding` |
| 9 | `/auth/redeem` | `<Redeem />` | Handles magic link redemption from query params (`?token=...` or code entry). Sets session cookie. | Redirects to `res.next` or `/app` |
| 10 | `/onboarding` | `<Onboarding />` | 2-step flow: Step 1 Baseline Intake (date, birthplace, timezone, time certainty, optional time), Step 2 Plan Selection (Free vs Sovereign+). | Completes onboarding and transitions to `/app` |
| 11 | `/app` | `<Workspace />` | Authenticated text-first workspace. Contains 6 tabs: Today (main chat), Explore (pattern prompts), People (relational comparison), Systems (group dynamics), Library (saved insights), You (Baseline status). | Log out returns to `/`; session check redirects to `/login` if unauthenticated |

---

## 9. Acceptance Criteria Verification Matrix

| Requirement | Acceptance Criteria | Target File / Verification Command | Current Status |
|---|---|---|---|
| R1. UI Simplification | Refine spacing hierarchy, card padding, font legibility, section transitions across 1440px & 390px viewports without layout clipping. | `apps/web/src/App.tsx`, `apps/web/src/styles.css` | Verified compliant with industrial dark aesthetic; ready for refinement |
| R1. UI Copy Authority | 100% compliant wording from `docs/product-language-system.md`. Zero prohibited terms (`sovereign-answer.v2`, `Basis ID`, `model-safe context`, `One private foundation`, etc.). | `apps/web/src/LandingParity.test.ts`, `scripts/verify-framer-react-challenge.mjs` | Verified zero prohibited terms present |
| R2. Route Integrity | All 10 user-facing application routes render cleanly, navigate without console errors, and preserve state integrity. | `App.tsx` routing router, `LandingParity.test.ts:108-127` | Verified all 10 routes defined and mapped |
| R3. Foundation Contract | `pnpm verify:foundation` passes with 0 errors. Core D1 tables verified. | `scripts/verify-foundation.mjs` | Verified PASSED (code 0) |
| R3. UI Styling Contract | Zero `backdrop-blur`, zero animated gradient tokens, zero bronze overrides. | `node .agents/skills/ui-contract-validator.mjs` | Verified PASSED (code 0) |
| R3. TypeScript Contract | `pnpm typecheck` passes across all 5 workspace projects. | `pnpm -r typecheck` | Verified PASSED (code 0) |
| R3. Test Suite Contract | `pnpm test` passes across all workspace packages (71 test files, 411 tests). | `pnpm -r test` | Verified PASSED (code 0) |
| R3. Release Gate Contract | `pnpm verify:cloudflare-build` passes all 24 stages including bundle size and D1 parity. | `scripts/cloudflare-build-diagnostics.mjs` | Verified PASSED (code 0) |
