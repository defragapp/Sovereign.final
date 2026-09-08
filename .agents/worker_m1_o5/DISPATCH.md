# Dispatch for Worker M1: Frontend Design System & Real Product UI Fragments (R1 & R2)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/worker_m1_o5/`

## Role & Objectives
Implement Milestone 1: Requirements R1 and R2.
1. Create high-fidelity presentation UI fragments in `apps/web/src/components/fragments/`:
   - `BaselineViewFragment.tsx`: Mock context vectors with percentage weights and descriptors.
   - `ExpressionViewFragment.tsx`: Textual contrast between raw query input and Sovereign contextual breakdown panel.
   - `SystemMapViewFragment.tsx`: Compact SVG/CSS multi-party relationship vector node diagram (zero console errors).
   - Purely presentational, zero API calls, zero real user data.
2. Update `apps/web/src/PublicLanding.v2.tsx`:
   - Atmospheric glass borders (`border-white/10` base, `hover:border-white/20`).
   - Hero headline scale increased by ~25% with expanded line-height (`leading-[1.12]`), hosted in `max-w-5xl mx-auto`.
   - Place a compact `BaselineViewFragment` preview card above the fold in the hero stage.
   - Replace generic 1-2-3 cards with the three conceptual pillars:
     - **SELF — Your Baseline**
     - **BETWEEN — Your Relationships**
     - **WHOLE — Your Systems**
     Grounded in `docs/product-language-system.md`.
   - Implement the vertical scroll expansion sequence:
     `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`
     embedding `BaselineViewFragment` at `BASELINE`, `ExpressionViewFragment` at `EXPRESSION`, and `SystemMapViewFragment` at `SYSTEMS`.
3. Unify static HTML pages styling in `apps/web/public/`:
   - Create `apps/web/public/tokens.css` with authoritative CSS variables (`--sov-page: #000000;`, `--platform-bg: #000000;`, `--sov-sage: #9fbaa1;`, etc., and compatibility aliases).
   - Link `/tokens.css` in the `<head>` of `pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, and `404.html`.
   - DO NOT alter or remove any Stripe donation links or support text checked by `PublicSupport.test.ts`.
4. Protected File Rule:
   - `apps/web/src/App.tsx` must NOT contain `backdrop-blur` (preserves `LandingParity.test.ts`).

## Exclusive Write Ownership
- `apps/web/src/components/fragments/BaselineViewFragment.tsx`
- `apps/web/src/components/fragments/ExpressionViewFragment.tsx`
- `apps/web/src/components/fragments/SystemMapViewFragment.tsx`
- `apps/web/src/PublicLanding.v2.tsx`
- `apps/web/public/tokens.css`
- `apps/web/public/pricing.html`
- `apps/web/public/faq.html`
- `apps/web/public/how-it-works.html`
- `apps/web/public/consent.html`
- `apps/web/public/404.html`

## Mandatory Reading Before Starting Work
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/.agents/survey_exp1_o5/handoff.md`
4. `/Users/cjo/Sovereign.final/AGENTS.md`
5. `/Users/cjo/Sovereign.final/docs/product-language-system.md`

## Mandatory Verification
After implementing changes:
1. `pnpm typecheck` must exit 0
2. `pnpm test` must exit 0 (especially `LandingParity.test.ts` and `PublicSupport.test.ts`)
3. `pnpm validate:ui` must exit 0
4. `pnpm build` must exit 0
5. `pnpm verify:foundation` must exit 0

## Deliverable
Write a complete completion report to `/Users/cjo/Sovereign.final/.agents/worker_m1_o5/handoff.md` including files modified, verification command outputs, and notify the orchestrator via send_message.

## 2026-09-07T21:30:50Z
You are Worker M1 (Frontend Design System & Real Product UI Fragments: R1 & R2).
Your working directory is /Users/cjo/Sovereign.final/.agents/worker_m1_o5/.
Read your detailed task description in /Users/cjo/Sovereign.final/.agents/worker_m1_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/PROJECT.md, /Users/cjo/Sovereign.final/.agents/survey_exp1_o5/handoff.md, /Users/cjo/Sovereign.final/AGENTS.md, and /Users/cjo/Sovereign.final/docs/product-language-system.md.

