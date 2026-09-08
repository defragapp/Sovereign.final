# Cloudflare Workers Best Practices
Source: /Users/cjo/.gemini/config/skills/workers-best-practices/SKILL.md

Core Methodology:
Reviews and authors Cloudflare Workers code against production best practices, security, and edge-runtime invariants.
Key focus areas:
- Web Crypto: timingSafeEqual for signatures, crypto.randomUUID()
- Secrets: Read from env bindings, never hardcoded
- Request handling: stream unbounded data, proper error status handling
- Bindings: D1 database bindings, proper error handling and transactions
- No global request state, no floating promises
