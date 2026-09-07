---
name: visual-design-system
description: Audits, modernizes, and validates the visual hierarchy and CSS authority of Sovereign.OS. Enforces UI_UX_CONTRACT.md, zero-overflow Playwright gates (1440x900 & 390x844), design token compliance, and prevents CSS cascade collisions.
---

# Visual Design System (VDS) Skill

## Authoritative Precedence
1. `apps/web/src/tokens.css` (Design tokens)
2. `apps/web/src/design-system.css` (Base primitives)
3. `apps/web/src/public.css` (Landing)
4. `apps/web/src/workspace.css` (Conversation workspace)
5. `apps/web/src/app-shell.css` (Modals/Overlays)

## Automated Verification Loop
Every visual task must pass:
1. `pnpm validate:ui`: AST/regex scan for forbidden tokens (backdrop-blur, gradients).
2. `pnpm typecheck && pnpm build`: Clean artifact creation.
3. `node scripts/verify-visual-qa.mjs`: Multi-viewport (1440x900, 390x844) zero-overflow test.
