# Project: Sovereign.OS Live Production Visual QA & Interaction Verification

## Architecture
- **Target Domains**:
  - `https://sovereign.defrag.app`: Public marketing & landing experience.
  - `https://app.defrag.app`: Application shell & authenticated workspace (/app, /login, /signup).
- **Viewports**:
  - Desktop: 1440x900
  - Mobile: 390x844
- **Testing Architecture (`~/teamwork_projects/sovereign_browser_audit`)**:
  - `audit-runner.mjs`: Standalone automated Chromium runner executing comprehensive visual QA, token evaluation, keyframe inspection, and interaction simulation.
  - `tests/`: Modular test specifications for R1 (Payload/Styles), R2 (Visual/Layout), and R3 (Interactive Workspace).
  - `evidence/`: Structured machine-readable `audit-evidence.json` and human-readable `audit-evidence.md`.
  - `screenshots/`: Viewport-specific evidence captures (desktop 1440x900 and mobile 390x844).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Legacy Stylesheet Purge | Zero requests or `<link>` tags for `public.css`, `workspace.css`, `design-system.css`. | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Foundation Slate Background | Background computed style evaluates to `#09090b` or `#121212` (or `#000000`/`#050505`). | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Bronze Override Elimination | Zero `var(--bronze-accent)` or `--bronze-accent: #dda273` in computed styles. | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Glassmorphism Prohibition | Zero `backdrop-blur` or `backdropFilter !== 'none'` across all interactive elements. | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Scroll Reveal Choreography | Framer Motion `whileInView`, `staggerChildren` (0.09s/0.12s), and section fade-up transitions. | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Dark Stage Spotlight | Ambient radial lighting geometry behind hero and demo terminal. | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Turnstile Mounting Hierarchy | Cloudflare Turnstile explicit rendering into `.turnstile-slot` with `data-turnstile-rendered="true"`. | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Passkey & Email Hierarchy | Visual order: Passkey primary CTA, recovery divider, email fallback form. | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Subpixel Overflow Restriction | Desktop (1440x900) and Mobile (390x844) render cleanly with `overflowX <= 2px`. | M2 | ORIGINAL_REQUEST §R2 |
| 10 | AI Inference State Trigger | Synthetic query in workspace or demo terminal triggering `sending = true`. | M3 | ORIGINAL_REQUEST §R3 |
| 11 | IridescentLoader Shimmer Keyframes | `.sov-shimmer-bar` executes active `sov-shimmer` 2.4s cubic-bezier keyframes. | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Typing Dots Keyframes | 3 staggered `.sov-typing-dot` elements execute `sov-dot-fade` 1.4s keyframes. | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Direct Answer Typography Scaling | `.answer-direct` computes to `1rem` (mobile) / `1.0625rem` (md) with `1.72` line-height. | M3 | ORIGINAL_REQUEST §R3 |
| 14 | Workspace Tab Transition (0.18s) | Smooth `.sov-tab-content` switching across `people`, `systems`, `explore`, `you` with 0.18s fade-and-slide. | M3 | ORIGINAL_REQUEST §R3 |
| 15 | Unauthenticated Route Gate | Security redirect from `/app` to `/login` preserving `returnTo`. | M1, M2 | AGENTS.md / Survey |
| 16 | Multi-Viewport Visual Evidence | Screenshot capture and artifact logging at 1440x900 and 390x844. | M1, M2, M3 | Task Requirements |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | R1: Live Production Payload & Style Auditing | Build & execute test runner verifying legacy CSS exclusion, background palette, bronze override purge, and glassmorphism prohibition on 1440x900 & 390x844. | None | DONE |
| M2 | R2: Visual Regression & Layout Verification | Verify scroll reveals (`whileInView`, `staggerChildren`), dark spotlight, Turnstile mounting hierarchy, and zero horizontal scroll overflow. | M1 | DONE |
| M3 | R3: Interactive Workspace State Testing | Execute synthetic query, verify `<IridescentLoader/>` shimmer/dots keyframes, verify `.answer-direct` typography scaling, and verify `.sov-tab-content` 0.18s tab switching. | M2 | DONE |
| M4 | Comprehensive Review, Verification & Forensic Audit | Dual Reviewers, Dual Challengers, and Forensic Auditor verification against all acceptance criteria. | M1, M2, M3 | DONE |


## Interface Contracts & Verification Thresholds
- **Horizontal Overflow**: `Math.max(0, scrollWidth - clientWidth) <= 2px`
- **Background Luminance**: `red, green, blue <= 18` (slate `#09090b` / `#121212` / `#000000`)
- **Backdrop Filter**: `backdropFilter === 'none'`
- **Typography**:
  - `< 768px`: `fontSize === '16px'`, `lineHeight === '27.52px'` (or ratio `1.72`)
  - `>= 768px`: `fontSize === '17px'`, `lineHeight === '29.24px'` (or ratio `1.72`)
- **Animation Durations**:
  - Shimmer: `2.4s`
  - Dots: `1.4s`
  - Tab switch: `0.18s`
