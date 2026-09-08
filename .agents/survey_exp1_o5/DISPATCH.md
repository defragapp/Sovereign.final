# Dispatch for Survey Explorer 1 (Frontend Design System & UI Fragments)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/survey_exp1_o5/`

## Objective
Investigate the codebase for Requirements R1 (Design System & Hero Section Polish) and R2 (Real Product UI Fragments).

## Mandatory Inputs to Read
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/AGENTS.md`
3. `/Users/cjo/Sovereign.final/docs/product-language-system.md`
4. Reference URL: `https://slight-use-623506.framer.app/` (Use `read_url_content` or `curl`/browser tools to inspect visual tokens, copy, layout if possible)

## Specific Investigation Questions
- Examine `apps/web/src/PublicLanding.v2.tsx`, `apps/web/src/App.tsx`, `apps/web/src/styles.css`, `design-system.css`, tokens.
- How are borders currently styled? Where are the stark 1px borders vs atmospheric glass borders (`border-white/10`)?
- What is the current hero headline scale and container in `PublicLanding.v2.tsx`? What changes are needed for 25% scale increase and `max-w-5xl`?
- What are the current feature cards? How to implement the three conceptual pillars: **SELF — Your Baseline**, **BETWEEN — Your Relationships**, **WHOLE — Your Systems**?
- How to implement the vertical scroll expansion sequence: `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`?
- What static HTML pages exist in `apps/web/public/` (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`) and how do they reference CSS variables / dark-mode design system?
- Where are the large empty dark-gradient placeholder rectangles across landing and workspace layouts?
- How should the 3 UI fragments be implemented:
  1. Baseline View (mock context vectors and baseline weighting cards)
  2. Expression View (textual differentiation between raw query input and Sovereign contextual breakdown panel)
  3. System Map View (compact SVG/CSS node network snippet illustrating multi-party relationship vectors)
- What files need to be modified or created? What are the exact component boundaries?

## Output Requirement
Write a comprehensive report to `/Users/cjo/Sovereign.final/.agents/survey_exp1_o5/handoff.md` with:
- Current state observation
- Technical recommendations and code locations
- Potential risks and regressions
- Verification strategy

## 2026-09-07T21:24:48Z
You are Survey Explorer 1 (Frontend Design System & UI Fragments).
Your working directory is /Users/cjo/Sovereign.final/.agents/survey_exp1_o5/.
Read your detailed task description in /Users/cjo/Sovereign.final/.agents/survey_exp1_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/AGENTS.md and /Users/cjo/Sovereign.final/docs/product-language-system.md.
Investigate the codebase for Requirements R1 (Design System & Hero Section Polish) and R2 (Real Product UI Fragments).
Check https://slight-use-623506.framer.app/ for visual design references.
Deliver your comprehensive handoff report to /Users/cjo/Sovereign.final/.agents/survey_exp1_o5/handoff.md and notify me when complete.

