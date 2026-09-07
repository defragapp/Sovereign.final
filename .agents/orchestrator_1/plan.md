# Project Plan: Sovereign.OS Framer Visual Design & React Production Parity

## Objective
Design, refine, and publish an editorial, high-contrast visual UI/UX for Sovereign.OS inside Framer (nice-pluto-305324.framer.app / Session 2) grounded strictly in authoritative documentation, and subsequently translate and integrate this exact visual hierarchy, typography, and copy into the local React codebase (`apps/web/src/App.tsx` and components), verified by passing `pnpm test` and `pnpm verify:foundation` with 0 errors.

## Execution Phases

### Phase 0: Survey & Specification Extraction
- Dispatch 3 parallel Explorers:
  - Explorer 1: Document & Language Governance (examine `docs/product-language-system.md`, `docs/inner-recognition-intelligence.md`, `docs/product-positioning-canonical.md`, `docs/baseline-question-universe-and-demonstration-strategy.md`, and `AGENTS.md`).
  - Explorer 2: Existing React Codebase Architecture & UI State (examine `apps/web/src/App.tsx`, existing components, styles, styling system/Tailwind, and tests).
  - Explorer 3: Framer Integration & Tooling Feasibility (examine Framer tooling, CLI/MCP capabilities, session `nice-pluto-305324.framer.app`, and assets).
- Synthesize findings into `PROJECT.md` with full Feature Inventory, interface contracts, and layout specifications.

### Phase 1: Framer Visual Design Exploration & Alignment (Milestone 1)
- Dispatch Worker to use Framer agent / tools to construct and publish the landing page in Framer (`nice-pluto-305324.framer.app / Session 2`):
  - Founder Hero: "Healing isn’t optional. Holding onto the pain is.", kicker "PERSONAL AI FOR REAL LIFE", concise 2-sentence supporting description.
  - Three-Layer Scope: Explicit visual progression (01 · YOU, 02 · YOU + YOUR PEOPLE, 03 · FROM 1:1 TO THE WHOLE SYSTEM).
  - Sovereign Answer v2 Demo: Authentic chat/terminal intake preview using Sources (never Basis/model context) with the 3 sections.
  - Visual Style: Monochromatic industrial high-contrast (#000000/#050505, sharp 1px borders, Inter & JetBrains Mono, zero decorative AI clutter).
- Verify publishing status and live URL.
- Reviewer & Challenger review.

### Phase 2: React Codebase Production Parity (Milestone 2)
- Dispatch Worker to update `apps/web/src/App.tsx` and related components to match the Framer landing page layout, copy, typography, and contrast.
- Ensure strict compliance with AGENTS.md:
  - Near-black foundation, warm readable typography, restrained sage accent, generous whitespace, subtle borders.
  - No dashboard card walls, fake metrics, decorative AI effects.
  - No exposure of internal terms (Basis, model context, provider names, `sovereign-answer.v2`).
- Worker runs build, typecheck, tests (`pnpm test`), and foundation verification (`pnpm verify:foundation`).

### Phase 3: Adversarial Review, Forensic Audit & Gate (Milestone 3)
- Dispatch Reviewers to inspect visual fidelity, code quality, and test outcomes.
- Dispatch Challengers to test edge cases, viewport responsiveness, and regression resistance.
- Dispatch Forensic Auditor (`teamwork_preview_auditor`) for hard veto audit check.
- Record all results in `GATE_STATUS.md`.
- Report final verified completion back to Sentinel.
