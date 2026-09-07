# Task Assignment: Spec Miner (Survey - Precise Requirements & Thresholds)

## Mission
Extract and document every precise requirement, assertion threshold, forbidden token, and expected interaction sequence for the Sovereign.OS Visual QA & Interaction Verification mission.

## Authoritative Context
- ORIGINAL_REQUEST: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
- Repo root: /Users/cjo/Sovereign.final
- Key docs: docs/product-language-system.md, docs/inner-recognition-intelligence.md, AGENTS.md

## Scope & Instructions
1. Extract exact requirements for R1 (Live Production Payload & Style Auditing):
   - Forbidden legacy CSS files: public.css, workspace.css, design-system.css (in <head> and network requests)
   - Background colors: slate #09090b or #121212
   - Forbidden tokens: zero bronze tints (var(--bronze-accent)), zero backdrop-blur glassmorphism tokens
   - Target viewports: Desktop (1440x900) and Mobile (390x844)
   - Target domains: https://sovereign.defrag.app and https://app.defrag.app
2. Extract exact requirements for R2 (Visual Regression & Layout Verification):
   - Landing page scroll reveals (whileInView, staggerChildren)
   - Dark stage spotlight
   - Auth modal Turnstile widget mounting with passkey/email fallback hierarchy
   - No horizontal scroll overflow at both 1440x900 and 390x844
3. Extract exact requirements for R3 (Interactive Workspace State Testing):
   - Synthetic query simulation triggering AI generation state
   - `<IridescentLoader/>` shimmer bar animation (.sov-shimmer-bar, .sov-typing-dot keyframes active)
   - `.answer-direct` typography scaling (1rem / 1.0625rem md, 1.72 line-height)
   - Workspace tab switching across people, systems, explore, you views with .sov-tab-content 0.18s fade-and-slide animation without jitter
4. Structure the exact verification checklist and write your report to /Users/cjo/Sovereign.final/.agents/spec_miner_survey_1/handoff.md.

## 2026-09-07T11:04:37Z
You are Spec Miner 1 on the Sovereign.OS Visual QA & Interaction Verification mission.

Read your task assignment: /Users/cjo/Sovereign.final/.agents/spec_miner_survey_1/DISPATCH.md
Read the authoritative user request: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
Also inspect /Users/cjo/Sovereign.final/AGENTS.md and relevant docs.

Extract and document every precise assertion, forbidden token, threshold, and interaction flow across R1, R2, and R3:
- R1: Legacy CSS, slate #09090b/#121212 background, zero bronze tints (var(--bronze-accent)), zero backdrop-blur.
- R2: Scroll reveals, spotlight, Turnstile/passkey hierarchy, zero horizontal scroll overflow on 1440x900 and 390x844.
- R3: Synthetic query simulation, IridescentLoader shimmer/dot keyframes, .answer-direct typography (1rem / 1.0625rem md, 1.72 line-height), .sov-tab-content 0.18s tab switching.

Compile a comprehensive specification checklist and write to /Users/cjo/Sovereign.final/.agents/spec_miner_survey_1/handoff.md. Report back when finished.
