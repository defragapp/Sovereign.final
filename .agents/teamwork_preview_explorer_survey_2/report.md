# Architectural Survey & Parity Report: React Codebase & UI State

**Survey Target:** `/Users/cjo/Sovereign.final/apps/web/`  
**Explorer:** Explorer 2 (Survey: React Codebase Architecture & UI State)  
**Date:** 2026-09-07  
**Integrity Mode:** Development / Read-Only Investigation  

---

## 1. Executive Summary

This report delivers a thorough architectural and design system survey of the Sovereign.OS web application (`@sovereign/web`), its styling infrastructure, its verification and test framework, and the exact specifications required to bring the editorial high-contrast Framer landing page into local React production parity without perturbing existing authenticated flows, Baseline generation paths, or test assertions.

### Key Takeaways
1. **Single-File Public Architecture with Modular Workspace Assets:** The primary entry point and all client-side routes (`/`, `/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`) are currently driven directly by a custom zero-dependency history router inside `/Users/cjo/Sovereign.final/apps/web/src/App.tsx`.
2. **Tailwind CSS v4 (CSS-First, Zero-Config):** The project uses Tailwind CSS v4.3.3 via `@tailwindcss/vite`. There is no `tailwind.config.js`. Design tokens and font families are managed across `design-system.css`, `public.css`, `workspace.css`, and `styles.css`.
3. **Typography Disconnect (Inter & JetBrains Mono Missing):** The current codebase relies on a bundled variable Geist Sans font and system fallbacks. Neither **Inter** nor **JetBrains Mono** is currently linked or imported as a web font in `index.html` or `styles.css`. Parity with the requested visual style requires integrating these fonts.
4. **Strict Test Boundaries:** 
   - `pnpm test` runs `vitest` across all workspaces. In `apps/web`, it strictly validates `PublicSupport.test.ts` (ensuring Stripe voluntary donation links, '$1' minimum, and separation from subscriptions).
   - `pnpm verify:foundation` strictly requires `apps/web/src/App.tsx` to exist on disk at that exact path, along with 4 other core files, JSON syntax validity across all `package.json` files, and 9 core D1 tables.
   - Both `pnpm typecheck` and `pnpm build` compile cleanly in < 1 second.
5. **Clear Landing Page Parity Path:** The `Landing()` component inside `App.tsx` can be cleanly refactored (or decomposed into dedicated section components) to implement the high-contrast industrial monochromatic visual system, Three-Layer Scope progression (01 · YOU, 02 · YOU + YOUR PEOPLE, 03 · FROM 1:1 TO THE WHOLE SYSTEM), authentic Sovereign Answer v2 terminal preview using Sources, while keeping all authenticated paths (`/onboarding`, `/app`, `/login`, `/signup`, `/auth/redeem`) completely intact.

---

## 2. React Codebase Architecture & UI State

### 2.1 Monorepo & Packaging
The workspace is managed with `pnpm@9.15.9`:
- `apps/web` (`@sovereign/web`): Vite 8.1.5 + React 19.2.7 + TypeScript 5.8.3 + Tailwind v4 + Framer Motion 13.2.0 + Lucide React 1.41.0.
- `apps/worker` (`@sovereign/worker`): Cloudflare Worker gateway with Hono 4.12.31 + Zod 4.4.3 + Durable Objects.
- `apps/sovereign-worker`: Canonical worker runtime with 69 test suites and D1 migrations.
- `packages/contracts` (`@sovereign/agent-contracts`): Shared TypeScript contracts and model configs.

### 2.2 Entrypoints & Mounting
- **HTML Host:** `/Users/cjo/Sovereign.final/apps/web/index.html`
  - Mounts `<div id="root"></div>`.
  - Sets viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`.
  - Sets theme color: `#0b0b0a`.
  - Loads `/src/main.tsx`.
- **Application Bootstrap:** `/Users/cjo/Sovereign.final/apps/web/src/main.tsx`
  - Imports stylesheets in exact sequence:
    1. `./design-system.css`
    2. `./public.css`
    3. `./workspace.css`
    4. `./styles.css`
  - Mounts `<App />` within `<React.StrictMode>`.

### 2.3 Router & Route Mapping (`App.tsx`)
Routing is implemented using a custom, lightweight, history-based router in `App.tsx`:
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

function currentRoute(): Route {
  const path = window.location.pathname;
  if (path.startsWith('/auth/redeem')) return '/auth/redeem';
  const known: Route[] = [
    '/', '/how-it-works', '/pricing', '/faq', '/terms',
    '/privacy', '/login', '/signup', '/auth/redeem', '/onboarding', '/app'
  ];
  return known.includes(path as Route) ? (path as Route) : '/';
}

function go(path: Route) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
```

#### Route Dispatch Table:
| Route | Component Rendered | Purpose / State |
|---|---|---|
| `/` | `<Landing />` | Public root landing page, narrative progression, interactive demo widgets. |
| `/login` | `<Auth mode="login" />` | Email login / magic code dispatch and verification. |
| `/signup` | `<Auth mode="signup" />` | Email signup (creates user account prior to Baseline intake). |
| `/auth/redeem` | `<Redeem />` | Ingests URL token parameter (`/auth/redeem?token=...`) and establishes session. |
| `/onboarding` | `<Onboarding />` | Interactive Baseline intake (birthdate, birthplace, timezone, certainty) + polling + plan choice. |
| `/app` | `<Workspace />` | Core authenticated chat environment: Today, People, Systems, Library, Settings. |
| `/how-it-works` | `<InfoPage onBack={() => go('/')} />` | Explanatory journey steps + Stripe voluntary donation callout (`#support`). |
| `/pricing` | `<Pricing onBack={() => go('/')} />` | Standard Free ($0) vs Sovereign+ ($20/mo) plan cards + voluntary support. |
| `/faq` | `<FAQ onBack={() => go('/')} />` | Accordion questions on Baseline, relational intelligence, and non-tax-deductible support. |
| `/terms` | `<LegalPage title="Terms of Service" />` | Data privacy, non-training, and account boundaries. |
| `/privacy` | `<LegalPage title="Privacy Policy" />` | Strict data isolation and storage guarantees. |

### 2.4 Existing UI Components & Primitives
1. **shadcn-Style Primitives (`apps/web/src/components/ui/`):**
   - `button.tsx`: CVA forwardRef button supporting variants `primary` (`bg-[var(--cream)] text-[var(--ink)]`), `secondary` (`border border-[var(--line-strong)]`), `ghost` and sizes `sm`, `md`, `lg`.
   - `input.tsx`: forwardRef input styled with `border-[var(--line)] bg-[var(--surface)] text-[var(--cream)]`.
   - `textarea.tsx`: forwardRef textarea styled with `border-[var(--line)] bg-[var(--surface)] text-[var(--cream)]`.
2. **Interactive Demo Primitives (`apps/web/src/components/`):**
   - `Accordion.tsx`: Animated collapsible accordion for structured Sovereign answers with `observation`, `pattern`, and `shift`.
   - `RelationalInquiryDemo.tsx`: 3 interactive scenarios (Pacing & Time, Feedback & Collaboration, Autonomy & Closeness) demonstrating dual-baseline comparisons (Baseline A vs Baseline B).
   - `SystemDynamicDemo.tsx`: Interactive SVG node diagram showing group structures (Families, Teams, Groups, Partnerships) across 3 progression stages.
3. **Core App Components (`apps/web/src/`):**
   - `SovereignMark`: Clean vector SVG mark with concentric rings.
   - `ReferenceField`: Coordinate axis spatial motif.
   - `Header`: Sticky public navigation bar with brand anchor, navigation links, and action buttons.
   - `AuthenticatedWorkspace.tsx` / `SovereignIntelligenceWorkspace.tsx`: Modular enterprise workspace implementations with full conversation and state management.

---

## 3. Styling System, Theme Tokens & Typography

### 3.1 Tailwind CSS v4 Configuration
- **Engine:** `@tailwindcss/vite` plugin 4.3.3 inside `vite.config.ts`.
- **Configuration Pattern:** CSS-first configuration via `@import "tailwindcss";` in `src/styles.css`. There is no `tailwind.config.js`.
- **Class Utilities:** Standard Tailwind utility classes (`flex`, `grid`, `rounded-2xl`, `border`, `gap-4`, `p-6`, etc.) are fully supported alongside arbitrary values (`text-white/40`, `bg-[#121212]`, etc.).

### 3.2 CSS File Hierarchy and Precedence
Styles are imported in `main.tsx` in this explicit order:
1. `design-system.css` (1,148 lines): Comprehensive foundational CSS variables, `@font-face` for Geist Sans, button classes, card definitions, and responsive breakpoint rules.
2. `public.css` (18,349 lines): Massive stylesheet containing ported v0 landing assets, layout rules, interactive cards, and responsive media queries.
3. `workspace.css` (9,936 lines): Authenticated workspace layout, chat bubble formatting, thread sidebar, and inspector panes.
4. `styles.css` (147 lines): Active Tailwind layer and top-level theme overrides:
   - Root color tokens:
     - `--platform-bg`: `#09090b`
     - `--ink`: `#09090b`
     - `--cream`: `#f4f0e8`
     - `--muted`: `#a3a099`
     - `--subtle`: `#686660`
     - `--surface-0`: `#0c0c0e`
     - `--surface-1`: `#121215`
     - `--surface-2`: `#18181c`
     - `--surface-3`: `#202026`
     - `--line`: `rgba(255, 255, 255, 0.08)`
     - `--line-strong`: `rgba(255, 255, 255, 0.16)`
     - `--sage`: `#aebaa7` (restrained accent green)
     - `--sage-muted`: `rgba(174, 186, 167, 0.14)`

### 3.3 Typography Audit: Inter and JetBrains Mono
- **Current State:**
  - `apps/web/public/fonts/` contains only `geist/Geist-Variable.woff2`, `sovereign-display.woff2`, and `sovereign-sans.woff2`.
  - `styles.css` defines `--sans-primary` as `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist Sans", "Segoe UI", system-ui, sans-serif;`.
  - `JetBrains Mono` is completely absent from the font declarations.
  - `Inter` is only referenced in fallback strings inside `public.css` and `passkey-auth.css`.
- **Required Parity Fix:**
  To fulfill the visual requirements of `ORIGINAL_REQUEST.md` ("crisp typography contrast with Inter & JetBrains Mono"):
  1. Add Google Fonts preconnect and stylesheet links in `apps/web/index.html`:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
     ```
  2. Update font tokens in `styles.css`:
     ```css
     :root {
       --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
       --font-mono: 'JetBrains Mono', monospace;
       --sans-primary: var(--font-sans);
       font-family: var(--font-sans);
     }
     .font-mono {
       font-family: var(--font-mono);
     }
     ```

### 3.4 Color and Aesthetic Compliance (AGENTS.md)
`AGENTS.md` and `docs/product-language-system.md` enforce:
- **Foundation:** Near-black foundation (`#000000` / `#050505` / `#09090b`).
- **Typography:** Warm readable typography (`#f4f0e8`, `#f2ede5`, white/90).
- **Accents:** Restrained sage accent (`#aebaa7`), zero neon/rainbow AI gradients.
- **Whitespace & Borders:** Generous whitespace, subtle 1px borders (`border-white/[0.08]`).
- **Cards & Effects:** Avoid dashboard card walls, fake metrics, floating orbs, decorative AI sparkles, and framework-heavy navigation.

---

## 4. Tests and Verification Framework

### 4.1 `pnpm test`
Executes `pnpm -r test` across all workspace packages:
1. **`@sovereign/web` (`apps/web`):**
   - Runner: `vitest run --passWithNoTests`
   - Test File: `apps/web/src/PublicSupport.test.ts` (3 tests, all passing):
     - Validates that `how-it-works.html`, `pricing.html`, `faq.html`, and `AccountControlCenter.tsx` contain `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` and DO NOT contain retired support URLs.
     - Validates that support is voluntary, separate from subscriptions, and does not alter Free or Sovereign+ access.
     - Validates that custom contributions start from `$1` and forbids phrases like `$10 suggested`, `$25 suggested`, `$1–$1,000`, `$5–$500`.
2. **`@sovereign/worker` (`apps/worker`):**
   - Runner: `vitest run --passWithNoTests`
   - 69 test files, 399 passed tests covering auth contracts, baseline engine, billing, input safety, rate limits, and turn recovery.
3. **`@sovereign/sovereign-worker` (`apps/sovereign-worker`):**
   - 69 test files, 399 passed tests.
4. **`@sovereign/agent-contracts` (`packages/contracts`):**
   - Passes with 0 tests.

### 4.2 `pnpm verify:foundation`
Executes: `node scripts/verify-foundation.mjs`
- **Rule 1 — File Existence:** Asserts that the following 5 exact paths exist:
  1. `README.md`
  2. `docs/architecture.md`
  3. `apps/web/src/App.tsx` (CRITICAL: `App.tsx` must remain at this exact relative path)
  4. `apps/sovereign-worker/src/index.ts`
  5. `apps/sovereign-worker/migrations/0001_initial.sql`
- **Rule 2 — JSON Parseability:** Recursively walks the repository root and parses every `package.json` and `manifest.webmanifest`. Throws if any JSON is malformed.
- **Rule 3 — Migration D1 Integrity:** Reads `apps/sovereign-worker/migrations/0001_initial.sql` and verifies that `CREATE TABLE <table_name>` statements exist for:
  `accounts`, `persons`, `relationships`, `systems`, `consent_grants`, `threads`, `thread_events`, `entitlement_cache`, `webhook_events`.

### 4.3 Full Inventory of Package.json Scripts
| Script Name | Command | Purpose / Scope |
|---|---|---|
| `dev` | `pnpm --parallel ... dev` | Concurrent dev servers for web (5173) and worker (8789). |
| `build` | `pnpm --filter @sovereign/web build && pnpm --filter @sovereign/worker build` | Compiles web assets via Vite and dry-run validates Worker via Wrangler. |
| `typecheck` | `pnpm -r typecheck` | Runs `tsc --noEmit` across all 5 workspace projects. |
| `test` | `pnpm -r test` | Runs vitest across all workspace packages. |
| `lint` | `pnpm -r lint` | Runs `tsc --noEmit` linter across workspaces. |
| `verify:foundation` | `node scripts/verify-foundation.mjs` | Gate verifier for required files, JSON validity, and D1 core tables. |
| `validate:ui` | `node .agents/skills/ui-contract-validator.mjs` | Validates UI contracts against authoritative specifications. |
| `verify:migrations` | `node scripts/validate-migrations.mjs && ...` | Validates D1 migration syntax and upgrade integrity. |
| `scan:secrets` | `node scripts/scan-secrets.mjs` | Scans for leaked keys, tokens, or credentials. |
| `scan:production-fixtures` | `node scripts/scan-production-fixtures.mjs` | Scans fixtures for production data leaks. |
| `verify:production-release` | `node scripts/verify-production-release-v3.mjs ...` | Checks release readiness and production configuration. |
| `verify:live-visual-release` | `node scripts/verify-live-visual-release-v3.mjs` | Runs visual release diagnostics. |
| `verify:cloudflare-build` | `node scripts/cloudflare-build-diagnostics.mjs` | Validates Cloudflare build bundle size and environment bindings. |
| `production:release:text` | `node scripts/assert-main-release.mjs ...` | Verified Cloudflare production deployment pipeline. |

---

## 5. Exact Structure for React Landing Page Parity

To achieve 100% visual, typographic, and functional parity with the Framer landing page while respecting `AGENTS.md` and `docs/product-language-system.md`, the landing page inside `apps/web/src/App.tsx` (or imported subcomponents) must adhere to the following structure:

### 5.1 Structural Composition
```
App
 ├── Header (Sticky navigation, logo, links, Sign In, Build Your Baseline CTA)
 └── Landing (id="top", background: #000000/#050505, typography: Inter & JetBrains Mono)
      ├── 1. HeroSection
      │    ├── Kicker: "PERSONAL AI FOR REAL LIFE" (Monospace/caps badge, sage pulse)
      │    ├── Headline: "Healing isn’t optional. Holding onto the pain is."
      │    ├── Subtitle: 2-sentence un-hackable personal AI description
      │    ├── Action Group: "Build your Baseline" (primary) + "How it works" (secondary)
      │    └── Trust Subtext: "Start free · No card required · Review, correct, or reject any interpretation"
      │
      ├── 2. SovereignAnswerPreview (Authentic Terminal/Chat Intake)
      │    ├── Inquiry Question: "Why do I keep overthinking what to say when I feel misunderstood?"
      │    ├── Baseline Status Badge: "BASELINE GROUNDED"
      │    ├── Section 1: "WHAT YOU MAY BE BRINGING"
      │    ├── Section 2: "WHAT THEY MAY BE BRINGING"
      │    ├── Section 3: "WHAT HAPPENS BETWEEN YOU"
      │    └── Sources & Correction Footer:
      │         ├── "See source details" (collapsed disclosure showing approved Sources)
      │         └── "Correct, adjust, or reject this interpretation at any time."
      │
      ├── 3. ThreeLayerScopeSection (The Architecture of Sovereign)
      │    ├── Scope Progression Header: "Start with yourself. Expand outward when it matters."
      │    ├── Layer 01 · YOU: Self-exploration, decisions, pressure responses, creative rhythms
      │    ├── Layer 02 · YOU + YOUR PEOPLE: Relational intelligence, 1:1 dynamics without collapsing perspectives
      │    └── Layer 03 · FROM 1:1 TO THE WHOLE SYSTEM: System dynamics, multi-participant teams & families
      │
      ├── 4. InteractiveDemonstrationSection
      │    ├── Canonical Inquiries Accordion (`Accordion.tsx`)
      │    ├── Relational Inquiry Demo (`RelationalInquiryDemo.tsx`)
      │    └── System Dynamic Visualizer (`SystemDynamicDemo.tsx`)
      │
      ├── 5. ComparisonSection
      │    ├── Headline: "Most AI starts with the prompt. Sovereign starts with you."
      │    ├── Left Card: Generic AI Chatbots (context pasting, surface advice, no structural memory)
      │    └── Right Card: Sovereign.OS (grounded baseline, structured answers, non-coercive patterns)
      │
      ├── 6. PricingSurfaceSection
      │    ├── Headline: "Simple, transparent access."
      │    ├── Standard Tier: Free ($0) — Private baseline, Today surface, 10 AI turns/mo
      │    └── Sovereign+ Tier: $20/mo — Relational intelligence, systems mapping, 300 AI turns/mo
      │
      ├── 7. FinalCtaSection
      │    ├── Glyph: SovereignMark (32px)
      │    ├── Headline: "Know yourself. Understand your people. See the whole system."
      │    └── CTA: "Build your Baseline" -> routes to `/signup`
      │
      └── Footer (SovereignMark, Terms, Privacy, Pricing, FAQ, copyright)
```

### 5.2 Mandatory Copy Rules (Preventing Regressions)
- **Do NOT use retired phrases:**
  - `Understand both sides and what happens between you.`
  - `Example Basis` or raw `Basis` (use **`Sources`** or **`See source details`**).
  - `server-approved Basis`, `permitted context`, `consented people`, `permitted perspectives`, `confirmed responsibilities`.
  - `One private reference beneath every question.`
  - `One private foundation.`
  - `Separate helping from carrying the outcome.`
  - `See where responsibility keeps landing.`
- **Do NOT expose internal implementation jargon:**
  - No `model-safe context`, `basis_id`, `provider`, `sovereign-answer.v2` label, `confidence classes`, or `API tokens`.
- **Preserve exact Public Support assertions in `PublicSupport.test.ts`:**
  - Support URL must remain: `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`
  - Must state: "Separate from subscriptions", "Support is voluntary and does not change Free or Sovereign+ access", "one-time amount from $1".
  - Forbid: `$10 suggested`, `$25 suggested`, `$1–$1,000`, `$5–$500`.

### 5.3 Non-Regression Guarantees
1. **Preserve `apps/web/src/App.tsx` Path:** `scripts/verify-foundation.mjs` checks `stat('apps/web/src/App.tsx')`. The file must exist at that path.
2. **Preserve Route Names & Navigation:** All routes (`/`, `/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`) must remain functional.
3. **Preserve Baseline & Auth Flows:** 
   - `requestSignup`, `requestLogin`, `redeemAuth` must connect to their API endpoints.
   - `Onboarding` component must preserve the exact Baseline calculation polling cycle and plan selection logic.
   - `Workspace` component must preserve `sendThreadMessage` with idempotency keys and error handling.

---

## 6. Recommendations & Implementation Plan for Phase 2

1. **Step 1: Font Assets Integration**
   - Add Inter and JetBrains Mono links to `apps/web/index.html`.
   - Add `@theme` / `:root` font variables in `apps/web/src/styles.css` defining `--font-sans: 'Inter', ...` and `--font-mono: 'JetBrains Mono', ...`.
2. **Step 2: Component Decomposition / Modularization**
   - To keep `App.tsx` maintainable without violating `verify:foundation` (which requires `App.tsx` to exist and export the root component), create clean subcomponents under `apps/web/src/components/landing/`:
     - `HeroSection.tsx`
     - `SovereignAnswerPreview.tsx`
     - `ThreeLayerScopeSection.tsx`
     - `ComparisonSection.tsx`
     - `PricingSection.tsx`
     - `FinalCtaSection.tsx`
   - Import and render these inside `Landing()` in `App.tsx`.
3. **Step 3: Verification & Visual Smoke Testing**
   - Run `pnpm typecheck` to ensure strict TypeScript compliance.
   - Run `pnpm test` to ensure `PublicSupport.test.ts` and worker tests pass with 0 errors.
   - Run `pnpm verify:foundation` to confirm foundation rules hold.
   - Run `pnpm build` to verify clean bundle generation for both client and worker.
   - Execute multi-viewport check (`1440x900` desktop, `390x844` mobile) to confirm responsive layout stability.

---
*Report compiled autonomously by Explorer 2.*
