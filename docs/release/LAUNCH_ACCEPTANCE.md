# Sovereign.final Launch Acceptance Record

> [!IMPORTANT]
> **Authoritative Repository Record:** This document is the current, active launch acceptance record for [`defragapp/Sovereign.final`](https://github.com/defragapp/Sovereign.final).
> Historical launch evidence from the parent repository `defragapp/OPENAPI` (commit `c21eb46...`, deployed August 27, 2026) has been archived to [`docs/release/HISTORICAL_OPENAPI_ACCEPTANCE.md`](./HISTORICAL_OPENAPI_ACCEPTANCE.md) and serves only as historical runtime reference.

---

## Executive Status Summary

| Certification Category | Status | Details |
|------------------------|--------|---------|
| **SOURCE / LOCAL CERTIFICATION** | **PASS** | Complete implementation, 0 type errors, 442/442 unit/contract tests passing, 19 migrations verified non-destructive, 0 secret/fixture leaks, worker packaging passes, bundle budget passes, all local smoke suites pass. |
| **DEPLOYMENT CERTIFICATION** | **BLOCKED** | Current `Sovereign.final` production deployment has **not** been executed or verified from this environment because Cloudflare credentials (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`) are not configured in the execution environment. |
| **AUTHENTICATED PRODUCTION E2E** | **BLOCKED** | No authorized production test account or session is available to verify authenticated end-to-end user journeys against live production infrastructure. |

---

## Release Identity

| Field | Value |
|-------|-------|
| Product | Sovereign.OS |
| Repository | `defragapp/Sovereign.final` |
| Upstream Reference Source | `defragapp/OPENAPI` (historical reference) |
| Active Branch | `main` |
| Current HEAD Commit SHA | `be12cdf463ec1c33f2c525f29aa3f7d2f9d6ea4f` |
| `origin/main` SHA | `be12cdf463ec1c33f2c525f29aa3f7d2f9d6ea4f` |
| Release SHA Parity | In sync (`HEAD` == `origin/main`) |
| Primary Worker Name | `sovereign-agent` (`apps/worker/wrangler.jsonc`) / `sovv-web` (production direct) |
| Cloudflare Account ID | `8b1954d216d65077c6480d62583fe2c2` (configured in production config) |
| Target Custom Domains | `sovereign.defrag.app`, `app.defrag.app`, `defrag.app`, `www.defrag.app` |
| Database Migration Version | `0019_deprecate_manual_capacity` (19 non-destructive migrations) |
| D1 Database Name | `sovereign-openapi-db` (`497e5df9-c82a-499e-9be6-d809c992e8ce`) |
| AI Gateway ID | `sovereign-ai-gateway` |
| AI Model | `@cf/zai-org/glm-4.7-flash` via `cloudflare-gateway` |
| Answer Contract | `sovereign-answer.v2` |
| Baseline Contract | `baseline-source.v1+baseline-facets.v1` |
| Authoritative Release Command | `pnpm production:release:text` |

---

## Source & Local Certification: PASS

All repository verification gates and local integration smoke tests execute and pass cleanly on the current `Sovereign.final` repository.

### Exact Verification Commands & Results

| Gate / Command | Status | Details |
|----------------|--------|---------|
| `pnpm -r typecheck` | **PASS** | 0 TypeScript errors across 5 workspace projects (`@sovereign/contracts`, `@sovereign/agent-contracts`, `@sovereign/web`, `@sovereign/worker`, `@sovereign/sovereign-worker`). |
| `pnpm -r test` | **PASS** | 82 test suites, 442 unit and contract tests passed (0 failed, 0 skipped). |
| `pnpm build` | **PASS** | Vite v8.1.5 client bundle (256.90 kB / 78.58 kB gzip) + Wrangler dry-run packaging with 52 static assets. |
| `node scripts/validate-migrations.mjs` | **PASS** | All 19 database migrations (`0001` through `0019`) verified strictly non-destructive. |
| `node scripts/verify-migration-upgrade.mjs` | **PASS** | Linear, immutable upgrade from `0018_workers_ai_capacity_reservations` to `0019_deprecate_manual_capacity`. |
| `node scripts/verify-foundation.mjs` | **PASS** | Canonical foundation files, routing targets, and D1 database schemas verified. |
| `node scripts/scan-secrets.mjs` | **PASS** | 0 unencrypted secrets, tokens, or private keys found in committed source. |
| `node scripts/scan-production-fixtures.mjs` | **PASS** | 0 fixture-only bypasses or fake test implementations present in production paths. |
| `node scripts/verify-direct-preview-config.mjs` | **PASS** | Direct preview and production Wrangler configurations verified. |
| `node scripts/verify-worker-bundle-size.mjs` | **PASS** | Worker compressed upload is **237.23 KiB** (well under the 2,500 KiB internal budget and Cloudflare\'s 3,072 KiB ceiling). |

### Local Smoke Tests

The smoke test suite verifies application logic, security boundaries, and data integrity using local execution and synthetic environments:

| Test Script | Status | Verified Functionality |
|-------------|--------|------------------------|
| `npx tsx scripts/auth-smoke.ts` | **PASS** | Magic link generation, 6-digit email redemption code, atomic session token issuance via D1 batch, policy receipt recording, single-use token invalidation. |
| `npx tsx scripts/baseline-smoke.ts` | **PASS** | Strict data isolation: raw birth date/time, exact coordinates, and timezone remain sealed in D1; only derived interpretive facets are emitted to prompt context. |
| `npx tsx scripts/product-smoke.ts` | **PASS** | Stripe entitlement projection, Free tier (10 turns/mo) vs Sovereign+ (300 turns/mo), authenticated on-demand private export without persistent artifacts. |
| `npx tsx scripts/jobs-smoke.ts` | **PASS** | Retention engine executes: 30-day thread retention, 90-day audit retention, 14-day account deletion grace period. |
| `npx tsx scripts/stripe-smoke.ts` | **PASS** | Sovereign+ checkout session creation, customer billing portal URL generation, webhook signature validation. |
| `npx tsx scripts/worker-gateway-smoke.ts` | **PASS** | Cloudflare Gateway adapter accepts model `@cf/zai-org/glm-4.7-flash`, dispatches valid request payload, and parses HTTP 202 streaming responses conforming to `sovereign-answer.v2`. |

---

## Test Methodology Classification

To maintain absolute fidelity in the release record, verification activities are classified into three distinct categories:

### 1. Local Smoke & Integration Tests (EXECUTED — PASS)
- **Environment:** Local Node.js / `tsx` runtime using in-memory SQLite and isolated stub objects.
- **Scope:** Validates business logic, cryptographic signing algorithms, prompt sanitization, JSON schema compliance, and state transitions.
- **Limitation:** Does not communicate with live Cloudflare edge servers or external third-party production APIs.

### 2. Simulated / Miniflare Tests (EXECUTED — PASS)
- **Environment:** Local Wrangler build & dry-run packaging (`wrangler deploy --dry-run`).
- **Scope:** Verifies that all Durable Object classes (`ThreadCoordinator`), D1 bindings (`DB`), AI bindings (`AI`), and static asset paths (`apps/web/dist`) resolve correctly without packaging errors or missing imports.
- **Limitation:** Emulates Cloudflare Worker environment; does not verify live edge network routing or real Cloudflare DNS propagation.

### 3. Live Production Tests (NOT EXECUTED — BLOCKED)
- **Environment:** Live Cloudflare edge network (`https://sovereign.defrag.app`, `https://app.defrag.app`).
- **Scope:** Real HTTP requests to deployed Worker, live Cloudflare AI Gateway latency, live D1 production database queries, and authenticated E2E sessions.
- **Status:** **BLOCKED** due to missing Cloudflare credentials and lack of an authorized production test account.

---

## Deployment Certification: BLOCKED

| Field | Status / Value | Reason |
|-------|----------------|--------|
| Target Worker | `sovv-web` / `sovereign-agent` | Configured in `wrangler.jsonc` |
| Cloudflare Deployment | **BLOCKED** | `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are not available in this environment. `wrangler deploy` cannot authenticate to the Cloudflare API. |
| Live `/ready` Parity | **NOT VERIFIED** | Cannot query live endpoints for this repository until deployment occurs. |
| Remote D1 Migration | **BLOCKED** | Remote execution of migration `0019_deprecate_manual_capacity` requires Cloudflare API authentication. |
| DMARC / DNS Parity | **NOT VERIFIED** | Historical records exist in `HISTORICAL_OPENAPI_ACCEPTANCE.md`, but live DNS validation for this specific deployment cannot be confirmed without Cloudflare access. |

---

## Authenticated Production E2E: BLOCKED

```text
Authenticated E2E production smoke test:
BLOCKED — no authorized production test account or live session credentials are available in this environment.
```

The complete authenticated user flow (`signup → auth redemption → onboarding → Baseline computation → thread creation → first AI turn → sovereign-answer.v2 rendering`) is fully implemented in code and passes 100% of local integration tests. However, executing this flow against the live production domains (`https://app.defrag.app`) requires:
1. Live Worker deployment of `Sovereign.final` code to Cloudflare.
2. A dedicated test email account to receive magic links / verification codes.
3. Live Resend and Turnstile secrets configured in Cloudflare Worker secrets.

---

## Historical Reference Material

For the historical acceptance evidence of the parent repository `defragapp/OPENAPI`, see:
- [`docs/release/HISTORICAL_OPENAPI_ACCEPTANCE.md`](./HISTORICAL_OPENAPI_ACCEPTANCE.md) (August 27, 2026 deployment of SHA `c21eb46a...`).

Do **not** cite historical OPENAPI deployment IDs, Cloudflare SHA parity hashes, or DMARC checks as evidence of `Sovereign.final` readiness.
