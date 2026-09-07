# Handoff Report: Route Flow & Page Flow Survey

**Agent**: `survey_explorer_2` (Route Flow Explorer)  
**Parent**: Project Orchestrator (`428716aa-5ea4-415f-b004-15b10aefd9af`)  
**Timestamp**: 2026-09-07T15:40:30Z  
**Type**: Hard Handoff  

---

## 1. Observation

1. **Routing Definition & Mapping in `apps/web/src/App.tsx`**:
   - `Route` type definition (`App.tsx:45-56`):
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
     ```
   - Route resolution function (`App.tsx:67-84`):
     ```typescript
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
     ```
   - Client navigation dispatcher (`App.tsx:86-89`):
     ```typescript
     function go(path: Route) {
       window.history.pushState({}, '', path);
       window.dispatchEvent(new PopStateEvent('popstate'));
     }
     ```
   - Router rendering dispatch (`App.tsx:146-156`):
     ```typescript
     if (route === '/app') return <Workspace />;
     if (route === '/onboarding') return <Onboarding />;
     if (route === '/auth/redeem') return <Redeem />;
     if (route === '/login' || route === '/signup') return <Auth mode={route.slice(1) as 'login' | 'signup'} />;
     if (route === '/how-it-works') return <InfoPage onBack={() => go('/')} />;
     if (route === '/pricing') return <Pricing onBack={() => go('/')} />;
     if (route === '/faq') return <FAQ onBack={() => go('/')} />;
     if (route === '/terms') return <LegalPage title="Terms of Service" onBack={() => go('/')} />;
     if (route === '/privacy') return <LegalPage title="Privacy Policy" onBack={() => go('/')} />;
     return <Landing />;
     ```

2. **Navigation Link Omissions in `App.tsx`**:
   - `<Header />` nav links (`App.tsx:180-185`):
     ```tsx
     <nav className="hidden items-center gap-8 md:flex">
       <button onClick={() => scrollToLayer('layer-01')} className="...">01 · You</button>
       <button onClick={() => scrollToLayer('layer-02')} className="...">02 · You + Your People</button>
       <button onClick={() => scrollToLayer('layer-03')} className="...">03 · Whole System</button>
       <button onClick={() => go('/pricing')} className="...">Pricing</button>
     </nav>
     ```
     Observed: `/how-it-works` is completely omitted from `<Header />`. On mobile (`<768px`), all navigation links are hidden with no mobile menu.
   - `<footer />` links (`App.tsx:779-784`):
     ```tsx
     <div className="flex gap-6 font-utility text-[10px]">
       <button onClick={() => go('/terms')}>Terms</button>
       <button onClick={() => go('/privacy')}>Privacy</button>
       <button onClick={() => go('/pricing')}>Pricing</button>
       <button onClick={() => go('/faq')}>FAQ</button>
     </div>
     ```
     Observed: `/how-it-works` is omitted from the footer.
   - Hero button fallback logic (`App.tsx:309-316`):
     ```tsx
     onClick={() => {
       const demoEl = document.getElementById('demo');
       if (demoEl) {
         demoEl.scrollIntoView({ behavior: 'smooth' });
       } else {
         go('/how-it-works');
       }
     }}
     ```
     Observed: Since `<section id="demo" ...>` exists on Landing (`App.tsx:438`), `demoEl` is always found on the landing page, so `go('/how-it-works')` is never called.
   - `<Auth mode={mode} />` (`App.tsx:795-964`):
     Observed: No toggle link exists to switch from `/login` to `/signup` or from `/signup` to `/login`.
   - `<Workspace />` mobile sign-out (`App.tsx:1453-1476`):
     ```tsx
     <div className="hidden md:block pt-6 border-t border-[var(--line)] space-y-3">
       ...
       <button onClick={async () => { await logout(); go('/'); }}>
         <LogOut className="h-3.5 w-3.5" />
       </button>
     </div>
     ```
     Observed: Sign-out button is nested inside `hidden md:block`. On 390px mobile viewports, the sign-out button is not rendered.

3. **Edge Routing in `apps/worker/src/runtime-entry.ts`**:
   - `routeHostname` (`runtime-entry.ts:526-549`) performs 308 redirects between `sovereign.defrag.app` (public) and `app.defrag.app` (application).
   - `enforcePrivatePageBoundary` (`runtime-entry.ts:263-276`) guards `/app`, `/app/*`, and `/onboarding`, issuing a 302 redirect to `/login?returnTo=...` for unauthenticated requests.
   - `isSpaDocumentPath` (`runtime-entry.ts:587-598`) rewrites SPA routes to `/` to serve `index.html`.

4. **Test Suite Commands and Results**:
   - `pnpm test`: Exited with code 0. 69 test files / 399 tests in `apps/worker`, 2 test files in `apps/web` (`LandingParity.test.ts`, `PublicSupport.test.ts`).
   - `pnpm typecheck`: Exited with code 0 across all 5 workspace projects (`apps/web`, `packages/contracts`, `packages/agent-contracts`, `apps/worker`, `apps/sovereign-worker`).
   - `pnpm verify:foundation`: Exited with code 0 ("Foundation verified: 5 required files, JSON valid, core D1 tables present").
   - `pnpm verify:cloudflare-build`: Exited with code 0 across all 24 stages (including `worker-bundle-size`, `build`, `typecheck`, `smoke:auth`, `smoke:baseline`, `smoke:jobs`, etc.).

---

## 2. Logic Chain

1. **Step 1 (Route Definition & Discovery)**:
   - Observation 1 establishes that all 10 user-facing routes plus `/` are declared and rendered in `apps/web/src/App.tsx`.
   - However, Observation 2 demonstrates that `/how-it-works` is absent from both `<Header />` and `<footer />`, and the only button mentioning it in `App.tsx` conditionally calls `go('/how-it-works')` only when `#demo` is absent. Because `#demo` is present in `Landing()`, users cannot navigate to `/how-it-works` via clicks.

2. **Step 2 (Authentication Flow Continuity)**:
   - In Observation 2, `<Auth />` provides form submissions for either login or signup, but lacks an anchor or button to toggle between modes.
   - A user who mistakenly clicks "Sign in" (`/login`) instead of "Get started" (`/signup`) has no UI path to switch without navigating back to home.

3. **Step 3 (Mobile Viewport Constraints & Broken Controls)**:
   - In Observation 2, `<Workspace />` hides the session controls and `<LogOut />` button on screens `<768px` using Tailwind's `hidden md:block`.
   - Consequently, on a 390px mobile viewport, authenticated users have no sign-out button available anywhere in the workspace UI.
   - In `<Header />`, the desktop navigation links are hidden on mobile with no hamburger menu or replacement, leaving mobile users unable to jump to sections or pricing from the top bar.

4. **Step 4 (Route Normalization Vulnerability)**:
   - Observation 1 shows that `currentRoute()` does strict array lookup: `known.includes(path as Route)`.
   - If a URL has a trailing slash (e.g., `/pricing/` or `/app/`), `known.includes('/pricing/')` evaluates to `false`, causing the router to fall back silently to `'/'` (Landing) instead of the intended page.

5. **Step 5 (Test Suite Coverage & Gaps)**:
   - Observation 4 confirms that all existing test suites pass.
   - Inspection of `LandingParity.test.ts` reveals it only performs static regex and string searches on `App.tsx` and `index.html` (e.g. `expect(appTsx).toContain("'/how-it-works'")`).
   - There are currently zero React integration tests mounting `<App />` with a simulated router pathname to test DOM rendering, component mount lifecycle, or user navigation transitions.

---

## 3. Caveats

1. **Live Cloudflare Visual Cohesion Auditing**:
   `scripts/verify-live-route-cohesion-v2.mjs` was inspected but is bypassed in local development environments (`console.log("Route cohesion check bypassed."); process.exit(0);`). Live multi-viewport screenshot verification requires active Cloudflare Browser Rendering credentials (`CLOUDFLARE_BROWSER_API_TOKEN`).
2. **Static HTML vs SPA Serving**:
   `apps/web/public/` contains legacy static HTML files (`how-it-works.html`, `pricing.html`, `faq.html`). When testing direct URL requests through the Cloudflare Worker vs client-side navigation in the SPA, static files may be returned on direct hard reloads if `isSpaDocumentPath` does not rewrite them.

---

## 4. Conclusion

The application's route architecture in `apps/web/src/App.tsx` is clean, lightweight, and completely consolidated, satisfying all current static test contracts. However, there are five concrete UI flow and route integrity defects:
1. `/how-it-works` is orphaned from public navigation clicks.
2. The `<Auth />` screen lacks a mode switcher between `/login` and `/signup`.
3. Authenticated mobile users on `/app` (390px) cannot sign out because the `<LogOut />` button is `hidden md:block`.
4. Mobile landing page visitors lack a header navigation menu.
5. Trailing slash URLs (e.g. `/pricing/`, `/app/`) silently drop to the landing page due to unnormalized path matching in `currentRoute()`.

---

## 5. Verification Method

To independently verify all observations and conclusions:

1. **Run Full Test & Build Suite**:
   ```bash
   pnpm test
   pnpm typecheck
   pnpm verify:foundation
   pnpm verify:cloudflare-build
   ```
   All commands should exit 0 with zero errors.

2. **Verify Navigation Omissions**:
   Inspect `apps/web/src/App.tsx` lines 180-185 (`<Header />`), lines 779-784 (`<footer />`), and lines 309-316 (hero button). Confirm that `/how-it-works` is not reachable via clicks from Landing.

3. **Verify Mobile Sign-Out Omission**:
   Inspect `apps/web/src/App.tsx` lines 1453-1476. Confirm that the sign-out button is inside `<div className="hidden md:block ...">`.

4. **Verify Trailing Slash Routing Defect**:
   Inspect `apps/web/src/App.tsx` lines 67-84. Confirm that `known.includes(path as Route)` does not normalize trailing slashes.
