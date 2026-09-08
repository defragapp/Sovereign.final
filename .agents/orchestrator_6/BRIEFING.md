# BRIEFING — 2026-09-07T22:26:55Z

## Mission
Achieve exact visual parity between Sovereign.OS React app and Framer reference (https://slight-use-623506.framer.app/) while preserving all production logic and passing all release gates.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/cjo/Sovereign.final/.agents/orchestrator_6
- Original parent: parent
- Original parent conversation ID: a42f7bf1-dd66-4e33-92c8-7e8fbd27f3cd

## 🔒 My Workflow
- **Pattern**: Project
- **Scope document**: /Users/cjo/Sovereign.final/PROJECT.md
1. **Decompose**: Decompose full scope into milestones: Framer template extraction & visual audit, React visual implementation & parity integration, Verification & forensic audit, Release & deployment.
2. **Dispatch & Execute** (pick ONE):
   - **Direct (iteration loop)**: For each milestone: Explorer (3) -> Worker (1) -> Reviewer (2) -> Challenger (2) -> Auditor (1) -> Gate verification.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed at 16 spawns, write handoff.md, cancel crons, spawn successor.
- **Work items**:
  1. Survey & Spec Mining (Live Framer inspection & Codebase analysis) [in-progress]
  2. Framer Template Integration & Exact Visual Parity in React [pending]
  3. Gate Verification (Tests, Foundations, Challenger, Forensic Audit) [pending]
  4. Release & Parity Validation [pending]
- **Current phase**: 0 (Survey)
- **Current focus**: Survey & Spec Mining

## 🔒 Key Constraints
- DISPATCH-ONLY orchestrator: NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers to do so.
- NEVER investigate or explore the problem at the code level — dispatch Explorers for technical investigation.
- File-editing tools ONLY for metadata/state files (.md) in .agents/ folder.
- Audit Enforcement: If a Forensic Auditor reports INTEGRITY VIOLATION, milestone fails unconditionally.
- Communicate all reports back to caller a42f7bf1-dd66-4e33-92c8-7e8fbd27f3cd via send_message.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh.
- Product language laws: Never expose internal terms (Basis, model/provider identifiers, sovereign-answer.v2, model-safe context).
- Launch rule: The first acceptance path is account -> Baseline -> first real AI turn -> rendered answer. No mock AI answer.
- Verified deployment command: pnpm production:release:text.

## Current Parent
- Conversation ID: a42f7bf1-dd66-4e33-92c8-7e8fbd27f3cd
- Updated: not yet

## Key Decisions Made
- Defer all exploration and implementation to subagents per DISPATCH-ONLY orchestrator mandate.
- Dispatched 3 parallel survey subagents to inspect Framer live preview, React codebase, and repo test invariants.
- Survey Spec Miner 1 completed with exhaustive inventory of test assertions, language laws, visual constraints, and release verifiers.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|---|---|---|---|---|
| survey_exp1_o6 | teamwork_preview_explorer | Framer Reference Inspector | in-progress | 395f48e1-aa95-44ba-a6df-9a5a2fa2cfc5 |
| survey_exp2_o6 | teamwork_preview_explorer | React Codebase Inspector | in-progress | af9ba857-1575-4ec5-bd13-13a507a48241 |
| survey_spec1_o6 | teamwork_preview_spec_miner | Contracts & Invariant Miner | completed | 89880635-7bc3-4fdf-a519-9707bfbaa975 |

## Succession Status
- Succession required: no
- Spawn count: 3 / 16
- Pending subagents: 395f48e1-aa95-44ba-a6df-9a5a2fa2cfc5, af9ba857-1575-4ec5-bd13-13a507a48241
- Predecessor: orchestrator_5
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: task-26 (*/10 * * * *)
- Safety timer: handled via heartbeat cron
- On succession: kill all timers before spawning successor
- On context truncation: run manage_task(Action="list") — re-create if missing

## Artifact Index
- /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md — User request record
- /Users/cjo/Sovereign.final/PROJECT.md — Global project architecture & milestones
- /Users/cjo/Sovereign.final/.agents/orchestrator_6/DISPATCH.md — Current dispatch instruction
- /Users/cjo/Sovereign.final/.agents/orchestrator_6/plan.md — Phased orchestration plan
- /Users/cjo/Sovereign.final/.agents/orchestrator_6/progress.md — Orchestrator liveness & progress log
- /Users/cjo/Sovereign.final/.agents/survey_spec1_o6/handoff.md — Invariants & test contracts
- /Users/cjo/Sovereign.final/.agents/orchestrator_6/GATE_STATUS.md — Gate verdicts
