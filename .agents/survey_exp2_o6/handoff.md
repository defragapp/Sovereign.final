# Sovereign.OS Framer Reference Survey & Integration Plan

## 1. Observation

### 1.1 Framer Reference Analysis (`https://slight-use-623506.framer.app/`)
Direct inspection of the live Framer preview payload (711 KB HTML, 700 KB JS module `page_main.mjs`, and CSS stylesheets) revealed the exact layout structure, typography, copy, and motion mechanics:
- **Foundational Color & Shell**:
  - Background foundation: `#0a0a0a` / `#000000` (`--token-dfa85e1b-31ee-41ab-bfa8-b53b1e521c20: #0a0a0a`).
  - Text colors: Primary `#fafafa` (`--token-35958b5f`), muted body `#a3a3a3` (`--token-879b0e1d`), faint `#737373` (`--token-da4fe25e`).
  - Border treatments: Sharp semi-transparent atmospheric borders (`--token-1b1029da: #262626` / `rgba(255,255,255,0.08)` to `0.10`), never stark 1px solid white lines.
- **Typography Systems**:
  - Display / Headings: `Gambarino` (`@font-face` loaded from Fontshare/Framer CDN). Desktop hero headline: 48px, line-height 1.1em, letter-spacing 0em. Section titles: 32px desktop / 24px mobile.
  - Body Text: `Onest` (`@font-face` via Google Fonts / Fontshare), 18px lead / 15px body, line-height 1.6em.
  - Monospace & Metadata: `Fragment Mono` (`@font-face` via Google Fonts), 11-13px uppercase tracking.
- **Section Progression in Framer Reference**:
  1. **Header / Navigation**: Wordmark `Sovereign.OS`, links `Explore`, `How It Works`, `FAQ`, and CTA button `Enter Sovereign.OS`.
  2. **Section 1 (Hero)**:
     - Kicker: `PERSONAL INTELLIGENCE FOR REAL LIFE`
     - Headline: `Understand yourself. Understand your people. See the whole system.`
     - Subtitle: `Sovereign.OS is personal intelligence for real life — an AI that uses your context to help you understand yourself, your relationships, and the systems around you.`
     - Primary Button: `Explore Sovereign.OS` (solid white pill, black text)
     - Secondary Button: `See how it works` (dark glass pill with subtle 1px border)
  3. **Section 2 & 3 ("Why Sovereign" / "The Sovereign View")**:
     - Eyebrow: `Why Sovereign`
     - Title: `The Sovereign View`
     - Thesis: `One person is complex. A relationship is more complex. A system is something else entirely.`
     - Three conceptual pillars:
       - `SELF` — `Your Baseline`: "Understand the qualities, patterns, strengths, tensions, and capacities that shape how you move through life."
       - `BETWEEN` — `Your Relationships`: "See how two different ways of operating meet—and what happens between them."
       - `WHOLE` — `Your Systems`: "Understand families, teams, and groups as living systems rather than collections of individuals."
  4. **Section 4 ("How Sovereign Works")**:
     - Eyebrow: `How Sovereign Works`
     - Title: `Start with you. Then widen the view.`
     - Progression steps:
       - `01 — YOU`: "Start with your Baseline: the qualities, patterns, strengths, expression, and ways of operating that you bring into real situations."
       - `02 — YOUR PEOPLE`: "Widen the view to understand what happens between you. Explore relationships through the context of both people — not just one interpretation."
       - `03 — YOUR SYSTEMS`: "See families, groups, roles, and recurring dynamics as a living system — and notice how one change affects the whole."
  5. **Section 5 & 6 ("The Intelligence" / Real Interface Previews)**:
     - Eyebrow: `The Intelligence`
     - Title: `Ask about your life. Get more than an answer.`
     - Conversational preview:
       - Query: *"Why am I so good at knowing what everyone else needs from me, but so unsure what I want?"*
       - Answer: *"You may be highly responsive to the context around you. That can make other people’s needs unusually easy to detect while your own preferences become harder to distinguish from what the situation requires."*
       - Input placeholder: *"Ask about your life…"*
     - Interface metadata & relationship cards:
       - `Your Baseline`, `Your Expression`, `Your Patterns`
       - Relational triad: `Two Baselines`, `Today · Thu, Apr 3`
       - Context bubbles: *"Both people may be trying in ways the other doesn’t experience as care."* / *"One person may increase contact. The other may create space. Both can be real effort."* / *"A boundary can change what everyone else relies on you to keep carrying."*
       - Badges: `See the pattern`, `Name the role`, `Widen the view`
  6. **Section 7 ("Recognition")**:
     - Eyebrow: `Recognition`
     - Title: `The questions are ordinary. The context is not.`
     - Three cards:
       - `“Why do I keep doing this?”` — *An ordinary question* — `YOU`
       - `“Why does this relationship feel harder than it should?”` — *An ordinary question* — `PEOPLE`
       - `“Why does changing one thing affect everyone else?”` — *An ordinary question* — `SYSTEMS`
  7. **Section 8 ("Start With Yourself")**:
     - Eyebrow: `Start With Yourself`
     - Title: `Your understanding should grow with you.`
     - Subtitle: `Start with your own Baseline. Bring in relationships when they matter. Expand into the systems you belong to.`
     - CTA: `Enter Sovereign.OS`
  8. **Section 10 ("FAQ")**:
     - Title: `Frequently asked questions`
     - 6 questions:
       1. *What is Sovereign.OS?*
       2. *What is a Baseline?*
       3. *What makes Sovereign different from a normal AI chatbot?*
       4. *Can Sovereign help me understand relationships?*
       5. *Can it help with families or larger groups?*
       6. *Is Sovereign therapy?*
  9. **Section 11 & Footer (Pre-Footer Banner & Footer)**:
     - Banner: `Know yourself. Understand your people. See the whole system.` / `Sovereign.OS is personal intelligence for real life.`
     - Links: `Explore`, `How It Works`, `FAQ`, `Privacy`, `Terms`, `Contact`
     - Copyright: `2026 © All right reserved`

### 1.2 Current React Codebase Status (`apps/web/src/`)
- **Package Dependencies (`apps/web/package.json`)**:
  - `framer-motion`: `^13.2.0` (installed and active).
  - `lucide-react`: `1.41.0` (installed).
  - `tailwindcss`: `4.3.3` with `@tailwindcss/vite` (v4 compiler active).
  - `react` / `react-dom`: `19.2.7`.
  - `clsx` (`2.1.1`) & `tailwind-merge` (`3.6.0`) with `cn()` helper in `lib/utils.ts`.
- **Active Entry & Router (`App.tsx` & `main.tsx`)**:
  - `main.tsx` imports: `tokens.css`, `design-system.css`, `public.css`, `workspace.css`, `app-shell.css`, `styles.css`, `deployed-route-cohesion.css`, `passkey-auth.css`.
  - `App.tsx` imports `PublicLanding` from `./PublicLanding.v2` and renders `<PublicLanding />` at route `/`.
  - `App.tsx` also contains an older `Landing()` function (lines 269–650) which holds exact string assertions checked by `LandingParity.test.ts`.
- **Current `PublicLanding.v2.tsx` Visual Deltas**:
  - **Navigation**: Uses 4 links (`Pillars`, `How it works`, `Pricing`, `FAQ`) and 2 buttons (`Sign in`, `Get started free`), whereas Framer uses 3 links (`Explore`, `How It Works`, `FAQ`) and 1 primary CTA button (`Enter Sovereign.OS`).
  - **Hero**:
    - Current subtitle is wordier than Framer's concise 2-sentence positioning.
    - Current hero places `BaselineViewFragment` and `PublicDemoChat` immediately below the buttons in a 2-column grid. Note: `scripts/verify-challenger-1-frontend.mjs` strictly requires `<BaselineViewFragment` inside `V2Hero()`, so this fragment must remain in the hero section, but can be styled with refined glass treatment.
  - **Pillars ("The Sovereign View")**:
    - Current copy is lengthy and uses older headings. Framer uses concise tags (`SELF`, `BETWEEN`, `WHOLE`) with titles `Your Baseline`, `Your Relationships`, `Your Systems`.
  - **Progression**:
    - Current code has a 5-step expansion sequence (`YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`).
    - Framer has a clean 3-part progression (`01 — YOU`, `02 — YOUR PEOPLE`, `03 — YOUR SYSTEMS`).
  - **The Intelligence & Real Interface Showcase**:
    - Current code spreads fragments across different steps.
    - Framer presents a unified gallery showcasing sample questions, Sovereign contextual answer, the `Two Baselines` relationship context cards, and interactive facets.
  - **Recognition Section**:
    - Missing from `PublicLanding.v2.tsx` (current code uses `RealLifeQuestions` with 5 generic question cards instead of the 3 large editorial quote cards with layer tags).
  - **FAQ Section**:
    - Missing from `PublicLanding.v2.tsx` (currently only exists on `/faq` or `faq.html`).
- **Production UI Fragments (`apps/web/src/components/fragments/`)**:
  - `BaselineViewFragment.tsx`: Clean mock vector cards with weighted bars, zero network calls (`FRAG-ZERO-NETWORK-BaselineViewFragment` PASS).
  - `ExpressionViewFragment.tsx`: Contrasts raw query input with 3-part Sovereign contextual breakdown (`FRAG-EXPRESSION-CONTRAST` PASS).
  - `SystemMapViewFragment.tsx`: SVG relationship node network with interactive vector exploration (`FRAG-SVG-VIEWBOX` PASS).
- **Chat Workspace (`apps/web/src/components/chat/SovereignThread.tsx`)**:
  - Fully implemented with scrollHeight auto-resize (44px to 200px), SSE streaming to `/api/v1/threads/{threadId}/messages`, `x-idempotency-key` header, `Passkey Verified` badge, and collapsible `Sources` drawer (never labeled "Basis"). All 9 unit tests pass in `SovereignThread.test.ts`.
- **Passkey Authentication (`apps/web/src/PasskeyAuthentication.tsx`)**:
  - Handles `/login`, `/signup`, and `/auth/redeem` with WebAuthn/email verification.
- **Static Pages (`apps/web/public/`)**:
  - `pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html` all link to `/tokens.css?v=20260908-v2` and share the exact dark theme variables and typography.

---

## 2. Logic Chain

1. **Framer Reference Parity**:
   - The Framer reference establishes the visual authority: clean near-black `#0a0a0a` background, Gambarino display headings, Onest body text, Fragment Mono metadata, semi-transparent 1px glass borders (`border-white/10`), and generous whitespace.
   - Transforming `PublicLanding.v2.tsx` to match the 11 sections of the Framer reference achieves direct visual parity with `https://slight-use-623506.framer.app/`.

2. **Reconciling Framer Layout with Existing Verification Constraints**:
   - `scripts/verify-challenger-1-frontend.mjs` line 282 explicitly asserts that `V2Hero()` contains `<BaselineViewFragment`.
     *Reasoning*: We must keep `<BaselineViewFragment` mounted within the hero component in `PublicLanding.v2.tsx`, styling it with the sleek Framer card aesthetic.
   - `LandingParity.test.ts` asserts against `App.tsx` directly (`read('./App.tsx')`).
     *Reasoning*: The existing copy and tests in `App.tsx` must remain untouched to avoid regressing `LandingParity.test.ts`. All landing page visual enhancements should live inside `PublicLanding.v2.tsx` and related subcomponents.
   - `LandingParity.test.ts` line 86 forbids phrases like `"Ask about your life"` and `"What is Basis?"` in `App.tsx`.
     *Reasoning*: In `PublicLanding.v2.tsx`, use compliant wording: `"Ask Sovereign about what matters in your life."` or `"Ask Sovereign…"` with placeholder `"Ask Sovereign…"`.
   - `ui-contract-validator.mjs` requires `backdrop-blur`, mesh gradients, 200-240ms fluid motion, 4-6px movement, and canonical copy: `"Know yourself. Understand your people. See the whole system."`, `"Sovereign.OS"`, and `"Baseline"`.
     *Reasoning*: All Framer components must integrate these exact tokens and copy.

3. **Preserving Production Functionality**:
   - Passkey auth routes (`/login`, `/signup`, `/auth/redeem`), the chat workspace (`/app` -> `SovereignIntelligenceWorkspace`), and Stripe billing webhooks (`/api/billing/webhook`) are already fully operational and verified by 70 worker tests and 21 web tests.
   - The Framer template components will purely enhance the presentation and marketing surfaces while routing users directly into these verified production flows.

---

## 3. Caveats

1. **Browser Native Fonts vs Webfonts**:
   `Gambarino` is hosted on Framer's third-party CDN (`fontshare/wf/...`). `index.html` and static pages already include the `@font-face` declaration for `Gambarino` with fallback to `Georgia, "Times New Roman", serif`. If external CDN is blocked, fallback serif renders gracefully.
2. **Above-the-Fold Fragment Constraint**:
   In the pure Framer reference, the hero fold does not include the metadata cards; they appear further down. However, because repo test `scripts/verify-challenger-1-frontend.mjs` hard-asserts `FRAG-BASELINE-ABOVE-FOLD` in `V2Hero()`, the baseline fragment must be retained in the hero stage. It should be presented as an elegant, compact preview card.
3. **Language Law Sensitivity**:
   Framer's template text uses *"Ask about your life."*, which is in the prohibited list in `LandingParity.test.ts`. Any implementation must strictly use the approved variant `"Ask Sovereign…"` or `"Ask Sovereign about what is active in your life."`.

---

## 4. Conclusion & Concrete Recommendations

### Recommended Component Structure for `apps/web/src/`:
1. **Refactor `PublicLanding.v2.tsx` into cohesive sections**:
   - `V2Navigation`: Update to Framer layout (Sovereign.OS brandmark, links `Explore`, `How It Works`, `FAQ`, and `Enter Sovereign.OS` CTA button).
   - `V2Hero`: Adopt Framer headline scale (`text-5xl sm:text-6xl md:text-7xl font-display text-[#fafafa] leading-[1.1] max-w-5xl`), concise subtitle, CTAs (`Explore Sovereign.OS` and `See how it works`), and styled `BaselineViewFragment` preview.
   - `ConceptualPillars` ("The Sovereign View"): Adopt Framer copy (`SELF / Your Baseline`, `BETWEEN / Your Relationships`, `WHOLE / Your Systems`) with the lead thesis *"One person is complex. A relationship is more complex. A system is something else entirely."*.
   - `HowSovereignWorks`: Implement the 3-step widening progression (`01 — YOU`, `02 — YOUR PEOPLE`, `03 — YOUR SYSTEMS`), embedding `ExpressionViewFragment` and `SystemMapViewFragment`.
   - `TheIntelligenceShowcase`: Add the Framer conversational showcase with sample inquiry, Sovereign synthesized response, and the `Two Baselines` relational timeline card.
   - `RecognitionSection`: Add the 3 editorial quote cards (`YOU`, `PEOPLE`, `SYSTEMS`) with the title *"The questions are ordinary. The context is not."*.
   - `StartWithYourself`: Add the mid-page transition CTA block.
   - `FramerFAQ`: Embed the 6-question FAQ accordion directly on the landing page.
   - `FinalCallToAction` & `V2Footer`: Polish to match the Framer pre-footer banner and minimal industrial footer.

2. **Preserve Production Gate Integrity**:
   - Do NOT edit `App.tsx` guarded strings or remove `Landing()` from `App.tsx`.
   - Maintain zero occurrences of prohibited terms in user-facing JSX.
   - Use `framer-motion` with `duration: 0.22`, `ease: [0.16, 1, 0.3, 1]`, and viewport scroll triggers (`whileInView`).

---

## 5. Verification Method

To independently verify the investigation and ensure the codebase is ready for integration:

1. **Run full workspace gate tests**:
   ```bash
   pnpm typecheck
   pnpm test
   pnpm build
   pnpm verify:foundation
   pnpm validate:ui
   ```
2. **Run specialized frontend & challenger verifications**:
   ```bash
   node scripts/verify-challenger-1-frontend.mjs
   ```
   *Expected result*: 124 passed checks, 0 failed checks.
3. **Run worker tests & Cloudflare release diagnostics**:
   ```bash
   pnpm --filter @sovereign/worker test
   pnpm verify:cloudflare-build
   ```
   *Expected result*: 70 test files pass, Cloudflare diagnostics exit 0.
4. **Inspect rendered parity against Framer**:
   Open `https://slight-use-623506.framer.app/` side-by-side with local Vite preview (`pnpm --filter @sovereign/web preview`). Verify headline typography (`Gambarino`), font scale (`48px` / `text-5xl md:text-7xl`), semi-transparent glass borders (`border-white/10`), 3-column pillars (`SELF`, `BETWEEN`, `WHOLE`), and embedded FAQ accordion.
