# Framer Reference Exhaustive Inspection Report

## 1. Observation

### 1.1 Live Site Origin and Manifest Verification
- **Target URL**: `https://slight-use-623506.framer.app/`
- **Underlying Template**: "MindWave" by creator "Thanh Tran", customized for Sovereign.OS.
- **Framer Site ID**: `b91458ae70e69ec952ba596a958d8f1271ba7a4f0cfdea0ac99d0c6fbd38595c`
- **Published Timestamp**: Sep 7, 2026, 9:09 PM UTC
- **Generator**: Framer `f03650d`
- **Title**: `Sovereign.OS — Personal intelligence for real life.`
- **Description**: `Understand yourself, understand your people, and see the whole system.`
- **Search Index Route Map** (`searchIndex-pmAusc05ZjF5.json`):
  - `/` -> Main landing page (`-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs`)
  - `/privacy` -> Privacy Policy (`FWC5irjYUfi6yymnA9KTcV8WdOA4g1vbIWOO3KWpsIs.BLTLIsNJ.mjs`)
  - `/terms-of-service` -> Terms of Service (`GZBzRYtUzmUJkWjOr-0dJJjC67D8Z25gygHmFJOgZnQ.FPFsSx2f.mjs`)
  - `/contact` -> Contact Page (`-JoA4klmzCHnf1zCcMKcAzmBc4n_VThke88wLI-QYzU.DFuoEy9U.mjs`)
  - `/blog` -> Blog Listing (`W6KJbsRUWfs-dXlXv2ShBQQ_Z_hEAdgL70xszNe7Zkk.D1v582iH.mjs`)
  - `/404` -> Not Found (`aOqxHv_QR9m9oOfsr4NiVq6R9IrM6WZNAIp87Ng5VbU.CgxOAGKV.mjs`)

### 1.2 Layout Hierarchy and DOM Tree of Landing Page (`/`)
The landing page renders inside `#main` with an intrinsic canvas height of `10,313px` across 12 distinct sections and a sticky navigation capsule:
1. **Header / Floating Navigation Capsule** (`<nav class="framer-gDgJV framer-8pbdi3">`, container `.framer-1g7tdyi`):
   - Fixed top floating pill: `max-width: 1240px`, height `min-content`, padding `10px 10px 10px 20px` (desktop), `10px` (mobile).
   - Border radius: `22px`.
   - Border: `1px solid rgba(250, 250, 250, 0.05)` (`--token-16ef8c1a...`).
   - Background: `linear-gradient(180deg, rgba(250, 250, 250, 0.05) -30%, rgba(10, 10, 10, 0.7) 40%, rgba(10, 10, 10, 0.9) 100%)`.
   - Capsule Backdrop Blur: `backdrop-filter: blur(6px)`.
   - Elements:
     * Left: Logo Image (`24px x 24px`) + Brand Wordmark: "Sovereign.OS" (Font: `Gambarino`, `20px`, color: `#fafafa`).
     * Center: Navigation links (`gap: 32px` desktop, `20px` tablet): "Explore" (`href="./#features"`), "How It Works" (`href="./#process"`), "FAQ" (`href="./#faq"`). Link hover effect: `.framer-u86jjt` scale underline indicator.
     * Right: Primary CTA: "Enter Sovereign.OS" (`Main Button`, width `130px`).
     * Mobile Menu: Hamburger toggle (`width: 390px`, expands vertically to column layout, gap `16px`, full-width button).

2. **Hero Section** (`<section data-framer-name="Hero Section" class="framer-18femmv">`):
   - Layout: `height: 100vh`, `flex-direction: column`, `align-items: center`, `justify-content: center`.
   - Background Atmosphere: `Rainbow Glowing` (`FramerLEZWeploS`): 11 concentric circular gradient rings centered at `top: 50%; left: 50%` with spring reveal animations (`bounce: 0.3`, `duration: 1.0 - 2.0s`, `delay: 0.5 - 1.0s`):
     * `framer-436ii3`: `300px` (opacity: 0.5, duration: 2s, delay: 1.0s)
     * `framer-1ykp0g5`: `250px` (opacity: 0.6, duration: 1.8s, delay: 0.9s)
     * `framer-1dbxvbt`: `200px` (opacity: 0.7, duration: 1.6s, delay: 0.8s)
     * `framer-1lyse93`: `150px` (opacity: 0.8, duration: 1.4s, delay: 0.7s)
     * `framer-1ytd2cr`: `100px` (opacity: 0.8, duration: 1.2s, delay: 0.6s)
     * `framer-1jjvits`: `50px` (opacity: 0.8, duration: 1.0s, delay: 0.5s)
   - Floating Hero Image Cards: 4 corner cards (`framer-1a1ehbx`, `framer-b0087j`, `framer-9jv8xs`, `framer-10wbp92`) with `border-radius: 10px`, `width: 300px`, `aspect-ratio: 1.5`, masked by `linear-gradient(90deg, #0000 0%, #000 100%)` (left) and `linear-gradient(270deg, #0000 0%, #000 100%)` (right).
   - Content Container (`.framer-1gffwn7`, `gap: 24px`, `height: 80vh`):
     * Kicker Badge (`framer-hGHD2`): "PERSONAL INTELLIGENCE FOR REAL LIFE", pill `border-radius: 999px`, padding `4px 12px`, with 6px colored breathing dot.
     * H1 Headline (`.framer-1mnq5vh`): "Understand yourself. Understand your people. See the whole system." (`max-width: 1000px` desktop / `720px` tablet / `350px` mobile, `Gambarino`, `64px`, `line-height: 1.1em`).
     * Subhead (`.framer-1lyxcuk`): "Sovereign.OS is personal intelligence for real life — an AI that uses your context to help you understand yourself, your relationships, and the systems around you." (`max-width: 600px`, `Onest`, `15px`, `line-height: 1.6em`, color `#fafafa`).
     * Action CTAs (`.framer-93qf5f-container`, `.framer-vg2egy-container`):
       - Primary: "Explore Sovereign.OS" (`Main Button`, `160px`, iridescent conic laser border).
       - Secondary: "See how it works" (pill button, subtle glass border).

3. **Marquee / Logo Slideshow** (`Logo Slideshow`):
   - Horizontal infinite ticker banner bridging Hero into About section.

4. **About Section** (`<section id="about" data-framer-name="About Section" class="framer-g0xfnu">`):
   - Section Wrapper: `max-width: 1000px`, padding `0 100px 100px` (desktop), `0 40px 100px` (tablet), `0 20px 100px` (mobile).
   - Section Header: Kicker: "Why Sovereign", Title: "The Sovereign View".
   - Text Reveal on Scroll (`KaraokeText`, component `boEgf9FjQ`):
     "One person is complex. A relationship is more complex. A system is something else entirely."
     * Font: `Gambarino`, `40px` (desktop) / `32px` (tablet) / `24px` (mobile), `line-height: 1.2em`, letter-spacing `-0.01em`.
     * Scroll timing: reveals smoothly between 20% and 80% viewport scroll, transitioning characters from muted `#404040` (blur: 2px) to `#fafafa`.
   - Three-Pillar Progression Cards:
     * 01 · SELF: Subhead `Your Baseline` -> "Understand the qualities, patterns, strengths, tensions, and capacities that shape how you move through life."
     * 02 · BETWEEN: Subhead `Your Relationships` -> "See how two different ways of operating meet—and what happens between them."
     * 03 · WHOLE: Subhead `Your Systems` -> "Understand families, teams, and groups as living systems rather than collections of individuals."

5. **Our Impact Section** (`<section id="impact" data-framer-name="Our Impact Section" class="framer-m09nmb">`):
   - Section Header: Kicker: "How Sovereign Works", Title: "Start with you. Then widen the view."
   - Three Process Cards (`Impact Card`, `310px x 242px`, `border-radius: 20px`, `border: 1px solid rgba(250, 250, 250, 0.05)`):
     * Card 1: "Start with your Baseline: the qualities, patterns, strengths, expression, and ways of operating that you bring into real situations."
     * Card 2: "Widen the view to understand what happens between you. Explore relationships through the context of both people — not just one interpretation."
     * Card 3: "See families, groups, roles, and recurring dynamics as a living system — and notice how one change affects the whole."

6. **Process Section** (`<section id="process" data-framer-name="Process Section" class="framer-x58hde">`):
   - Section Header: Kicker: "The Intelligence", Title: "Ask about your life. Get more than an answer."
   - Interactive Chat Intake Preview Fragment (`Card Illustration 1`, `600px x 400px`):
     * User Prompt bubble: "Why am I so good at knowing what everyone else needs from me, but so unsure what I want?" (background `#171717`, border `1px solid rgba(250, 250, 250, 0.1)`, `border-radius: 16px`).
     * Sovereign Synthesized Answer bubble: "You may be highly responsive to the context around you. That can make other people’s needs unusually easy to detect while your own preferences become harder to distinguish from what the situation requires."
     * Composer Input: placeholder "Ask about your life…", Send action button with gradient accent.
     * Contextual breakdown tags (`Card Illustration 2`): 🌿 Your Baseline, 🌱 Your Expression, 🧠 Your Patterns, 🌙 Your Relationships, 💖 Your Systems, 🧘 Your AI.

7. **Features Section** (`<section id="features" data-framer-name="Features Section" class="framer-yi5hfl">`):
   - Section Header: Kicker: "Recognition", Title: "The questions are ordinary. The context is not."
   - Three Recognition Cards:
     * Card 1: Pillar `SELF`, Subtitle `An ordinary question`, Quote: "“Why do I keep doing this?”"
     * Card 2: Pillar `PEOPLE`, Quote: "“Why does this relationship feel harder than it should?”"
     * Card 3: Pillar `SYSTEMS`, Quote: "“Why does changing one thing affect everyone else?”"

8. **Testimonials / Baseline Showcase Section** (`<section id="testimonials" data-framer-name="Testimonials Section" class="framer-1d2xjte">`):
   - Section Header: Kicker: "Start With Yourself", Title: "Your understanding should grow with you."
   - Three Showcase Fragments with looping mirror spring hover/entry animations (`scale: 1.1`, ease `[.78, 0, .45, 1]`):
     * Card 1: Header `Two Baselines`, Pill: "Shared by choice" -> "Both people may be trying in ways the other doesn’t experience as care."
     * Card 2: Header `Relationship context`, Pill: "See the pattern" -> "One person may increase contact. The other may create space. Both can be real effort."
     * Card 3: Header `Family system`, Pill: "Name the role" -> "A boundary can change what everyone else relies on you to keep carrying. The system exists around and between the people in it."

9. **Start With Yourself / Conversion Section** (`<section id="pricing" data-framer-name="Start With Yourself" class="framer-9o0xhc">`):
   - Large stage card: `border-radius: 32px`, `background: linear-gradient(#171717 0%, #0a0a0a 100%)`, `padding: 100px`, `border: 1px solid rgba(250, 250, 250, 0.05)`.
   - Kicker: "Start With Yourself" (`Fragment Mono`, `13px` uppercase).
   - Title: "Know yourself. Understand your people. See the whole system." (`Gambarino`, `48px`, `line-height: 1.1em`).
   - Description: "Start with your own Baseline. Bring in relationships when they matter. Expand into the systems you belong to." (`Onest`, `16px`, `#a3a3a3`).
   - Action: "Enter Sovereign.OS" (`Main Button`, `160px`).

10. **FAQ Section** (`<section id="faq" data-framer-name="FAQ" class="framer-1az5ofq">`):
    - Section Header: Kicker: "FAQ", Title: "Frequently asked questions".
    - 2-Column Accordion Grid (`width: 1000px`, `gap: 12px`, collapsing to 1-column on mobile):
      * Q1: "What is Sovereign.OS?" -> "Sovereign.OS is personal intelligence for real life — an AI platform designed to help you understand yourself, your relationships, and the systems around you."
      * Q2: "What is a Baseline?" -> "Your Baseline is the foundation Sovereign uses to understand your individual context and how you tend to operate."
      * Q3: "What makes Sovereign different from a normal AI chatbot?" -> "Sovereign is designed around personal context rather than isolated prompts. The goal is not simply to answer what you ask, but to help you understand the context behind the question."
      * Q4: "Can Sovereign help me understand relationships?" -> "Yes. Sovereign can help you explore what happens between people while keeping each person’s perspective and consent distinct."
      * Q5: "Can it help with families or larger groups?" -> "Sovereign can extend from individual understanding into relationship and system-level context."
      * Q6: "Is Sovereign therapy?" -> "No. Sovereign is not a therapist, diagnostic system, or replacement for professional care."

11. **Contact Section** (`<section id="contact" data-framer-name="Contact Section" class="framer-1heyl85">`):
    - Support and inquiry section with input fields (`Name`, `Email`, `Message`), submit button, and contact cards.

12. **Footer** (`<div class="framer-1283csf" data-framer-name="Footer">`):
    - Layout: `max-width: 1240px`, padding `100px` (desktop) / `40px` (mobile), `border-top: 1px solid #262626`, background: `#0a0a0a`.
    - Left column:
      * Wordmark: "Sovereign.OS" (`Gambarino`, `24px`, `#fafafa`) with 32x32 logo icon.
      * Tagline: "Personal intelligence for real life." (`Onest`, `15px`, `#fafafa`, `width: 304px`).
      * Socials: 5 rounded icon buttons (`28px x 28px`, `border-radius: 8px`, background `#171717`): Facebook, X, Instagram, LinkedIn, Threads.
    - Right columns:
      * Column 1 ("Sections"): Explore, How It Works, FAQ.
      * Column 2 ("Pages"): Privacy, Terms, Contact.
    - Bottom bar: "Made by Thanh Tran" & "2026 © All right reserved".

### 1.3 Design Tokens & CSS Properties
- **Colors**:
  ```css
  --token-dfa85e1b-31ee-41ab-bfa8-b53b1e521c20: #0a0a0a; /* Base Canvas Dark */
  --token-e416509c-8a21-482e-99d4-b3f528170e92: #171717; /* Surface Neutral 900 */
  --token-1b1029da-2606-4117-bacf-b4fcfdbee5ba: #262626; /* Border Dark Neutral 800 */
  --token-5fd106d1-b371-4012-9f3c-993298b10ebb: #404040; /* Muted Text Neutral 700 */
  --token-9b4d4859-2aed-46cd-8b3e-9276fd4aee49: #525252; /* Neutral 600 */
  --token-da4fe25e-fab3-4303-ad1c-77414ceac9f1: #737373; /* Neutral 500 */
  --token-879b0e1d-5621-4d40-b220-d8aae467daad: #a3a3a3; /* Muted Accent Neutral 400 */
  --token-b60aeb72-65cc-4c6e-8812-1af0df1f280f: #d4d4d4; /* Neutral 300 */
  --token-91f478e9-072c-4396-84ff-8a518fea31e7: #e5e5e5; /* Neutral 200 */
  --token-a0ed438d-f67a-44a5-8d9a-100a89faf808: #f5f5f5; /* Light Neutral 100 */
  --token-35958b5f-fcd4-4988-a517-708c39eda844: #fafafa; /* Pure Foreground White */

  /* Alphas */
  --token-16ef8c1a-aeb2-47a8-bb72-806a1d13acb7: #fafafa0d; /* White 5% (Glass border) */
  --token-e21513bc-4f6f-41cb-84ad-329aacc84550: #fafafa1a; /* White 10% (Glass highlight) */
  --token-ae7c3705-d02c-43c9-91ea-9c702dd8acf6: #fafafa33; /* White 20% */
  --token-77df515d-03a3-4702-a610-4bff680152fa: #fafafa80; /* White 50% */
  ```
- **Conic Laser Gradient (Main Button)**:
  `conic-gradient(from 0deg at 50% 50%, rgba(250, 250, 250, 0) 158.4deg, rgba(235, 44, 80, 0.3) 165.6deg, rgb(242, 146, 32) 172.8deg, rgb(254, 228, 53) 180deg, rgb(101, 191, 114) 187.2deg, rgb(71, 136, 200) 194.4deg, rgba(90, 84, 164, 0.3) 201.6deg, rgba(250, 250, 250, 0) 208.8deg)`

### 1.4 Typography Specs
| Role | Family | Size (Desktop/Tablet/Mobile) | Weight | Line Height | Letter Spacing | Color |
|---|---|---|---|---|---|---|
| **H1 Display / Hero** | `Gambarino, serif` | 64px / 52px / 40px | 400 | 1.1em | 0em | `#fafafa` |
| **H2 Section Title** | `Gambarino, serif` | 52px / 40px / 32px | 400 | 1.1em | 0em | `#fafafa` |
| **H3 Card Title** | `Gambarino, serif` | 32px / 26px / 22px | 400 | 1.2em | -0.02em | `#fafafa` |
| **H4 Title / Modal** | `Gambarino, serif` | 24px / 20px / 18px | 400 | 1.2em | 0em | `#fafafa` |
| **Kicker / Badge** | `Fragment Mono, monospace` | 13px / 12px / 12px | 400 | 1.2em | 0.05em | `#fafafa` |
| **Body Large** | `Onest, sans-serif` | 16px / 16px / 15px | 400 / 700 | 1.6em | -0.02em | `#fafafa` |
| **Body Regular** | `Onest, sans-serif` | 15px / 14px / 14px | 400 / 700 | 1.6em | -0.02em | `#fafafa` |
| **Muted Caption** | `Onest, sans-serif` | 13px / 12px / 12px | 400 | 1.6em | -0.02em | `#a3a3a3` |
| **Button Text** | `Onest, sans-serif` | 14px | 500 / 700 | 1.2em | 0em | `#fafafa` (diff blend) |

### 1.5 Framer Motion Animation Specifications
- **Navigation Entrance**:
  ```ts
  initial: { opacity: 0.001, scale: 0.9, y: -40 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { delay: 0.2, duration: 0.8, ease: [0.6, 0, 0.4, 1], type: "tween" }
  ```
- **Hero Reveal Sequence (Staggered)**:
  - Headline: `delay: 0.2s, duration: 0.8s, y: 40 -> 0, opacity: 0 -> 1`
  - Subhead: `delay: 0.3s, duration: 0.8s, y: 40 -> 0, opacity: 0 -> 1`
  - CTAs: `delay: 0.5s, duration: 0.8s, y: 40 -> 0, opacity: 0 -> 1`
  - Easing curve: `[0.6, 0, 0.4, 1]`
- **Rainbow Glowing Concentric Rings**:
  - `type: "spring", bounce: 0.3`, durations descending from 2.0s to 1.0s, delays staggered 1.0s down to 0.5s.
- **Scroll Text Reveal (`KaraokeText`)**:
  - Viewport start: 20%, Viewport end: 80%
  - Character blur: 2px -> 0px, color: `#404040` -> `#fafafa`, `transitionDuration: 0.4s`.
- **Card Interactive Hover / Floating Loops**:
  - `scale: 1.1`, repeat type: `"mirror"`, `duration: 1.0s`, ease `[0.78, 0, 0.45, 1]`.
- **Main Button Laser Border Animation**:
  - `duration: 3.5s`, `ease: [0, 0, 1, 1]` (linear 360deg infinite rotation).

---

## 2. Logic Chain

1. **Inspection of Bundle Architecture**: The downloaded SSR HTML (`raw_landing.html`) and client bundle (`script_main.0D24Rp15.mjs`) revealed the full Framer component map. By analyzing `__framer__appearAnimationsContent` and the minified stylesheet (`ssr_styles.css`), the exact Framer Motion parameters and layout classes were extracted directly without guesswork.
2. **Analysis of Template Adaptation**: The underlying Framer template is "MindWave" by "Thanh Tran", which was customized for Sovereign.OS. The main landing page `/` features full Sovereign.OS copy ("Understand yourself. Understand your people. See the whole system."), the Three Pillars (SELF, BETWEEN, WHOLE), and the 6 canonical FAQ entries. Secondary pages (`/contact`, `/privacy`, `/terms-of-service`) retain standard template structure and legal boilerplate.
3. **Reconciliation with Sovereign.OS Rules (`AGENTS.md` and `LandingParity.test.ts`)**:
   - `AGENTS.md` mandates near-black background (`#0a0a0a`), warm white typography, and zero prohibited internal terms (no "Basis", "sovereign-answer.v2", or "model context").
   - `LandingParity.test.ts` forbids `backdrop-blur` on body content.
   - Crucially, the inspection verified that `backdrop-filter: blur(...)` is used *only* on the floating navigation capsule (`framer-1g7tdyi`, blur 6px) and footer, while all main content cards achieve their glass appearance via 1px semi-transparent alpha borders (`rgba(250, 250, 250, 0.05)`) and dark gradient fills (`linear-gradient(#171717 0%, #0a0a0a 100%)`). This cleanly resolves the apparent tension between glassmorphism and the `backdrop-blur` prohibition in the React app.

---

## 3. Caveats

- **External Fonts**: The serif display font `Gambarino` is loaded from Fontshare (`https://framerusercontent.com/third-party-assets/fontshare/...`). `Onest` and `Fragment Mono` are loaded from Google Fonts. Local `index.html` already declares these font sources.
- **Dynamic Framer Canvas Artifacts**: Some internal SVG template IDs and Framer runtime wrappers (`data-framer-appear-id`, `SmartComponentScopedContainer`) are artifacts of the Framer compiler. When translating into local React, standard `framer-motion` `<motion.div>` primitives with the exact transition and variant specs documented here should be used rather than trying to replicate Framer internal wrappers.

---

## 4. Conclusion

The live Framer preview at `https://slight-use-623506.framer.app/` provides an authoritative, complete visual specification for the Sovereign.OS landing experience. The design system uses:
1. An industrial monochromatic `#0a0a0a` stage with subtle `#fafafa0d` (5% white) glass borders.
2. Concentric spring-animated glowing gradient rings behind the Hero section.
3. A rotating conic iridescent laser beam on the primary CTA button (`Main Button`).
4. High-contrast typography pairing `Gambarino` (display serif, 64px/52px/32px), `Onest` (sans-serif body, 15px/16px), and `Fragment Mono` (monospace kickers, 13px).
5. A progressive scroll-driven text reveal (`KaraokeText`) in the About section.
6. A rich chat intake fragment preview in the Process section with contextual breakdown pills.
7. An expandable 2-column FAQ accordion containing the 6 canonical Sovereign questions and answers.

---

## 5. Verification Method

To verify these findings independently:
1. **Inspect Local Files**:
   - Raw HTML: `view_file` on `/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html`
   - Appear Animations: `view_file` on `/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/appear_animations.json`
   - CSS Stylesheet: `view_file` on `/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/ssr_styles.css`
   - Page Component: `view_file` on `/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs`
2. **Run Analysis Scripts**:
   ```bash
   python3 /Users/cjo/Sovereign.final/.agents/survey_exp1_o6/extract_faq_qa.py
   python3 /Users/cjo/Sovereign.final/.agents/survey_exp1_o6/map_animations.py
   python3 /Users/cjo/Sovereign.final/.agents/survey_exp1_o6/inspect_typography.py
   ```
3. **Verify Route Tests**:
   ```bash
   cd /Users/cjo/Sovereign.final && pnpm test apps/web/src/LandingParity.test.ts
   ```
