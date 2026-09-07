# Sovereign.OS Specification & Product Language Survey Report

**Explorer 1 (Survey: Product Language & Specification)**  
**Date**: 2026-09-07  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_1`  
**Target Surfaces**: Framer Design Preview (`nice-pluto-305324.framer.app`) & Production React Codebase (`apps/web/src/App.tsx`)

---

## 1. Executive Summary & Authoritative Hierarchy

This survey establishes the complete, authoritative product language, copy framing, and visual design specifications for Sovereign.OS. It synthesizes rules from the repository's governing contracts to ensure total fidelity across both the visual design phase in Framer and the production implementation in React.

### Documentation Authority and Precedence

According to `docs/product-language-system.md` (lines 17–28) and `AGENTS.md`:
1. **`docs/product-language-system.md`** governs all user-facing language, brand voice, terminology boundaries, and narrative sequence.
2. **`AGENTS.md`** governs repository launch boundaries, core UI rules, and the first acceptance path.
3. **`docs/launch-product-contract.md`** governs the included product capabilities, gating, and acceptance boundaries.
4. **`docs/inner-recognition-intelligence.md`** governs intelligence models, answer schemas (`sovereign-answer.v2`), and Basis validation.
5. **`docs/v0-visual-port-contract.md` & `docs/UI_UX_CONTRACT.md`** govern visual architecture, stylesheets, and typographic standards.
6. **`docs/baseline-question-universe-and-demonstration-strategy.md`** governs the canonical question universe, intent taxonomy, and demonstration fixtures.

*Rule of Precedence*: Subordinate documents, release verifiers, or historical test fixtures must not invent UI copy or alter governing language. When conflicts arise, `docs/product-language-system.md` strictly overrides subordinate files.

---

## 2. Explicit Copy Guidelines & Terminology System

### 2.1 Brand Architecture & Identity

| Dimension | Canonical Formulation | Governing Rule |
| :--- | :--- | :--- |
| **Product Category** | `Private personal AI for real life.` | Never describe as a generic chatbot, coaching assistant, or horoscope. |
| **Root Product Promise** | `Understand yourself. Understand your people. See the whole system.` | Use as a concise description of scope when one line is needed; not a substitute for the founder hero. |
| **Founder Hero Statement** | `Healing isn’t optional. Holding onto the pain is.` | Founder-locked root headline. Curly apostrophe required (`isn’t`). Must not be altered. |
| **Enduring Brand Line** | `Know yourself. Understand your people. See the whole system.` | Deeper brand statement or closing CTA line. |
| **Public Product Name** | `Sovereign.OS` (or `Sovereign`) | Public URL: `https://sovereign.defrag.app`. |

---

### 2.2 Terminology Matrix: Required Public vs. Prohibited Internal Terms

User-facing language must be plain, direct, and focused on what the person can explore or understand. Technical machinery stays underneath the interface.

| Category | Required / Approved User-Facing Term | Strictly Prohibited Internal / Retired Term | Rationale & Authority |
| :--- | :--- | :--- | :--- |
| **Source Data / Evidence** | **`Sources`**, **`See source details`**, **`Source details`** | `Basis`, `Example Basis`, `provenance`, `evidence levels`, `source layers`, `model-safe context`, `server-approved`, `authorized references` | `Basis` is an internal server-registry term. The UI must label this layer `Sources` (`docs/product-language-system.md:123-131`). |
| **Source Explanation** | `These are the source values Sovereign used for this answer.` | `What is Basis?`, `What does Basis prove?`, `Calculated proof of personality` | Sources support reflection; they never prove personality, motive, or current state (`docs/inner-recognition-intelligence.md:147`). |
| **Baseline Metaphor** | `A private reference built around you, so Sovereign can begin with more than the current prompt.` | `foundation`, `personal foundation`, `private foundation`, `one private foundation` | Primary marketing must NOT use `foundation` as the metaphor (`docs/product-language-system.md:85-87`). |
| **Underlying Mechanics** | Plain human descriptions (e.g. *how you think, decide, communicate, create, connect, respond under pressure, and grow*) | Astrology, Human Design, Gene Keys, numerology, planetary transits, astronomical positions, source abbreviations | Root narrative must not enumerate framework mechanics before explaining product categories (`docs/product-language-system.md:87-88, 301`). |
| **Response Architecture** | Standard formatted answer (Direct answer + structured sections) | `sovereign-answer.v2`, schema names, JSON keys, `facet profile`, `facet_profile_preparing`, `source_computing` | Internal response schemas must remain hidden (`AGENTS.md:15`). |
| **Pressure State** | `Under pressure` (in demos) / `Shadow` (in auth workspace) | `Toxic trait`, `defect`, `negative pattern`, `emotional vector`, `possible interaction vector` | Shadow is how a valid quality narrows under pressure, not a bad identity (`docs/product-language-system.md:227-232`). |
| **Elevated State** | `At its best` (in demos) / `Gift` (in auth workspace) | `Highest self`, `superpower`, `unlocked potential` | Gift is what the same quality makes possible with awareness (`docs/product-language-system.md:233-238`). |
| **Decision Fit** | `What fits` (in demos) / `Alignment` (in auth workspace) | `Alignment score`, percentage compatibility, `calculated solution`, `correct answer` | Alignment is a qualitative balance of fit and tradeoff, never a numeric score (`docs/inner-recognition-intelligence.md:159`). |
| **Relationship Intel** | `See why the same moment lands differently—and how to bridge the gap.` | Compatibility score, mind-reading, motive assignment, relationship verdict | Relationship intelligence requires mutual consent and keeps people distinct (`docs/product-language-system.md:57-64`). |
| **Relational Sections** | `You may be bringing`, `They may be bringing`, `What happens between you` | `Permitted context`, `consented people`, `other person's secret thoughts`, `why they hurt you` | Emphasizes mutual interaction without guessing private interior states (`docs/product-language-system.md:279`). |
| **System Intel** | `See the whole system.` | `Where responsibility keeps landing`, `authority`, `missing perspective`, `broken family` | Responsibility is only one dimension; do not reduce systems to responsibility alone (`docs/product-language-system.md:65-72`). |
| **Current Context** | `Active now` / `What may be louder today` | Transit predictions, `today's horoscope`, `fate`, `destiny` | Current factors are temporary overlays (6-hr TTL); they do not dictate behavior (`docs/inner-recognition-intelligence.md:69-76`). |
| **Scripture Integration** | `Explore through Christian Scripture` (Contextual, opt-in) | Religious buzzwords, forced theology, divine mandate, moral verdicts | Optional, requires explicit confirmation, separated from Baseline (`docs/product-language-system.md:256-263`). |
| **Voice & Tone** | Calm, adult, clear, direct, restrained | Therapy-speak, inspirational filler, spiritual certainty, clinical jargon, `healing journey`, `do the work` | The voice is grounded, discerning, and non-coercive (`docs/product-language-system.md:196-207`). |

---

### 2.3 Comprehensive List of Prohibited Marketing Headlines & Phrases

The following phrases must **NEVER** appear in user-facing copy (`docs/product-language-system.md:578-624`):
- ❌ *"Ordinary questions. More context when it belongs."*
- ❌ *"What is Basis?"* or *"What does Basis prove?"*
- ❌ *"One private reference beneath every question."*
- ❌ *"One private foundation. More useful answers across the questions that shape your life."*
- ❌ *"Separate helping from carrying the outcome."* (as category heading)
- ❌ *"See where responsibility keeps landing."* (as category heading)
- ❌ *"Understand both sides and what happens between you."*
- ❌ *"Ask about your life."* or *"Ask about your life. Get an answer built around you."*
- ❌ *"What do you want to understand?"* or *"Bring the question you already have."*
- ❌ *"What would you like to explore?"*, *"Ask anything."*, *"Tell me what's on my mind."*
- ❌ *"what is supported, interpreted, and still unknown"*
- ❌ *"server-confirmed Stripe subscription state"*
- ❌ *"authority"* or *"missing perspective"* as canonical product intelligence dimensions
- ❌ *"your chart says"*, *"the universe is telling you"*, *"this transit means"*
- ❌ *"healing journey"*, *"unlock your potential"*, *"become your highest self"*, *"do the work"*, *"choose yourself"*, *"return to yourself"*
- ❌ *"break the cycle"* (as a generic promise)

---

## 3. Founder Hero Framing & Exact Copy

The root landing hero is **founder-locked**. It introduces the product category and emotional gravity without technical clutter.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                       [ PERSONAL AI FOR REAL LIFE ]                    │
│                                                                        │
│                          Healing isn’t optional.                       │
│                         Holding onto the pain is.                      │
│                                                                        │
│    Sovereign.OS is a private personal AI for understanding yourself,   │
│    your relationships, your decisions, and the systems around you.     │
│    Build your Baseline once, then explore how you think, decide,       │
│    communicate, create, connect, respond under pressure, and change.   │
│                                                                        │
│              [ Build your Baseline ]      [ See a Sovereign answer ]   │
│                                                                        │
│      Start free · No card required · Review, correct, or reject        │
│                         any interpretation                             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Exact Text Specifications

1. **Kicker / Badge**:
   - Exact text: `PERSONAL AI FOR REAL LIFE`
   - Styling: Monospace/Utility font (`JetBrains Mono` or uppercase tracking `font-utility text-[10px] tracking-widest`), pill border, restrained sage accent dot (`#9fbaa1`).

2. **Headline (Two Lines)**:
   - Line 1: `Healing isn’t optional.`
   - Line 2: `Holding onto the pain is.`
   - Typography: Clean enterprise sans (`Inter` / `Geist Sans`), large scale (48px–72px), tight line height (1.06), warm cream (`#f4f0e8`).
   - Punctuation Rule: Must use the typographic curly apostrophe (`isn’t`), never a straight single quote (`isn't`). Line 2 must say `Holding onto the pain is.` (not `Holding the pain is.` which is reserved for internal positioning).

3. **Supporting Description (2-Sentence Un-hackable Personal AI Framing)**:
   - Sentence 1: `Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.`
   - Sentence 2: `Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.`
   - Tone: Grounded, reassuring, emphasizing complete user ownership and private persistence without commercial model-training or data exploitation.

4. **Call to Action Buttons**:
   - Primary: `Build your Baseline` (Solid warm cream `#f4f0e8` pill or rounded-xl, dark ink text `#09090b`).
   - Secondary: `See a Sovereign answer` (or `How it works` / `Explore demo`) (Subtle 1px border `rgba(255,255,255,0.12)`, transparent/dark surface, cream text).
   - Navigation: Top bar contains `Sign in` and `Get started` (or `Build Your Baseline`).
   - Rule: The root hero has **no additional acquisition buttons** or clutter.

5. **Trust Line**:
   - Exact text: `Start free · No card required · Review, correct, or reject any interpretation`
   - Styling: Small, subtle muted stone (`text-xs text-[#686660]`).

---

## 4. Three-Layer Scope Progression (The Architecture of Sovereign)

The public product narrative expands outward across three distinct tiers. This sequence must be preserved chronologically: **Individual (01) → Relational (02) → Systemic (03)**.

```
01 · YOU                     02 · YOU + YOUR PEOPLE           03 · FROM 1:1 TO THE WHOLE SYSTEM
(Explore yourself)           (Relational intelligence)        (System dynamics)
┌─────────────────────────┐  ┌─────────────────────────────┐  ┌────────────────────────────────┐
│ Personal Baseline       │  │ Relational Intelligence     │  │ System Dynamics                │
│                         │  │                             │  │                                │
│ Explore how you think,  │  │ See why the same moment     │  │ See the whole system.          │
│ decide, communicate,    │  │ lands differently—and how   │  │                                │
│ create, connect, and    │  │ to bridge the gap.          │  │ Move from one relationship to  │
│ grow.                   │  │                             │  │ a family, household, team, or  │
│                         │  │ With permission, Sovereign  │  │ group. See who is involved,    │
│ Use Sovereign to        │  │ can use both people’s       │  │ what each person is            │
│ explore your own        │  │ Baselines while keeping     │  │ responsible for, where         │
│ patterns, expression,   │  │ each person distinct.       │  │ pressure builds, and what      │
│ decisions, pressure,    │  │                             │  │ changes when one responds      │
│ Shadow, Gift, and       │  │                             │  │ differently.                   │
│ Alignment.              │  │                             │  │                                │
└─────────────────────────┘  └─────────────────────────────┘  └────────────────────────────────┘
```

### 4.1 Layer 01 · YOU (Explore yourself)
- **Tag & Kicker**: `01 · YOU` (Subtitle: `Explore yourself`)
- **Heading**: `Explore how you think, decide, communicate, create, connect, and grow.`
- **Description**: `Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.`
- **Representative Canonical Inquiries**:
  - *"How do I make decisions that actually fit me?"*
  - *"Why did their tone affect me more than their words?"*
  - *"How do I know when I’m adapting too early?"*
  - *"What changes in me under pressure?"*
  - *"What part of myself am I underusing?"*
  - *"Why do I keep repeating this pattern?"*
- **Public Workflow Demonstration Steps**:
  1. `Start with the question`
  2. `Use what matters from your Baseline`
  3. `Find the useful difference`
  4. `Leave what is not known unanswered`
  5. `Give you something you can try`
- **Boundary Constraint**: Self-exploration must not be reduced to fixing a problem, conflict, carrying other people, or overfunctioning. It covers whole human expression.

---

### 4.2 Layer 02 · YOU + YOUR PEOPLE (Relational intelligence)
- **Tag & Kicker**: `02 · YOU + YOUR PEOPLE` (Subtitle: `Relational intelligence`)
- **Heading**: `See why the same moment lands differently—and how to bridge the gap.`
- **Description**: `With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.`
- **Representative Canonical Inquiries**:
  - *"Why does the same conversation feel urgent to me and pressuring to them?"*
  - *"What do we each need to communicate clearly?"*
  - *"Where do our decision-making styles differ?"*
  - *"What happens between us when pressure rises?"*
  - *"What would repair require from each of us?"*
- **Public Workflow Demonstration Steps**:
  1. `Start with what happened`
  2. `Keep each person separate`
  3. `Show what happens between you`
  4. `Do not guess private feelings`
  5. `Find a lower-pressure next step`
- **Boundary Constraint**: Both individuals remain distinct. No compatibility percentages. No mind-reading or claiming to know the other party's unvoiced thoughts.

---

### 4.3 Layer 03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics)
- **Tag & Kicker**: `03 · FROM 1:1 TO THE WHOLE SYSTEM` (Subtitle: `System dynamics`)
- **Heading**: `See the whole system.`
- **Description**: `Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.`
- **Representative Canonical Inquiries**:
  - *"What role am I actually playing in this family?"*
  - *"What changes when I stop playing the role everyone expects?"*
  - *"How does pressure move through this team?"*
  - *"Why does my family pull me back into mediator mode even when I stop fixing the conflict?"*
  - *"What changes when one person responds differently?"*
- **Public Workflow Demonstration Steps**:
  1. `Start with what you told Sovereign`
  2. `Keep each person separate`
  3. `Show how pressure moves`
  4. `Show why the role keeps returning`
  5. `Change one thing and watch what happens`
- **Boundary Constraint**: Do NOT reduce the system story to *"where responsibility keeps landing"*. Do not claim uncomputed authority or missing perspectives. Do not require a decorative graph node-mesh; focus on the human interaction sequence.

---

## 5. Sovereign Answer v2 Demo Specification

The demonstration card must accurately represent the authenticated `sovereign-answer.v2` output model without exposing raw code schemas.

### 5.1 Presentation Format: Terminal / Conversational Intake

The demo should be framed as an **authentic terminal/chat intake**:
- Top header with discrete inquiry intake and a restrained status badge: `[ INQUIRY ]` on the left, `[ BASELINE GROUNDED ]` with a subtle pulsing sage dot on the right.
- High-contrast industrial container: background `#050505` / `#0c0c0e`, 1px crisp border `rgba(255,255,255,0.08)`.
- Typographic hierarchy: Monospace kickers (`JetBrains Mono`, 10px uppercase tracking) preceding each section.

### 5.2 The Relational Intake Preview Triad

To demonstrate the full power of relational intelligence, the preview must feature the canonical three-part intake:

```
┌────────────────────────────────────────────────────────────────────────┐
│ INQUIRY                                              ● BASELINE GROUNDED│
│ "Why does the same conversation feel urgent to me and pressuring to them?"│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ WHAT YOU MAY BE BRINGING                                               │
│ Your Baseline creates direction quickly when ownership is ambiguous.   │
│ In hard conversations, you seek a concrete next step in order to feel  │
│ settled, which can accelerate your pacing.                             │
│                                                                        │
│ WHAT THEY MAY BE BRINGING                                              │
│ Their permitted Baseline requires internal reflection before           │
│ articulation. Under rapid questioning, their instinct is to pause and  │
│ regulate rather than offer an immediate commitment.                    │
│                                                                        │
│ WHAT HAPPENS BETWEEN YOU                                               │
│ The interaction becomes a timing gap before it becomes a values gap:   │
│ urgency invites withdrawal, and withdrawal amplifies urgency. Naming   │
│ a clear return time allows space without leaving the issue abandoned.  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ <u>See source details</u>           Correct, adjust, or reject at any time. │
└────────────────────────────────────────────────────────────────────────┘
```

1. **`WHAT YOU MAY BE BRINGING`**:
   - Grounded in User's Baseline reference (e.g. reflective processing, structuring urgency, clarity focus).
   - Possibility phrasing: *"You may tend to...", "Your Baseline suggests a preference for..."*
2. **`WHAT THEY MAY BE BRINGING`**:
   - Grounded strictly in permitted shared reference.
   - Possibility phrasing: *"Their communication style may prioritize...", "They may require processing time before responding..."*
   - Strictly forbids mind-reading, motive assignment, or hostility claims.
3. **`WHAT HAPPENS BETWEEN YOU`**:
   - Analyzes the **interaction dynamics** and highlights the **useful distinction** (e.g. *"Urgency vs. Clarity"*, *"Supporting vs. Carrying"*, *"Timing mismatch vs. Values conflict"*).
   - Identifies what each person can own and provides a concrete, lower-pressure bridge.

### 5.3 Sources Disclosure Pattern (Never "Basis")

- **Closed state**: A clean text link or small button: `See source details` (or `Sources`).
- **Inspection Drawer / Popover**:
  - Title: `Source details`
  - Explanatory copy: *"These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state."*
  - Example values: `HD G13.1`, `GK ACT13`, `☉ CAN 04.2°`, `N LP1` (deterministic fixtures only).
- **Correction Affordance**:
  - Footer note: *"Correct, adjust, or reject this interpretation at any time."*

---

## 6. High-Contrast Industrial Monochromatic Visual Design Principles

Sovereign.OS features an editorial, high-contrast, industrial visual language rooted in absolute precision, quiet confidence, and zero decorative noise.

### 6.1 Color Foundation

```
#000000 / #050505    #0c0c0e / #121215    #f4f0e8 / #f1ece5    #a3a099 / #686660    #9fbaa1
[ Void Black ]       [ Surface Elevation ] [ Warm Cream ]       [ Muted Stone ]      [ Restrained Sage ]
Base canvas & field  Panels, cards & inputs Primary readable text Secondary & subtle   Status dot & accent
```

| Token / Layer | Hex / CSS Value | Description & Intent |
| :--- | :--- | :--- |
| **Canvas Base** | `#000000` / `#050505` | Near-black void foundation. Deepest industrial grounding. |
| **Surface 0 (Base Panel)** | `#0c0c0e` | Flat intake/card containers. Subtle lift from the void. |
| **Surface 1 (Card / Modal)**| `#121215` / `#151516` | Raised containers, interactive preview elements. |
| **Surface 2 (Interactive)** | `#18181c` / `#1c1c1e` | Button hover states, input wells, active segments. |
| **Primary Text (Ink)** | `#f4f0e8` / `#f1ece5` | Warm, readable cream text. High contrast against dark grounds without stark harshness. |
| **Secondary Text (Muted)** | `#a3a099` / `#bbb3a8` | Descriptions, explanatory paragraphs, supporting copy. |
| **Tertiary Text (Subtle)** | `#686660` / `#918a81` | Micro-metadata, trust lines, timestamps, borders. |
| **Accent (Restrained Sage)**| `#9fbaa1` / `#aebaa7` | **Only brand accent.** Used strictly for active dots, status badges, and subtle highlights. |
| **Warm Clay (Secondary)** | `#dda273` / `#c4aba1` | Reserved strictly for subtle spatial motif accents or secondary indicators. |
| **Borders (Low-Contrast)** | `rgba(255, 255, 255, 0.08)` | Crisp, ultra-fine 1px lines dividing surfaces. |
| **Borders (Strong / Hover)**| `rgba(255, 255, 255, 0.16)` | Focused inputs, active cards, interactive borders. |

---

### 6.2 Typographic Hierarchy & Font System

| Role | Font Family | Weights | Usage & Scope |
| :--- | :--- | :--- | :--- |
| **Titles & Headings** | `Inter` / `Geist Sans` (with SF Pro / Segoe fallbacks) | Light (300), Normal (400), Medium (500) | Hero statements, section titles, accordion questions. Visual weight comes from scale (40px–72px) and generous tracking, **never** bold serif. |
| **Body & Prose** | `Inter` / `Geist Sans` | Normal (400) | Answer text, explanations, descriptions, FAQ answers. Generous line height (1.6–1.75). |
| **Micro-Labels & Technical Data** | `JetBrains Mono` / `ui-monospace` | Regular (400), Medium (500) | Numbering (`01 · YOU`), kickers (`PERSONAL AI FOR REAL LIFE`), status chips (`BASELINE GROUNDED`), section tags (`WHAT YOU MAY BE BRINGING`), Source codes. |

> **⚠️ STRICT PROHIBITION ON SERIF FONTS**:
> `Sovereign Display`, Georgia, Palatino, Iowan Old Style, or any other serif typeface are **completely retired from active UI use** (`docs/product-language-system.md:454-467`). Hierarchy is achieved solely through scale, weight, spacing, opacity, and layout within the modern sans/mono system.

---

### 6.3 Industrial Structural Principles (Zero Clutter)

1. **Sharp 1px Dividers**:
   All cards, sections, headers, and inputs use razor-thin 1px borders (`border: 1px solid rgba(255, 255, 255, 0.08)`). Never use heavy drop shadows or thick outlines.
2. **Generous Whitespace**:
   Section spacing: 96px–128px on desktop, 64px–80px on mobile. Card internal padding: 28px–40px. The interface must breathe like an editorial publication.
3. **Restrained Corner Radii**:
   `rounded-xl` (12px) to `rounded-2xl` (16px) for major cards; `rounded-full` for badges, pill tags, and CTAs. No exaggerated or toy-like border-radii.
4. **Prohibited Decorative Artifacts**:
   - ❌ No electric blue, cyan glow, or purple gradients.
   - ❌ No frosted-glass glassmorphism dashboard cards.
   - ❌ No 3D floating meshes or rotating sphere hero animations.
   - ❌ No typing simulations, bouncing dots, or pulsing robot icons.
   - ❌ No fake metrics, gauges, star ratings, or compatibility percentages.

---

## 7. Actionable Gap Analysis & Alignment Plan

### 7.1 Gaps in Current `apps/web/src/App.tsx`

| Section | Current Implementation in `App.tsx` | Required Canonical State | Action Required |
| :--- | :--- | :--- | :--- |
| **Hero Title** | Line 256: Has `Healing isn’t optional.<br />Holding onto the pain is.` | Matches text. | Verify curly apostrophe rendering and styling. |
| **Hero Description** | Line 261: Combines sentence 1 & sentence 2 | Sentence 1 + 2 present. | Matches canon. |
| **Interactive Widget** | Lines 285–373: Interactive Baseline Intake Preview Widget (Date/Place form) | Need authentic terminal/chat intake demonstration | Retain or harmonize with chat preview. |
| **Demo Card Headings** | Lines 399, 406, 413: Uses `GROUNDED OBSERVATION`, `THE STRUCTURAL PATTERN`, `THE SHIFT` | Relational demo requires: `WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU` | **Update headings and content** to reflect the relational three-part intake preview. |
| **Three-Layer Scope** | Lines 457, 474, 491: `01 · YOU` (`Personal Baseline`), `02 · YOU + YOUR PEOPLE` (`Relational Intelligence`), `03 · THE WHOLE SYSTEM` (`System Dynamics`) | Tags should read: `01 · YOU (Explore yourself)`, `02 · YOU + YOUR PEOPLE (Relational intelligence)`, `03 · FROM 1:1 TO THE WHOLE SYSTEM (System dynamics)` with approved descriptions | **Update headings, subtitles, and descriptions** to match `product-language-system.md:305-359`. |
| **Sources Affordance** | Line 423: Uses `alert(...)` for `See source details` | Needs quiet expandable drawer or inline popover explaining Sources without JavaScript alerts | Replace alert with clean accessible drawer/disclosure component. |

---

## 8. Summary of Findings & Next Steps

1. **Language & Copy**: Total adherence to `docs/product-language-system.md` is mandatory. Every user-facing string must replace `Basis` with `Sources`, eliminate therapy jargon, and frame all interpretations with possibility language (`may`, `can`).
2. **Hero Structure**: The founder hero statement (`Healing isn’t optional. Holding onto the pain is.`) with the kicker `PERSONAL AI FOR REAL LIFE` and the 2-sentence un-hackable personal AI description is the immovable root narrative anchor.
3. **Three-Layer Scope**: The explicit progression across `01 · YOU`, `02 · YOU + YOUR PEOPLE`, and `03 · FROM 1:1 TO THE WHOLE SYSTEM` establishes the true scope of Sovereign without reducing it to conflict analysis.
4. **Demonstration Card**: The demonstration must use the relational intake triad: `WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, and `WHAT HAPPENS BETWEEN YOU`, supported by quiet `Sources` details.
5. **Visual Standards**: Pure industrial monochrome (#000000 base, warm cream text, 1px subtle borders, Inter/Geist Sans typography, JetBrains Mono micro-labels, restrained sage accent).

This concludes the product language and specification survey.
