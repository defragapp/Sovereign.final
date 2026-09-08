# Orchestration Plan: Framer Template Integration & Exact Visual Parity

## Objective
Achieve exact visual parity between Sovereign.OS React production app (`apps/web`) and the Framer design reference (`https://slight-use-623506.framer.app/`), extracting and implementing the customized Framer template components while preserving all existing Sovereign.OS production content, passkey auth, chat logic, Stripe billing, and passing all release gates.

## Phases and Milestones

### Phase 0: Survey & Technical Investigation (Parallel Dispatch)
- **Explorer 1 (Live Framer Inspector)**: Inspect `https://slight-use-623506.framer.app/` (using HTTP fetch, DOM inspection, CSS extraction, animation timing discovery) to map exact layout, typography, animations, spacing, component hierarchy, and styling tokens.
- **Explorer 2 (React Codebase Inspector)**: Inspect `apps/web` (`PublicLanding.v2.tsx`, `App.tsx`, `tokens.css`, `design-system.css`, `styles.css`, `components/fragments/`) to determine the exact delta between current implementation and the Framer template.
- **Spec Miner 1 (Contracts & Invariant Miner)**: Inspect existing tests (`LandingParity.test.ts`, `PublicSupport.test.ts`, `SovereignThread.test.ts`, release verifier scripts) and AGENTS.md rules to establish hard boundaries (no `backdrop-blur`, no "Basis" terminology, no internal terms, passkey auth, billing routes).

### Phase 1: Implementation & Integration (Worker)
- Worker integrates the Framer template HTML/CSS/Framer Motion structure into `apps/web`.
- Updates `PublicLanding.v2.tsx`, fragments, CSS tokens, and page components to match Framer reference with exact visual parity.
- Preserves all production content, chat thread logic, passkey authentication, and billing integration.
- Executes local typecheck, test, and build to verify zero regressions.

### Phase 2: Multi-Agent Review & Challenge
- **Reviewer 1**: Reviews visual styling, layout, responsive behavior, typography, and CSS architecture against the Framer reference.
- **Reviewer 2**: Reviews code cleanliness, test compliance, contract preservation (no breaking of existing unit/integration tests).
- **Challenger 1**: Empirical verification — tests visual overflow (0px overflow on desktop 1440px and mobile 390px), console errors, and interaction states.
- **Challenger 2**: Adversarial stress test — verifies all route navigation, language laws (no "Basis", no internal leaks), and passkey/chat integration integrity.

### Phase 3: Forensic Integrity Audit
- **Auditor**: Comprehensive anti-cheat audit — verifies no dummy facades, no hardcoded test shortcuts, no mock states, genuine component implementations.
- Hard veto: Gate passes only if audit is CLEAN.

### Phase 4: Release & Deployment Verification
- Execute full monorepo release gates: `pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm verify:foundation`, `pnpm verify:cloudflare-build`.
- Deploy via `pnpm production:release:text` and verify live SHA parity on `https://sovereign.defrag.app/ready`.
- Report final outcome to parent via `send_message`.
