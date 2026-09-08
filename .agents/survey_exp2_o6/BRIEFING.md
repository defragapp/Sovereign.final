# BRIEFING — 2026-09-07T22:28:00Z

## Mission
Inspect the React codebase in apps/web, compare against Framer reference (https://slight-use-623506.framer.app/), and provide detailed recommendations for exact visual parity while preserving all production functionality (Passkey, SovereignThread, Stripe, product language laws).

## 🔒 My Identity
- Archetype: explorer
- Roles: survey, analysis, synthesis
- Working directory: /Users/cjo/Sovereign.final/.agents/survey_exp2_o6
- Original parent: c59f2538-c87d-4651-a198-e703d8d36889
- Milestone: survey_exp2_o6

## 🔒 Key Constraints
- Read-only investigation — do NOT modify production code (only write to our own agent directory)
- Sovereign product language laws (docs/product-language-system.md, AGENTS.md): No internal terms ("Basis", "model-safe context", "sovereign-answer.v2"), no fake metrics, near-black foundation, warm typography, restrained sage accent
- Preserve protected production paths: Passkey authentication, SovereignThread chat workspace, Stripe billing webhooks/safety
- Output 5-component handoff report (Observation, Logic Chain, Caveats, Conclusion, Verification Method) in handoff.md

## Current Parent
- Conversation ID: c59f2538-c87d-4651-a198-e703d8d36889
- Updated: 2026-09-07T22:28:00Z

## Investigation State
- **Explored paths**:
  - `https://slight-use-623506.framer.app/` (downloaded full HTML and JS modules)
  - `apps/web/package.json`
  - `apps/web/src/PublicLanding.v2.tsx`, `App.tsx`, `main.tsx`
  - `apps/web/src/tokens.css`, `design-system.css`, `styles.css`, `public.css`, `workspace.css`
  - `apps/web/src/components/fragments/` (`BaselineViewFragment.tsx`, `ExpressionViewFragment.tsx`, `SystemMapViewFragment.tsx`)
  - `apps/web/src/components/chat/` (`SovereignThread.tsx`, `SovereignThread.test.ts`)
  - `apps/web/src/PasskeyAuthentication.tsx`
  - `apps/web/public/` (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`, `tokens.css`)
  - Verification scripts: `verify-challenger-1-frontend.mjs`, `ui-contract-validator.mjs`, `verify-foundation.mjs`, `cloudflare-build-diagnostics.mjs`
- **Key findings**:
  - Framer reference features 11 distinct sections: Navigation, Hero, Why Sovereign (3 Pillars), How Sovereign Works (3 Steps), The Intelligence (Conversational & Interface Showcase), Recognition (3 Quotes), Start With Yourself (CTA block), FAQ (6 items), Pre-footer Banner, and Footer.
  - Current React app renders `PublicLanding.v2.tsx` at `/`, but contains deltas in copy length, missing the embedded FAQ accordion and the 3-quote "Recognition" section.
  - `scripts/verify-challenger-1-frontend.mjs` strictly requires `<BaselineViewFragment` inside `V2Hero()`, which must be preserved.
  - `LandingParity.test.ts` validates string literals in `App.tsx` directly; therefore, `App.tsx` guarded tests must remain intact.
  - All gates (`typecheck`, `test`, `build`, `verify:foundation`, `validate:ui`, `verify:cloudflare-build`) pass cleanly.
- **Unexplored areas**: None; all required areas surveyed and documented.

## Key Decisions Made
- Fully documented all 9 section deltas and provided exact component mapping in handoff.md.
- Reconciled visual layout requirements with strict automated repo gates (Challenger-1, UI validator, Language Law).

## Artifact Index
- /Users/cjo/Sovereign.final/.agents/survey_exp2_o6/handoff.md — Final comprehensive survey and integration report
- /Users/cjo/Sovereign.final/.agents/survey_exp2_o6/progress.md — Heartbeat progress log
- /Users/cjo/Sovereign.final/.agents/survey_exp2_o6/DISPATCH.md — Dispatch record
- /Users/cjo/Sovereign.final/.agents/survey_exp2_o6/framer_reference.html — Full 711KB Framer reference HTML
