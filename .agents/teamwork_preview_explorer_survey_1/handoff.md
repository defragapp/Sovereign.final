# Handoff Report: Explorer 1 (Survey: Product Language & Specification)

**Type**: Hard Handoff (Investigation Complete)  
**Agent ID / Name**: Explorer 1 (`teamwork_preview_explorer_survey_1`)  
**Parent Conversation ID**: `c76c6f5b-d8e4-45b7-af63-a75188c0ed34`  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_1`  
**Full Report**: `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_1/report.md`

---

## 1. Observation

Direct observations from repository files, lines, and tool outputs:

1. **`AGENTS.md` (lines 13–20)**:
   - Product boundary: `"The public product is Sovereign.OS at https://sovereign.defrag.app."`
   - Language boundary: `"User-facing language should be plain, direct, and centered on what the product helps a person do. Do not expose internal implementation terms such as Basis IDs, model/provider identifiers, sovereign-answer.v2, or model-safe context."`
   - UI rule: `"The product is chat-first. Keep the public/authenticated visual system cohesive: near-black foundation, warm readable typography, restrained sage accent, generous whitespace, subtle borders, and source-owned shadcn-style primitives. Avoid dashboard card walls, fake metrics, decorative AI effects, and framework-heavy navigation."`

2. **`docs/product-language-system.md`**:
   - Order of precedence (lines 17–28): `docs/product-language-system.md` is the canonical authority for user-facing language, brand voice, terminology, and narrative sequence.
   - Exact Founder Hero (lines 183–185, 291–297):
     - Kicker: `PERSONAL AI FOR REAL LIFE`
     - Founder hero: `Healing isn’t optional. Holding onto the pain is.`
     - Supporting copy sentence 1: `Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.`
     - Supporting copy sentence 2: `Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.`
     - Trust line: `Start free · No card required · Review, correct, or reject any interpretation`
   - Three-Layer Scope (lines 303–359):
     - `01 · YOU`: Heading: `Explore how you think, decide, communicate, create, connect, and grow.`, Description: `Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.`
     - `02 · YOU + YOUR PEOPLE`: Heading: `See why the same moment lands differently—and how to bridge the gap.`, Description: `With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.`
     - `03 · FROM 1:1 TO THE WHOLE SYSTEM`: Heading: `See the whole system.`, Description: `Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.`
   - Terminology rules (lines 114–131, 245–255, 578–624):
     - Basis is internal only; UI labels must use `Sources`, `See source details`, or `Source details`.
     - Strictly forbidden: `Basis`, `model context`, `evidence levels`, `source layers`, `provenance`, `foundation` (for Baseline), `what is supported, interpreted, and still unknown`, `healing journey`, `do the work`, `unlock your potential`.
   - Typography authority (lines 454–467): `Sovereign Display` and serif fallbacks (Georgia, Palatino) are retired from rendered UI. Title system is enterprise sans (`Inter` / `Geist Sans` / Apple SF Pro / Segoe fallbacks).

3. **`docs/inner-recognition-intelligence.md` (lines 83–147, 161–189)**:
   - `sovereign-answer.v2` structure: headline, direct answer, sections, basis_refs, correction_prompt, actions, confidence, safety_mode.
   - Basis display values are owned by server; UI must show only the plain source-details affordance (`See source details`) with codes collapsed by default.
   - Relationship answers draw from `You may be bringing`, `They may be bringing`, and `What happens between you`.

4. **`docs/baseline-question-universe-and-demonstration-strategy.md` (lines 830–845, 888–987)**:
   - In relational demonstrations, the interface presents three simultaneous fields:
     1. `You may be bringing`
     2. `They may be bringing`
     3. `What happens between you`
   - Emphasizes the *useful distinction* (e.g., timing difference vs. values conflict; directness vs. pressure) and practical de-escalation bridge.

5. **`docs/v0-visual-port-contract.md` (lines 63–85, 142–163)** & **`docs/UI_UX_CONTRACT.md` (lines 8–22)**:
   - Near-black foundation (`#000000` / `#050505` / `#09090b`), warm cream text (`#f4f0e8`), muted stone (`#a3a099`), subtle stone (`#686660`), restrained sage accent (`#9fbaa1`).
   - Sharp 1px low-contrast borders (`rgba(255, 255, 255, 0.08)`).
   - Monospace typography (`JetBrains Mono` / `ui-monospace`) for kickers, numbering, badges, and technical metadata.
   - Zero decorative AI clutter: no cyan glows, no purple glassmorphism, no fake metrics, no card walls.

6. **`apps/web/src/App.tsx` (lines 255–262, 381–431, 451–508)**:
   - Hero headline and description currently match text, but preview card in lines 381–431 currently renders `GROUNDED OBSERVATION`, `THE STRUCTURAL PATTERN`, `THE SHIFT` rather than the required relational triad (`WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU`).
   - Line 423 uses a JavaScript `alert()` for `See source details` rather than a styled drawer/disclosure.
   - Lines 457, 474, 491 have `Personal Baseline`, `Relational Intelligence`, `System Dynamics` headings rather than the exact canonical headings from `product-language-system.md:305-359`.

---

## 2. Logic Chain

1. **Premise 1 (Documentation Authority)**: By `docs/product-language-system.md:17-28` and `AGENTS.md:7-16`, user-facing copy and narrative sequence are strictly governed by `product-language-system.md`. Subordinate documents and tests cannot alter this copy.
2. **Premise 2 (Hero Consistency)**: The founder hero in `product-language-system.md:291-297` specifies the kicker `PERSONAL AI FOR REAL LIFE`, headline `Healing isn’t optional. Holding onto the pain is.`, and a 2-sentence description defining un-hackable personal AI across self, relationships, decisions, and systems.
3. **Premise 3 (Three-Layer Narrative)**: The product narrative must unfold in three layers (`01 · YOU (Explore yourself)`, `02 · YOU + YOUR PEOPLE (Relational intelligence)`, `03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics)`), each with exact approved headings and descriptions (`product-language-system.md:305-359`).
4. **Premise 4 (Relational Intake Preview Triad)**: In `inner-recognition-intelligence.md:175-176` and `baseline-question-universe-and-demonstration-strategy.md:830-845`, the demonstration of relationship intelligence must show `WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, and `WHAT HAPPENS BETWEEN YOU`, supported by quiet `Sources` disclosure (never `Basis`).
5. **Premise 5 (Visual Cohesion)**: `AGENTS.md:17-20`, `UI_UX_CONTRACT.md:8-22`, and `v0-visual-port-contract.md:63-85` require an industrial monochromatic aesthetic (#000000/#050505, 1px borders, Inter/Geist Sans typography, JetBrains Mono micro-labels, restrained sage accent, zero AI clutter).
6. **Inference**: Therefore, any Framer prototype (Session 2 / `nice-pluto-305324.framer.app`) and the React codebase (`apps/web/src/App.tsx`) must align to these exact verbatim strings, section structures, and visual rules.

---

## 3. Caveats

- **Scope Boundary**: This investigation is read-only. No source code in `apps/web/src` was modified during this turn.
- **Framer Access**: The Framer project environment (`nice-pluto-305324.framer.app`) is managed via `@framer/agent` in subsequent steps; this survey provides the governing specification for that design agent.
- **Worlds/Video Exclusion**: Per `AGENTS.md:35` and `docs/launch-product-contract.md:40`, Worlds/video generation is strictly excluded from launch runtime and must not appear in copy or CTAs.

---

## 4. Conclusion

The specification is fully cataloged in `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_1/report.md`. The design team (for Framer) and frontend engineering team (for React `App.tsx`) have unambiguous, verbatim specifications for:
- The Founder Hero with exact kicker, headline, 2-sentence description, and trust line.
- The Three-Layer Scope (`01 · YOU`, `02 · YOU + YOUR PEOPLE`, `03 · FROM 1:1 TO THE WHOLE SYSTEM`).
- The Sovereign Answer v2 Demo with the relational intake triad (`WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU`) and quiet `Sources` disclosure.
- The high-contrast industrial monochromatic visual design system (#000000 foundation, 1px borders, Inter & JetBrains Mono, restrained sage accent).
- The complete matrix of approved vs. prohibited terminology.

---

## 5. Verification Method

To independently verify the facts and constraints in this handoff:

1. **Verify Prohibited Terminology Absence**:
   Run grep to ensure no prohibited terms exist in user-facing templates:
   ```bash
   rg -i "what is basis|model context|evidence levels|source layers|foundation" apps/web/src/App.tsx
   ```
2. **Verify Hero and Heading Strings**:
   Inspect `apps/web/src/App.tsx` and compare against `docs/product-language-system.md:291-359`:
   ```bash
   rg "Healing isn’t optional" apps/web/src/App.tsx
   rg "PERSONAL AI FOR REAL LIFE" apps/web/src/App.tsx
   rg "01 · YOU" apps/web/src/App.tsx
   ```
3. **Verify Foundation Release Tests**:
   Run the project foundation verifier:
   ```bash
   node scripts/verify-foundation.mjs
   ```
   (Expected output: `Foundation verified: 5 required files, JSON valid, core D1 tables present.`)
4. **Invalidation Conditions**:
   - Introduction of `Basis` or `model context` into UI headings or labels.
   - Substitution of serif typefaces (`Sovereign Display`, Georgia) into rendered headings.
   - Alteration of the founder hero text or kicker.
   - Reduction of `01 · YOU` or `03 · FROM 1:1 TO THE WHOLE SYSTEM` into conflict-only or responsibility-only descriptions.
