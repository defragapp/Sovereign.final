# Scope: Sovereign.OS Framer Template Integration & Exact Visual Parity

## Architecture
- **Presentation Tier (`apps/web/src`)**:
  - `PublicLanding.v2.tsx`: Primary landing page layout re-architected to mirror the Framer template (`https://slight-use-623506.framer.app/`):
    - Floating navigation capsule (`max-width: 1240px`, border-radius 22px, `Gambarino` wordmark, links, `Enter Sovereign.OS` CTA).
    - Hero stage: Ambient concentric gradient circles, H1 headline in `Gambarino` 64px, kicker pill with breathing dot, subhead in `Onest`, primary laser CTA and secondary pill CTA, retaining `<BaselineViewFragment>` in the hero to satisfy `verify-challenger-1-frontend.mjs`.
    - About section ("The Sovereign View"): Thesis quote, Three Conceptual Pillars (01 SELF, 02 BETWEEN, 03 WHOLE).
    - Impact section: 3-step progression cards (01 YOU, 02 YOUR PEOPLE, 03 YOUR SYSTEMS).
    - Process section ("The Intelligence"): Interactive chat preview fragment, contextual breakdown tags.
    - Recognition section: 3 quote cards (SELF, PEOPLE, SYSTEMS).
    - Showcase section ("Your understanding should grow with you"): Two Baselines, Relationship context, Family system cards.
    - Conversion stage ("Start With Yourself"): Gradient stage card with CTA.
    - FAQ section: 2-column accordion with 6 canonical Sovereign.OS questions and answers.
    - Footer: Nav links, social links, copyright.
  - `tokens.css` & `public.css`:
    - Palette tokens: canvas `#0a0a0a`, surface `#171717`, border `#262626` / `rgba(250, 250, 250, 0.05)`, text `#fafafa` and `#a3a3a3`.
    - Conic laser beam animation keyframes and classes for the primary CTA button.
    - Ambient glow keyframes and glass styling using CSS variables (strictly avoiding literal `backdrop-blur` Tailwind class in `App.tsx`).
  - `App.tsx`:
    - Preserves all 10 non-landing route literals (`/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`).
    - Preserves Passkey authentication modal and flow.
    - Preserves support link (`https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`).
  - `components/chat/SovereignThread.tsx`:
    - Preserved in full, maintaining auto-resize textarea, three-block message structure, collapsible Sources drawer (never "Basis"), and SSE streaming.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Floating Nav Capsule | Fixed pill navigation with wordmark, links (Explore, How It Works, FAQ), and CTA button | M1 | Framer Survey |
| 2 | Hero Stage & Ambient Rings | Concentric glowing rings, Gambarino 64px H1, kicker pill, subhead, dual CTAs | M1 | Framer Survey |
| 3 | Hero Baseline Fragment Anchor | Retain `<BaselineViewFragment>` inside `V2Hero` to satisfy `verify-challenger-1-frontend.mjs` | M1 | Survey Exp 2 |
| 4 | About & Three Pillars | Thesis quote + 3 pillars (SELF — Baseline, BETWEEN — Relationships, WHOLE — Systems) | M1 | Framer Survey |
| 5 | Progression Section | 3 progression cards (01 — YOU, 02 — YOUR PEOPLE, 03 — YOUR SYSTEMS) | M1 | Framer Survey |
| 6 | The Intelligence Process | Chat intake preview with contextual breakdown tags | M1 | Framer Survey |
| 7 | Recognition Quotes | 3 recognition cards for SELF, PEOPLE, SYSTEMS | M1 | Framer Survey |
| 8 | Showcase Cards | Two Baselines, Relationship context, Family system cards | M1 | Framer Survey |
| 9 | Conversion Stage | Large dark-gradient card with "Start With Yourself" CTA | M1 | Framer Survey |
| 10 | 2-Column FAQ Accordion | 6 canonical Sovereign.OS Q&As in interactive accordion | M1 | Framer Survey |
| 11 | Footer | Links, social icons, and copyright | M1 | Framer Survey |
| 12 | Laser Conic CTA Animation | Rotating iridescent conic gradient border on primary button | M1 | Framer Survey |
| 13 | Responsive & Zero Overflow | Exact 0.0px horizontal overflow at 1440x900 and 390x844 viewports | M1 | Spec Miner |
| 14 | Preserved Auth & Chat Logic | PasskeyAuthentication, SovereignThread, Stripe billing completely intact | M1 | ORIGINAL_REQUEST §R3 |
| 15 | Language Laws & Invariants | Zero occurrences of "Basis", "sovereign-answer.v2", or forbidden phrases | M1 | AGENTS.md & Spec Miner |
| 16 | Five Verification Gates | typecheck, build, test, verify:foundation, verify:cloudflare-build green | M2 | Spec Miner |
| 17 | Multi-Agent Review & Challenge | Independent Reviewers, Challengers, and Forensic Auditor verification | M2 | Orchestration Pattern |
| 18 | Production Release | Deploy via `pnpm production:release:text` and verify live SHA parity | M3 | sovereign-production-release |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Framer Template Implementation & Visual Integration | Integrate Framer sections, layout, typography, animations, tokens, and FAQ in `PublicLanding.v2.tsx` and CSS | Survey | IN_PROGRESS |
| M2 | Multi-Agent Review, Stress Challenge & Forensic Audit | Reviewers, Challengers (visual QA overflow 0px), and Forensic Auditor | M1 | PLANNED |
| M3 | Release Verification & Cloudflare Deployment | Full gate tests, `pnpm production:release:text`, and live edge readiness check | M2 | PLANNED |

## Code Layout & File Boundaries
- **Worker File Ownership**:
  - `apps/web/src/PublicLanding.v2.tsx` (primary landing implementation)
  - `apps/web/src/public.css` or `apps/web/src/tokens.css` or `apps/web/src/design-system.css` (Framer visual tokens, laser button, animations)
  - `apps/web/src/components/fragments/` (any fragment styling adjustments)
- **Protected / Read-Only Files**:
  - `apps/web/src/App.tsx`: Must preserve all route literals and zero `backdrop-blur`.
  - `apps/web/src/components/chat/SovereignThread.tsx`: Must preserve chat thread logic.
  - `apps/web/src/PasskeyAuthentication.tsx`: Must preserve passkey authentication flow.
  - `apps/sovereign-worker/`: Backend routes and migrations remain unchanged.
