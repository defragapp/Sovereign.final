## 2026-09-07T15:51:53Z
You are worker_m1_2 assigned to Milestone 1: UI Simplification & Route Flow Implementation for the Sovereign project.

Working directory: /Users/cjo/Sovereign.final/.agents/worker_m1_2
Repository root: /Users/cjo/Sovereign.final
Target files owned exclusively:
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/components/IridescentLoader.tsx

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY READING:
Before making any changes, you MUST read:
1. /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
2. /Users/cjo/Sovereign.final/.agents/orchestrator_4/PROJECT.md
3. /Users/cjo/Sovereign.final/.agents/survey_explorer_1/survey_report.md
4. /Users/cjo/Sovereign.final/.agents/survey_explorer_2/survey_report.md
5. /Users/cjo/Sovereign.final/.agents/survey_spec_miner_1/spec_report.md

TASKS TO IMPLEMENT (Features 1-11 + code hygiene):
1. Spacing & Card Padding: Refine padding on Three-Layer Scope cards and Pricing cards from `p-8` to `p-6 sm:p-8` for optimal 390px mobile line length.
2. Mobile Demo Terminal Header Overflow: In the `#demo` interactive demonstration terminal header, prevent left/right collision between the path label and status pill at 390px width (e.g. truncate or responsive max-width on path label, ensuring `flex-nowrap` doesn't clip or overlap the badge).
3. Hero Headline Responsive Scaling: Adjust `h1` sizing to `text-3xl sm:text-6xl md:text-7xl` (or responsive clamp) to avoid awkward 4-line wrapping on narrow mobile viewports.
4. Mobile Workspace Tab Scrollbar Hygiene: In `<Workspace />`, hide the mobile horizontal scrollbar on the navigation rail (`[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`).
5. Public Copy Plain-Language Simplification: Simplify unguarded technical jargon to plain, user-centric descriptions:
   - "THREE-LAYER ARCHITECTURE" -> "THREE LAYERS OF UNDERSTANDING"
   - "AUTHENTICATED DEMONSTRATION · RELATIONAL INTELLIGENCE" -> "INTERACTIVE PREVIEW · RELATIONAL CLARITY"
   - "2 Baselines Permitted" -> "Comparing 2 private Baselines"
   - "EXPLORE CANONICAL INQUIRIES" -> "EXPLORE REAL SITUATIONS"
   - "Has no structural memory of your operating mechanics." -> "Has no memory of how you naturally operate."
   CRITICAL: DO NOT change any guarded copy asserted in `LandingParity.test.ts` (e.g. "PERSONAL AI FOR REAL LIFE", "Healing isn’t optional...", "01 · YOU", "02 · YOU + YOUR PEOPLE", "03 · FROM 1:1 TO THE WHOLE SYSTEM", "WHAT YOU MAY BE BRINGING", "WHAT THEY MAY BE BRINGING", "WHAT HAPPENS BETWEEN YOU", "See source details", "These are the source values Sovereign used for this answer.", "What is active for you now?", "placeholder=\"Ask Sovereign…\"", "how pressure moves", "https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02", "Support Sovereign.OS from $1.", etc.).
6. Strict Terminology & Glassmorphism Negative Compliance: Ensure ZERO prohibited terms (`sovereign-answer.v2`, `Basis ID`, `model-safe context`, `model context`, `server-approved`, `authority`, `What is Basis?`) and ZERO `backdrop-blur` / `backdrop-filter` or `var(--bronze-accent)` in active user-facing code.
7. Trailing Slash Route Normalization: In `currentRoute()` in `App.tsx`, normalize route paths (strip trailing slashes, e.g. `(path.replace(/\/+$/, '') || '/')`) before matching against known routes, so `/pricing/` or `/how-it-works/` resolves cleanly instead of falling back to `/`.
8. Un-orphan `/how-it-works`: Add `/how-it-works` navigation link to `<Header />` and `<footer />` for direct user accessibility.
9. Auth Screen Mode Switcher: In `<Auth />`, add a toggle link between `/login` and `/signup` ("Don't have an account? Sign up" on login mode; "Already have an account? Sign in" on signup mode).
10. Mobile Workspace Sign-Out Access: In `<Workspace />`, ensure authenticated users on mobile (390px) viewports can sign out from `/app` (not hidden behind `hidden md:block`).
11. Mobile Header Navigation Access: Provide accessible navigation on mobile landing viewports to access sections, pricing, how-it-works, and FAQ.
12. IridescentLoader Hygiene: In `apps/web/src/components/IridescentLoader.tsx`, replace dynamic Tailwind class string interpolations with explicit static ternaries (e.g. `isCompact ? 'gap-2' : 'gap-3'`, `isCompact ? 'text-[10px]' : 'text-[11px]'`).

VERIFICATION REQUIREMENTS:
You must run the following verification commands and ensure 100% success:
1. `pnpm --filter web test` (must pass 12/12)
2. `pnpm typecheck` (zero TypeScript errors)
3. `pnpm verify:foundation` (zero errors)
4. `node .agents/skills/ui-contract-validator.mjs` (zero forbidden tokens)
