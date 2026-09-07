# Sovereign.OS UI Codebase Survey & Visual Hierarchy Report

**Date**: 2026-09-07  
**Agent**: `survey_explorer_1` (Codebase UI Explorer)  
**Target Files**: `apps/web/src/App.tsx`, `apps/web/src/styles.css`, `apps/web/src/components/*`, `apps/web/public/*`  
**Parent Task**: Sovereign UI Simplification and Route Verification  

---

## 1. Executive Summary

A comprehensive survey was conducted across the Sovereign.OS frontend codebase in `/Users/cjo/Sovereign.final`. The frontend has already undergone significant modernization:
1. `apps/web/src/main.tsx` cleanly imports only `App.tsx` and `styles.css` (with all legacy CSS imports removed or commented out).
2. `apps/web/index.html` loads zero legacy stylesheets, relying exclusively on Google Fonts (Inter & JetBrains Mono) and the Vite bundle.
3. Prohibited backend implementation terms (`sovereign-answer.v2`, `Basis ID`, `model-safe context`) and forbidden glassmorphism (`backdrop-blur`) have zero active presence in rendered UI components.
4. The visual foundation adheres strictly to near-black (`#000000`/`#050505`), crisp monochromatic borders (`rgba(255, 255, 255, 0.08)`), restrained sage accents (`#9fbaa1`), and warm typography (`#f4f0e8`).

However, several actionable refinement opportunities were uncovered:
- **Mobile layout friction (390px)**: Header collision in the interactive demonstration terminal, rigid `p-8` card padding eating 23% of mobile screen width, and hero headline line-wrap vulnerability.
- **Copy simplification**: Remnants of engineering/system jargon in public section kickers and terminal labels (`THREE-LAYER ARCHITECTURE`, `AUTHENTICATED DEMONSTRATION`, `2 Baselines Permitted`, `CANONICAL INQUIRIES`, `sovereign.workspace / relational-inquiry`).
- **Implementation hygiene**: Dynamic Tailwind string template literals in `IridescentLoader.tsx` that bypass Tailwind's static scanning.

---

## 2. Prohibited Backend Terms & Forbidden Glassmorphism Audit

### 2.1 Search Methodology
A global ripgrep search was executed across `apps/web/src/` and `apps/web/public/` for all prohibited phrases specified in `AGENTS.md` and `LandingParity.test.ts`:
- `sovereign-answer.v2`
- `Basis ID` / `basisId` / `Basis-ID`
- `model-safe context` / `model context`
- `server-approved`
- `authority`
- `backdrop-blur` / `backdrop-filter`
- `var(--bronze-accent)` / `#d4a373` (bronze overrides)

### 2.2 Findings in Active User-Facing Code (`App.tsx`, `styles.css`, active components)
| Prohibited Item | Presence in `App.tsx` | Presence in `styles.css` | Compliance Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `sovereign-answer.v2` | **None** | **None** | **PASS** | UI renders clean label `SOVEREIGN ANSWER`. The literal string only exists as a TypeScript type import in `api.ts`. |
| `Basis ID` / `basisId` | **None** | **None** | **PASS** | UI renders `Source details` with labels like `These are the source values Sovereign used for this answer.` |
| `model-safe context` | **None** | **None** | **PASS** | Zero occurrences in UI code. |
| `model context` | **None** | **None** | **PASS** | Zero occurrences in UI code. |
| `server-approved` | **None** | **None** | **PASS** | Zero occurrences in UI code. |
| `authority` | **None** | **None** | **PASS** | Zero occurrences in `App.tsx` (enforced by `LandingParity.test.ts`). |
| `backdrop-blur` | **None** | **None** | **PASS** | Enforced by `LandingParity.test.ts` line 97 and `ui-contract-validator.mjs`. |
| `backdrop-filter` | **None** | **None** | **PASS** | `styles.css` contains zero backdrop filter rules. |
| `var(--bronze-accent)` | **None** | **None** | **PASS** | Color palette uses only `#000000`, `#f4f0e8` (cream), and `#9fbaa1` (sage). |

### 2.3 Legacy / Inactive Files Note
Legacy CSS files in `apps/web/src/` (`design-system.css`, `workspace.css`, `powder.css`, `releases.css`, `public.css`) and static HTML in `apps/web/public/` (`how-it-works.html`) still contain historical `backdrop-filter: blur(...)` and bronze `#d4a373` rules. However, these files are **not imported** by `apps/web/src/main.tsx` or `index.html`. `ui-contract-validator.mjs` verifies that all active React files comply.

---

## 3. Viewport Hierarchy & Spacing Audit (1440px Desktop vs 390px Mobile)

### 3.1 Header Navigation
- **Desktop (1440px)**: Height `h-16` (64px), horizontal layout with 4 nav links (`01 · You`, `02 · You + Your People`, `03 · Whole System`, `Pricing`) and two actions ("Sign in" / "Get started"). Fluid `px-4 sm:px-8`. Clean, well-spaced, restrained.
- **Mobile (390px)**: Nav links are hidden via `hidden md:flex`. Logo and actions measure ~322px total width, fitting cleanly inside 390px without wrapping or clipping.

### 3.2 Founder Hero Section
- **Desktop (1440px)**:
  - Kicker: `font-mono text-[11px]` with `bg-[var(--sage)]` dot.
  - Headline: `text-6xl md:text-7xl font-normal tracking-tight leading-[1.06]`.
  - Body: `text-lg leading-relaxed max-w-2xl`.
  - CTAs: Horizontal flex (`flex-row gap-4`).
- **Mobile (390px)**:
  - Headline: `text-4xl` (~36px). "Healing isn’t optional." has 22 characters (~340px in Inter). Inside container `px-6` (available width 342px), this line sits right on the edge of awkward wrapping depending on system font rendering.
  - *Refinement*: Changing `text-4xl` to `text-3xl sm:text-6xl md:text-7xl` or responsive clamp prevents unintended wrapping while strictly preserving the required text string.
  - CTAs: Stacked vertically (`flex-col gap-4 w-full sm:w-auto`), providing large, easily tapped touch targets for mobile thumbs.

### 3.3 Three-Layer Scope Cards
- **Desktop (1440px)**:
  - 3-column grid (`md:grid-cols-3 gap-8`).
  - Card padding: `p-8` (32px). Clean, spacious, balanced with 1px border `border-white/10` and hover micro-lift (`whileHover={{ y: -4 }}`).
- **Mobile (390px)**:
  - Single column with `gap-8`.
  - Card padding: `p-8` consumes 64px of the 342px available width (nearly 20% of the screen width), leaving only 278px for paragraph text.
  - *Refinement*: Adjust card padding to `p-6 sm:p-8` (24px padding on mobile, 32px on desktop). This recovers 16px of readable line width on mobile devices without altering desktop appearance.

### 3.4 Sovereign Answer Demonstration Window (`#demo`)
- **Desktop (1440px)**:
  - Outer padding: `p-6 sm:p-10`.
  - Window header bar displays 3 window dots, terminal label `sovereign.workspace / relational-inquiry`, and `BASELINE GROUNDED` status pill.
  - Prompt input and "Ask Sovereign" button sit side-by-side (`sm:flex-row gap-3`).
  - Relational triad cards (You, Them, Between You) are distinct, legible, and well-proportioned.
  - Inline sources drawer displays 4-column pill grid (`sm:grid-cols-4`).
- **Mobile (390px)**:
  - **CRITICAL LAYOUT ISSUE**: The window header bar (`flex items-center justify-between`) attempts to show both the path (`sovereign.workspace / relational-inquiry`, ~260px) and the `BASELINE GROUNDED` badge (~130px) in a single row without `flex-wrap`. In mobile viewports with available width of 294px, the text collides with and pushes the badge off-screen or causes layout wrapping jitter.
  - *Refinement*: Truncate or hide the terminal path on small screens (`hidden sm:inline` or `truncate max-w-[120px] sm:max-w-none`), or simplify to `relational-inquiry`.

### 3.5 Comparison & Pricing Sections
- **Comparison Section**:
  - Desktop: 2-column grid (`md:grid-cols-2 gap-6`), padding `p-7`.
  - Mobile: Stacks cleanly into 2 full-width cards with clear bullet separation.
- **Pricing Section**:
  - Desktop: 2-column grid (`md:grid-cols-2 gap-6`), padding `p-8`.
  - Mobile: Stacks into 2 cards. Padding `p-8` is slightly thick on 390px screens (`p-6 sm:p-8` is recommended).

### 3.6 Authenticated Workspace (`/app`)
- **Desktop (1440px)**:
  - Navigation rail: Left vertical column `w-60` (240px) with 6 navigation items (Today, Explore, People, Systems, Library, You), plan indicator, and sign-out button.
  - Main area: Centered chat/thinking interface `max-w-3xl`, message history, sticky bottom prompt input.
  - Answer rendering: `answer-direct` computes to `1.0625rem` font size and `1.72` line-height.
- **Mobile (390px)**:
  - Navigation rail: Shifts to top horizontal bar `flex-row justify-between p-4`.
  - Tabs: Scroll horizontally via `nav className="flex md:flex-col gap-1 overflow-x-auto"`.
  - *Refinement*: The horizontal tab navigation bar displays a default native browser scrollbar on mobile. Adding `scrollbar-none` or `[&::-webkit-scrollbar]:hidden` cleans up the visual presentation.
  - Direct answer text: Computes to `1rem` with `1.72` line-height.
  - Tab transition: Smooth `.sov-tab-content` 0.18s fade-and-slide (`sov-fade-in 0.18s ease-out`).

---

## 4. Copy Simplification Opportunities

Sovereign's product principle emphasizes:
> *"User-facing language should be plain, direct, and centered on what the product helps a person do. Do not expose internal implementation terms."*

### 4.1 Test-Guarded Copy (MUST NOT BE CHANGED)
The following strings are strictly verified in `apps/web/src/LandingParity.test.ts` and `apps/web/src/PublicSupport.test.ts` and must be preserved exactly:
1. `PERSONAL AI FOR REAL LIFE`
2. `Healing isn’t optional.<br />\n              Holding onto the pain is.`
3. `Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.`
4. `Start free · No card required · Review, correct, or reject any interpretation`
5. `01 · YOU` / `Explore yourself` / `Explore how you think, decide, communicate, create, connect, and grow.` / `Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.`
6. `02 · YOU + YOUR PEOPLE` / `Relational intelligence` / `See why the same moment lands differently—and how to bridge the gap.` / `With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.`
7. `03 · FROM 1:1 TO THE WHOLE SYSTEM` / `System dynamics` / `See the whole system.` / `Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.`
8. `Why does the same conversation feel urgent to me and pressuring to them?`
9. `Ask Sovereign`
10. `WHAT YOU MAY BE BRINGING`
11. `WHAT THEY MAY BE BRINGING`
12. `WHAT HAPPENS BETWEEN YOU`
13. `See source details`
14. `These are the source values Sovereign used for this answer.`
15. `What is active for you now?`
16. `placeholder="Ask Sovereign…"`
17. `Private by default · Sovereign uses only consented data`
18. `how pressure moves`
19. `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`
20. `Support Sovereign.OS from $1.` / `one-time amount from $1` / `Separate from subscriptions` / `Support is voluntary and does not change Free or Sovereign+ access.`

### 4.2 Unguarded Copy Opportunities (Plain Language Improvements)
The following elements are NOT asserted by test suites and currently contain engineering or administrative terminology:

| Location | Current Phrasing | Proposed Plain Phrasing | Rationale |
| :--- | :--- | :--- | :--- |
| `App.tsx:342` | `THREE-LAYER ARCHITECTURE` | `THREE LAYERS OF UNDERSTANDING` or `THE THREE LAYERS` | "Architecture" is an engineering implementation term; "layers of understanding" centers on what the user experiences. |
| `App.tsx:445` | `AUTHENTICATED DEMONSTRATION · RELATIONAL INTELLIGENCE` | `INTERACTIVE PREVIEW · RELATIONAL CLARITY` | "Authenticated demonstration" sounds like a test contract checklist item. |
| `App.tsx:448` | `Sovereign Intelligence Workspace` | `See how a conversation is understood` | Clarifies the tangible value of the demonstration immediately above the terminal. |
| `App.tsx:465` | `sovereign.workspace / relational-inquiry` | `Sovereign Workspace · Relational Inquiry` (or `Relational Inquiry` on mobile) | Removes faux-terminal UNIX path syntax that clutters the UI and overflows on mobile. |
| `App.tsx:480` | `2 Baselines Permitted` | `Comparing 2 private Baselines` or `2 consented perspectives` | "Permitted" sounds like an authorization gate; "consented" or "comparing" describes the user relationship. |
| `App.tsx:617` | `EXPLORE CANONICAL INQUIRIES` | `EXPLORE REAL SITUATIONS` or `COMMON SITUATIONS TO EXPLORE` | "Canonical inquiries" is theology/database jargon; "real situations" is human. |
| `App.tsx:648` | `Has no structural memory of your operating mechanics.` | `Has no memory of how you naturally operate.` | "Operating mechanics" treats a human being as machinery. |

---

## 5. Styling and Layout Refinement Targets

### 5.1 Issue 1: Demo Terminal Header Bar Collision on 390px
- **File**: `apps/web/src/App.tsx:460-471`
- **Symptom**: `sovereign.workspace / relational-inquiry` + 3 dots + `BASELINE GROUNDED` pill exceed 294px available width.
- **Solution**: Truncate or hide the path on mobile (`<span className="ml-2 font-mono text-[11px] text-[var(--subtle)] truncate max-w-[120px] sm:max-w-none">`).

### 5.2 Issue 2: Founder Hero Headline Wrapping on Mobile
- **File**: `apps/web/src/App.tsx:281`
- **Symptom**: `text-4xl` font size allows "Healing isn’t optional." to wrap awkwardly on screens under 375px.
- **Solution**: Use `text-3xl sm:text-6xl md:text-7xl` or responsive clamp `text-[2rem] sm:text-6xl md:text-7xl`.

### 5.3 Issue 3: Heavy Card Padding on Mobile Viewports
- **File**: `apps/web/src/App.tsx:367, 391, 415, 689, 714`
- **Symptom**: Static `p-8` consumes 64px width on 390px screens.
- **Solution**: Transition to `p-6 sm:p-8` for Scope cards and Pricing cards.

### 5.4 Issue 4: IridescentLoader Dynamic Tailwind Classes
- **File**: `apps/web/src/components/IridescentLoader.tsx:22, 31, 42`
- **Symptom**: Dynamic string interpolation (`gap-${isCompact ? '2' : '3'}`, `text-[${isCompact ? '10px' : '11px'}]`) is an anti-pattern in Tailwind CSS because static extraction cannot detect interpolated strings.
- **Solution**: Use explicit static ternary strings (`isCompact ? 'gap-2' : 'gap-3'`, `isCompact ? 'text-[10px]' : 'text-[11px]'`).

### 5.5 Issue 5: Mobile Workspace Navigation Scrollbar
- **File**: `apps/web/src/App.tsx:1424`
- **Symptom**: Horizontal overflow `nav` displays standard browser scrollbar on mobile devices.
- **Solution**: Add utility classes to hide scrollbars while preserving touch scrollability (`[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`).

---

## 6. Route Integrity & Verification Status

### 6.1 Route Inventory
All 10 required routes are mapped and active in `App.tsx`:
1. `/` — `<Landing />`
2. `/how-it-works` — `<InfoPage />`
3. `/pricing` — `<Pricing />`
4. `/faq` — `<FAQ />`
5. `/terms` — `<LegalPage title="Terms of Service" />`
6. `/privacy` — `<LegalPage title="Privacy Policy" />`
7. `/login` — `<Auth mode="login" />`
8. `/signup` — `<Auth mode="signup" />`
9. `/auth/redeem` — `<Redeem />`
10. `/onboarding` — `<Onboarding />`
11. `/app` — `<Workspace />`

### 6.2 Test & Gate Verification Results
All project validation gates were run directly and confirmed passing:
- `pnpm --filter web test`: **12/12 passed** (LandingParity: 9/9, PublicSupport: 3/3)
- `pnpm test`: **399/399 passed** (69 test files across worker & sovereign-worker)
- `pnpm verify:foundation`: **PASS** (zero missing files, valid JSON, D1 schema verified)
- `pnpm typecheck`: **PASS** (zero TypeScript compiler errors across all 5 workspace projects)
- `node .agents/skills/ui-contract-validator.mjs`: **PASS** (zero forbidden styling tokens)
- `pnpm verify:cloudflare-build`: **PASS** (all 19 deployment stages completed with status `success`)

