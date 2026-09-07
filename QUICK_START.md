# Quick Start: Sovereign.OS v2

**TL;DR:** Complete refactor of public landing + chat workspace. 3 files to understand, 3 commands to deploy.

## The 3 Core Files

### 1. `PublicLanding.v2.tsx` (610 lines)
**What:** Refactored landing page with unified narrative
**Key:** Hero + demo chat + pricing + CTA
**To Change:** Edit headline copy, add more FAQ questions
```typescript
if (path === '/') return <PublicLanding />;
```

### 2. `SovereignChatWorkspace.v2.tsx` (425 lines)
**What:** ChatGPT-like chat interface
**Key:** Empty state, streaming turns, error recovery
**To Change:** Add sidebar, change colors, add new prompt categories
```typescript
if (path === '/app') return <SovereignChatWorkspace threadId={threadId} />;
```

### 3. `useSovereignTurn.ts` (120 lines)
**What:** React hook for streaming responses
**Key:** Calls `/api/v1/threads/:id/messages`, reads SSE stream
**To Change:** Never
```typescript
const { state, sovereignTurn, submitInquiry } = useSovereignTurn();
```

## The 3 Deploy Commands

```bash
# 1. Update imports (frontend)
sed -i 's/PublicLanding/PublicLanding.v2/g' apps/web/src/index.tsx

# 2. Build and deploy frontend
cd apps/web && npm run build && npm run deploy

# 3. Deploy backend (implement /api/v1/threads/:id/messages endpoint)
cd ../sovereign-worker && npm run deploy
```

## What You Get

✅ **Public Landing:**
- Hero with live demo chat
- Comparison section (Generic AI vs. Sovereign)
- Pricing matrix
- FAQ
- Conversion-focused CTAs

✅ **Chat Workspace:**
- Empty state with guided prompts
- Real-time streaming turns
- User + Sovereign turn bubbles
- Loading state + error recovery
- Mobile responsive

✅ **Design System:**
- Modern fluid dark theme
- Micro-borders & backdrop blur
- Smooth transitions (150-250ms)
- Color system (base, text, accents)

✅ **Copy:**
- No jargon ("Understand yourself" not "Build your Baseline")
- Direct voice (grounded, contemplative)
- FAQ with 10 common questions
- Banned terms list

## Minimum Viable Setup

### Step 1: Copy Files (5 min)
```
PublicLanding.v2.tsx → apps/web/src/
SovereignChatWorkspace.v2.tsx → apps/web/src/
PublicDemoChat.tsx → apps/web/src/components/
useSovereignTurn.ts → apps/web/src/hooks/
v2-landing.css → apps/web/src/styles/
v2-chat-workspace.css → apps/web/src/styles/
```

### Step 2: Update Router (3 min)
```typescript
// apps/web/src/index.tsx
import { PublicLanding } from './PublicLanding.v2';
import { SovereignChatWorkspace } from './SovereignChatWorkspace.v2';

function App() {
  const path = location.pathname;
  if (path === '/') return <PublicLanding />;
  if (path === '/app') return <SovereignChatWorkspace />;
  // ...
}
```

### Step 3: Add CSS (1 min)
```typescript
// apps/web/src/main.tsx
import './styles/v2-landing.css';
import './styles/v2-chat-workspace.css';
```

### Step 4: Implement Backend Endpoint (30 min)
```typescript
// apps/sovereign-worker/src/routes/messages.ts
POST /api/v1/threads/:threadId/messages
→ Returns text/event-stream with AI response chunks
```

See `BACKEND_STREAMING_GUIDE.md` for complete code.

### Step 5: Test (15 min)
```bash
# Frontend
cd apps/web && npm run dev
# → http://localhost:5173

# Backend
cd apps/sovereign-worker && npm run dev
# → http://localhost:8787

# Test
# 1. Navigate to landing
# 2. Click "Get started"
# 3. Sign up
# 4. Send first message
# 5. Watch streaming response
```

## Common Customizations

### Change Hero Headline
**File:** `PublicLanding.v2.tsx` line 149
```typescript
<h1 className="v2-hero-headline">
  Your new headline here.
</h1>
```

### Change Colors
**File:** `v2-landing.css` line 3-14
```css
--color-base: #030712;  /* Change here */
--color-accent-cyan: #06b6d4;  /* Or here */
```

### Add More Prompt Categories
**File:** `SovereignChatWorkspace.v2.tsx` line 28-42
```typescript
const EMPTY_STATE_PROMPTS = [
  {
    category: 'Your new category',
    prompts: [
      'Prompt 1',
      'Prompt 2',
    ]
  },
  // ...
];
```

### Change Streaming Endpoint
**File:** `useSovereignTurn.ts` line 48
```typescript
const response = await fetch(`/api/v1/threads/...`);  // Change URL here
```

## Troubleshooting

**Streaming not working?**
- Backend endpoint must return `Content-Type: text/event-stream`
- First chunk should arrive within 100ms
- Test with curl: `curl -N http://localhost:8787/api/v1/threads/test/messages`

**CSS not applying?**
- Check import order (v2 CSS should come after old CSS)
- Verify CSS variables in `design-system.css`
- Use DevTools to check cascade

**Sign-up failing?**
- Check `/api/v1/auth/me` returns 200
- Verify cookies are set
- Check browser console for fetch errors

## File Sizes

```
PublicLanding.v2.tsx       ~12 KB
SovereignChatWorkspace.v2.tsx ~14 KB
useSovereignTurn.ts        ~4 KB
PublicDemoChat.tsx         ~3 KB
v2-landing.css             ~28 KB
v2-chat-workspace.css      ~20 KB
────────────────────────────────
Total                      ~81 KB (gzipped: ~20 KB)
```

## Performance Targets

- **LCP:** < 2.5s (hero visible)
- **FID:** < 100ms (click responsiveness)
- **CLS:** < 0.1 (no layout shift)
- **Streaming latency:** < 100ms (first chunk)
- **Chat TTFB:** < 500ms

## Next Steps

1. ✅ Copy files
2. ✅ Update router
3. ✅ Implement backend endpoint
4. ✅ Test end-to-end
5. ⏭️ Monitor post-launch (see `DEPLOYMENT_CHECKLIST.md`)
6. ⏭️ Gather feedback
7. ⏭️ Iterate

## References

- **Complete Guide:** `REFACTOR_SUMMARY.md`
- **Integration Steps:** `INTEGRATION_GUIDE.md`
- **Backend Setup:** `BACKEND_STREAMING_GUIDE.md`
- **Copy Reference:** `marketing-copy.md`
- **Launch Checklist:** `DEPLOYMENT_CHECKLIST.md`

---

**Ready?** Start with Step 1 above. Should take ~1 hour total.

**Questions?** See the full guides (links above).

**Done?** Create a PR, get approvals, merge to main, deploy!

---

**Last Updated:** 2026-09-07
