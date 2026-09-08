# Dispatch Instructions

## 2026-09-07T21:24:03Z

<USER_REQUEST>
You are the Project Orchestrator for Sovereign.OS.

Your working directory is: /Users/cjo/Sovereign.final/.agents/orchestrator_5/
The project workspace root is: /Users/cjo/Sovereign.final
The authoritative user request is recorded in: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (under section ## 2026-09-07T21:23:27Z).

Here is the exact task:
Sovereign.OS is a personal AI platform deployed at `sovereign.defrag.app` on Cloudflare Workers. The project extends the existing React + Cloudflare Worker monorepo with five parallel workstreams: design-system polish synced from a Framer reference, real product UI fragments replacing empty placeholders, WebAuthn passkey authentication, Stripe billing webhook integration, and a polished AI chat thread component (`SovereignThread.tsx`).

Working directory: /Users/cjo/Sovereign.final
Integrity mode: development

## Key Context (Read Before Starting)
- **Repo**: `/Users/cjo/Sovereign.final` — pnpm monorepo with `apps/web` (Vite + React) and `apps/sovereign-worker` (Cloudflare Worker)
- **Framer reference**: https://slight-use-623506.framer.app/ (visual authority — use published preview site for visual matching)
- **Live product**: https://sovereign.defrag.app (Cloudflare production)
- **Build command**: `pnpm production:release:text` — the *only* verified deploy command
- **Test gate**: `pnpm typecheck && pnpm build && pnpm test && pnpm verify:foundation` must all pass green before any release
- **D1 migrations**: Current canonical migration target is `0019_deprecate_manual_capacity.sql`; 19 migrations already applied. Do NOT add a `002_subscription_status.sql` — Stripe customer schema already exists in `0004_stripe_customers.sql` and billing safety in `0009_production_scale_and_billing_safety.sql`
- **Auth**: PasskeyAuthentication.tsx already exists at `apps/web/src/PasskeyAuthentication.tsx` — extend, don't replace
- **Chat**: `SovereignChatWorkspace.v2.tsx` already exists — polish and extend
- **Language law**: Never expose internal terms: Basis IDs, model/provider identifiers, `sovereign-answer.v2`, model-safe context. Use `docs/product-language-system.md` as authority
- **Visual law (AGENTS.md)**: Near-black `#0a0a0a`, warm cream typography `#f5f5f7`, restrained sage accent `#9fbaa1`. No fake metrics, no decorative AI effects, no dashboard card walls

## Requirements

### R1. Design System & Hero Section Polish
Update `apps/web/src/PublicLanding.v2.tsx` and associated CSS files (`design-system.css`, `styles.css`, tokens) to match the Framer reference at https://slight-use-623506.framer.app/. Specifically:
- Replace stark 1px white borders with atmospheric glass borders (`border-white/10` equivalent)
- Increase hero headline scale by ~25% with expanded line-height and `max-w-5xl` container
- Replace generic feature cards with the three conceptual pillars: **SELF — Your Baseline**, **BETWEEN — Your Relationships**, **WHOLE — Your Systems**
- Implement a vertical scroll expansion sequence: `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`
- All static HTML pages in `apps/web/public/` (`pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html`) must share the same CSS variables and dark-mode design system

### R2. Real Product UI Fragments
Replace large empty dark-gradient placeholder rectangles across the landing and workspace layouts with high-fidelity non-functional interface fragments:
- **Baseline View**: Mock metadata cards showing context vectors and baseline weighting (no real data)
- **Expression View**: Textual differentiation between a raw query input and a Sovereign contextual breakdown panel
- **System Map View**: Compact SVG/CSS node network snippet illustrating multi-party relationship vectors
These are purely presentational — no real API calls, no real user data.

### R3. Chat Thread Component Polish (`SovereignThread.tsx`)
Create or substantially refine `apps/web/src/components/chat/SovereignThread.tsx` building on the existing `SovereignChatWorkspace.v2.tsx`:
- Auto-resize textarea composer
- Rich message rendering separating: user prompt block, Sovereign synthesized answer block, and a collapsible "Sources" drawer (never labeled "Basis")
- Entry animations compatible with the existing design system (no external animation libraries unless already in package.json)
- Passkey verification badge visible in the header when the session has a verified passkey credential
- Must integrate with existing `/api/v1/threads/{threadId}/messages` SSE endpoint

### R4. Stripe Billing Webhook Route
Extend `apps/sovereign-worker/src/` to add or verify a webhook handler for `/api/billing/webhook` that handles:
- `checkout.session.completed`
- `invoice.payment_succeeded` and `invoice.payment_failed`
- `customer.subscription.updated` and `customer.subscription.deleted`
Do NOT add a new D1 migration — billing schema already exists in migrations `0004` and `0009`. Verify the Stripe webhook secret is read from the worker's environment bindings, not hardcoded. Add 402 Payment Required middleware for protected workspace routes that require `sovereign_pro` tier.

### R5. Gate Testing & Deployment Verification
All changes must pass the full gate before any deployment:
1. `pnpm typecheck` — zero TypeScript errors
2. `pnpm build` — clean production build
3. `pnpm test` — all Vitest tests green (including `PublicSupport.test.ts` and `LandingParity.test.ts`)
4. `pnpm verify:foundation` — foundation verification script passes
Deploy with `pnpm production:release:text` only after all gates pass. Document the SHA of the deployed commit in release evidence.
</USER_REQUEST>
