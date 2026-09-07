## 2026-09-07T15:41:30Z

You are a Senior Frontend Worker for the Sovereign UI Simplification and Route Verification project.
Your working directory is: /Users/cjo/Sovereign.final/.agents/worker_m1_1
Your parent is the Project Orchestrator (conversation ID: 428716aa-5ea4-415f-b004-15b10aefd9af).

MANDATORY FIRST STEP: Read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md.

Read the authoritative survey reports:
- /Users/cjo/Sovereign.final/.agents/survey_explorer_1/survey_report.md
- /Users/cjo/Sovereign.final/.agents/survey_explorer_2/survey_report.md
- /Users/cjo/Sovereign.final/.agents/survey_spec_miner_1/spec_report.md
- /Users/cjo/Sovereign.final/.agents/orchestrator_3/PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You exclusively own:
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/components/IridescentLoader.tsx

Tasks for Milestone 1:
1. Spacing & Card Padding:
   - In apps/web/src/App.tsx, change Three-Layer Scope card padding (lines ~367, 391, 415) and Pricing card padding (lines ~689, 714) from fixed 'p-8' to responsive 'p-6 sm:p-8' to optimize readability on mobile (390px).
2. Hero Headline Scaling:
   - In App.tsx:281, adjust h1 size to 'text-3xl sm:text-6xl md:text-7xl' to avoid awkward 4-line wrapping on narrow mobile screens (<375px).
3. Demo Terminal Header Overflow:
   - In App.tsx:460-471, ensure the left header elements in #demo terminal do not collide with the 'BASELINE GROUNDED' badge at 390px width. Make the path text responsive or truncated on mobile ('truncate max-w-[120px] sm:max-w-none' or 'hidden sm:inline').
4. Workspace Tab Scrollbar:
   - In App.tsx:1424, add '[&::-webkit-scrollbar]:hidden' to the tab navigation rail so no browser scrollbar track appears on mobile.
5. Plain-Language Copy Simplification:
   - Replace unguarded developer/theological jargon with plain, direct user-centric descriptions:
     - 'THREE-LAYER ARCHITECTURE' -> 'THREE LAYERS OF UNDERSTANDING'
     - 'AUTHENTICATED DEMONSTRATION · RELATIONAL INTELLIGENCE' -> 'INTERACTIVE PREVIEW · RELATIONAL CLARITY'
     - 'Sovereign Intelligence Workspace' -> 'See how a conversation is understood'
     - '2 Baselines Permitted' -> 'Comparing 2 private Baselines'
     - 'EXPLORE CANONICAL INQUIRIES' -> 'EXPLORE COMMON SITUATIONS'
     - 'Has no structural memory of your operating mechanics.' -> 'Has no memory of how you naturally operate.'
   CRITICAL: Do NOT modify any guarded test strings in LandingParity.test.ts (e.g., 'PERSONAL AI FOR REAL LIFE', 'Healing isn’t optional.<br />\n Holding onto the pain is.', '01 · YOU', '02 · YOU + YOUR PEOPLE', '03 · FROM 1:1 TO THE WHOLE SYSTEM', accordion questions, trust line, etc.).
6. Strict Negative Terminology & Glassmorphism Check:
   - Ensure ZERO instances of 'sovereign-answer.v2', 'Basis ID', 'model-safe context', 'authority'.
   - Ensure ZERO instances of 'backdrop-blur', 'bg-gradient-to-*', 'var(--bronze-accent)'.
7. Route Path Normalization:
   - In currentRoute() (App.tsx:67-84), normalize window.location.pathname by stripping trailing slashes (e.g., path !== '/' ? path.replace(/\/+$/, '') : '/') so that paths like '/pricing/' or '/app/' map to their known routes instead of falling back to '/'.
8. Un-orphan '/how-it-works':
   - In <Header /> (App.tsx:180-185), add navigation item for 'How it Works' calling go('/how-it-works').
   - In <footer> (App.tsx:779-784), add 'How it Works' button calling go('/how-it-works').
9. Auth Switcher:
   - In <Auth /> (App.tsx:795-964), add a toggle link between login and signup modes so users on /login can switch to /signup and vice versa.
10. Mobile Workspace Sign-out:
    - In <Workspace /> (App.tsx), make the logout action accessible on mobile viewports so authenticated users on 390px screens can sign out.
11. Mobile Header Navigation:
    - In <Header /> (App.tsx), add a clean, restrained mobile navigation menu/toggle button so mobile users can navigate to sections, How it Works, and Pricing.
12. IridescentLoader Clean-up:
    - In apps/web/src/components/IridescentLoader.tsx, replace dynamic template literal classnames ('gap-${isCompact ? '2' : '3'}', etc.) with explicit static ternary expressions.

Verification:
Execute:
- pnpm test
- pnpm typecheck
- pnpm verify:foundation
- node .agents/skills/ui-contract-validator.mjs
All must pass with 0 errors.

Output Requirements:
- Write implementation report to /Users/cjo/Sovereign.final/.agents/worker_m1_1/implementation_report.md.
- Write structured handoff report to /Users/cjo/Sovereign.final/.agents/worker_m1_1/handoff.md.
- Send a message to your parent (conversation ID: 428716aa-5ea4-415f-b004-15b10aefd9af) notifying completion.
