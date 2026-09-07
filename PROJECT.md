# Project: Sovereign.OS Five Workstreams Extension & Production Release

## Architecture
- **Presentation & Landing Tier (`apps/web`)**:
  - Hero section in `PublicLanding.v2.tsx`: Scaled by ~25% with `leading-[1.12]`, hosted in `max-w-5xl mx-auto`.
  - Three Conceptual Pillars (`ConceptualPillars`): SELF — Your Baseline, BETWEEN — Your Relationships, WHOLE — Your Systems.
  - Vertical Scroll Expansion Sequence (`YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS`): Step progression indicator hosting high-fidelity product UI fragments.
  - Product UI Fragments (`apps/web/src/components/fragments/`):
    - `BaselineViewFragment.tsx`: Context vectors with weighting percentages, visible above the fold.
    - `ExpressionViewFragment.tsx`: Textual differentiation between raw query input and Sovereign contextual breakdown panel.
    - `SystemMapViewFragment.tsx`: Compact SVG/CSS multi-party relationship vector network diagram.
  - Shared Static Styling (`apps/web/public/`): Shared `tokens.css` unified across `pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, and `404.html` preserving donation support contracts.
- **Conversational Chat & Auth Tier (`apps/web/src/components/chat`)**:
  - `SovereignThread.tsx`: Auto-resizing textarea composer (44px–200px scrollHeight clamping), three-block message rendering (User prompt, Sovereign Answer with exploration cards, collapsible "Sources" drawer strictly avoiding "Basis"), and sage passkey verification badge in the header.
  - SSE Streaming Client: Connects to `/api/v1/threads/{threadId}/messages` with required `x-idempotency-key: turn_${crypto.randomUUID()}` header.
- **Backend Billing & Security Tier (`apps/worker`)**:
  - Stripe Billing Webhook: Canonical handler at `/api/billing/webhook` and `/api/v1/stripe/webhook` handling 5 lifecycle events (`checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`).
  - Missing Signature Check: Returns HTTP 400 `Invalid signature` when `stripe-signature` header is omitted or invalid.
  - 402 Payment Required Middleware: `requireProTier` guards protected workspace routes (`/api/v1/workspace/pro`), enforcing HTTP 402 `Payment Required` for accounts not on `sovereign_pro` tier.
  - Zero New Migrations: Existing schema from migrations `0004` and `0009` fully covers all billing state; migration target strictly maintained at immutable `0019_deprecate_manual_capacity.sql`.
- **Gate Testing & Release Tier (`scripts/`, `apps/`)**:
  - Full gate validation: `pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm verify:foundation`, `pnpm verify:migrations`, `pnpm scan:secrets`, and `pnpm verify:cloudflare-build`.
  - Production deployment via `pnpm production:release:text` verified live at `https://sovereign.defrag.app/ready` (SHA: `ead8cbfcd9410440f3cf1c46f7b7f69f97c43f0d`).

## Code Layout & File Ownership
- **Milestone 1 Owner**:
  - `apps/web/src/components/fragments/BaselineViewFragment.tsx` (exclusively owned)
  - `apps/web/src/components/fragments/ExpressionViewFragment.tsx` (exclusively owned)
  - `apps/web/src/components/fragments/SystemMapViewFragment.tsx` (exclusively owned)
  - `apps/web/src/PublicLanding.v2.tsx` (exclusively owned)
  - `apps/web/public/tokens.css` (exclusively owned)
  - `apps/web/public/pricing.html`, `faq.html`, `how-it-works.html`, `consent.html`, `404.html` (exclusively owned)
- **Milestone 2 Owner**:
  - `apps/web/src/components/chat/SovereignThread.tsx` (exclusively owned)
  - `apps/web/src/components/chat/SovereignThread.test.ts` (exclusively owned)
  - `apps/web/src/SovereignChatWorkspace.v2.tsx` (exclusively owned)
- **Milestone 3 Owner**:
  - `apps/worker/src/index.ts` (exclusively owned)
  - `apps/worker/src/routes/stripe.ts` (exclusively owned)
  - `apps/worker/src/billing/stripe.ts` (exclusively owned)
  - `apps/worker/src/security/tier-guard.ts` (exclusively owned)
  - `apps/worker/src/billing/stripe-webhook-route-r4.test.ts` (exclusively owned)
- **Shared / Protected Files**:
  - `apps/web/src/App.tsx`: Protected file — contains zero `backdrop-blur` (preserves `LandingParity.test.ts`).
  - `apps/worker/migrations/`: Immutable sequence ending at `0019_deprecate_manual_capacity.sql`. Zero new migration files.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Atmospheric Glass Borders | Replace stark borders with semi-transparent atmospheric glass borders (`border-white/10`) | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Hero Scale & max-w-5xl | Increase hero headline scale by ~25% with expanded line-height in `max-w-5xl` container | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Three Conceptual Pillars | Replace generic 1-2-3 steps with SELF — Your Baseline, BETWEEN — Your Relationships, WHOLE — Your Systems | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Vertical Scroll Expansion Sequence | Implement sequence: `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS` | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Static HTML Design System Unification | Ensure all 5 static HTML pages share `tokens.css` while preserving donation anchors | M1 | ORIGINAL_REQUEST §R1 |
| 6 | Baseline View UI Fragment | Mock context vectors with percentage weights and descriptors, visible above the fold | M1 | ORIGINAL_REQUEST §R2 |
| 7 | Expression View UI Fragment | Textual contrast between raw query input and Sovereign contextual breakdown | M1 | ORIGINAL_REQUEST §R2 |
| 8 | System Map View UI Fragment | Compact SVG/CSS multi-party relationship vector node diagram without errors | M1 | ORIGINAL_REQUEST §R2 |
| 9 | Auto-Resize Textarea Composer | Clamped scrollHeight expansion (44px–200px) with Enter/Shift+Enter handling | M2 | ORIGINAL_REQUEST §R3 |
| 10 | Three-Block Message Rendering | Separate User block, Sovereign Answer block (with exploration cards), and Sources drawer | M2 | ORIGINAL_REQUEST §R3 |
| 11 | Compliant Collapsible Sources Drawer | Collapsible drawer strictly labeled "Sources" / "Source details" (NEVER "Basis") | M2 | ORIGINAL_REQUEST §R3 |
| 12 | Passkey Header Badge | Conditionally rendered sage passkey badge based on session state | M2 | ORIGINAL_REQUEST §R3 |
| 13 | Thread SSE & Idempotency Key | Stream messages from `/api/v1/threads/{id}/messages` with required `x-idempotency-key` | M2 | ORIGINAL_REQUEST §R3 |
| 14 | Webhook Route & Missing Signature Check | POST to `/api/billing/webhook` returns 400 for missing/invalid `stripe-signature` header | M3 | ORIGINAL_REQUEST §R4 |
| 15 | Five Stripe Webhook Events | Handle `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted` | M3 | ORIGINAL_REQUEST §R4 |
| 16 | 402 Payment Required Middleware | Require `sovereign_pro` tier on protected workspace route, returning HTTP 402 | M3 | ORIGINAL_REQUEST §R4 |
| 17 | Zero Hardcoded Stripe Secrets | Read secrets solely from worker environment bindings; pass `scan:secrets` | M3 | ORIGINAL_REQUEST §R4 |
| 18 | D1 Migration Target Immutability | Strictly maintain canonical target at `0019_deprecate_manual_capacity.sql`; zero new migrations | M3 | ORIGINAL_REQUEST §Key Context |
| 19 | Monorepo Gate Suite | Zero errors across `pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm verify:foundation` | M4 | ORIGINAL_REQUEST §R5 |
| 20 | Deployment Verification & Evidence | Deploy via `pnpm production:release:text` and document release commit SHA | M4 | ORIGINAL_REQUEST §R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Frontend Design System & UI Fragments (R1 & R2) | Hero scale, glass borders, Conceptual Pillars, Expansion Sequence, Baseline/Expression/System Map UI fragments, static HTML unification | Survey | DONE |
| M2 | Chat Thread Component Polish & Passkey (R3) | `SovereignThread.tsx`, auto-resize textarea, 3 message blocks, Sources drawer, passkey badge, SSE integration, unit tests | Survey | DONE |
| M3 | Stripe Billing Webhook & 402 Middleware (R4) | `/api/billing/webhook` route, missing-signature 400, 5 events, `requireProTier` 402 middleware, zero new migrations, unit tests | Survey | DONE |
| M4 | Gate Verification, Forensic Audit & Deployment (R5) | Monorepo gate testing, independent Reviewer & Challenger verification, Forensic Integrity Audit, and deployment execution | M1, M2, M3 | DONE |

## Interface Contracts
### UI Fragment Integration Contract
- `BaselineViewFragment`: Exports `BaselineViewFragment({ compact?: boolean })`. Purely presentational, zero API calls, renders context vectors.
- `ExpressionViewFragment`: Exports `ExpressionViewFragment()`. Purely presentational, zero API calls.
- `SystemMapViewFragment`: Exports `SystemMapViewFragment()`. Purely presentational, zero API calls, renders SVG network.
- `PublicLanding.v2.tsx`: Renders `BaselineViewFragment` above the fold in the Hero stage, and embeds all three fragments in the `YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS` expansion sequence.

### Chat Thread Contract
- `SovereignThread`:
  - Props: `{ threadId?: string, session?: AuthSession | null, hasVerifiedPasskey?: boolean, surface?: string, initialMessages?: ChatMessage[], onTurnComplete?: (msg: ChatMessage) => void }`
  - Textarea: auto-resizes via `scrollHeight` clamped between 44px and 200px.
  - Message Blocks: User inquiry, Sovereign Answer, Collapsible Sources drawer.
  - Language Law: Never renders "Basis", "sovereign-answer.v2", or "model-safe context".
  - SSE Request: Includes `'x-idempotency-key': 'turn_' + crypto.randomUUID()`.

### Billing & Security Contract
- Route: `POST /api/billing/webhook` and `POST /api/v1/stripe/webhook`
- Missing Signature Header: Returns HTTP 400 with text `'Invalid signature'`.
- Events Handled:
  1. `checkout.session.completed` -> upserts `stripe_customers`
  2. `invoice.payment_succeeded` -> reconciles active subscription
  3. `invoice.payment_failed` -> updates subscription to `past_due`, sets entitlement to `free`, triggers `payment_attention` notification
  4. `customer.subscription.updated` -> projects subscription status
  5. `customer.subscription.deleted` -> projects subscription cancellation
- Protected Pro Route:
  - `GET /api/v1/workspace/pro` -> returns HTTP 402 `{ error: 'payment_required', requiredTier: 'sovereign_pro' }` when account plan is not `sovereign_pro`.
- Secrets: strictly read from `env.STRIPE_WEBHOOK_SECRET` and `env.STRIPE_SECRET_KEY`.
