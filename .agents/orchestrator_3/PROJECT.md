# Project: Sovereign UI Simplification and Route Verification

## Architecture
- Client application: React + Vite SPA in `apps/web` with custom client-side router (`currentRoute`, `go`) in `apps/web/src/App.tsx`.
- Styling: Tailwind CSS v4 in `apps/web/src/styles.css` with industrial monochromatic design system (#000000/#050505 foundation, 1px subtle white borders, Inter & JetBrains Mono, restrained sage accent `#9fbaa1`, zero glassmorphism / `backdrop-blur`).
- Edge routing: Cloudflare Worker in `apps/worker/src/runtime-entry.ts` routing between `sovereign.defrag.app` and `app.defrag.app`.
- Test suites: Vitest in `apps/web` (`LandingParity.test.ts`, `PublicSupport.test.ts`) and `apps/worker`, plus release diagnostics in `scripts/cloudflare-build-diagnostics.mjs`.

## Code Layout
- `apps/web/src/App.tsx`: Main application router, Landing, InfoPage, Pricing, FAQ, LegalPage, Auth, Redeem, Onboarding, and Workspace components.
- `apps/web/src/styles.css`: Global styles, typography tokens, animation keyframes.
- `apps/web/src/components/IridescentLoader.tsx`: Interactive AI inference loader component.
- `apps/web/src/LandingParity.test.ts`: Parity and negative terminology regression assertions.
- `apps/web/src/RouteIntegrity.test.ts`: Dedicated route and flow integrity test suite.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | Spacing Hierarchy & Card Padding Refinement | Refine padding on Three-Layer Scope cards and Pricing cards from `p-8` to `p-6 sm:p-8` for optimal 390px mobile line length. | M1 | survey_explorer_1 |
| 2 | Mobile Demo Terminal Header Overflow Fix | Prevent left/right collision in `#demo` terminal top bar at 390px width. | M1 | survey_explorer_1 |
| 3 | Hero Headline Responsive Scaling | Adjust `h1` sizing to `text-3xl sm:text-6xl md:text-7xl` to prevent awkward 4-line wrapping on narrow viewports. | M1 | survey_explorer_1 |
| 4 | Mobile Workspace Tab Scrollbar Hygiene | Hide mobile horizontal scrollbar on workspace navigation rail. | M1 | survey_explorer_1 |
| 5 | Public Copy Plain-Language Simplification | Simplify unguarded technical jargon (`THREE-LAYER ARCHITECTURE`, `AUTHENTICATED DEMONSTRATION`, etc.) to plain user-centric descriptions. | M1 | survey_explorer_1 |
| 6 | Strict Terminology & Glassmorphism Negative Audit | Enforce zero forbidden terms (`sovereign-answer.v2`, `Basis ID`, `model-safe context`, `authority`) and zero `backdrop-blur`. | M1 | survey_spec_miner_1 |
| 7 | Trailing Slash Route Normalization | Normalize route paths in `currentRoute()` to prevent trailing slash drops to `/`. | M2 | survey_explorer_2 |
| 8 | Un-orphan `/how-it-works` Navigation | Add `/how-it-works` link to `<Header />` and `<footer />` for direct user accessibility. | M2 | survey_explorer_2 |
| 9 | Auth Screen Mode Switcher | Add toggle link in `<Auth />` to switch seamlessly between `/login` and `/signup`. | M2 | survey_explorer_2 |
| 10 | Mobile Workspace Sign-Out Access | Ensure authenticated users on 390px mobile viewports can sign out from `/app`. | M2 | survey_explorer_2 |
| 11 | Mobile Header Navigation Access | Provide accessible navigation on mobile landing viewports to access sections, pricing, and how-it-works. | M2 | survey_explorer_2 |
| 12 | 10 Route Flow Verification & Integration Tests | Create comprehensive route integrity tests for all 10 application routes. | M3 | survey_explorer_2 |
| 13 | Release Gate & Contract Compliance | Verify zero regressions across `pnpm test`, `pnpm typecheck`, `pnpm verify:foundation`, and `pnpm verify:cloudflare-build`. | M3 | survey_spec_miner_1 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | UI Simplification & Route Flow Implementation | Features 1-11: Spacing, card padding, terminal overflow, hero scaling, plain copy, route normalization, header/footer links, auth toggle, mobile sign-out, mobile navigation in `App.tsx` and `styles.css`. | Survey | IN_PROGRESS |
| M2 | Route Flow Integrity Test Suite | Feature 12: Dedicated route tests (`RouteIntegrity.test.ts`) covering all 10 routes and edge cases. | M1 | PLANNED |
| M3 | Comprehensive Review, Challenge, & Forensic Audit | Feature 13: 2x Reviewers, 2x Challengers, Forensic Auditor, full test suite, typecheck, verify:foundation, verify:cloudflare-build (24 stages). | M2 | PLANNED |

## Interface Contracts
### `currentRoute()` Router Contract
- Input: `window.location.pathname` (normalized: strip trailing slashes, handle `/auth/redeem/*`).
- Output: Exact `Route` union matching one of 11 valid paths (`/`, `/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`).
- Fallback: Defaults to `'/'` only for unrecognized paths.

### Visual Styling Contract
- Background: Near-black foundation (`#000000` / `#050505` / `#09090b`).
- Borders: 1px subtle borders (`rgba(255, 255, 255, 0.08)` / `border-white/[0.08]`).
- Typography: Inter (body) & JetBrains Mono (code/labels).
- Accents: Restrained sage (`#9fbaa1`).
- Forbidden: Zero `backdrop-blur`, zero `bg-gradient-to-*`, zero `animate-spin-slow`, zero `neon-glow`, zero `var(--bronze-accent)`.
