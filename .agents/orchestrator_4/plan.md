# Implementation Plan — Sovereign UI Simplification and Route Verification

## Phase 0: Survey & Discovery (COMPLETED)
- [x] Survey UI codebase, styling tokens, and layout constraints (`survey_explorer_1`)
- [x] Survey route flows, navigation architecture, and gaps (`survey_explorer_2`)
- [x] Mine release specifications, guarded test contracts, and acceptance criteria (`survey_spec_miner_1`)
- [x] Record Feature Inventory & Milestone Decomposition in `PROJECT.md`

## Milestone 1: UI Simplification & Route Flow Implementation (IN PROGRESS)
- Objective: Refine spacing, card padding, typography legibility, and section transitions in `apps/web/src/App.tsx` and `styles.css`. Replace internal jargon with plain language. Enforce zero forbidden terms and zero `backdrop-blur`. Fix route normalization, un-orphan `/how-it-works`, add auth toggle, add mobile sign-out, add mobile navigation.
- Worker: `teamwork_preview_worker` (`worker_m1`)

## Milestone 2: Route Flow Integrity Test Suite
- Objective: Implement comprehensive test coverage for all 10 application routes (`apps/web/src/RouteIntegrity.test.ts`), covering route rendering, client-side transitions, and edge cases.
- Worker: `teamwork_preview_worker` (`worker_test_m2`)

## Milestone 3: Comprehensive Review, Challenge & Forensic Audit
- Objective: Verify full test suite (`pnpm test`), type checking (`pnpm typecheck`), foundation checks (`pnpm verify:foundation`), and Cloudflare build verification (`pnpm verify:cloudflare-build`).
- Reviewers: 2 x `teamwork_preview_reviewer`
- Challengers: 2 x `teamwork_preview_challenger`
- Forensic Auditor: `teamwork_preview_auditor`
- Milestone Gate: 100% pass across all 24 release stages, clean audit.

## Final Milestone & Handoff
- Compile comprehensive `handoff.md` and report completion to Sentinel.
