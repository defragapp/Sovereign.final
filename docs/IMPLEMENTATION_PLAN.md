# Sovereign.OS — Final Launch Implementation Plan

**Date:** 2026-09-05  
**Target:** `defragapp/Sovereign.final`  
**Source of truth for proven runtime:** `defragapp/OPENAPI`  
**Production URL:** `https://sovereign.defrag.app`

## 1. Launch decision

This repository is a **controlled extraction and simplification**, not a rewrite of Sovereign intelligence.

The implementation order is:

**lock contracts → establish thin app shell → extract proven backend → wire UI to real endpoints → verify parity → production cutover**

The new repository must be materially smaller than `OPENAPI` while retaining the active Baseline, security, answer-contract, consent, billing, persistence, and Cloudflare runtime behavior.

## 2. Architecture choice

### Runtime

Keep the existing Cloudflare-native topology:

```text
sovereign.defrag.app
        |
        v
Sovereign Worker
  |       |       |
  |       |       +--> AI Gateway --> Workers AI
  |       +----------> Durable Object: ThreadCoordinator
  +------------------> D1
  +------------------> Static Assets (web/dist)
```

Do not introduce Next.js, Vercel-specific backend services, OpenAI Agents runtime, a second database, R2, or a second authentication system.

### Frontend

Use **React + Vite + Tailwind CSS v4 + shadcn/ui-style source-owned primitives**.

The shadcn approach is deliberate: components live in the repository and can be edited to match Sovereign instead of imposing a branded third-party visual system. The official shadcn CLI supports Vite projects and source-owned components. See `https://ui.shadcn.com/docs/cli`.

The frontend remains a static asset bundle served by the Worker. This keeps deployment simple and preserves the existing Cloudflare asset model.

### Backend

Use the proven Worker request path from `OPENAPI` as the authoritative implementation. The current Worker has a small direct runtime dependency surface (`hono`, `zod`, and the shared contracts package); the new tree should preserve that property rather than importing a large application framework.

## 3. Repository layout

```text
/
├── apps/
│   ├── web/                   # React/Vite product UI
│   └── worker/                # Cloudflare edge runtime
├── packages/
│   └── contracts/             # Only shared contracts required by both sides
├── docs/
│   ├── IMPLEMENTATION_PLAN.md
│   ├── UI_UX_CONTRACT.md
│   ├── EXTRACTION_MANIFEST.md
│   └── DRIFT_REGISTER.md
├── components.json            # shadcn/ui project configuration
├── package.json
└── pnpm-workspace.yaml
```

The initial shell is intentionally small. Production extraction adds the protected Sovereign modules after dependency tracing rather than copying `OPENAPI` wholesale.

## 4. Product flow to build first

```text
public landing
   ↓
get started / sign in
   ↓
authentication
   ↓
account onboarding
   ↓
Baseline onboarding
   ↓
Baseline ready
   ↓
chat-first workspace
   ↓
ask a real question
   ↓
Sovereign answer
   ↓
optional context expansion
   ↓
people / systems / library when authorized
```

The first working vertical slice is **account → Baseline → one real AI turn → rendered answer**. Do not build secondary screens before that slice is wired end-to-end.

## 5. Protected backend extraction

### Required modules

Extract only modules on the active production path:

- Worker routing/runtime and environment types.
- Session/auth/security boundary, including magic links, Turnstile, same-origin checks, signing, and session verification.
- Baseline orchestration, contracts, facets, astronomy integration, privacy transformation, readiness state, and source provenance.
- Sovereign answer pipeline, prompt, safety, grounded intelligence, question/context selection, and `sovereign-answer.v2` parsing/validation.
- Conversation, expression, relational, relationship, and emotional context modules when transitively required.
- Accounts, entitlements, threads, turns, People, Systems/product state, Library persistence.
- Stripe checkout/portal/webhooks and AI usage reservation/release.
- Transactional email.
- Active retention/cleanup jobs.
- The shared contracts that these modules directly consume.

### Extraction rule

For every copied source file, record:

1. direct imports;
2. workspace imports;
3. environment bindings used;
4. database tables/migrations touched;
5. whether the file is request-path critical;
6. whether it is preserved unchanged or adapted;
7. tests proving parity.

A file is not considered extracted merely because it has been copied. It is extracted when the new runtime imports and exercises it on the real request path.

## 6. Baseline must remain authoritative

Preserve the existing Baseline onboarding contract:

- `POST /api/v1/account/onboarding`
- `POST /api/v1/baseline/onboarding`
- `GET /api/v1/baseline/status`

Preserve the existing privacy behavior around raw birth information and exact private birthplace, the existing astronomy source path, time-certainty handling, location precision, account ownership, cache behavior, partial framework coverage, and readiness semantics.

Do not create a second Baseline schema in the new repository during launch extraction.

## 7. AI pipeline

The chat endpoint is a Sovereign product adapter, not a generic chat demo.

```text
POST /api/v1/threads/:threadId/messages
        ↓
same-origin + authenticated session
        ↓
completed Baseline
        ↓
message + idempotency validation
        ↓
authorize selected context
        ↓
reserve AI turn
        ↓
serialize thread turn
        ↓
assemble model-safe context
        ↓
Sovereign prompt
        ↓
AI Gateway → Workers AI
        ↓
parse/validate sovereign-answer.v2
        ↓
output safety review
        ↓
persist turn/event
        ↓
render answer
        ↓
finalize usage reservation
```

The Cloudflare LLM chat template is used only for its proven streaming/UI starting pattern. It is not the source of truth for Sovereign inference, security, billing, or context. Cloudflare's current template explicitly demonstrates streaming chat, AI Gateway support, responsive UI, and Worker-based AI; those ideas are the transport shell only.

## 8. UI/UX decision

### Visual direction

Use the supplied Vercel screenshot as a **visual grammar reference**, not a brand template:

- black/near-black field;
- very restrained header;
- strong typography;
- wide negative space;
- one central product moment;
- minimal controls;
- no visual dashboard wall.

Sovereign is simpler than the reference. The page should feel like the same product before and after sign-in.

### Brand system

Use a very small token set:

- `--ink`: near-black base;
- `--surface`: subtle raised surface;
- `--cream`: warm primary text;
- `--muted`: secondary text;
- `--sage`: quiet brand accent;
- `--line`: low-contrast dividers.

Type should be clean and editorial rather than futuristic. Avoid all-caps UI except for tiny metadata labels.

The brand mark should be a restrained CSS/SVG treatment, not a decorative hero illustration.

### Public pages

Public pages are deliberately short and functional:

- `/`
- `/how-it-works`
- `/pricing`
- `/faq`
- `/privacy`
- `/terms`

Header:

`Sovereign.OS` · `How it works` · `Pricing` · `FAQ` · `Sign in` · `Get started`

Root structure:

1. One-sentence category statement.
2. Core promise.
3. A real product view showing the conversation.
4. Three capability statements: Yourself / Your people / The whole system.
5. One trust/privacy statement.
6. One CTA.

The landing page must not reproduce the older multi-section marketing treatment, founder-heavy story, technical source explanations, or a large set of cards.

### Authentication

Auth is a centered, single-purpose screen.

- One logo/wordmark.
- One clear task title.
- Email input.
- Primary action.
- Small privacy/trust line.
- No marketing navigation.
- No dashboard chrome.

The actual magic-link/Turnstile/session behavior remains server-side and must be wired before launch; the starter UI currently represents only the visual contract.

### Authenticated workspace

The workspace is the primary product surface and should visually dominate the launch.

```text
┌─────────────────────────────────────────────┐
│ Sovereign                              You   │
├─────────────────────────────────────────────┤
│                                             │
│               conversation                  │
│                                             │
│        answer + source details              │
│                                             │
│                                             │
│  +  Ask Sovereign about your life...   ↑   │
└─────────────────────────────────────────────┘
```

Do not add permanent dashboard cards for Baseline, usage, people, systems, or Library. Those are navigable contexts, not the primary visual hierarchy.

### Progressive context

One affordance: **Add context**.

Choices:

- Your Baseline
- What's happening now
- A person
- A family/team/group
- Something saved in your Library

Only present options the current account can actually use.

## 9. AI output presentation contract

The answer is the product. It must be comfortable to read, not rendered like an API response.

Default rendering order:

1. headline;
2. direct answer;
3. explanatory sections only when useful;
4. practical next step/action when the answer contains one;
5. `See source details` only when source context is useful;
6. unknowns/correction path when material.

Do not show by default:

- source IDs;
- Basis registry identifiers;
- model/provider names;
- JSON;
- confidence percentages;
- scores/gauges;
- internal answer-contract names;
- implementation terminology.

The UI must preserve the server's distinction between what is supported, what is inferred, and what remains unknown without exposing internal implementation vocabulary.

## 10. User-facing answer tone

The assistant should sound:

- direct;
- calm;
- specific;
- grounded in the user's question;
- useful in the next few minutes;
- explicit about uncertainty when needed;
- non-diagnostic;
- non-mind-reading.

Prefer:

> “Start with what you actually observed.”

> “There are a few plausible dynamics here; what they intended is still unknown.”

Avoid:

> “Your profile proves…”

> “They feel…”

> “This relationship is incompatible.”

The user should never need to understand the framework vocabulary to benefit from the answer.

## 11. Public language

Canonical product definition:

> **Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.**

Canonical promise:

> **Understand yourself. Understand your people. See the whole system.**

Baseline short form:

> **A private reference built around you.**

Baseline explanation:

> **Your Baseline gives Sovereign a consistent reference for how you may think, decide, communicate, create, connect, respond under pressure, and grow.**

Do not put implementation vocabulary in public copy.

## 12. Commercial path

Keep the existing launch economics:

- Free: `$0`, Baseline, Today, Explore, 10 AI turns/month.
- Sovereign+: `$20/month` or `$99/year`, 300 AI turns/month, People, Systems, Library continuity, consent-aware shared intelligence.

Billing must remain server-authoritative.

Do not make paid UI states appear functional until the corresponding entitlement is enforced by the Worker.

## 13. Cloudflare Free operating profile

The user has chosen to remain on Cloudflare Free until initial revenue is generated. Therefore launch engineering must assume constrained inference capacity.

Mandatory protections:

- authentication before AI inference;
- usage reservation before AI execution;
- account/IP rate limiting;
- strict request and message limits;
- bounded history/context reads;
- AI Gateway rate limiting/observability;
- no automatic retry loops;
- graceful 429/503 states;
- emergency inference disable switch;
- static page caching where safe;
- no unauthenticated public AI endpoint.

A surge in landing-page traffic must not translate directly into uncontrolled inference traffic.

## 14. Verification gates

### Gate A — structural

- workspace installs cleanly;
- TypeScript passes;
- Worker dry-run build passes;
- frontend production build passes;
- no duplicate framework/runtime stack;
- no unused secret names or provider configs.

### Gate B — parity

- Baseline parity;
- auth/session parity;
- thread/turn parity;
- usage/entitlement parity;
- Stripe webhook parity;
- People/Systems consent parity;
- answer-contract parsing parity;
- safety parity.

### Gate C — UX

Test at minimum:

- 1440×900;
- 1280×800;
- 390×844;
- 375×844.

Check:

- clear visual hierarchy;
- no horizontal overflow;
- 44px touch targets on mobile;
- composer remains usable with keyboard/safe-area insets;
- answer text is readable;
- public and authenticated surfaces visibly belong to the same product.

### Gate D — public truthfulness

Reject any release containing:

- unsupported framework claims;
- deterministic psychological claims;
- relationship mind-reading;
- compatibility scores;
- legacy Defrag/OpenAPI public naming;
- internal provider/schema vocabulary.

### Gate E — production

- real `sovereign.defrag.app` route;
- real auth;
- real Baseline;
- real AI turn;
- real Stripe webhook/entitlement;
- real data deletion/export behavior;
- no mocked AI success state;
- no silent failure that looks like an answer.

## 15. Build sequence

### P0 — Repository foundation

Done first:

- workspace/package structure;
- Vite/React shell;
- Tailwind/shadcn configuration;
- Worker shell;
- UI token system;
- public/auth/workspace route skeleton;
- docs and extraction manifest.

### P1 — Backend extraction

- copy protected Worker/security/auth/Baseline/intelligence modules;
- copy complete required migrations;
- create dependency map;
- remove unused providers and historical wrappers.

### P2 — First vertical slice

Wire:

`signup/login → account → Baseline → workspace → first AI turn → answer rendering`

Nothing else outranks this path.

### P3 — Production account capabilities

Add real:

- threads/history;
- billing/entitlements;
- People;
- Systems;
- Library;
- deletion/export;
- policy acceptance.

### P4 — UX hardening

- responsive pass;
- keyboard/screen-reader pass;
- empty/loading/error states;
- source details disclosure;
- capacity states;
- no mock-success residue.

### P5 — Release verification

Run structural, parity, security, visual, and live smoke gates.

### P6 — Cutover

Only after all gates pass:

1. deploy Worker/assets;
2. run live health/readiness checks;
3. verify auth and Baseline;
4. verify one real AI turn;
5. verify Stripe entitlement;
6. verify public routes/canonical metadata;
7. monitor before opening broad traffic.

## 16. Definition of “built”

Sovereign.final is launch-ready when a new user can:

1. land on `sovereign.defrag.app` and understand the product in seconds;
2. create/sign into an account;
3. complete their private Baseline;
4. ask a real question in plain language;
5. receive a real Sovereign answer backed by the protected answer pipeline;
6. understand why the answer is useful without seeing implementation details;
7. buy Sovereign+ and have entitlement enforced;
8. use consented relationship/system context when eligible;
9. export/delete their data;
10. continue using the product without encountering a visual or language break between public, auth, and private surfaces.

## 17. Current implementation state

The repository foundation has been drafted locally in `/mnt/data/Sovereign.final` with the public/auth/workspace visual shell and the build wiring described above.

The GitHub integration currently returns `403 Resource not accessible by integration` for writes to `defragapp/Sovereign.final`, so the drafted foundation cannot yet be pushed from this session. The target repository exists and is empty. The next repository-side operation is to grant/restore write access, then publish the foundation and continue with protected runtime extraction.
