# Original User Request

## Initial Request — 2026-09-07T07:49:23Z

<USER_REQUEST>
Evolve, refine, and design an editorial, high-contrast visual UI/UX for Sovereign.OS inside Framer to visually plan and demonstrate the product experience, grounded strictly in authoritative repo documentation (docs/product-language-system.md, docs/inner-recognition-intelligence.md, docs/product-positioning-canonical.md, and docs/baseline-question-universe-and-demonstration-strategy.md). Once visually approved, bring the design into the local React codebase (apps/web/src) for production parity.

Working directory: /Users/cjo/Sovereign.final
Integrity mode: development

## Requirements

### R1. Phase 1 — Framer Visual Design Exploration & Alignment
Use @framer/agent to design and publish the landing page in Framer (nice-pluto-305324.framer.app / Session 2):
- Founder Hero: "Healing isn’t optional. Holding onto the pain is." with kicker PERSONAL AI FOR REAL LIFE and concise 2-sentence supporting description of un-hackable personal AI.
- Three-Layer Scope: Explicit visual progression: 01 · YOU (Explore yourself), 02 · YOU + YOUR PEOPLE (Relational intelligence), and 03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics).
- Sovereign Answer v2 Demo: Render an authentic chat/terminal intake preview using Sources (never Basis or model context) with sections WHAT YOU MAY BE BRINGING, WHAT THEY MAY BE BRINGING, WHAT HAPPENS BETWEEN YOU.
- Visual Style: High-contrast industrial monochromatic (#000000/#050505 foundation, sharp 1px borders, crisp typography contrast with Inter & JetBrains Mono, zero decorative AI clutter).

### R2. Phase 2 — React Codebase Production Parity
Once the Framer visual presentation is finalized, translate and integrate the visual design, typography, layout hierarchy, and copy directly into the local React application (apps/web/src/App.tsx).

## Acceptance Criteria

### Visual & Copy Compliance
- [ ] Framer project (nice-pluto-305324.framer.app) published and verified with clean 100% compliant wording from docs/product-language-system.md.
- [ ] Local React application updated to match Framer visual hierarchy without breaking existing tests.
- [ ] pnpm test and pnpm verify:foundation pass with 0 errors.
</USER_REQUEST>

## 2026-09-07T11:03:02Z

<USER_REQUEST>
Execute autonomous visual QA & interaction verification for live Sovereign.OS production deployment.

Working directory: ~/teamwork_projects/sovereign_browser_audit
Integrity mode: demo

## Requirements

### R1. Live Production Payload & Style Auditing
Perform automated browser testing across `https://sovereign.defrag.app` and `https://app.defrag.app` across desktop (1440x900) and mobile (390x844) viewports. Assert zero presence of legacy CSS files (`public.css`, `workspace.css`, `design-system.css`) in `<head>` or network requests. Verify background computes to slate `#09090b` or `#121212` with zero bronze tints or `backdrop-blur` glassmorphism tokens.

### R2. Visual Regression & Layout Verification
Verify landing page scroll reveals (`whileInView`, `staggerChildren`), dark stage spotlight, and auth modal Turnstile widget mounting with passkey/email fallback hierarchy.

### R3. Interactive Workspace State Testing
Simulate synthetic query to verify `<IridescentLoader/>` shimmer bar animation during inference, `.answer-direct` typography scaling (`1rem` / `1.0625rem` md, `1.72` line-height), and smooth `.sov-tab-content` 0.18s tab switching across `people`, `systems`, `explore`, and `you` views.

## Acceptance Criteria

### Visual & Functional QA
- [ ] Document `<head>` and network payloads contain zero legacy CSS imports.
- [ ] Computed styles across all interactive elements contain zero bronze overrides (`var(--bronze-accent)`) or forbidden glassmorphism (`backdrop-blur`).
- [ ] Desktop (`1440x900`) and Mobile (`390x844`) render cleanly without horizontal scroll overflow.
- [ ] `IridescentLoader` renders with active `.sov-shimmer-bar` and `.sov-typing-dot` keyframes during AI generation state.
- [ ] Direct answer text computes to `1rem` / `1.0625rem` md with `1.72` line-height.
- [ ] Workspace tab switching executes with `.sov-tab-content` fade-and-slide animation without jitter.
</USER_REQUEST>

## 2026-09-07T15:33:17Z

<USER_REQUEST>
Refine public visual standards, simplify public UI descriptions, and verify all page flows across Sovereign.OS while preserving exact guarded test contracts.

Working directory: ~/teamwork_projects/sovereign_ui_simplification
Integrity mode: development

## Requirements

### R1. UI Simplification & Visual Hierarchy Refinement
Enhance spacing hierarchy, card padding, font legibility, and section transitions across desktop (1440px) and mobile (390px) viewports in `apps/web/src/App.tsx` and `styles.css`. Maintain plain, direct language that emphasizes what the product helps a person do without exposing internal backend terminology (`sovereign-answer.v2`, `Basis ID`, `model-safe context`).

### R2. Complete Flow & Route Integrity Verification
Verify all user-facing routes (`/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`) render cleanly and navigate without broken state or layout clipping.

### R3. Strict Test Contract & Release Gate Compliance
Ensure all changes strictly satisfy existing test suites (`pnpm test`), TypeScript checking (`pnpm typecheck`), foundation checks (`pnpm verify:foundation`), and Cloudflare release build verification (`pnpm verify:cloudflare-build`).

## Acceptance Criteria

### Visual & Route Verification
- [ ] Public landing page (`https://sovereign.defrag.app`) and workspace application (`https://app.defrag.app`) display simplified, readable typography and refined spacing hierarchy without layout clipping.
- [ ] All 10 application routes navigate without console errors, visual regressions, or broken UI elements.
- [ ] No prohibited backend implementation terms or forbidden glassmorphism (`backdrop-blur`) tokens are present in user-facing code.
- [ ] Full test suite (`pnpm test`), TypeScript verification (`pnpm typecheck`), and `pnpm verify:cloudflare-build` pass with zero errors.
</USER_REQUEST>

## 2026-09-07T21:23:27Z

<USER_REQUEST>
Sovereign.OS is a personal AI platform deployed at `sovereign.defrag.app` on Cloudflare Workers. The project extends the existing React + Cloudflare Worker monorepo with five parallel workstreams: design-system polish synced from a Framer reference, real product UI fragments replacing empty placeholders, WebAuthn passkey authentication, Stripe billing webhook integration, and a polished AI chat thread component (`SovereignThread.tsx`).

Working directory: /Users/cjo/Sovereign.final
Integrity mode: development

## Key Context (Read Before Starting)

- **Repo**: `/Users/cjo/Sovereign.final` — pnpm monorepo with `apps/web` (Vite + React) and `apps/sovereign-worker` (Cloudflare Worker)
- **Framer reference**: https://slight-use-623506.framer.app/ (visual authority — use published preview site for visual matching)
- **Live product**: https://sovereign.defrag.app (Cloudflare production)
- **Build command**: `pnpm production:release:text` — the *only* verified deploy command
- **Test gate**: `pnpm typecheck && pnpm build && pnpm test && pnpm verify:foundation` must all pass green before any release
- **D1 migrations**: Current canonical migration target is `0019_deprecate_manual_capacity.sql`; 19 migrations already applied. Do NOT add a `002_subscription_status.sql` — Stripe customer schema already exists in `0004_stripe_customers.sql` and billing safety in `0009_production_scale_and_billing_safety.sql`
- **Auth**: PasskeyAuthentication.tsx already exists at `apps/web/src/PasskeyAuthentication.tsx` — extend, don't replace
- **Chat**: `SovereignChatWorkspace.v2.tsx` already exists — polish and extend
- **Language law**: Never expose internal terms: Basis IDs, model/provider identifiers, `sovereign-answer.v2`, model-safe context. Use `docs/product-language-system.md` as authority
- **Visual law (AGENTS.md)**: Near-black `#0a0a0a`, warm cream typography `#f5f5f7`, restrained sage accent `#9fbaa1`. No fake metrics, no decorative AI effects, no dashboard card walls

## Requirements

### R1. Design System & Hero Section Polish

Update `apps/web/src/PublicLanding.v2.tsx` and associated CSS files (`design-system.css`, `styles.css`, tokens) to match the Framer reference at https://slight-use-623506.framer.app/. Specifically:
- Replace stark 1px white borders with atmospheric glass borders (`border-white/10` equivalent)
- Increase hero headline scale by ~25% with expanded line-height and `max-w-5xl` container
- Replace generic feature cards with the three conceptual pillars: **SELF — Your Baseline**, **BETWEEN — Your Relationships**, **WHOLE — Your Systems**
- Implement a vertical scroll expansion sequence: `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`
- All static HTML pages in `apps/web/public/` (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`) must share the same CSS variables and dark-mode design system

### R2. Real Product UI Fragments

Replace large empty dark-gradient placeholder rectangles across the landing and workspace layouts with high-fidelity non-functional interface fragments:
- **Baseline View**: Mock metadata cards showing context vectors and baseline weighting (no real data)
- **Expression View**: Textual differentiation between a raw query input and a Sovereign contextual breakdown panel
- **System Map View**: Compact SVG/CSS node network snippet illustrating multi-party relationship vectors

These are purely presentational — no real API calls, no real user data.

### R3. Chat Thread Component Polish (`SovereignThread.tsx`)

Create or substantially refine `apps/web/src/components/chat/SovereignThread.tsx` building on the existing `SovereignChatWorkspace.v2.tsx`:
- Auto-resize textarea composer
- Rich message rendering separating: user prompt block, Sovereign synthesized answer block, and a collapsible "Sources" drawer (never labeled "Basis")
- Entry animations compatible with the existing design system (no external animation libraries unless already in package.json)
- Passkey verification badge visible in the header when the session has a verified passkey credential
- Must integrate with existing `/api/v1/threads/{threadId}/messages` SSE endpoint

### R4. Stripe Billing Webhook Route

Extend `apps/sovereign-worker/src/` to add or verify a webhook handler for `/api/billing/webhook` that handles:
- `checkout.session.completed`
- `invoice.payment_succeeded` and `invoice.payment_failed`
- `customer.subscription.updated` and `customer.subscription.deleted`

Do NOT add a new D1 migration — billing schema already exists in migrations `0004` and `0009`. Verify the Stripe webhook secret is read from the worker's environment bindings, not hardcoded. Add 402 Payment Required middleware for protected workspace routes that require `sovereign_pro` tier.

### R5. Gate Testing & Deployment Verification

All changes must pass the full gate before any deployment:
1. `pnpm typecheck` — zero TypeScript errors
2. `pnpm build` — clean production build
3. `pnpm test` — all Vitest tests green (including `PublicSupport.test.ts` and `LandingParity.test.ts`)
4. `pnpm verify:foundation` — foundation verification script passes

Deploy with `pnpm production:release:text` only after all gates pass. Document the SHA of the deployed commit in release evidence.

## Acceptance Criteria

### Design System
- [ ] Hero headline is visually larger than current; container uses `max-w-5xl` or equivalent
- [ ] Glass borders render as semi-transparent (no stark 1px white lines on landing page)
- [ ] Three conceptual pillars (SELF / BETWEEN / WHOLE) appear in the section below the hero
- [ ] All five static HTML pages share the same CSS variable root as the React app

### Product UI Fragments
- [ ] At least one Baseline View mock card is visible above the fold on the landing page
- [ ] The System Map View node diagram renders as SVG/CSS without errors in the browser console
- [ ] No real API calls are made by the fragment components

### Chat Thread
- [ ] `SovereignThread.tsx` renders without TypeScript errors
- [ ] Textarea auto-resizes on input (scrollHeight technique)
- [ ] "Sources" drawer label is never "Basis" in any rendered string
- [ ] Passkey badge is conditionally rendered based on a session prop

### Billing
- [ ] POST to `/api/billing/webhook` returns 400 for missing `stripe-signature` header
- [ ] Subscription tier `sovereign_pro` enforces a 402 response on a protected route in the worker
- [ ] No hardcoded Stripe secrets in source files

### Gate Tests
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm build` exits 0
- [ ] `pnpm test` exits 0 (all tests green)
- [ ] `pnpm verify:foundation` exits 0
- [ ] Release evidence records the deployed commit SHA
</USER_REQUEST>

