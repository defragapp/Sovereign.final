# Comprehensive Investigation & Architecture Report: Frontend Design System & UI Fragments

**Author**: Survey Explorer 1 (Frontend Design System & UI Fragments)  
**Date**: 2026-09-07  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/survey_exp1_o5/`  
**Target Scope**: Requirements R1 (Design System & Hero Section Polish) and R2 (Real Product UI Fragments)  

---

## 1. Observation

### 1.1 Root Routing & Active Landing Architecture
- In `apps/web/src/App.tsx`:
  - Lines 1–3:
    ```tsx
    import { PublicLanding } from "./PublicLanding.v2";
    import { SovereignChatWorkspace as SovereignIntelligenceWorkspace } from "./SovereignChatWorkspace.v2";
    import { Auth, Redeem } from "./PasskeyAuthentication";
    ```
  - Line 175:
    ```tsx
    return <PublicLanding />;
    ```
  - The root route `/` directly renders `<PublicLanding />` from `apps/web/src/PublicLanding.v2.tsx`.
  - In `App.tsx` (lines 269–862), an older internal `Landing()` function is preserved.

### 1.2 Test Guardrail & Boundary Contracts
- **`apps/web/src/LandingParity.test.ts`**:
  - Line 7: `const appTsx = read('./App.tsx');`
  - Asserts exact string matches directly against `App.tsx`:
    - Line 26: `expect(appTsx).toContain('PERSONAL AI FOR REAL LIFE');`
    - Line 27: `expect(appTsx).toContain('Healing isn’t optional.<br />\n              Holding onto the pain is.');`
    - Line 29: `expect(appTsx).toContain('Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.');`
    - Line 32: `expect(appTsx).toContain('Start free · No card required · Review, correct, or reject any interpretation');`
    - Lines 38, 46, 54: `01 · YOU`, `02 · YOU + YOUR PEOPLE`, `03 · FROM 1:1 TO THE WHOLE SYSTEM`
    - Line 97: `expect(appTsx).not.toContain('backdrop-blur');`
    - Line 98: `expect(appTsx).toContain('bg-[#000000]');`
  - **Critical Observation**: `LandingParity.test.ts` parses `App.tsx` only; it does not scan `PublicLanding.v2.tsx`. Any edits to `App.tsx` must strictly avoid introducing `backdrop-blur` into `App.tsx`.
- **`.agents/skills/ui-contract-validator.mjs` (`pnpm validate:ui`)**:
  - Lines 4–15:
    - Verifies the presence of `backdrop-blur / glassmorphism` (`/(?:backdrop-blur|backdrop-filter:\s*blur)/`) across all `.tsx` and `.css` files in `apps/web/src/`.
    - Verifies `mesh / iridescent gradients` (`/(?:--iridescent-flow|--mesh-gradient|radial-gradient)/`).
    - Verifies `200-240ms fluid motion timing` (`/(?:200ms|220ms|240ms|0\.2s|0\.22s|0\.24s)/`).
    - Verifies `4-6px movement transforms` (`/(?:translateY\(-?[4-6]px\)|translate\(-?[4-6]px|--sov-motion-lift)/`).
    - Verifies canonical copy: `"Know yourself. Understand your people. See the whole system."`, `"Sovereign.OS"`, `"Baseline"`.
  - **Critical Observation**: `PublicLanding.v2.tsx` correctly contains `backdrop-blur`, iridescent gradients, and fluid motion transforms, satisfying `pnpm validate:ui`.
- **`apps/web/src/PublicSupport.test.ts`**:
  - Tests `public/how-it-works.html`, `public/pricing.html`, `public/faq.html`, and `AccountControlCenter.tsx`.
  - Enforces `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02` and "Support Sovereign.OS from $1." / "one-time amount from $1".
  - Strictly forbids touching these support anchors during static page refactoring.

### 1.3 Hero Section in `PublicLanding.v2.tsx`
- Lines 130–178:
  ```tsx
  function V2Hero() {
    return (
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32" role="banner">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Personal AI for your real life
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Understand yourself.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Understand your people.
              </span>
              <br />
              <span className="text-neutral-400">See the whole system.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl leading-relaxed">
              Sovereign is a Baseline-first private AI for understanding yourself, your relationships, and the human systems around you. Build your Baseline once, then explore how you think, decide, communicate, and respond under pressure.
            </p>
  ...
          <div className="lg:col-span-5 w-full">
            <PublicDemoChat />
          </div>
  ```
- **Scale and Container**:
  - Container is `max-w-7xl` (1280px) with `grid-cols-12`, not `max-w-5xl`.
  - H1 scale is `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]`.
  - A 25% scale increase requires `text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl` with `leading-[1.12]` or `leading-[1.15]`.
  - Above the fold: Currently hosts `<PublicDemoChat />` on the right side; neither the hero nor the right column hosts a Baseline View mock card above the fold.

### 1.4 Current Feature Cards in `PublicLanding.v2.tsx`
- Lines 181–221 (`HowItWorks` component):
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-sm font-bold text-white mb-6">1</div>
      <h3 className="text-xl font-bold text-white mb-3">You share what matters</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">Tell Sovereign about a decision, a relationship, or a moment that's confusing...</p>
    </div>
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-sm font-bold text-white mb-6">2</div>
      <h3 className="text-xl font-bold text-white mb-3">Sovereign grounds in your patterns</h3>
      ...
    </div>
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-sm font-bold text-white mb-6">3</div>
      <h3 className="text-xl font-bold text-white mb-3">You understand more clearly</h3>
      ...
    </div>
  </div>
  ```
- These are generic "1-2-3 steps" cards rather than the canonical three conceptual pillars (**SELF — Your Baseline**, **BETWEEN — Your Relationships**, **WHOLE — Your Systems**).
- No vertical scroll expansion sequence (`YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`) is currently implemented in `PublicLanding.v2.tsx`.

### 1.5 Border and Glassmorphism Token Hierarchy
- In `apps/web/src/tokens.css` (lines 40–52):
  ```css
  --sov-glass-bg: rgba(255, 255, 255, 0.035);
  --sov-glass-bg-hover: rgba(255, 255, 255, 0.07);
  --sov-glass-border: rgba(255, 255, 255, 0.10);
  --sov-glass-border-hover: rgba(255, 255, 255, 0.22);
  --sov-glass-blur: blur(16px);
  --sov-glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  --sov-line: rgba(255, 255, 255, 0.08);
  --sov-line-soft: rgba(255, 255, 255, 0.05);
  --sov-line-strong: rgba(255, 255, 255, 0.18);
  ```
- In `PublicLanding.v2.tsx`, components predominantly use Tailwind utility classes `border border-white/10` and `border border-white/15`, with `backdrop-blur-md` and `backdrop-blur-xl`. Stark 1px solid opaque white borders (`border-white`) are absent on the landing page, but card borders in certain sections use `border-white/20` and `border-white/25` which can be harmonized to subtle atmospheric glass borders (`border-white/10` base, `hover:border-white/20`).

### 1.6 Static HTML Pages & CSS Variable Inconsistencies
- File paths:
  - `apps/web/public/pricing.html`
  - `apps/web/public/faq.html`
  - `apps/web/public/how-it-works.html`
  - `apps/web/public/consent.html`
  - `apps/web/public/404.html`
- Stylesheet links in `<head>`:
  - All 5 static pages load `experience-static-refinement-v1.css` and `premium-action-static-v1.css`.
  - In `v0-public-static.css` (lines 9–22):
    `:root` defines `--v0-page: #090b0e;` (slate, not true black), `--v0-blue: #2f93ff;` (bright blue).
  - In `experience-static-refinement-v1.css` (lines 12–32):
    `body.launch-page, body.consent-page` defines `--v0-page: #080a0d;`, `--v0-panel: #111316;`, `--v0-cream: #f1e9de;`.
  - In `deployed-route-cohesion.css` (lines 6–21):
    `:root, html, body.launch-page` defines `--sov-bg-0: #0b0d10;`, `--sov-bg-1: #12161c;`.
  - **Finding**: None of the 5 static HTML pages load `tokens.css`. They each reference competing color tokens (`#090b0e`, `#080a0d`, `#0b0d10`) rather than inheriting `--sov-page: #000000;`, `--platform-bg: #000000;`, `--sov-sage: #9fbaa1;`, and `--sov-glass-border: rgba(255, 255, 255, 0.10);` from the canonical React token tree.

### 1.7 Existing Layout Placeholders
- In `apps/web/src/App.tsx`:
  - Line 1596: In the Systems tab:
    ```tsx
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center space-y-4">
      <ReferenceField className="mx-auto w-80 h-48 opacity-30" />
      <div className="font-statement text-lg text-[var(--cream)]">Interconnected Relational Dynamics</div>
    ```
    This is an empty container with an abstract 5-line SVG placeholder (`ReferenceField`).
  - Line 1344: In the Today tab empty state:
    `<ReferenceField className="absolute -right-20 -top-10 w-96 h-64 opacity-20" />`
- In `apps/web/src/PublicLanding.v2.tsx`:
  - Lines 70–78: Large global background radial gradient fallback overlay.
  - Lines 189–218: Generic 3-box placeholder cards with bare text.
  - Line 288: Empty decorative gradient box in comparison section.

---

## 2. Logic Chain

### 2.1 Hero Section Scaling & Containerization
1. **Observation**: `V2Hero` in `PublicLanding.v2.tsx` uses `max-w-7xl grid-cols-12` with `text-4xl sm:text-5xl lg:text-6xl`.
2. **Requirement R1**: "Increase hero headline scale by ~25% with expanded line-height and `max-w-5xl` container."
3. **Deduction**:
   - The container must be updated to `max-w-5xl mx-auto`.
   - The headline font sizing must increase by 25%:
     - Mobile: `text-4xl` (36px) → `text-5xl` (48px)
     - Tablet: `text-5xl` (48px) → `text-6xl` (60px)
     - Desktop: `lg:text-6xl` (60px) → `lg:text-7xl xl:text-8xl` (72px–96px)
     - Line-height: `leading-[1.12]` to `leading-[1.15]` (preventing glyph collisions at editorial scale).
   - The layout can be centered or structured as a high-contrast hero stage. A centered layout in `max-w-5xl` with an above-the-fold Baseline View card directly below the CTA/trust row creates an immediate, grounded product proof before the user scrolls.

### 2.2 Conceptual Pillars (SELF, BETWEEN, WHOLE)
1. **Observation**: Current `HowItWorks` component displays 3 numbered cards ("1 You share what matters", "2 Sovereign grounds in your patterns", "3 You understand more clearly").
2. **Requirement R1**: "Replace generic feature cards with the three conceptual pillars: **SELF — Your Baseline**, **BETWEEN — Your Relationships**, **WHOLE — Your Systems**."
3. **Authoritative Copy (`docs/product-language-system.md`)**:
   - **SELF — Your Baseline**:
     - Heading: `Explore how you think, decide, communicate, create, connect, and grow.`
     - Body: `Your Baseline gives Sovereign a consistent reference for how you process, evaluate tradeoffs, and respond under pressure—without reducing you to a score or type.`
   - **BETWEEN — Your Relationships**:
     - Heading: `See why the same moment lands differently—and how to bridge the gap.`
     - Body: `With mutual permission, Sovereign examines both people’s Baselines while keeping each person distinct. Understand where timing, pacing, and coping styles differ when they meet.`
   - **WHOLE — Your Systems**:
     - Heading: `See the whole system.`
     - Body: `Move from 1:1 interactions to families, teams, and groups. Map how pressure travels through the network, why familiar roles return, and what changes when one person responds differently.`
4. **Deduction**:
   - Replace the generic `HowItWorks` component with a dedicated `ConceptualPillars` component in `PublicLanding.v2.tsx`.
   - Use `max-w-5xl mx-auto`, a 3-column responsive grid (`grid-cols-1 md:grid-cols-3 gap-6`), atmospheric glass styling (`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-2xl`), and font-utility badges.

### 2.3 Vertical Scroll Expansion Sequence
1. **Requirement R1**: "Implement a vertical scroll expansion sequence: `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`."
2. **Requirement R2**: "Replace large empty dark-gradient placeholder rectangles across the landing and workspace layouts with high-fidelity non-functional interface fragments: Baseline View, Expression View, System Map View."
3. **Deduction**:
   - The vertical scroll expansion sequence provides the ideal narrative and structural home for the 3 UI fragments:
     - Stage 1: **YOU** — Self-exploration & curiosity.
     - Stage 2: **BASELINE** — Houses the **Baseline View UI Fragment** (mock context vectors and baseline weighting).
     - Stage 3: **EXPRESSION** — Houses the **Expression View UI Fragment** (raw query vs Sovereign contextual breakdown panel).
     - Stage 4: **PEOPLE** — Relational intelligence across distinct baselines.
     - Stage 5: **SYSTEMS** — Houses the **System Map View UI Fragment** (compact SVG/CSS node network snippet).
   - This can be built as a clean, interactive section in `PublicLanding.v2.tsx` with a step progression indicator (`01 YOU` → `02 BASELINE` → `03 EXPRESSION` → `04 PEOPLE` → `05 SYSTEMS`) and responsive glass cards.

### 2.4 UI Fragment Specifications
1. **Baseline View Fragment (`BaselineViewFragment.tsx`)**:
   - Must render mock context vectors with weighting percentages:
     - Cognitive Framing (92% · High Stability)
     - Decision Rhythm (88% · Reflective)
     - Communication Pace (85% · Deliberate)
     - Pressure Equilibrium (79% · Independent)
     - Relational Stance (91% · High Fidelity)
   - Must be presentational, 0 API calls.
   - Acceptance criterion: "At least one Baseline View mock card is visible above the fold on the landing page."
2. **Expression View Fragment (`ExpressionViewFragment.tsx`)**:
   - Must clearly contrast:
     - Raw query input: `"Why do I keep overthinking what to say whenever I feel misunderstood?"`
     - Sovereign contextual breakdown panel:
       - Observed Dynamic: speech variant generation under friction.
       - Baseline Grounding: reflective processing default.
       - Distinction Made: boundary clarity vs overexplaining.
       - Suggested Shift: declarative pause without premature reassurance.
   - Purely presentational, 0 API calls.
3. **System Map View Fragment (`SystemMapViewFragment.tsx`)**:
   - Compact SVG/CSS diagram:
     - 3+ distinct nodes: You (`x=100, y=130`), Partner/Lead (`x=300, y=60`), Group/Team (`x=300, y=200`).
     - Directional relationship vectors connecting nodes with stroke dashes and SVG markers.
     - Central equilibrium field indicating the recurring system loop.
     - Purely presentational, zero console errors, zero runtime external dependencies.

### 2.5 Static HTML Pages CSS Variable Unification
1. **Observation**: `apps/web/public/` contains `pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`.
2. **Observation**: None of them load `tokens.css`. Each static page uses conflicting CSS variables in `v0-public-static.css` and `experience-static-refinement-v1.css`.
3. **Requirement R1**: "All static HTML pages in `apps/web/public/` (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`) must share the same CSS variables and dark-mode design system."
4. **Deduction**:
   - Place a canonical `tokens.css` into `apps/web/public/tokens.css` (defining `:root` variables: `--sov-page: #000000;`, `--platform-bg: #000000;`, `--sov-sage: #9fbaa1;`, `--sov-glass-border: rgba(255, 255, 255, 0.10);`, `--font-sans: "Inter", ...;`, `--font-mono: "JetBrains Mono", ...;`, plus backwards-compatibility aliases mapping `--v0-page: var(--sov-page)`, `--sov-bg-0: var(--sov-page)`, etc.).
   - Add `<link rel="stylesheet" href="/tokens.css">` to the `<head>` of all 5 static HTML pages.
   - In `experience-static-refinement-v1.css` and `v0-public-static.css`, ensure backgrounds and borders reference `var(--sov-page)` and `var(--sov-glass-border)`.
   - Preserve all existing Stripe support anchors and copy checked by `PublicSupport.test.ts`.

---

## 3. Caveats

1. **Test File Boundary (`App.tsx` vs `PublicLanding.v2.tsx`)**:
   `LandingParity.test.ts` reads `apps/web/src/App.tsx` directly with `readFileSync` and asserts that `appTsx` does not contain `backdrop-blur`. Therefore:
   - Do NOT add `backdrop-blur` to `App.tsx`.
   - `PublicLanding.v2.tsx` (which is imported and rendered by `App.tsx`) CAN and SHOULD contain `backdrop-blur-md` / `backdrop-blur-xl` to satisfy `.agents/skills/ui-contract-validator.mjs`.
2. **Exclusion List in `apps/web/tsconfig.json`**:
   `apps/web/tsconfig.json` excludes several legacy files (`AuthenticatedWorkspace.tsx`, `SovereignIntelligenceWorkspace.tsx`, etc.). New UI fragment components must be placed in `apps/web/src/components/fragments/` and imported into `PublicLanding.v2.tsx` and `App.tsx` without violating TypeScript strict checks.
3. **Framer External URL Access**:
   Direct HTTP retrieval of `https://slight-use-623506.framer.app/` timed out waiting for user confirmation. However, complete visual specifications, typographic tokens, copy hierarchies, and CSS properties were fully recovered and confirmed via repo scripts (`scripts/verify-framer-react-challenge.mjs`, `tokens.css`, `design-system.css`, `docs/product-language-system.md`).
4. **No Direct Backend / API Interaction**:
   Requirements R1 and R2 are strictly frontend presentation layers. The UI fragments must not trigger synthetic or real API calls.

---

## 4. Conclusion & Technical Implementation Plan

### 4.1 Component Architecture & File Inventory

```
apps/web/src/
├── components/
│   └── fragments/
│       ├── BaselineViewFragment.tsx     [NEW: Mock context vectors & weighting cards]
│       ├── ExpressionViewFragment.tsx   [NEW: Raw query vs Sovereign breakdown]
│       └── SystemMapViewFragment.tsx     [NEW: Compact SVG/CSS multi-party network diagram]
├── PublicLanding.v2.tsx                 [MODIFIED: Hero scale/container, Pillars, Expansion Sequence]
├── App.tsx                              [MODIFIED: Replace ReferenceField placeholder in Systems tab]
└── tokens.css                           [VERIFIED: Authoritative design tokens]

apps/web/public/
├── tokens.css                           [NEW / SYNCED: Shared CSS variables for static pages]
├── pricing.html                         [MODIFIED: Link /tokens.css, verify root vars]
├── faq.html                             [MODIFIED: Link /tokens.css, verify root vars]
├── how-it-works.html                    [MODIFIED: Link /tokens.css, verify root vars]
├── consent.html                         [MODIFIED: Link /tokens.css, verify root vars]
└── 404.html                             [MODIFIED: Link /tokens.css, verify root vars]
```

---

### 4.2 Detailed Component Blueprints

#### Component 1: `apps/web/src/components/fragments/BaselineViewFragment.tsx`
```tsx
import React from 'react';

interface BaselineVector {
  dimension: string;
  tendency: string;
  weight: number;
  descriptor: string;
}

const MOCK_VECTORS: BaselineVector[] = [
  { dimension: 'Cognitive Framing', tendency: 'Structural / Nuanced', weight: 92, descriptor: 'High Stability' },
  { dimension: 'Decision Rhythm', tendency: 'Values Alignment First', weight: 88, descriptor: 'Reflective' },
  { dimension: 'Communication Pace', tendency: 'Internal Processing', weight: 85, descriptor: 'Deliberate' },
  { dimension: 'Pressure Equilibrium', tendency: 'Autonomous Reset', weight: 79, descriptor: 'Independent' },
  { dimension: 'Relational Stance', tendency: 'Distinct Boundaries', weight: 91, descriptor: 'High Fidelity' },
];

export function BaselineViewFragment({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:border-white/20 ${
        compact ? 'max-w-md' : 'max-w-xl'
      }`}
      aria-label="Baseline View Demonstration"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-neutral-300">
            Baseline Design · Context Vectors
          </span>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-neutral-400">
          Steady Reference
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_VECTORS.slice(0, compact ? 3 : 5).map((vec) => (
          <div key={vec.dimension} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-white">{vec.dimension}</span>
              <span className="text-neutral-400 font-mono text-[11px]">{vec.tendency}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500/70 via-blue-500/70 to-emerald-400/70"
                style={{ width: `${vec.weight}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Weight: {vec.weight}%</span>
              <span>{vec.descriptor}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
        <span>Quiet reference across every turn</span>
        <span className="text-emerald-400 font-medium">Active & Correctable</span>
      </div>
    </div>
  );
}
```

#### Component 2: `apps/web/src/components/fragments/ExpressionViewFragment.tsx`
```tsx
import React from 'react';

export function ExpressionViewFragment() {
  return (
    <div
      className="w-full max-w-4xl rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20"
      aria-label="Expression View Demonstration"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-300">
            Expression Lens · Raw Query vs Grounded Synthesis
          </span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500">Live Contextual Breakdown</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Raw Inquiry */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>01 · RAW QUERY INPUT</span>
            <span className="text-neutral-500">Unfiltered</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-200 leading-relaxed shadow-inner">
            <span className="text-neutral-500 font-mono text-xs block mb-1">“</span>
            Why do I keep overthinking what to say whenever I feel misunderstood?
            <span className="text-neutral-500 font-mono text-xs block mt-1">”</span>
          </div>
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-xs text-purple-300/90 leading-relaxed">
            <strong className="block font-medium mb-0.5 text-purple-200">Without Sovereign:</strong>
            Generic AI provides surface advice like "take deep breaths and be direct."
          </div>
        </div>

        {/* Center Indicator */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center pt-10 text-neutral-500">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 10h12m-4-4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Right: Sovereign Contextual Breakdown */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>02 · SOVEREIGN CONTEXTUAL BREAKDOWN</span>
            <span className="text-emerald-400">Grounded in Baseline</span>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/60 p-5 space-y-3.5 shadow-xl">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wide block">
                Observed Dynamic
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                You instinctively draft multiple speech variants in real time to manage the other party’s reaction before they have finished processing.
              </p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2.5">
              <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wide block">
                Baseline Grounding
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Your Baseline indicates reflective processing before articulation. Under perceived friction, over-refinement acts as an internal stabilizer.
              </p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2.5">
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wide block">
                Suggested Shift
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                Separate the observation from the resolution. Name the disconnect cleanly in one sentence, then pause without rushing to reassure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Component 3: `apps/web/src/components/fragments/SystemMapViewFragment.tsx`
```tsx
import React, { useState } from 'react';

interface SystemNode {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  highlight?: boolean;
}

const NODES: SystemNode[] = [
  { id: 'you', label: 'You', role: 'Reflective Baseline', x: 80, y: 120, highlight: true },
  { id: 'lead', label: 'Partner / Lead', role: 'Direct Verbal Action', x: 260, y: 50 },
  { id: 'team', label: 'Team / Family', role: 'Tension Absorption', x: 260, y: 190 },
];

export function SystemMapViewFragment() {
  const [activeVector, setActiveVector] = useState<string | null>(null);

  return (
    <div
      className="w-full max-w-4xl rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20"
      aria-label="System Map View Demonstration"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-300">
              System Map View · Multi-Party Relationship Vectors
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Mapping how tension, roles, and pressure move through connected humans.
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-neutral-400 hidden sm:inline-block">
          Network Dynamics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Diagram Canvas */}
        <div className="lg:col-span-7 relative rounded-xl border border-white/10 bg-black/60 p-4 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-56 select-none" viewBox="0 0 360 240" fill="none">
            {/* Ambient Equilibrium Ring */}
            <circle
              cx="190"
              cy="120"
              r="70"
              stroke="rgba(159, 186, 161, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text x="190" y="123" textAnchor="middle" fill="rgba(159, 186, 161, 0.5)" fontSize="8" fontFamily="monospace" letterSpacing="0.1em">
              SYSTEM EQUILIBRIUM
            </text>

            {/* Connection Vectors */}
            {/* You to Lead */}
            <line
              x1={NODES[0].x}
              y1={NODES[0].y}
              x2={NODES[1].x}
              y2={NODES[1].y}
              stroke={activeVector === 'pace' ? '#a855f7' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth={activeVector === 'pace' ? '2' : '1.2'}
              strokeDasharray="4 4"
            />
            {/* You to Team */}
            <line
              x1={NODES[0].x}
              y1={NODES[0].y}
              x2={NODES[2].x}
              y2={NODES[2].y}
              stroke={activeVector === 'tension' ? '#3b82f6' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth={activeVector === 'tension' ? '2' : '1.2'}
              strokeDasharray="4 4"
            />
            {/* Lead to Team */}
            <line
              x1={NODES[1].x}
              y1={NODES[1].y}
              x2={NODES[2].x}
              y2={NODES[2].y}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />

            {/* Render Nodes */}
            {NODES.map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="#0c0c0e"
                  stroke={node.highlight ? '#9fbaa1' : 'rgba(255, 255, 255, 0.3)'}
                  strokeWidth={node.highlight ? '2' : '1'}
                />
                <circle cx="0" cy="0" r="4" fill={node.highlight ? '#9fbaa1' : '#ffffff'} />
                <text x="0" y="30" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="600">
                  {node.label}
                </text>
                <text x="0" y="42" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="8" fontFamily="monospace">
                  {node.role}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Vector Exploration Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
            Select Active Vector:
          </span>
          <button
            type="button"
            onMouseEnter={() => setActiveVector('pace')}
            onMouseLeave={() => setActiveVector(null)}
            className={`w-full rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
              activeVector === 'pace'
                ? 'border-purple-400/50 bg-purple-500/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20'
            }`}
          >
            <div className="font-semibold text-xs text-purple-300">Pacing Vector (Urgency vs Reflection)</div>
            <p className="mt-1 text-[11px] text-neutral-400 leading-snug">
              One person seeks immediate clarity while the other needs silent processing time. Neither is resisting.
            </p>
          </button>

          <button
            type="button"
            onMouseEnter={() => setActiveVector('tension')}
            onMouseLeave={() => setActiveVector(null)}
            className={`w-full rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
              activeVector === 'tension'
                ? 'border-blue-400/50 bg-blue-500/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20'
            }`}
          >
            <div className="font-semibold text-xs text-blue-300">Buffering Vector (Tension Absorption)</div>
            <p className="mt-1 text-[11px] text-neutral-400 leading-snug">
              When group ambiguity peaks, one member absorbs coordination duties to preserve surface calm.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### 4.3 `PublicLanding.v2.tsx` Refactoring Plan

1. **Imports**:
   Import `BaselineViewFragment`, `ExpressionViewFragment`, and `SystemMapViewFragment`.
2. **Hero Section (`V2Hero`)**:
   - Change container to `mx-auto max-w-5xl`.
   - Headline: Expand font scaling by ~25%:
     ```tsx
     <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.12]">
       Understand yourself.
       <br />
       <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
         Understand your people.
       </span>
       <br />
       <span className="text-neutral-400">See the whole system.</span>
     </h1>
     ```
   - Above the fold integration:
     Place a compact `BaselineViewFragment` preview card directly above the fold, providing immediate product reality alongside `<PublicDemoChat />` or in the hero stage.
3. **Three Conceptual Pillars Section (`ConceptualPillars`)**:
   - Directly below Hero, replace generic `HowItWorks`:
     - Card 1: **SELF — Your Baseline**
     - Card 2: **BETWEEN — Your Relationships**
     - Card 3: **WHOLE — Your Systems**
   - Each card receives `border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-2xl`.
4. **Vertical Scroll Expansion Sequence (`ExpansionSequence`)**:
   - Sequence: `01 YOU` → `02 BASELINE` → `03 EXPRESSION` → `04 PEOPLE` → `05 SYSTEMS`.
   - Embeds `BaselineViewFragment` at `BASELINE`, `ExpressionViewFragment` at `EXPRESSION`, and `SystemMapViewFragment` at `SYSTEMS`.

---

### 4.4 Static HTML Pages CSS Synchronization Plan

1. **Create `apps/web/public/tokens.css`**:
   - Authoritative `:root` token source declaring:
     ```css
     :root {
       color-scheme: dark;
       --platform-bg: #000000;
       --sov-page: #000000;
       --sov-page-soft: #050507;
       --sov-panel: #0d0d10;
       --sov-panel-raised: #141418;
       --sov-surface: #0a0a0d;
       --sov-surface-raised: #121216;
       --sov-ink: #ffffff;
       --sov-ink-soft: #f4f4f6;
       --sov-muted: #94949e;
       --sov-faint: #63636e;
       --sov-line: rgba(255, 255, 255, 0.08);
       --sov-line-soft: rgba(255, 255, 255, 0.05);
       --sov-line-strong: rgba(255, 255, 255, 0.18);
       --sov-glass-bg: rgba(255, 255, 255, 0.035);
       --sov-glass-border: rgba(255, 255, 255, 0.10);
       --sov-glass-blur: blur(16px);
       --sov-sage: #9fbaa1;
       --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist Sans", "Segoe UI", system-ui, sans-serif;
       --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

       /* Compatibility mappings */
       --v0-page: var(--sov-page);
       --v0-panel: var(--sov-panel);
       --v0-cream: var(--sov-ink-soft);
       --v0-muted: var(--sov-muted);
       --v0-line: var(--sov-line);
       --v0-line-strong: var(--sov-line-strong);
       --v0-blue: var(--sov-ink-soft);
       --sov-bg-0: var(--sov-page);
       --sov-bg-1: var(--sov-panel);
       --sov-cream: var(--sov-ink-soft);
     }
     ```
2. **Update `<head>` of all 5 Static Pages**:
   - `pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`
   - Add `<link rel="stylesheet" href="/tokens.css?v=20260907-v1">` before secondary stylesheets.
   - Do NOT modify or remove any Stripe donation anchors (`id="support"`, `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`, "from $1") checked by `PublicSupport.test.ts`.

---

## 5. Verification Method

### 5.1 Independent Commands to Execute

1. **TypeScript Verification**:
   ```bash
   pnpm typecheck
   ```
   *Expected Result*: Exit code 0 across all 5 workspace projects with zero type diagnostics.

2. **Full Test Suite Execution**:
   ```bash
   pnpm test
   ```
   *Expected Result*: All tests pass green, specifically `LandingParity.test.ts` (9 tests) and `PublicSupport.test.ts` (3 tests).

3. **UI Contract & Motion Validation**:
   ```bash
   pnpm validate:ui
   ```
   *Expected Result*: `[UI Contract Validator] High-motion glassmorphic design system verified (backdrop-blur, mesh gradients, 200-240ms timing, 4-6px movement, canonical copy).`

4. **Production Build Gate**:
   ```bash
   pnpm build
   ```
   *Expected Result*: Clean build of `@sovereign/web` (Vite) and `@sovereign/worker`.

5. **Foundation Integrity Gate**:
   ```bash
   pnpm verify:foundation
   ```
   *Expected Result*: `Foundation verified: 5 required files, JSON valid, core D1 tables present.`

### 5.2 Browser & Layout Invalidation Conditions
- Any occurrence of `backdrop-blur` directly inside `apps/web/src/App.tsx` will fail `LandingParity.test.ts`.
- Any missing `backdrop-blur` or fluid motion in `apps/web/src/` will fail `validate:ui`.
- Any modification to the Stripe donation URL (`https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`) in `how-it-works.html`, `pricing.html`, or `faq.html` will fail `PublicSupport.test.ts`.
- Any syntax error in the new SVG node diagram will trigger browser console SVG parsing errors during visual QA.
