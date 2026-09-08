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

## 2026-09-08T17:41:25Z

<USER_REQUEST>
Implement the full visual, functional, and deployment specification for **Sovereign.OS** at https://sovereign.defrag.app/, matching the Framer template at https://slight-use-623506.framer.app/ / https://framer.com/projects/MindWave-copy--rcpFlEAbbAmY31n6fD6g.

Working directory: /Users/cjo/Sovereign.final
Integrity mode: development

## Requirements

### R1. Design System & Scale Hierarchy Overhaul (Framer to Web App Sync)
- **Palette & Atmosphere:** Pure near-black (`#0a0a0a`), warm cream typography (`#f5f5f7`), and atmospheric soft glass borders (`border border-white/10`). Remove any stark 1px white borders.
- **Typography:** Serif editorial headers (`font-display` / `font-serif`, `tracking-tight`) with Gambarino styling paired with clean sans-serif body copy.
- **Hero Scaling:** Increase hero section scale by 25%. Make the primary headline ("Healing isn't optional. Holding onto the pain is." / "Understand yourself. Understand your people. See the whole system.") fill a commanding vertical presence with expanded line-height and `max-w-5xl` container sizing.
- **Section Rhythm (SELF → BETWEEN → WHOLE):** Implement conceptual architecture sections:
  * SELF — Your Baseline
  * BETWEEN — Your Relationships
  * WHOLE — Your Systems
- **Interactive Sequence ("Start with You"):** Vertical scroll sequence mapping `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`.

### R2. Real Product UI Fragments
Replace any empty gradient placeholders with high-fidelity, interactive or structured visual interface fragments demonstrating contextual intelligence:
- **Baseline View:** Render mock metadata cards showing context vectors and baseline weighting.
- **Expression View:** Textual differentiation between raw query input and Sovereign's contextual breakdown.
- **System Map View:** SVG/CSS node network illustrating multi-party relationship vectors.

### R3. Authentication & Passkey Integration
- Passkey-first WebAuthn registration and login handlers (`/api/auth/register`, `/api/auth/authenticate`) with fallback to magic-link email verification.
- HTTP-only cookie session token binding compatible with Cloudflare Workers.

### R4. Stripe Billing & Access Enforcement
- Cloudflare Worker route `/api/billing/webhook` processing `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, and `customer.subscription.*`.
- D1 SQL migration `0019_deprecate_manual_capacity` / subscription status tracking tiers (`free`, `sovereign_pro`).
- 402 Payment Required enforcement for protected workspace routes.

### R5. Internal AI Thread UI (Sovereign Chat Workspace)
- Fluid Dark UI shell in `SovereignChatWorkspace.v2.tsx` / `SovereignThread.tsx` with auto-resizing input, passkey badges, message blocks separating user prompt, baseline analysis, and synthesized explanation (`/api/explain`).
- Ensure static public HTML assets share exact CSS variables and dark-mode design system.

### R6. Build & Deployment Verification
- Execute `pnpm typecheck`, `pnpm test` (100% pass rate across all workspace tests), `pnpm verify:cloudflare-build`, and production deployment (`pnpm production:release:text`).
- Verify live `/ready` SHA parity and inspect Playwright screenshots.

## Acceptance Criteria

### Visual & Layout Quality
- [ ] Hero headline and CTA buttons scale 25% larger with `max-w-5xl` container sizing and zero vertical overlap.
- [ ] Design system tokens (`#0a0a0a` background, soft `border-white/10` glass, Gambarino headline typography) are uniform across all routes (`/`, `/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/app`).
- [ ] Real product UI fragments (Baseline View, Expression View, System Map SVG) render cleanly without empty placeholder boxes.

### Functional & Backend Parity
- [ ] Passkey and magic link authentication flows complete successfully.
- [ ] Stripe webhook endpoints process subscription status events without errors.
- [ ] Sovereign chat workspace thread renders prompt, baseline grounding, and synthesis blocks.

### Build & Release Verification
- [ ] 0 TypeScript errors (`pnpm typecheck`).
- [ ] All Vitest tests passing (`pnpm test`).
- [ ] Cloudflare build gate passed (`pnpm verify:cloudflare-build`).
- [ ] Deployed live to `https://sovereign.defrag.app` with verified SHA parity on `/ready`.
</USER_REQUEST>
