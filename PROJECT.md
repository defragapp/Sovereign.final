# Project: Sovereign.OS Landing Page Experience & React Production Parity

## Architecture
- **Framer Presentation Tier**: Visual design, high-contrast industrial aesthetic, typography hierarchy (Inter & JetBrains Mono), responsive layout, published at `https://nice-pluto-305324.framer.app` via `@framer/agent` (Session 2).
- **React Frontend Tier (`apps/web`)**: Client-side history router in `apps/web/src/App.tsx`, Tailwind CSS v4 styling in `src/styles.css`, Google Fonts web font imports (Inter, JetBrains Mono) in `index.html`, source-owned UI components (`RelationalInquiryDemo.tsx`, `SystemDynamicDemo.tsx`, `Accordion.tsx`).
- **Backend & Verification Tier (`apps/sovereign-worker`, `apps/worker`, `scripts`)**: Foundation verification script `scripts/verify-foundation.mjs`, Vitest suite (`pnpm test`), and full typecheck (`pnpm typecheck`).

## Code Layout
- `apps/web/index.html`: Web font links for Inter (sans) and JetBrains Mono (mono).
- `apps/web/src/styles.css`: CSS root variables, font families, industrial monochromatic colors (`#000000`, `#050505`, subtle borders `rgba(255,255,255,0.08)`, restrained sage `#9fbaa1`).
- `apps/web/src/App.tsx`: `Landing()` public route, navigation, hero, three-layer scope progression, Sovereign Answer v2 demo preview, pricing/FAQ hooks, footer.
- `apps/web/src/components/`: Modular presentation components for intake preview, relational triad, and system dynamics.
- `apps/web/src/PublicSupport.test.ts`: Voluntary donation link tests (must remain 100% green).
- `scripts/verify-foundation.mjs`: Core file checks (must remain 100% green).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Founder Hero Design | Kicker "PERSONAL AI FOR REAL LIFE", headline "Healing isn’t optional. Holding onto the pain is.", 2-sentence description of private personal AI, trust line. | M1, M2 | survey / ORIGINAL_REQUEST §R1 |
| 2 | Three-Layer Scope Hierarchy | Explicit progression: `01 · YOU (Explore yourself)`, `02 · YOU + YOUR PEOPLE (Relational intelligence)`, `03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics)`. | M1, M2 | survey / ORIGINAL_REQUEST §R1 |
| 3 | Sovereign Answer v2 Demo | Authentic chat/terminal intake preview with question "Why does the same conversation feel urgent to me and pressuring to them?", button "Ask Sovereign", relational triad ("WHAT YOU MAY BE BRINGING", "WHAT THEY MAY BE BRINGING", "WHAT HAPPENS BETWEEN YOU"), and quiet Sources disclosure drawer (never Basis). | M1, M2 | survey / ORIGINAL_REQUEST §R1 |
| 4 | Industrial Monochromatic Visual Design | Near-black foundation (#000000/#050505), sharp 1px borders (rgba(255,255,255,0.08)), Inter & JetBrains Mono typography, restrained sage accent (#9fbaa1), zero AI decorative clutter. | M1, M2 | survey / ORIGINAL_REQUEST §R1 |
| 5 | Language & Terms Governance | 100% compliant copy grounded in `docs/product-language-system.md`; zero exposure of internal terms (Basis, model context, provider names, `sovereign-answer.v2`). | M1, M2, M3 | survey / AGENTS.md / docs |
| 6 | Framer Canvas Restructuring & Publishing | Restructure breakpoint `WQLkyLRf1`, integrate dark theme, navigation, hero, 3-layer scope, demo preview, publish to `https://nice-pluto-305324.framer.app` and verify live page. | M1 | survey / ORIGINAL_REQUEST §R1 |
| 7 | Web Font Integration | Add Google Fonts links for Inter and JetBrains Mono in `apps/web/index.html` and wire font variables in `styles.css`. | M2 | survey / Explorer 2 report |
| 8 | React Landing Page Production Parity | Update `apps/web/src/App.tsx` and subcomponents to reflect Framer visual design, typography, layout hierarchy, and copy. | M2 | survey / ORIGINAL_REQUEST §R2 |
| 9 | Foundation & Test Suite Gate | Ensure `pnpm test` (all workspace tests) and `pnpm verify:foundation` pass with 0 errors. | M3 | survey / ORIGINAL_REQUEST §Acceptance Criteria |
| 10 | Independent Adversarial & Integrity Audit | Challenge responsiveness, copy compliance, and run Forensic Integrity Audit (`teamwork_preview_auditor`). | M3 | survey / AGENTS.md & Orchestrator Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Framer Visual Design Exploration & Alignment | Restructure canvas, insert 3-layer scope, wire hero and demo triad, publish to `nice-pluto-305324.framer.app`, and verify live site. | None | DONE |
| M2 | React Codebase Production Parity | Integrate Inter & JetBrains Mono fonts, update `apps/web/src/App.tsx` and components to match Framer visual hierarchy and copy. | M1 | DONE |
| M3 | Verification, Adversarial Challenge & Forensic Audit Gate | Run full test suite, foundation verification, build, typecheck, multi-reviewer review, challenger stress-testing, and forensic audit. | M2 | DONE |

## Interface Contracts
### Framer ↔ React UI Alignment
- **Foundational Color Tokens**:
  - Background: `#000000` (canvas) / `#050505` (surface) / `#0c0c0e` (cards)
  - Borders: `1px solid rgba(255, 255, 255, 0.08)`
  - Text: `#f4f0e8` (cream primary), `#a3a099` (muted secondary), `#686660` (subtle captions)
  - Accent: `#9fbaa1` (restrained sage, badges / active states)
- **Typography Matrix**:
  - Sans: `Inter`, system fallbacks (headings, body, actions)
  - Mono: `JetBrains Mono`, monospace fallbacks (kickers, numbering, badges, terminal labels)
- **Relational Triad Labels**:
  - Section 1: `WHAT YOU MAY BE BRINGING`
  - Section 2: `WHAT THEY MAY BE BRINGING`
  - Section 3: `WHAT HAPPENS BETWEEN YOU`
  - Attribution: `Sources` / `See source details` (NEVER `Basis`)
