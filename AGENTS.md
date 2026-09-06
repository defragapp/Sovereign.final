# Sovereign.final build rules

## Mission

Ship a working private personal AI product rapidly without weakening the proven Sovereign runtime.

## Source authority

Use `defragapp/OPENAPI` as the source of proven backend behavior. Prefer extraction and minimal adaptation over reinvention.

## Product boundary

The public product is `Sovereign.OS` at `https://sovereign.defrag.app`.

User-facing language should be plain, direct, and centered on what the product helps a person do. Do not expose internal implementation terms such as Basis IDs, model/provider identifiers, `sovereign-answer.v2`, or model-safe context.

## UI rule

The product is chat-first. Keep the public/authenticated visual system cohesive: near-black foundation, warm readable typography, restrained sage accent, generous whitespace, subtle borders, and source-owned shadcn-style primitives. Avoid dashboard card walls, fake metrics, decorative AI effects, and framework-heavy navigation.

## Engineering rule

Never replace a protected production path merely to simplify the new repository. Auth, Baseline, consent, answer validation/safety, billing, persistence, and server-side entitlement checks remain server authoritative.

## Launch rule

The first acceptance path is:

`account → Baseline → first real AI turn → rendered answer`

No mocked AI answer, simulated entitlement, or fake account state may be presented as production capability.
Current canonical migration target is `0019_deprecate_manual_capacity`.
The verified deployment command is `pnpm production:release:text`.
Release evidence must describe what actually ran.
Worlds/video generation is not part of the current launch runtime.
