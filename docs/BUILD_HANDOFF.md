# Sovereign.OS — Build Handoff

## Immediate build order

1. Publish the foundation tree.
2. Run `pnpm install` with the committed versions in package manifests.
3. Add the first real extracted backend commit.
4. Point `apps/worker/wrangler.jsonc` at the existing D1/DO/AI/Turnstile/Stripe/Resend bindings.
5. Run the first vertical slice against a development/preview Worker.
6. Only then expand People, Systems, Library, and secondary public pages.

## Local commands

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm test
pnpm --filter @sovereign/web dev
pnpm --filter @sovereign/worker dev
```

## First extraction commit

Extract these in one controlled change set so the first real route has a coherent request path:

```text
runtime-entry / entry / env / runtime
security/auth + security/d1-session + security/headers
auth-public + auth-session
baseline + baseline-engine + baseline-contracts + baseline-facets + astronomy
agent/sovereign + prompt + recognition + input-safety + safety + grounded-intelligence
conversation-context
necessary expression/relationship/relational/emotional context
accounts + entitlements + threads + turns
usage + Stripe
email
required migrations
agent-contracts
```

Do not extract public marketing code from `OPENAPI`.

## Wiring contract

The UI uses the existing endpoints; the Worker owns all business authorization.

```text
web fetch client
    |
    +--> /api/v1/auth/*
    +--> /api/v1/account/onboarding
    +--> /api/v1/baseline/onboarding
    +--> /api/v1/baseline/status
    +--> /api/v1/threads/*
    +--> /api/v1/billing/*
    +--> /api/v1/stripe/webhook
```

The frontend must never decide whether a user is entitled to People, Systems, Library, or AI turns. It may hide unavailable controls, but the Worker must enforce every boundary.

## Build truthfulness

The foundation workspace contains an intentional visual shell, not a fake implementation of the backend. The send handler in the starter workspace is a local interaction preview and must be replaced by the real thread endpoint before production.

Do not ship the starter with mocked answers or simulated account state.
