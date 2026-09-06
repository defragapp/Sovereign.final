# Sovereign.OS

Private personal AI for real life.

Sovereign starts with a private Baseline and helps people make sense of real questions, decisions, relationships, communication, pressure, recurring patterns, and wider systems when context is useful and consented.

## Purpose

`Sovereign.final` is the launch-focused extraction of the proven Sovereign runtime from `defragapp/OPENAPI` into a smaller, cleaner product repository.

This is an extraction and simplification project, not an intelligence rewrite. Existing Baseline, authentication/security, consent, answer-contract, billing, persistence, and Cloudflare runtime contracts remain authoritative.

## Stack

- React + Vite
- Tailwind CSS v4
- shadcn/ui-style source-owned components
- Cloudflare Worker
- Cloudflare D1
- Durable Objects
- Workers AI + AI Gateway
- Stripe
- Resend

## Product sequence

Public landing → authentication → account onboarding → Baseline → chat → optional context → People / Systems / Library.

The first launch-critical vertical slice is:

**account → Baseline → one real AI turn → rendered Sovereign answer**

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm test
pnpm --filter @sovereign/web dev
pnpm --filter @sovereign/worker dev
```

The frontend is fully wired to the production Cloudflare Worker API client (`apps/web/src/lib/api.ts`). There are no mock send paths, simulated account states, or fake AI responses in the production application. The user journey connects live:
`Landing (/) → Auth (/signup, /login, /auth/redeem) → Baseline (/onboarding) → Workspace (/app) → Thread messages (/api/v1/threads/:threadId/messages) → Sovereign Answer v2`.

## Documentation

- [`docs/SOVEREIGN_RELEASE_PLAN.md`](docs/SOVEREIGN_RELEASE_PLAN.md) — release plan, gate verification status, and deployment runbook
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — complete launch implementation plan
- [`docs/UI_UX_CONTRACT.md`](docs/UI_UX_CONTRACT.md) — public, auth, workspace, and AI-answer visual/interaction contract
- [`docs/EXTRACTION_MANIFEST.md`](docs/EXTRACTION_MANIFEST.md) — protected extraction scope from `OPENAPI`
- [`docs/DRIFT_REGISTER.md`](docs/DRIFT_REGISTER.md) — launch identity, language, capability, URL, and visual drift controls
- [`docs/BUILD_HANDOFF.md`](docs/BUILD_HANDOFF.md) — immediate implementation order and wiring expectations

## Production Release

The launch is **text-first**. The canonical database migration target is `0019_deprecate_manual_capacity`, with capacity reservation tracking governed by `0018_workers_ai_capacity_reservations` and `0013_workers_ai_free_capacity`. Private account export is available through authenticated on-demand generation from D1.

To execute the verified release:

```bash
pnpm production:release:text
```

GitHub Actions, deploy hooks, Cloudflare Pages, and preview Workers are not production release authorities.

## Source of truth

Proven production behavior is extracted from `defragapp/OPENAPI`.

Production product URL: https://sovereign.defrag.app

Public product language is `Sovereign.OS`. Repository names, provider names, internal answer-contract identifiers, and implementation terminology are not user-facing language.
