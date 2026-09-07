# Sovereign.OS Production Release & Verification Skill (Local Copy)

Source: /Users/cjo/Sovereign.final/.agents/skills/sovereign-production-release/SKILL.md

The sovereign-production-release skill provides an authoritative, multi-gate pre-flight and production deployment verification framework for Sovereign.OS (defragapp/Sovereign.final).

It enforces strict product-language contracts, CSS import precedence, zero-overflow visual QA, Cloudflare edge deployment verification, and /ready SHA parity without modifying underlying backend/runtime architecture.

Key methodology:
- Multi-viewport visual QA (Playwright 1440x900 & 390x844).
- Strict overflow verification: Math.max(0, scrollWidth - clientWidth) <= 2px.
- Zero legacy CSS files: public.css, workspace.css, design-system.css.
- Production readiness and SHA parity validation.
