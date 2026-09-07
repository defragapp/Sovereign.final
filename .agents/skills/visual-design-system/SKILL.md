---
name: visual-design-system
description: Enforces a premium, high-motion Framer aesthetic across Sovereign.OS. Mandates monochrome b/w base themes with iridescent Siri/Gemini-style flow highlights, WebGL/CSS mesh gradients, glass buttons, and 3D gyro/mouse tilt elements.
---

# High-Motion Visual Design System (VDS) Skill

## Authoritative Precedence
1. `apps/web/src/tokens.css` (Monochrome base tokens & iridescent gradient variables)
2. `apps/web/src/design-system.css` (Glassmorphic primitives, 12-16px container radii, 10-12px inputs, 6-8px buttons)
3. `apps/web/src/public.css` (Dark stage spotlights, gyro-tilt hero animations, 3D scroll cylinders)
4. `apps/web/src/workspace.css` (V0-style chat workspace with fluid Siri/Gemini-style highlights)
5. `apps/web/src/app-shell.css` (Modals/Overlays with backdrop-blur and glass treatments)

## Automated Verification Loop
Every visual task must pass:
1. `pnpm validate:ui`: Verify presence of `backdrop-blur`, mesh gradients, and 200-240ms fluid motion timing (4-6px movement).
2. `pnpm typecheck && pnpm build`: Clean artifact creation.
3. `node scripts/verify-visual-qa.mjs`: Multi-viewport zero-overflow test.
