## 2026-09-07T08:03:05Z

You are Worker 2 for Milestone 2 (React Codebase Production Parity).
Your working directory is: /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_m2
Your parent conversation ID is: c76c6f5b-d8e4-45b7-af63-a75188c0ed34
Read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md before starting.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File ownership:
You exclusively own edits in:
- /Users/cjo/Sovereign.final/apps/web/index.html
- /Users/cjo/Sovereign.final/apps/web/src/styles.css
- /Users/cjo/Sovereign.final/apps/web/src/App.tsx and components under /Users/cjo/Sovereign.final/apps/web/src/
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_m2/

Reference files:
- /Users/cjo/Sovereign.final/PROJECT.md
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_1/report.md (Authoritative copy and prohibited terms)
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_2/report.md (React architecture, routing, and tests)
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_m1/handoff.md (Framer implementation and verified copy)
- Live published Framer site: https://nice-pluto-305324.framer.app

Your mission:
1. Typography Integration:
   - In apps/web/index.html, add preconnect and Google Fonts stylesheet links for:
     - Inter (weights 400, 500, 600, 700)
     - JetBrains Mono (weights 400, 500, 600)
   - In apps/web/src/styles.css, update font variables:
     --sans-primary to prioritize "Inter"
     --font-mono to prioritize "JetBrains Mono"
2. Visual Hierarchy & Copy Parity in apps/web/src/App.tsx:
   - High-contrast industrial monochromatic foundation (#000000 canvas, #050505 / #0c0c0e surfaces, sharp 1px borders rgba(255,255,255,0.08), restrained sage accent #9fbaa1).
   - Top Navigation: brand "Sovereign.OS", navigation links "01 · You", "02 · You + Your People", "03 · Whole System", "Pricing", CTAs "Sign in", "Get started".
   - Founder Hero:
     - Kicker: PERSONAL AI FOR REAL LIFE (monospace, restrained sage / subtle white)
     - Headline: Healing isn’t optional. Holding onto the pain is. (crisp typography)
     - 2-Sentence Description:
       "Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change."
     - Trust line: "Start free · No card required · Review, correct, or reject any interpretation"
   - Three-Layer Scope section (explicit visual progression):
     - Card 1: 01 · YOU (Explore yourself)
       Heading: Explore how you think, decide, communicate, create, connect, and grow.
       Description: Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.
     - Card 2: 02 · YOU + YOUR PEOPLE (Relational intelligence)
       Heading: See why the same moment lands differently—and how to bridge the gap.
       Description: With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.
     - Card 3: 03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics)
       Heading: See the whole system.
       Description: Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.
   - Sovereign Answer v2 Demo window:
     - Authentic chat/terminal intake preview with question: "Why does the same conversation feel urgent to me and pressuring to them?"
     - Button: "Ask Sovereign"
     - Relational triad sections:
       - WHAT YOU MAY BE BRINGING
       - WHAT THEY MAY BE BRINGING
       - WHAT HAPPENS BETWEEN YOU
     - Sources disclosure: quiet "Sources" / "See source details" button opening a clean inline disclosure drawer with source records (no JavaScript alert() dialogs!).
     - ZERO occurrences of prohibited terms (Basis, model context, provider identifiers, sovereign-answer.v2, etc.).
   - Keep all non-landing routes (/login, /signup, /auth/redeem, /onboarding, /app, /pricing, /how-it-works, /faq, /terms, /privacy) fully functional.
   - Ensure voluntary support link integrity (https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02) is preserved.
3. Verification:
   - Run `pnpm test` (must pass 100%, 0 failures).
   - Run `pnpm verify:foundation` (must pass with code 0).
   - Run `pnpm typecheck` (must pass with 0 errors).
   - Run `pnpm build` (must build cleanly with 0 errors).
4. Write your full implementation report to /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_m2/report.md and create a self-contained handoff.md in your working directory. Then send a message back to parent.
