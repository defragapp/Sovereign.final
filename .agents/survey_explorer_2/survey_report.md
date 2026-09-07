# Sovereign.OS Application Route & Page Flow Survey Report

**Explorer**: `survey_explorer_2` (Route Flow Explorer)  
**Date**: 2026-09-07  
**Project**: Sovereign UI Simplification and Route Verification  
**Repository**: `/Users/cjo/Sovereign.final`  

---

## 1. Executive Summary

This survey provides a comprehensive architectural and functional analysis of all user-facing application routes, page flows, layout dynamics, and test coverage across the Sovereign.OS web application (`apps/web`) and edge routing environment (`apps/worker`).

All 10 required user-facing routes (`/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`) plus the root landing page (`/`) are consolidated within `apps/web/src/App.tsx`. Routing is managed via a custom lightweight pushState/popstate mechanism without external routing libraries. Edge routing across `sovereign.defrag.app` (public domain) and `app.defrag.app` (application domain) is handled by Cloudflare Worker logic in `apps/worker/src/runtime-entry.ts`.

All test gates (`pnpm test`, `pnpm typecheck`, `pnpm verify:foundation`, and `pnpm verify:cloudflare-build` across 24 stages) currently pass with 0 errors. Several key UX gaps and edge case vulnerabilities were identified:
1. **Orphaned Route**: `/how-it-works` is missing from both the public `<Header />` and `<footer />` in `App.tsx`, and the hero fallback CTA scrolls to `#demo` instead of navigating.
2. **Missing Auth Toggle**: The `<Auth />` component has no link to toggle between `/login` and `/signup`.
3. **Missing Mobile Navigation**: Desktop header nav items (`01 · You`, `02 · You + Your People`, `03 · Whole System`, `Pricing`) are hidden on mobile (`md:hidden`) with no mobile menu or drawer alternative.
4. **Missing Mobile Sign-Out**: In `<Workspace />`, the sign-out control (`LogOut`) is wrapped in `hidden md:block`, leaving authenticated mobile users with no in-app mechanism to log out.
5. **Trailing Slash Sensitivity**: `currentRoute()` uses strict array inclusion without trailing-slash normalization, causing `/pricing/` or `/app/` to silently render `/` (Landing).
6. **Test Suite Gap**: Existing web tests (`LandingParity.test.ts`) perform static file string assertions; no integration tests mount `<App />` at each route to verify DOM rendering.

---

## 2. Route Survey & Architecture Catalog

### 2.1 Route Inventory

| Route | Component | Parent Shell | Key Interactions & State | Target Domain |
|---|---|---|---|---|
| `/` | `<Landing />` | Self (`page-noise`) | Hero CTA (`/signup`), 3-Layer Scope, Interactive Demo (`#demo`), Pricing cards (`/signup`), Footer nav | `sovereign.defrag.app` |
| `/how-it-works` | `<InfoPage />` | `<PageFrame />` | 4 numbered sections (`01`–`04`), Stripe voluntary support CTA (`$1+`), Back button (`go('/')`) | `sovereign.defrag.app` |
| `/pricing` | `<Pricing />` | `<PageFrame />` | Free tier ($0) & Sovereign+ ($20/mo) cards (`go('/signup')`), Stripe voluntary support CTA, Back button | `sovereign.defrag.app` |
| `/faq` | `<FAQ />` | `<PageFrame />` | 4 collapsible `<details>` accordions with animated chevron, Back button | `sovereign.defrag.app` |
| `/terms` | `<LegalPage title="Terms of Service" />` | `<PageFrame />` | Terms policy copy (effective Aug 17, 2026), Back button | `sovereign.defrag.app` |
| `/privacy` | `<LegalPage title="Privacy Policy" />` | `<PageFrame />` | Privacy policy copy (effective Aug 17, 2026), Back button | `sovereign.defrag.app` |
| `/login` | `<Auth mode="login" />` | Self (`page-noise`) | Email input, OTP code request (`requestLogin`), 6-digit code entry (`redeemAuth`), Back to home logo | `app.defrag.app` |
| `/signup` | `<Auth mode="signup" />` | Self (`page-noise`) | Name & email input, 18+ age checkbox, Terms/Privacy checkboxes (`go('/terms')`, `go('/privacy')`), OTP code entry | `app.defrag.app` |
| `/auth/redeem` | `<Redeem />` | Self (`page-noise`) | URL query param `token` consumption (`redeemAuth`), spinner / checkmark / error states, redirects to `res.next` or `/app` | `app.defrag.app` |
| `/onboarding` | `<Onboarding />` | Self (`page-noise`) | Auth check (`checkSession`), Baseline intake (`submitBaseline`), compute polling, plan selection (`completeAccountOnboarding`) | `app.defrag.app` |
| `/app` | `<Workspace />` | Self (`min-h-screen`) | Auth check, Baseline readiness check, 6 tabs (`today`, `explore`, `people`, `systems`, `library`, `you`), thread messaging, sign out | `app.defrag.app` |

---

## 3. Detailed Route Analysis

### 3.1 `/how-it-works`
- **Location**: `apps/web/src/App.tsx:1885-1940`
- **Rendering**: `<InfoPage onBack={() => go('/')} />` wrapped in `<PageFrame title="How Sovereign Works">`.
- **Content**:
  - `01`: "Start with you" (Baseline private reference).
  - `02`: "Bring real situations" (Grounded AI answers).
  - `03`: "Understand what happens between people" (Relational dynamics without collapsing perspectives).
  - `04`: "See the whole system" (Family and team patterns).
  - Voluntary support box: "Support Sovereign.OS from $1." linking to `https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`.
- **Responsive Layout**: Uses `md:grid-cols-[80px_1fr]` for each section. On mobile, the label and content stack vertically cleanly.
- **Edge Routing**: Listed in `PUBLIC_PATHS` (`apps/worker/src/runtime-entry.ts:72`). Note: `apps/web/public/how-it-works.html` also exists for static fallback.

### 3.2 `/pricing`
- **Location**: `apps/web/src/App.tsx:1941-2001`
- **Rendering**: `<Pricing onBack={() => go('/')} />` wrapped in `<PageFrame title="Pricing">`.
- **Content**:
  - Standard Free card ($0): 10 AI turns / month, CTA button `Start Free` -> `go('/signup')`.
  - Sovereign+ card ($20 / month): 300 AI turns / month, relational intelligence, systems, extended library retention, CTA button `Start Sovereign+` -> `go('/signup')`.
  - Voluntary contribution disclosure & link to Stripe.
- **Responsive Layout**: Uses `grid gap-6 md:grid-cols-2`. On mobile (<768px), cards stack vertically. Card padding is `p-8`. On 390px screens, `p-8` leaves 278px content width, which fits but could be optimized to `p-6 md:p-8` for improved mobile breathing room.
- **Edge Routing**: Listed in `PUBLIC_PATHS`. `apps/web/public/pricing.html` exists for static fallback.

### 3.3 `/faq`
- **Location**: `apps/web/src/App.tsx:2002-2036`
- **Rendering**: `<FAQ onBack={() => go('/')} />` wrapped in `<PageFrame title="Frequently Asked Questions">`.
- **Content**: 4 collapsible `<details>` blocks with `<summary>` tags and animated `ChevronDown` (`group-open:rotate-180`):
  1. What is Sovereign?
  2. What is a Baseline?
  3. Does Sovereign know what another person feels or intends?
  4. Can I support Sovereign.OS without subscribing?
- **Responsive Layout**: Max width `max-w-3xl`, clean vertical stack across both viewports.
- **Edge Routing**: Listed in `PUBLIC_PATHS`. `apps/web/public/faq.html` exists for static fallback.

### 3.4 `/terms` & `/privacy`
- **Location**: `apps/web/src/App.tsx:2037-2055`
- **Rendering**: `<LegalPage title="..." onBack={() => go('/')} />` wrapped in `<PageFrame title="...">`.
- **Content**: Both render identical data isolation and privacy disclosures:
  - "EFFECTIVE DATE: AUGUST 17, 2026"
  - Data isolation: raw birth date, exact coordinates, and private notes stored strictly for Baseline, never entering language model prompt context.
  - Consented sharing requires explicit approval.
  - No selling or training public AI models on private data.
- **Responsive Layout**: `max-w-3xl`, text-sm leading-relaxed. Renders cleanly across all viewports.
- **Edge Routing**: Listed in `PUBLIC_PATHS` and `isSpaDocumentPath`.

### 3.5 `/login` & `/signup`
- **Location**: `apps/web/src/App.tsx:795-964`
- **Rendering**: `<Auth mode="login" | "signup" />`.
- **Content**:
  - `signup`: Title "Create your Sovereign account", Name input, Email input, 18+ checkbox, Terms & Privacy checkboxes (`<button onClick={() => go('/terms')}>Terms</button>`, `<button onClick={() => go('/privacy')}>Privacy Policy</button>`), Submit "Continue".
  - `login`: Title "Sign in to Sovereign", Email input, Submit "Send sign-in link".
  - Shared OTP state: When sent, renders 6-digit code input (`Input maxLength={6}`) with button "Confirm & Open" (`redeemAuth({ email, code })`), plus "Use a different email address".
  - Upon redemption: Navigates to `res.next` (e.g. `/onboarding`) or `/app`.
- **Flow Observation**:
  - No link exists to toggle between `/login` and `/signup`.
  - Logo at top navigates to `go('/')`.
- **Edge Routing**: `isApplicationPagePath('/login')` & `isApplicationPagePath('/signup')`. The worker automatically redirects (308) requests from `sovereign.defrag.app` to `app.defrag.app`.

### 3.6 `/auth/redeem`
- **Location**: `apps/web/src/App.tsx:968-1018`
- **Rendering**: `<Redeem />`.
- **Content**:
  - Parses query param `token` from `window.location.search`.
  - States: `loading` (spinner "Opening your private session..."), `error` ("Unable to redeem link" + error message + "Back to sign in" button `go('/login')`), `success` (checkmark "Session authenticated").
  - On success: `go(res.next || '/app')`.
- **Edge Routing**: `currentRoute()` matches via `if (path.startsWith('/auth/redeem')) return '/auth/redeem'`. Worker handles via `pathname.startsWith('/auth/')`.

### 3.7 `/onboarding`
- **Location**: `apps/web/src/App.tsx:1022-1302`
- **Rendering**: `<Onboarding />`.
- **Lifecycle & Steps**:
  1. `loading`: Verifies session via `checkSession()`. If unauthenticated, `go('/login')`. If session valid, queries `getBaselineStatus()`. If baseline ready and `getAccountOnboarding().completed`, redirects to `go('/app')`.
  2. `intake`: Step 1 of 2. Forms for Birth Date (`type="date"`), Birthplace, Birthplace Timezone, Time Certainty (`exact` | `approximate` | `unknown`), Birth Time (if certainty != unknown). Submits `submitBaseline()`.
  3. `computing`: Spinner screen polling `getBaselineStatus()` every 1.5s until `status.ready` (up to 15 attempts).
  4. `plan`: Step 2 of 2. "Choose your launch tier" between Free Tier ($0, 10 turns/mo) and Sovereign+ ($20/mo, 300 turns/mo). Submits `completeAccountOnboarding(selectedPlan)` then `go('/app')`.
- **Responsive Layout**: `max-w-lg` centered container. Time certainty buttons use `grid grid-cols-3 gap-2`. On 390px viewport, buttons are ~90px wide, which fits closely within mobile card padding.
- **Edge Routing**: Worker enforces `isPrivateApplicationPagePath('/onboarding')`. Direct unauthenticated HTTP requests receive a 302 redirect to `https://app.defrag.app/login?returnTo=/onboarding`.

### 3.8 `/app`
- **Location**: `apps/web/src/App.tsx:1308-1880`
- **Rendering**: `<Workspace />`.
- **Lifecycle**:
  - Calls `checkSession()`. If unauthenticated, `go('/login')`.
  - Calls `getBaselineStatus()`. If `!bl.ready`, `go('/onboarding')`.
  - Loads `getEntitlements()`.
- **Tabs (`activeTab`)**:
  1. `today`: Chat / query intake surface. Suggestion situation pills, chat message thread, direct answer card with sections & feedback (`yes`, `partly`, `not_today`), IridescentLoader (`sov-shimmer-bar` and `sov-typing-dot`), sticky bottom chat input box with `Ask Sovereign…` placeholder.
  2. `explore`: 4 pattern cards (`Decision Making`, `Communication Under Stress`, `Momentum & Energy`, `Boundaries & Trust`), clicking "Explore this pattern →" pre-fills query and switches to `today`.
  3. `people`: Included people list, Add person form (`handleAddPerson`), "Examine dynamic →" switches to `today`.
  4. `systems`: Interconnected dynamic diagram & prompt CTA.
  5. `library`: Current active thread status, 30-day retention indicator.
  6. `you`: Baseline status indicators (Cognitive Framing, Decision Rhythm, Communication Tone, Generative Momentum, Relational Trust, Friction Response).
- **Responsive Layout**:
  - Desktop (1440px): Left sidebar `aside` at `md:w-60`, vertical nav tabs, bottom user session & sign out controls.
  - Mobile (390px): Sidebar becomes top bar with horizontal scrolling nav (`overflow-x-auto`).
  - **Identified Defect**: Bottom session & sign-out controls are inside `<div className="hidden md:block pt-6 ...">`. Mobile users cannot log out from `/app`.
- **Edge Routing**: Worker enforces `isPrivateApplicationPagePath('/app')`. Direct unauthenticated HTTP requests receive a 302 redirect to `https://app.defrag.app/login?returnTo=/app`.

---

## 4. Routing Architecture & Implementation

### 4.1 Client Routing (`apps/web/src/App.tsx`)
```typescript
type Route =
  | '/'
  | '/how-it-works'
  | '/pricing'
  | '/faq'
  | '/terms'
  | '/privacy'
  | '/login'
  | '/signup'
  | '/auth/redeem'
  | '/onboarding'
  | '/app';

function currentRoute(): Route {
  const path = window.location.pathname;
  if (path.startsWith('/auth/redeem')) return '/auth/redeem';
  const known: Route[] = [
    '/',
    '/how-it-works',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy',
    '/login',
    '/signup',
    '/auth/redeem',
    '/onboarding',
    '/app'
  ];
  return known.includes(path as Route) ? (path as Route) : '/';
}

function go(path: Route) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
```

### 4.2 Edge Routing (`apps/worker/src/runtime-entry.ts`)
- **Public Domain**: `sovereign.defrag.app`
- **App Domain**: `app.defrag.app`
- **Hostname Redirection (`routeHostname`)**:
  - `PUBLIC_HOST + isApplicationPath(pathname)` → 308 redirect to `APP_HOST`.
  - `APP_HOST + '/'` → 308 redirect to `APP_HOST + '/app'`.
  - `APP_HOST + PUBLIC_PATHS` → 308 redirect to `PUBLIC_HOST`.
- **SPA Rewrite (`navigationAssetRequest`)**:
  - `isSpaDocumentPath(pathname)` rewrites request path to `/` so Cloudflare Assets serves `index.html`.
  - Note: `isSpaDocumentPath` covers `/`, `/privacy`, `/terms`, `/app`, `/login`, `/signup`, `/onboarding`, `/invitation`, `/auth/*`.
  - `/pricing`, `/faq`, and `/how-it-works` are handled via static asset serving (`pricing.html`, `faq.html`, `how-it-works.html`) when fetched directly by URL, while client-side transitions render the React component counterparts.

---

## 5. Layout, Clipping & Viewport Analysis (1440px vs 390px)

| Viewport | Element / Component | Behavior | Assessment |
|---|---|---|---|
| **1440px (Desktop)** | Public `<Header />` | 64px height, max-w-6xl, logo, 4 nav items (`01`, `02`, `03`, `Pricing`), Sign in, Get started | Clean, balanced whitespace, no clipping. |
| **1440px (Desktop)** | `<Landing />` | Multi-section editorial progression, hero ambient radial glow, 3-layer scope cards, interactive demo with sources drawer, pricing preview | Generous padding, crisp typography contrast. |
| **1440px (Desktop)** | `<Workspace />` | Left rail `md:w-60`, main content `max-w-3xl`, sticky input box | Clean two-column layout, zero horizontal overflow. |
| **390px (Mobile)** | Public `<Header />` | Logo on left, Sign in & Get started on right. Nav links hidden via `hidden md:flex`. | Zero horizontal scroll, but mobile users cannot navigate to sections or pricing from header. |
| **390px (Mobile)** | `<Landing />` Hero | Hero buttons stack vertically (`w-full sm:w-auto`), kicker and title wrap naturally | No text clipping, typography line-height (`0.98` display) prevents collision. |
| **390px (Mobile)** | `<Pricing />` Cards | Single column stacked. Outer container `px-6`, inner card `p-8` | Fits in 390px (278px content), but `p-8` is slightly wide for mobile margins. |
| **390px (Mobile)** | `<Onboarding />` Time Certainty | 3 columns in `grid grid-cols-3 gap-2` within card | Buttons (~90px) accommodate "approximate" at `text-xs` closely. |
| **390px (Mobile)** | `<Workspace />` Rail | Sidebar becomes top row with `overflow-x-auto` | Nav buttons scroll smoothly horizontally; however, sign-out button is hidden. |
| **390px (Mobile)** | `<Workspace />` Input Box | Sticky at `bottom-4` with `bg-[#111110]` | Accessible thumb zone, textarea expands, send button pinned. |

---

## 6. Audit of Existing Test Coverage

### 6.1 Test Suites Overview
1. **`apps/web/src/LandingParity.test.ts`** (11 vitest assertions):
   - Confirms Inter and JetBrains Mono fonts in `index.html`.
   - Confirms CSS variables (`--font-sans`, `--font-mono`, `--platform-bg: #000000`, `--sage: #9fbaa1`).
   - Asserts exact Founder Hero copy with typographic apostrophe (`Healing isn’t optional.<br />\n              Holding onto the pain is.`).
   - Asserts Three-Layer Scope exact copy (01 · YOU, 02 · YOU + YOUR PEOPLE, 03 · FROM 1:1 TO THE WHOLE SYSTEM).
   - Asserts Sovereign Answer Demo copy (relational triad, source details).
   - Enforces zero prohibited backend terms (`sovereign-answer.v2`, `model-safe context`, `model context`, `server-approved`, `One private foundation`, `Separate helping from carrying`, `See where responsibility keeps landing`, `Understand both sides and what happens between you`, `Ask about your life`, `authority`, `What is Basis?`).
   - Asserts zero `backdrop-blur` and confirms `bg-[#000000]`.
   - Asserts Today copy ("What is active for you now?", "Ask Sovereign…", "Private by default…").
   - Asserts presence of all 10 non-landing route literals (`'/how-it-works'`, `'/pricing'`, `'/faq'`, `'/terms'`, `'/privacy'`, `'/login'`, `'/signup'`, `'/auth/redeem'`, `'/onboarding'`, `'/app'`).
   - Asserts voluntary support URL (`https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02`).

2. **`apps/web/src/PublicSupport.test.ts`** (3 vitest assertions):
   - Confirms Stripe voluntary support URL in static HTML (`how-it-works.html`, `pricing.html`, `faq.html`, `AccountControlCenter.tsx`).
   - Confirms voluntary support is separate from subscriptions and entitlement projection.
   - Asserts contribution minimum disclosure ("from $1").

3. **`apps/worker/src/*.test.ts`** (69 test files, 399 tests):
   - Complete coverage of auth signup, login, redeem, sessions, passkeys, rate limiting, baseline computation, turn entitlements, turn recovery, Stripe subscriptions, deletion lifecycles, and security headers.

4. **Release Gate Verification**:
   - `pnpm verify:foundation` passes (core D1 tables present, 5 required files valid).
   - `pnpm typecheck` passes across all 5 workspace packages with 0 errors.
   - `pnpm verify:cloudflare-build` passes all 24 stages including bundle size, migration parity, smoke tests, and secret scans.

### 6.2 Identified Test Coverage Gaps
- **No Component-Level Route Rendering Tests**: Currently, no test mounts `<App />` with a simulated `window.location.pathname` to ensure each route renders without throwing unhandled exceptions.
- **No Client Navigation Transition Tests**: No tests simulate clicking links or calling `go(path)` to verify that `popstate` events properly update the active view.
- **No Viewport Layout / Responsive Tests**: Automated headless visual audits (`scripts/verify-live-route-cohesion-v2.mjs`) are bypassed in local environments and only execute against live Cloudflare deployments.

---

## 7. Recommended Action Plan for Implementers

1. **Fix Navigation Linkage to `/how-it-works`**:
   - Add a link to `/how-it-works` in the public `<Header />` nav and/or `<footer />` to ensure discovery from the landing page.
   - In the hero CTA button, ensure direct navigation is possible when desired.

2. **Add Auth Mode Toggle in `<Auth />`**:
   - In `/login`, add: `"Don't have an account? "` `<button onClick={() => go('/signup')} className="underline text-[var(--cream)]">Sign up</button>`.
   - In `/signup`, add: `"Already have an account? "` `<button onClick={() => go('/login')} className="underline text-[var(--cream)]">Sign in</button>`.

3. **Provide Mobile Sign-Out in `<Workspace />`**:
   - In the mobile top rail of `<Workspace />`, place a sign-out button next to the plan tag, or expose sign-out within the `'you'` tab so mobile users can log out.

4. **Add Mobile Menu Dropdown in `<Header />`**:
   - Provide a lightweight mobile navigation drawer or dropdown for 390px viewports allowing access to `How it works`, `Pricing`, `FAQ`, and layers.

5. **Normalize Trailing Slashes in Router**:
   - In `currentRoute()`, normalize `window.location.pathname.replace(/\/+$/, '') || '/'` before matching against `known`.

6. **Add Integration Tests for All 10 Routes**:
   - Create `apps/web/src/RouteIntegrity.test.tsx` using Vitest + React Testing Library to mount `<App />` at each path (`/how-it-works`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/login`, `/signup`, `/auth/redeem`, `/onboarding`, `/app`) and verify key heading / element presence.
