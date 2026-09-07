# Sovereign.OS

> Personal AI for your real life. Understand yourself, your relationships, and the systems around you.

## What's New (v2)

This branch (`refactor/public-ai-platform-v2`) contains a **complete transformation** of the public experience:

- ✨ **Refactored Landing** (`PublicLanding.v2.tsx`) — Unified narrative, live demo chat, clear pricing
- ✨ **Chat Workspace** (`SovereignChatWorkspace.v2.tsx`) — ChatGPT-like interface with real-time streaming
- ✨ **Streaming Hook** (`useSovereignTurn.ts`) — React hook for SSE-based response delivery
- ✨ **Modern Styling** (`v2-landing.css`, `v2-chat-workspace.css`) — Fluid dark theme, micro-interactions
- ✨ **Marketing Copy** (`marketing-copy.md`) — Canonical copy guide (no jargon, no hype)
- ✨ **Integration Guide** (`INTEGRATION_GUIDE.md`) — 10-phase implementation roadmap
- ✨ **Backend Guide** (`BACKEND_STREAMING_GUIDE.md`) — SSE streaming setup for Cloudflare Workers

## Quick Start

### 1. Review the Changes

```bash
# See all files in this branch
git diff main..refactor/public-ai-platform-v2 --name-only

# Read the complete summary
cat REFACTOR_SUMMARY.md

# Review integration steps
cat INTEGRATION_GUIDE.md
```

### 2. Update App Router

**File:** `apps/web/src/index.tsx` (or equivalent)

```typescript
// OLD
import { PublicLanding } from './PublicLanding';

// NEW
import { PublicLanding } from './PublicLanding.v2';
```

### 3. Add CSS Imports

**File:** `apps/web/src/main.tsx` (or `index.css`)

```typescript
import './styles/v2-landing.css';
import './styles/v2-chat-workspace.css';
```

### 4. Implement Backend Streaming

See `BACKEND_STREAMING_GUIDE.md` for complete implementation.

Quick endpoint:

```typescript
POST /api/v1/threads/:threadId/messages
Content-Type: application/json

{ "message": "Why does this keep happening?" }

↓ Returns ↓

HTTP/1.1 200 OK
Content-Type: text/event-stream

This is chunk 1
This is chunk 2
...
```

### 5. Test End-to-End

```bash
# Frontend
cd apps/web && npm run dev
# → http://localhost:5173

# Backend
cd apps/sovereign-worker && npm run dev
# → http://localhost:8787

# Navigate to landing page, sign up, send first message
```

## File Structure

```
apps/web/src/
├── PublicLanding.v2.tsx              # Refactored landing page
├── SovereignChatWorkspace.v2.tsx      # Chat interface
├── components/
│   └── PublicDemoChat.tsx             # Interactive demo
├── hooks/
│   └── useSovereignTurn.ts            # Streaming hook
└── styles/
    ├── v2-landing.css                 # Landing styles
    └── v2-chat-workspace.css          # Chat styles

Root:
├── REFACTOR_SUMMARY.md                # Complete overview (this file)
├── INTEGRATION_GUIDE.md               # 10-phase implementation guide
├── BACKEND_STREAMING_GUIDE.md         # SSE streaming setup
└── marketing-copy.md                  # Canonical copy reference
```

## Key Changes

### Landing Page

**Before:**
- Multiple competing stories
- Complex Baseline concepts upfront
- Unclear value proposition

**After:**
- Single, coherent narrative ("Understand yourself. Understand your people. See the whole system.")
- Live interactive demo showing Sovereign's voice
- Clear pricing (Free vs. Sovereign+)
- Direct CTAs ("Get started free")

### Chat Workspace

**Before:**
- 116KB monolithic file with many surfaces
- Complex mode toggles
- No clear "new conversation" starting point

**After:**
- Focused chat interface (like ChatGPT)
- Empty state with guided prompt categories
- Real-time streaming turns
- Minimal, distraction-free

### Copy & Voice

**Banned Terms:**
- ❌ "Chat" → ✅ "Conversation"
- ❌ "Prompt" → ✅ "Inquiry"
- ❌ "Dashboard" → ✅ "Workspace"
- ❌ "Build your Baseline" → ✅ "Get started free"

**New Voice:**
- Direct, grounded, contemplative
- No AI marketing speak
- Written for real humans with real problems

## Design System

### Colors

```css
--color-base:           #030712
--color-elevated:       #0b0f19
--color-text-primary:   #f9fafb
--color-text-secondary: #9ca3af
--color-accent-cyan:    #06b6d4
--color-accent-emerald: #10b981
```

### Spacing & Typography

- **Display:** 32px-48px (hero, section headers)
- **Heading:** 18px-20px (card titles)
- **Body:** 14px-16px (regular text)
- **Meta:** 12px-13px (captions)

### Motion

```css
/* Snappy, not sluggish */
transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
```

## Testing Checklist

Before merging to main:

- [ ] Landing page loads < 2s
- [ ] Hero demo animates correctly
- [ ] Sign-up flow completes
- [ ] First message streams in real-time
- [ ] Mobile layout is responsive (< 768px)
- [ ] Keyboard navigation works (Tab, Cmd+K, Enter, Escape)
- [ ] No console errors
- [ ] No layout shift during streaming
- [ ] Styling conflicts resolved
- [ ] Copy approved by marketing/product

## Documentation

For detailed implementation:

1. **Overall Summary:** See `REFACTOR_SUMMARY.md`
2. **Step-by-Step Integration:** See `INTEGRATION_GUIDE.md`
3. **Backend Streaming:** See `BACKEND_STREAMING_GUIDE.md`
4. **Copy & Voice:** See `marketing-copy.md`

## Support

If you encounter issues:

1. **Streaming not working?** → See `BACKEND_STREAMING_GUIDE.md` troubleshooting
2. **CSS not applying?** → Check import order and CSS path
3. **Auth failing?** → Verify `/api/v1/auth/me` returns 200
4. **Copy questions?** → See `marketing-copy.md` for canonical reference

## Next Steps

### Phase 1: Merge & Deploy (This Week)

```bash
git checkout main
git merge refactor/public-ai-platform-v2 --no-ff
git push origin main
```

### Phase 2: Monitor & Polish (Week 2)

- Watch for 401s in streaming endpoint
- Check streaming latency (target < 100ms first chunk)
- Gather user feedback
- Fix critical bugs

### Phase 3: Enhance (Weeks 3+)

- Export conversations
- Share conversations (with consent)
- Mobile app
- Team features (Sovereign+)
- Advanced search

## Metrics to Track

**Post-Launch:**
- Landing → Signup conversion (target: > 5%)
- Signup → First message latency (target: < 2min)
- First message submit rate (target: > 80%)
- Chat depth (avg turns, target: > 3)
- 7-day retention (target: > 20%)
- Sovereign+ conversion (target: > 10%)

## Questions?

See the comprehensive guides:

- `REFACTOR_SUMMARY.md` — Complete overview
- `INTEGRATION_GUIDE.md` — Implementation steps
- `BACKEND_STREAMING_GUIDE.md` — Backend setup
- `marketing-copy.md` — Copy reference

---

**Branch:** `refactor/public-ai-platform-v2`
**Status:** Ready for merge to main
**Last Updated:** 2026-09-07
