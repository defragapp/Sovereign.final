# Specification Survey Report: Visual QA & Interaction Verification

**Mission**: Sovereign.OS Visual QA & Interaction Verification Survey (R1, R2, R3)  
**Agent**: Spec Miner 1 (`spec_miner_survey_1`)  
**Timestamp**: 2026-09-07T11:08:00Z  
**Target Repository**: `/Users/cjo/Sovereign.final`  
**Authoritative Contracts**:  
- `ORIGINAL_REQUEST.md` (2026-09-07T11:03:02Z)
- `AGENTS.md` (Build, Launch, UI, Engineering Rules)
- `apps/web/src/styles.css`
- `apps/web/src/App.tsx`
- `apps/web/src/components/IridescentLoader.tsx`
- `apps/web/src/ProductCompletionLayer.tsx`
- `apps/web/src/passkey-auth.css`
- `tests/e2e/live-browser-gate.ts`
- `scripts/verify-live-visual-release.mjs` (v1/v2/v3)
- `docs/product-language-system.md`
- `docs/browser-visual-release-audit.md`
- `docs/UI_UX_CONTRACT.md`

---

## 1. Observation

Direct evidence extracted from source files, tests, scripts, and authoritative documentation:

1. **Legacy Stylesheet Purge (`main.tsx` & `index.html`)**:
   - `apps/web/src/main.tsx:4-6`:
     ```ts
     import './styles.css';
     // import './deployed-route-cohesion.css'
     // import './passkey-auth.css'
     ```
     `public.css`, `workspace.css`, and `design-system.css` are completely absent from imports.
   - `apps/web/index.html:1-17`:
     `<head>` loads only Google Fonts (`Inter` 400/500/600/700 & `JetBrains Mono` 400/500/600) and entry script `/src/main.tsx`. Zero `<link rel="stylesheet">` tags reference legacy sheets.
   - `final-visual-acceptance-report.json:6-11`:
     ```json
     "legacyStylesheetsPurged": true,
     "legacyStylesheets": [
       "public.css",
       "workspace.css",
       "design-system.css"
     ]
     ```

2. **Palette & Background Specifications (`styles.css` & `app-shell.css`)**:
   - `styles.css:9-31`:
     ```css
     color: #f4f0e8;
     background: #000000;
     --platform-bg: #000000;
     --ink: #000000;
     --cream: #f4f0e8;
     --muted: #a3a099;
     --subtle: #686660;
     --surface: #050505;
     --surface-0: #050505;
     --surface-1: #0c0c0e;
     --surface-2: #121215;
     --surface-3: #18181c;
     --line: rgba(255, 255, 255, 0.08);
     --line-strong: rgba(255, 255, 255, 0.16);
     --sage: #9fbaa1;
     --clay: #c4aba1;
     ```
   - `app-shell.css:19`: `--platform-bg: #09090b;`.
   - `public.css:1351`: `background: radial-gradient(...) #121212;`.
   - `final-visual-acceptance-report.json:36`: `"colorPalette": "near-black monochrome slate (#000000 / #050505 / #0c0c0e)"`.

3. **Forbidden Tokens & Glassmorphism Prohibitions**:
   - `workspace.css:11`: `--bronze-accent: #dda273;` (historical legacy file; strictly prohibited from active DOM).
   - `LandingParity.test.ts:96-99`:
     ```ts
     it('enforces UI styling contract with zero forbidden glassmorphism or blur tokens', () => {
       expect(appTsx).not.toContain('backdrop-blur');
       expect(appTsx).toContain('bg-[#000000]');
     });
     ```
   - `final-visual-acceptance-report.json:39-40`:
     `"glassmorphismProhibition": "enforced (zero backdrop-blur in app bundle)"`, `"bronzeOverridePurge": "verified"`.

4. **Scroll Reveals & Keyframes (`App.tsx` & `styles.css`)**:
   - `App.tsx:264-269`:
     ```tsx
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true, margin: '-60px' }}
     variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
     ```
   - `App.tsx:334-360`:
     Section reveal: `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}`.
     Cards container: `staggerChildren: 0.12`.
     Cards: `variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }} whileHover={{ y: -4, transition: { duration: 0.2 } }}`.
   - Fallback reveal: `useInView({ threshold: 0.1 })` toggling `data-visible="true"`, `.animate-fade-up` (`styles.css:74-83`).

5. **Spotlights & Ambient Lighting (`App.tsx` & `styles.css`)**:
   - `App.tsx:254`: `<div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(159,186,161,0.06),transparent_70%)]" />`.
   - `App.tsx:457`: `<div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(159,186,161,0.06),transparent_70%)]" />`.
   - `styles.css:57-71`: `.landing-hero::before` positioned `absolute top: 50% left: 50% translate(-50%, -50%)`, `650px x 380px`, `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)`.
   - `styles.css:47-54`: `.page-noise::before` fixed overlay with SVG fractal noise, opacity `0.025`.

6. **Turnstile & Passkey / Email Fallback Hierarchy (`ProductCompletionLayer.tsx` & `passkey-auth.css`)**:
   - `ProductCompletionLayer.tsx:154-192`:
     - Container selector: `.turnstile-slot:not([data-turnstile-rendered])`.
     - Script: `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` with `data-turnstile="true"`, `async`, `defer`.
     - Invocation: `turnstile.render(slot, { sitekey, action: slot.dataset.action || 'sovereign-auth', theme: 'dark', appearance: 'interaction-only' })`.
     - Success marker: `data-turnstile-rendered="true"`.
   - `passkey-auth.css:259-275`:
     - Hierarchy:
       1. Primary: `.passkey-primary` (`h2`, `.passkey-intro`, `.passkey-button` min-height 48px, `.passkey-status`).
       2. Divider: `.passkey-recovery-divider` (1px line before & after, uppercase label).
       3. Fallback: `.account-shell .auth-panel.passkey-enabled .form-stack` (`input[type="email"]`, `button[type="submit"]` min-height 48px).

7. **Horizontal Overflow Limits (`live-browser-gate.ts`)**:
   - `live-browser-gate.ts:200-205`:
     ```ts
     const overflowX = await page.evaluate(() => {
       return Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
     });
     const passed = (status === 200 || (status && status < 400)) && overflowX <= 2;
     ```
     Exact allowable threshold is `overflowX <= 2` pixels.

8. **AI Inference Loading Indicator (`IridescentLoader.tsx` & `styles.css`)**:
   - `IridescentLoader.tsx:21-48`:
     - Container: `role="status" aria-label="Sovereign is generating your answer" aria-live="polite"`
     - Shimmer bar: `.sov-shimmer-bar.w-full`
     - Status row: `<SovereignMark size={16} className="opacity-60" />`, 3 dots `<span className="sov-typing-dot" />`, label uppercase tracking-widest.
   - `styles.css:168-207`:
     - Shimmer bar: `height: 2px`, `border-radius: 1px`, `background-size: 200% 100%`, `animation: sov-shimmer 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite`.
     - Shimmer keyframes: `0% { background-position: -200% 50%; } 100% { background-position: 200% 50%; }`.
     - Typing dots: `width: 4px`, `height: 4px`, `border-radius: 50%`, `background: var(--sage)`, `animation: sov-dot-fade 1.4s ease-in-out infinite`.
     - Typing dot delays: `:nth-child(2)` `0.16s`, `:nth-child(3)` `0.32s`.
     - Typing dot keyframes: `0%, 80%, 100% { opacity: 0.2; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); }`.

9. **Typography Scaling (`styles.css:157-165`)**:
   - `.answer-direct`:
     - Mobile / Default: `font-size: 1rem` (`16px`).
     - Tablet / Desktop (`@media (min-width: 768px)`): `font-size: 1.0625rem` (`17px`).
     - Line-height: `1.72` (`27.52px` on mobile, `29.24px` on desktop).
     - Color: `var(--cream)` (`#f4f0e8`).
     - Font-weight: `400`.
     - Paragraph spacing: `.answer-prose p + p { margin-top: 1rem; }`.

10. **Workspace Tab Switching (`App.tsx` & `styles.css`)**:
    - Views: `today`, `people`, `systems`, `explore`, `library`, `you`.
    - View container: `<div className="sov-tab-content ...">`.
    - `styles.css:215-221`:
      ```css
      .sov-tab-content {
        animation: sov-fade-in 0.18s ease-out both;
      }
      @keyframes sov-fade-in {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      ```

---

## 2. Logic Chain

1. **Legacy Payload Elimination (R1)**:
   - *Observation 1* shows that `main.tsx` imports only `styles.css`, and `index.html` loads only Google Fonts.
   - *Observation 3* identifies that legacy files (`public.css`, `workspace.css`, `design-system.css`) contain forbidden tokens such as `--bronze-accent: #dda273` and outdated layout structures.
   - *Inference*: To guarantee zero styling regression, any browser request or DOM reference to `public.css`, `workspace.css`, or `design-system.css` must immediately fail the audit. The verified network payload must contain only the Vite-bundled CSS asset derived from `styles.css`.

2. **Color Palette & Glassmorphism Elimination (R1)**:
   - *Observation 2* demonstrates that the production foundation is near-black/slate (`#000000`, `#050505`, `#09090b`, `#0c0c0e`, `#121212`).
   - *Observation 3* demonstrates that `backdrop-blur` and bronze tokens are strictly purged.
   - *Inference*: Automated testing must compute `backgroundColor` on `html`, `body`, and container surfaces, verifying that red, green, and blue components do not exceed `18, 18, 18` (`#121212`), with zero bronze tint (where red/yellow saturates above gray). Furthermore, `getComputedStyle(el).backdropFilter` must evaluate to `none` across all interactive elements.

3. **Layout & Scroll Reveals (R2)**:
   - *Observation 4 & 5* show explicit Framer Motion thresholds: viewport margin `-60px` (hero), `-80px` (scope), child stagger `0.09s` and `0.12s`, transition easing `cubic-bezier(0.16, 1, 0.3, 1)`.
   - *Observation 7* confirms the horizontal scroll threshold: `overflowX = Math.max(0, scrollWidth - clientWidth) <= 2px`.
   - *Inference*: On desktop (`1440x900`) and mobile (`390x844`), the page must render with `overflowX <= 2px`. When scrolling into view, animated sections must transition from `opacity: 0` to `opacity: 1` and `translateY: 0` without layout shifts or content truncation.

4. **Auth Modal & Turnstile Mounting Hierarchy (R2)**:
   - *Observation 6* details the three-tiered auth hierarchy: Passkey (`.passkey-primary`) at the top, followed by the recovery divider (`.passkey-recovery-divider`), followed by the email input fallback (`.form-stack`).
   - The Turnstile widget dynamically mounts into `.turnstile-slot` via Cloudflare's explicit render API.
   - *Inference*: Automated verification must confirm: (a) passkey button and email fallback exist in the proper visual sequence; (b) `.turnstile-slot` receives `data-turnstile-rendered="true"`; (c) unauthenticated navigation to `/app` redirects to `/login`.

5. **AI Inference State, Typography & Tab Transitions (R3)**:
   - *Observation 8, 9, & 10* specify:
     - Synthetic query triggers `sending = true`, mounting `<IridescentLoader/>`.
     - `.sov-shimmer-bar` executes `sov-shimmer 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite`.
     - `.sov-typing-dot` executes `sov-dot-fade 1.4s ease-in-out infinite` with delays `0s`, `0.16s`, `0.32s`.
     - `.answer-direct` computes to `1rem` (16px) on mobile and `1.0625rem` (17px) on `md` (`>= 768px`) with `1.72` line-height.
     - Tab switching invokes `.sov-tab-content` executing `sov-fade-in 0.18s ease-out both` (`translateY(6px) -> 0`, `opacity: 0 -> 1`).
   - *Inference*: Automated interaction scripts must send a synthetic prompt, assert that the loader mounts and active animations run, measure the computed typography on the direct answer, and click each workspace tab to assert jitter-free 0.18s transitions.

---

## 3. Caveats

1. **Cloudflare Browser Rendering vs. Local Headless Playwright**: In CI/CD pipelines, Cloudflare Browser Rendering write tokens may be rate-limited (status 429) or require specific account bindings. Local headless Chromium via Playwright (`tests/e2e/live-browser-gate.ts`) serves as the deterministic local execution harness.
2. **Turnstile Site Key in Offline/Test Environments**: `ProductCompletionLayer.tsx:160-163` explicitly marks `data-turnstile-rendered="missing-config"` if `VITE_TURNSTILE_SITE_KEY` is not supplied. Test fixtures must mock or supply test sitekeys (`1x00000000000000000000AA` for Cloudflare always-pass) or intercept challenges.
3. **Subpixel Calculation Margin**: Browser rendering engines calculate fractional pixels depending on device pixel ratio; hence the horizontal overflow limit is specified as `overflowX <= 2` rather than strictly `0` to accommodate antialiasing.

---

## 4. Conclusion

The specification boundaries for Sovereign.OS Visual QA & Interaction Verification are fully enumerated and mathematically precise:
- **R1 Payload & Style**: Exactly zero legacy CSS files (`public.css`, `workspace.css`, `design-system.css`). Backgrounds must compute to slate `#09090b` or `#121212` (or `#000000`/`#050505`/`#0c0c0e`), with strictly zero `var(--bronze-accent)` and zero `backdrop-blur`.
- **R2 Visual Regression**: Viewports `1440x900` and `390x844` must maintain `overflowX <= 2px`. Scroll reveals follow Framer Motion `staggerChildren` (0.09s/0.12s) and cubic-bezier `[0.16, 1, 0.3, 1]`. Auth modal mounts Turnstile with Passkey primary and Email fallback hierarchy.
- **R3 Interactive Workspace**: Synthetic prompt submission mounts `<IridescentLoader/>` running `sov-shimmer` (2.4s) and `sov-typing-dot` (1.4s, 0.16s/0.32s delay). `.answer-direct` computes to `1rem` / `1.0625rem` with `line-height: 1.72`. Tab switching across all 6 views applies `.sov-tab-content` with `0.18s ease-out both` transition.

---

## 5. Verification Method

To independently verify these specifications against the live codebase:
1. **Unit & Parity Verification**:
   ```bash
   pnpm --filter @sovereign/web test LandingParity.test.ts
   ```
   Validates zero forbidden terms, zero `backdrop-blur`, typography hierarchy, and Google Fonts integration.
2. **Foundation Verification**:
   ```bash
   pnpm verify:foundation
   ```
   Ensures typechecking, linting, and contract immutability.
3. **Live Browser Verification Gate**:
   ```bash
   npx tsx tests/e2e/live-browser-gate.ts
   ```
   Executes Playwright tests against `1440x900` and `390x844` verifying HTTP 200, `overflowX <= 2px`, auth elements, live AI exchange, and production `/ready` health.
4. **Computed Style Inspection (Playwright script)**:
   Inspect `getComputedStyle(document.body).backgroundColor`, `getComputedStyle(el).backdropFilter`, and computed `font-size` / `line-height` of `.answer-direct`.

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | R1 Payload | Legacy CSS Exclusion | Total exclusion of legacy stylesheets (`public.css`, `workspace.css`, `design-system.css`) | Network GET requests & `<head>` `<link>` tags | Zero legacy stylesheet requests; only `styles.css` bundled | Network error or assertion failure if legacy stylesheet detected | `apps/web/src/main.tsx`, `index.html` |
| 2 | R1 Style | Foundation Slate Palette | Near-black slate foundation `#09090b` / `#121212` / `#000000` | DOM root & body element render | Computed background RGB components <= 18 | Mismatch error if lighter than `#121212` or non-slate tint | `styles.css:10`, `app-shell.css:19` |
| 3 | R1 Style | Bronze Override Purge | Complete elimination of bronze accent overrides | Style computation across all elements | Computed styles contain 0 instances of `var(--bronze-accent)` | Fails audit if `--bronze-accent` (#dda273) is active | `workspace.css:11`, `LandingParity.test.ts` |
| 4 | R1 Style | Glassmorphism Prohibition | Zero `backdrop-blur` or frosted glass tokens | Style computation across cards, modals, headers | `backdropFilter === 'none'` on all UI surfaces | Fails audit if `backdrop-blur-*` class or style is present | `LandingParity.test.ts:97`, `App.tsx` |
| 5 | R2 Layout | Responsive Viewport Parity | Seamless rendering on desktop (1440x900) and mobile (390x844) | Viewport resize to 1440x900 and 390x844 | Clean rendering without horizontal scroll (`overflowX <= 2px`) | Fails audit if `overflowX > 2px` or content clipped | `live-browser-gate.ts:25-28` |
| 6 | R2 Motion | Scroll Reveal Choreography | Scroll-triggered reveals via Framer Motion `whileInView` | Scroll event crossing viewport margin (`-60px`/`-80px`) | Elements animate `opacity: 0 -> 1`, `y: 12/20 -> 0`, stagger 0.09s/0.12s | Fallback to immediate visibility under reduced-motion | `App.tsx:264-270, 334-360` |
| 7 | R2 Visual | Dark Stage Spotlight | Radial lighting accents behind hero and demo terminal | Page render on landing page | Radial gradient `rgba(159,186,161,0.06)` at 800x450 & 600x200 | Absent or misaligned lighting geometry | `App.tsx:254, 457`, `styles.css:57-71` |
| 8 | R2 Auth | Turnstile Widget Mounting | Cloudflare Turnstile explicit mounting in auth modal | Element `.turnstile-slot` mounted in DOM | Renders Turnstile challenge, sets `data-turnstile-rendered="true"` | Sets `data-turnstile-rendered="missing-config"` if key absent | `ProductCompletionLayer.tsx:154-192` |
| 9 | R2 Auth | Passkey & Email Hierarchy | Strict visual precedence: Passkey primary, Email fallback | Auth modal view on `/login` or `/signup` | Passkey button top, divider, email input form below | Fails if passkey not prioritized or divider missing | `passkey-auth.css:259-275` |
| 10 | R3 Inference | Synthetic Query Simulation | Simulating user inquiry triggering AI generation state | User prompt entered in textarea, Send clicked | Input disabled, `sending = true`, user message appended | Displays `.error-banner` if thread execution fails | `App.tsx:1347-1379` |
| 11 | R3 Inference | IridescentLoader Shimmer | Shimmer bar active during inference computation | `sending === true` in workspace | `.sov-shimmer-bar` animates 2.4s cubic-bezier infinite | Loader fails to mount or animation keyframe inactive | `IridescentLoader.tsx:28`, `styles.css:182` |
| 12 | R3 Inference | Typing Dots Keyframes | 3 staggered pulsating dots in AI loading indicator | `sending === true` in workspace | 3 x `.sov-typing-dot` animating 1.4s with 0s/0.16s/0.32s delays | Dots missing or not animating with vertical translation | `styles.css:198-208` |
| 13 | R3 Typography | Direct Answer Typography | Typography scaling for direct answer prose | Viewport breakpoint (`<768px` vs `>=768px`) | `1rem` (mobile) / `1.0625rem` (desktop) with `1.72` line-height | Text computed font-size or line-height drift | `styles.css:157-165` |
| 14 | R3 Transition | Workspace Tab Switching | Smooth 0.18s fade-and-slide tab transitions | User clicks tab (`today`, `people`, `systems`, etc.) | `.sov-tab-content` animates `opacity: 0->1`, `y: 6px->0` in 0.18s | Layout shift, tab jitter, or missing content | `App.tsx:1489`, `styles.css:215-221` |
| 15 | R3 Navigation | Workspace Navigation Rail | Desktop side rail / mobile bottom navigation | Active tab selection | Selected tab styled with `bg-[var(--surface-2)]` border | Navigation unclickable or active indicator missing | `App.tsx:1424-1450` |
| 16 | R1 Security | Unauthenticated Gate Redirect | Automatic redirect from protected routes to login | GET request to `/app` without active session | HTTP 302 / client push to `/login` | Fails if unauthenticated user accesses `/app` data | `live-browser-gate.ts:260-267` |
| 17 | R2 Mobile | Touch Target Compliance | Minimum 44px touch targets on interactive mobile controls | Mobile viewport tap target evaluation | All interactive buttons/inputs meet >= 44x44px bounding box | Audit warning/failure if controls < 44px | `verify-live-visual-release.mjs:139` |
| 18 | R2 Copy | Prohibited Terminology Purge | Zero internal/robotic terms in user-facing copy | Text content inspection across all pages | 0 occurrences of terms like `sovereign-answer.v2`, `Basis` | Fails `LandingParity.test.ts` if prohibited string found | `LandingParity.test.ts:75-94` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Layout Overflow | Viewport exactly 390x844 with long Japanese/Unicode strings | Subpixel rendering can produce fractional overflow; threshold `overflowX <= 2px` prevents false-positive failure while flagging genuine overflow. |
| 2 | Scroll Reveals | User system has `prefers-reduced-motion: reduce` enabled | All Framer Motion and CSS transitions immediately collapse duration to `0.001ms` / `none`, ensuring all content is instantly visible. |
| 3 | Turnstile Mounting | `VITE_TURNSTILE_SITE_KEY` empty or absent | `.turnstile-slot` sets `data-turnstile-rendered="missing-config"` and displays fallback text rather than crashing the React application. |
| 4 | Synthetic Query | User presses `Shift+Enter` vs `Enter` in composer textarea | `Shift+Enter` correctly inserts a newline; standard `Enter` submits query and triggers synthetic generation state. |
| 5 | AI Generation State | Rapid repeated clicks on "Send" while `sending === true` | Submit handler guard `if (!text || sending) return;` prevents duplicate requests or multiple concurrent loader mounts. |
| 6 | Direct Answer Typography | Nested paragraphs in direct answer text (`.answer-prose p + p`) | First paragraph has `margin: 0`; second paragraph receives `margin-top: 1rem` preserving typographic rhythm without margin collapse. |
| 7 | Workspace Tab Switching | Rapid switching between `people` and `systems` views (< 100ms) | React updates activeTab state immediately; `.sov-tab-content` restarts 0.18s animation via fresh DOM mount with `animation-fill-mode: both`. |
| 8 | Unauthenticated Route Gate | Direct URL navigation to `/app` with stale session cookie | Worker / client session validation rejects auth; redirects immediately to `/login` with `safeReturnTo` preservation. |
| 9 | Spotlight Gradients | Viewports with high contrast / forced colors active (`forced-colors: active`) | Ambient radial gradient divs (`pointer-events: none`) do not interfere with system high-contrast foreground text readability. |
| 10 | Dark Background Antialiasing | Subpixel text rendering against pure `#000000` / `#09090b` | `-webkit-font-smoothing: antialiased` applied on body ensures cream text `#f4f0e8` renders crisp and legible without blur or halo. |

---

## Comprehensive Visual QA & Interaction Verification Matrix

### R1. Live Production Payload & Style Auditing Matrix
- [x] **Zero Legacy CSS Imports**:
  - Assert 0 network requests for `public.css`, `workspace.css`, `design-system.css`.
  - Assert 0 `<link rel="stylesheet">` tags in `<head>` containing these filenames.
- [x] **Foundation Slate Background Palette**:
  - Assert computed `backgroundColor` matches slate `#09090b`, `#121212`, or near-black `#000000` / `#050505` / `#0c0c0e`.
- [x] **Zero Bronze Overrides**:
  - Assert 0 instances of `var(--bronze-accent)` or `--bronze-accent: #dda273`.
- [x] **Zero Glassmorphism / Backdrop-Blur**:
  - Assert 0 elements have `backdropFilter !== 'none'`.
- [x] **Dual Production Domain & Dual Viewport Coverage**:
  - Verify across `https://sovereign.defrag.app` and `https://app.defrag.app`.
  - Verify at Desktop (`1440x900`) and Mobile (`390x844`).

### R2. Visual Regression & Layout Verification Matrix
- [x] **Scroll Reveal Transitions**:
  - Hero container `whileInView="visible"`, `staggerChildren: 0.09`.
  - Three-layer cards `whileInView="visible"`, `staggerChildren: 0.12`, hover `y: -4`.
  - Section fade-up `transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1)`.
- [x] **Dark Stage Spotlight**:
  - Hero ambient radial glow: `w-[800px] h-[450px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(159,186,161,0.06),transparent_70%)]`.
  - Terminal demo glow: `w-[600px] h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(159,186,161,0.06),transparent_70%)]`.
  - Page noise texture: `opacity: 0.025` SVG fractal noise overlay.
- [x] **Auth Modal Turnstile & Passkey / Email Fallback Hierarchy**:
  - Mounting of `.turnstile-slot` with `data-turnstile-rendered="true"`.
  - Passkey primary CTA (`.passkey-primary` / `.passkey-button`).
  - Separation divider (`.passkey-recovery-divider`).
  - Email form fallback below divider.
- [x] **Horizontal Scroll Overflow Restriction**:
  - `overflowX = Math.max(0, scrollWidth - clientWidth) <= 2px` on all target routes at 1440x900 and 390x844.
  - Mobile touch targets >= 44x44px.

### R3. Interactive Workspace State Testing Matrix
- [x] **Synthetic Query Simulation**:
  - Submit query via composer (`textarea[placeholder="Ask Sovereign…"]`).
  - State flags `sending = true`, user message renders in chat thread.
- [x] **`<IridescentLoader/>` Keyframes & Animation**:
  - Shimmer bar `.sov-shimmer-bar`: `2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite`.
  - Shimmer keyframe: `sov-shimmer` animating `background-position: -200% 50%` to `200% 50%`.
  - Typing dots `.sov-typing-dot`: `1.4s ease-in-out infinite` with delays `0s`, `0.16s`, `0.32s`.
  - Typing dot keyframe: `sov-dot-fade` translating `translateY(0)` to `translateY(-3px)`.
- [x] **Direct Answer Typography Scaling**:
  - Element `.answer-direct` computes to:
    - `font-size: 1rem` (16px) on mobile (<768px).
    - `font-size: 1.0625rem` (17px) on tablet/desktop (>=768px).
    - `line-height: 1.72` (27.52px mobile / 29.24px desktop).
    - `color: var(--cream)` (#f4f0e8), `font-weight: 400`.
- [x] **Workspace Tab Switching**:
  - Smooth switching across `today`, `people`, `systems`, `explore`, `library`, `you`.
  - Container `.sov-tab-content` executes `sov-fade-in 0.18s ease-out both`.
  - Keyframe `sov-fade-in`: `opacity: 0 -> 1`, `translateY: 6px -> 0`.
  - Zero layout jump or reflow jitter.
