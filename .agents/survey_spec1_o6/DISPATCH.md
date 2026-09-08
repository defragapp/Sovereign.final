## 2026-09-07T22:23:00Z
You are teamwork_preview_spec_miner.
Your working directory is /Users/cjo/Sovereign.final/.agents/survey_spec1_o6.
Mandatory input: Read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md before starting.

Your mission:
Mine all explicit and implicit specifications, hard constraints, invariant contracts, and acceptance criteria:
1. Read /Users/cjo/Sovereign.final/AGENTS.md, docs/product-language-system.md, and any other relevant docs.
2. Read /Users/cjo/Sovereign.final/.agents/skills/sovereign-production-release/SKILL.md and /Users/cjo/Sovereign.final/.agents/skills/visual-design-system/SKILL.md.
3. Inspect existing test suites in apps/web/src/ (e.g. LandingParity.test.ts, PublicSupport.test.ts, SovereignThread.test.ts, etc.) and determine what exact assertions are enforced.
4. Enumerate all release gate scripts (pnpm typecheck, pnpm build, pnpm test, pnpm verify:foundation, pnpm verify:cloudflare-build, node .agents/skills/sovereign-production-release/scripts/release-verifier.mjs).
5. Document all hard invariants: language laws (forbidden terms like "Basis"), visual QA (0px overflow on 1440x900 and 390x844, zero console errors), static page anchors (support/donation links), CSS import order.

Write your comprehensive specifications and invariant checklist to /Users/cjo/Sovereign.final/.agents/survey_spec1_o6/handoff.md. Update progress.md with your progress and timestamps.
When finished, send a completion message to parent.
