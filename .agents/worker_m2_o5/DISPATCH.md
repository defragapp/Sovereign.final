# Dispatch for Worker M2: Chat Thread Component Polish (`SovereignThread.tsx`) & Passkey (R3)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/worker_m2_o5/`

## Role & Objectives
Implement Milestone 2: Requirement R3.
1. Create `apps/web/src/components/chat/SovereignThread.tsx` building on the architecture and precedents detailed in `/Users/cjo/Sovereign.final/.agents/survey_exp2_o5/handoff.md`:
   - Auto-resize textarea composer using `scrollHeight` clamping (44px to 200px) with Enter to submit and Shift+Enter for newline.
   - Three distinct message blocks:
     1. User prompt block (right-aligned, subtle glass styling).
     2. Sovereign synthesized answer block (headline, direct answer prose, exploration cards, feedback buttons).
     3. Collapsible "Sources" drawer (strictly avoiding "Basis" anywhere in user-facing UI; collapsed trigger labeled "Sources" or "See source details", expanded title "Source details", approved explanatory copy from `docs/product-language-system.md`).
   - Header with sage Passkey Verification badge (`border-[#9fbaa1]/30 bg-[#9fbaa1]/10 text-[#9fbaa1]`), conditionally rendered when `session?.hasPasskey || session?.passkeyVerified || hasVerifiedPasskey`.
   - SSE Streaming Integration:
     - Target endpoint: `POST /api/v1/threads/{threadId}/messages`.
     - Request headers MUST include:
       `'x-idempotency-key': 'turn_' + crypto.randomUUID()` (Fixes critical HTTP 400 defect).
       `'accept': 'text/event-stream'`.
       `'content-type': 'application/json'`.
     - Stream reader decoding and real-time token accumulation.
   - Animation primitives using existing `framer-motion` (^13.2.0) and `tokens.css` fluid transitions (220ms, no external libraries).
2. Create unit test suite in `apps/web/src/components/chat/SovereignThread.test.ts`:
   - Enforce Language Law: "Sources" drawer is never labeled "Basis", zero prohibited internal terms (`sovereign-answer.v2`, `model-safe context`, `server-approved`).
   - Test auto-resize textarea scrollHeight handling.
   - Test conditional passkey badge rendering.
   - Test presence of `x-idempotency-key` in message dispatch.
3. Update `apps/web/src/SovereignChatWorkspace.v2.tsx`:
   - Fix the missing `x-idempotency-key` header on lines 81–88.
   - Integrate `SovereignThread` or wire export.

## Exclusive Write Ownership
- `apps/web/src/components/chat/SovereignThread.tsx`
- `apps/web/src/components/chat/SovereignThread.test.ts`
- `apps/web/src/SovereignChatWorkspace.v2.tsx`

## Mandatory Reading Before Starting Work
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/.agents/survey_exp2_o5/handoff.md`
4. `/Users/cjo/Sovereign.final/AGENTS.md`
5. `/Users/cjo/Sovereign.final/docs/product-language-system.md`

## Mandatory Verification
After implementing changes:
1. `pnpm --filter @sovereign/web typecheck` and `pnpm typecheck` must exit 0
2. `pnpm --filter @sovereign/web test` must exit 0 (including `SovereignThread.test.ts`)
3. `pnpm build` must exit 0

## Deliverable
Write a complete completion report to `/Users/cjo/Sovereign.final/.agents/worker_m2_o5/handoff.md` including files modified, test outputs, and notify the orchestrator via send_message.

## 2026-09-07T21:31:00Z
You are Worker M2 (Chat Thread Component Polish & Passkey: R3).
Your working directory is /Users/cjo/Sovereign.final/.agents/worker_m2_o5/.
Read your detailed task description in /Users/cjo/Sovereign.final/.agents/worker_m2_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/PROJECT.md, /Users/cjo/Sovereign.final/.agents/survey_exp2_o5/handoff.md, /Users/cjo/Sovereign.final/AGENTS.md, and /Users/cjo/Sovereign.final/docs/product-language-system.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You have exclusive write ownership of:
- apps/web/src/components/chat/SovereignThread.tsx
- apps/web/src/components/chat/SovereignThread.test.ts
- apps/web/src/SovereignChatWorkspace.v2.tsx

Implement Requirement R3, run verification (pnpm --filter @sovereign/web typecheck, pnpm --filter @sovereign/web test, pnpm build), deliver your completion report to /Users/cjo/Sovereign.final/.agents/worker_m2_o5/handoff.md and notify me when complete.
