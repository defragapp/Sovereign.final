# Dispatch for Survey Explorer 2 (Chat Thread & Passkey Authentication)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/survey_exp2_o5/`

## Objective
Investigate the codebase for Requirement R3 (Chat Thread Component Polish: `SovereignThread.tsx`) and related authentication context.

## Mandatory Inputs to Read
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/AGENTS.md`
3. `/Users/cjo/Sovereign.final/docs/product-language-system.md`
4. Existing chat & auth implementations:
   - `apps/web/src/SovereignChatWorkspace.v2.tsx`
   - `apps/web/src/PasskeyAuthentication.tsx`
   - `apps/web/src/components/chat/` (check if `SovereignThread.tsx` exists or needs to be built)

## Specific Investigation Questions
- Does `apps/web/src/components/chat/SovereignThread.tsx` already exist, or what exists in that directory?
- How does `SovereignChatWorkspace.v2.tsx` handle messages, SSE streaming (`/api/v1/threads/{threadId}/messages`), and thread state?
- How is the composer implemented? How can the auto-resize textarea (scrollHeight technique) be integrated cleanly?
- How are message blocks rendered? How to cleanly separate:
  1. User prompt block
  2. Sovereign synthesized answer block
  3. Collapsible "Sources" drawer (CRITICAL: NEVER label "Basis" or expose internal terms)
- What animation primitives/classes exist in `package.json` and CSS (must be compatible with existing design system, no new external animation libraries)?
- How does passkey verification work in `PasskeyAuthentication.tsx`? What session prop or state indicates a verified passkey credential? How should the Passkey verification badge be rendered in the header?
- Are there any existing tests for chat or passkeys?

## Output Requirement
Write a comprehensive report to `/Users/cjo/Sovereign.final/.agents/survey_exp2_o5/handoff.md` with:
- Current state observation
- Technical recommendations, props interface for `SovereignThread.tsx`, and code locations
- Potential risks, language law compliance verification
- Verification strategy
