# Sovereign.final — OPENAPI Extraction Manifest

Source: `defragapp/OPENAPI/main`  
Target: `defragapp/Sovereign.final`

## Protected extraction groups

| Group | Source family | Treatment | Verification |
|---|---|---|---|
| Runtime | `apps/sovereign-worker/src/{runtime-entry.ts,entry.ts,index.ts,env.ts,runtime.ts}` | preserve/adapt minimally | worker build + route smoke |
| Auth/security | `security/**`, `auth-public.ts`, `auth-session.ts` | preserve | auth/session tests |
| Baseline | `baseline.ts`, `baseline-engine.ts`, `baseline-contracts.ts`, `baseline-facets.ts`, `astronomy.ts` | protected | Baseline parity + privacy checks |
| AI | `agent/**` | protected | answer-contract + safety tests |
| Context | `conversation-context.ts`, expression/relationship/relational/emotional | extract transitively | context authorization tests |
| Persistence | `db/**` active modules | preserve schema semantics | D1 migration + data tests |
| Billing | Stripe + usage | preserve server authority | webhook/entitlement tests |
| Email | `email.ts` | extract | magic-link delivery path |
| Jobs | `jobs.ts` active tasks | extract only if live | retention tests |
| Contracts | `packages/agent-contracts/**` required exports | reduce to active surface | typecheck |

## Excluded from v1

- old `apps/web/**` implementation;
- duplicate public HTML implementations;
- visual audit archives;
- historical release wrappers;
- experimental/unused AI providers;
- unused OpenAI Agents SDK runtime;
- Worlds/video implementation unless proven active and required;
- scratch/corpus files;
- presentation-only payloads.

## Required migration rule

Carry the production migration sequence intact through the latest active migration. Do not squash or renumber during the first extraction.

## Completion evidence

- [ ] direct dependency graph recorded
- [ ] transitive dependency graph recorded
- [ ] every extracted module has at least one runtime/test consumer
- [ ] Baseline parity
- [ ] auth parity
- [ ] thread/turn parity
- [ ] entitlement parity
- [ ] Stripe parity
- [ ] People/Systems consent parity
- [ ] safety parity
- [ ] answer-contract/Basis validation parity
- [ ] public identity/URL drift scan
