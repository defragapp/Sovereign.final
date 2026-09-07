# Sovereign.OS Public AI Platform v2 — Integration Guide

## Overview

This guide walks you through integrating the new **PublicLanding.v2** and **SovereignChatWorkspace.v2** into your production environment.

**Key Components:**
- `PublicLanding.v2.tsx` — Unified public narrative with live demo chat
- `SovereignChatWorkspace.v2.tsx` — ChatGPT-like conversational interface
- `useSovereignTurn.ts` — Streaming hook for SSE-based turn delivery
- `v2-landing.css` + `v2-chat-workspace.css` — Complete styling system
- `marketing-copy.md` — Canonical copy for all surfaces

---

## Phase 1: Update App Router

### 1.1 Update `apps/web/src/index.tsx` (or root component)

Switch the public landing from v1 to v2:

```typescript
import { PublicLanding } from './PublicLanding.v2';

export function App() {
  const path = location.pathname;
  
  // Public routes
  if (path === '/' || path === '/home') {
    return <PublicLanding />;
  }
  
  // Auth routes
  if (path === '/login' || path === '/signup') {
    return <AccountPage mode={path === '/signup' ? 'signup' : 'login'} />;
  }
  
  // Authenticated routes
  if (path === '/app' || path.startsWith('/app/')) {
    return <ProtectedWorkspace />;
  }
  
  return <PublicNotFound />;
}
```

### 1.2 Create `ProtectedWorkspace` component

This route-guards the chat workspace:

```typescript
import { useEffect, useState } from 'react';
import { SovereignChatWorkspace } from './SovereignChatWorkspace.v2';

function ProtectedWorkspace() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    fetch('/api/v1/auth/me')
      .then(res => {
        if (res.status === 401) {
          location.assign('/login?returnTo=/app');
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        location.assign('/login?returnTo=/app');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="workspace-loading" role="status">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirecting...
  }

  const threadId = new URLSearchParams(location.search).get('thread') || undefined;
  return <SovereignChatWorkspace threadId={threadId} />;
}

export default ProtectedWorkspace;
```

---

## Phase 2: CSS Integration

### 2.1 Import styles in your main entry point

**File: `apps/web/src/index.css` or `apps/web/src/main.tsx`**

```css
@import './styles/design-system.css';
@import './styles/v2-landing.css';
@import './styles/v2-chat-workspace.css';
```

Or in TypeScript:

```typescript
import './styles/v2-landing.css';
import './styles/v2-chat-workspace.css';
```

### 2.2 CSS Variables

Ensure your root `design-system.css` exposes these variables (v2 uses them):

```css
:root {
  --color-base: #030712;
  --color-elevated: #0b0f19;
  --color-card: #111827;
  --color-border: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-text-meta: #6b7280;
  --color-accent-cyan: #06b6d4;
  --color-accent-emerald: #10b981;
  --color-accent-amber: #f59e0b;
}
```

---

## Phase 3: Backend Streaming Setup

### 3.1 Ensure SSE Endpoint Exists

**Backend (`apps/sovereign-worker`)** must provide:

```
POST /api/v1/threads/:threadId/messages
```

With response header:
```
Content-Type: text/event-stream
```

And streaming body (line-delimited text chunks):
```
This is chunk 1
This is chunk 2 with more tokens
And so on...
```

### 3.2 Example Cloudflare Worker Handler

**File: `apps/sovereign-worker/src/routes/threads.ts`**

```typescript
export async function postThreadMessage(request: Request, threadId: string) {
  const auth = await getAuthContext(request);
  if (!auth) return new Response('Unauthorized', { status: 401 });

  const { message } = await request.json() as { message: string };

  // Create a ReadableStream for SSE
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Start AI response stream in background
  (async () => {
    try {
      // Call your AI inference
      const response = await callAIInference({
        threadId,
        userId: auth.userId,
        message,
        stream: true
      });

      // Stream response chunks to client
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(value);
      }
    } catch (error) {
      await writer.write(new TextEncoder().encode(`ERROR: ${error.message}`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

### 3.3 Hook Integration

The `useSovereignTurn` hook automatically:
1. POSTs to `/api/v1/threads/:threadId/messages`
2. Reads the streaming response
3. Accumulates chunks in UI state
4. Updates the Sovereign turn in real-time

**No additional frontend code needed** — the hook handles it all.

---

## Phase 4: Update Sign-Up Copy

### 4.1 Simplify Onboarding Message

**File: `apps/web/src/App.tsx` (signup section)**

Update the signup intro:

```typescript
// OLD
return (
  <section className="account-intro">
    <p className="eyebrow">START FREE</p>
    <h1>Create your Sovereign.OS account.</h1>
    <p className="lede">Start free. Verify your email, then build your Baseline.</p>
  </section>
);

// NEW
return (
  <section className="account-intro">
    <p className="eyebrow">GET STARTED</p>
    <h1>Welcome to Sovereign.</h1>
    <p className="lede">Verify your email and start exploring. Build your Baseline when you're ready.</p>
    <p className="account-intro-note">Your Baseline is the private reference Sovereign uses to ground every answer in who you actually are.</p>
  </section>
);
```

### 4.2 Fast-Track Onboarding

Reduce friction from: Email verify → Policy acceptance → Baseline questionnaire

To: Email verify → Name (optional) → Workspace

```typescript
// In AccountPage, conditionally skip Baseline until after signup
if (mode === 'signup') {
  // Skip Baseline builder for now
  // User can build it in workspace with onboarding modal
}
```

---

## Phase 5: Database Migrations (Optional)

If you want to track which "surface" (Explore, People, Systems) a turn belongs to:

```sql
ALTER TABLE threads ADD COLUMN IF NOT EXISTS default_surface TEXT DEFAULT 'Today';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS surface TEXT DEFAULT 'Today';
```

---

## Phase 6: Feature Flags (Safe Rollout)

Use feature flags to test v2 with a subset of users:

```typescript
import { getFeatureFlag } from './utils/features';

function App() {
  const useV2Landing = getFeatureFlag('landing_v2', false);
  const useV2Chat = getFeatureFlag('chat_v2', false);

  if (path === '/') {
    return useV2Landing ? <PublicLanding /> : <PublicLandingV1 />;
  }

  if (path === '/app') {
    return useV2Chat ? <SovereignChatWorkspace /> : <SovereignIntelligenceWorkspace />;
  }
}
```

---

## Phase 7: Testing Checklist

- [ ] **Landing Page**
  - [ ] Hero loads with live demo chat (animated)
  - [ ] All CTAs link to `/signup`
  - [ ] Navigation scrolls to sections
  - [ ] Mobile responsive (< 768px)
  - [ ] Pricing section shows both tiers

- [ ] **Sign-Up**
  - [ ] Email verification works
  - [ ] Policy acceptance clears validation error
  - [ ] Sign-up redirects to `/app` on success

- [ ] **Chat Workspace**
  - [ ] Empty state shows prompt categories
  - [ ] Clicking prompt pre-fills composer
  - [ ] Submit sends inquiry, shows loading state
  - [ ] Streaming response appears in real-time
  - [ ] User + Sovereign turns render correctly
  - [ ] Error state shows recoverable message

- [ ] **Styling**
  - [ ] Dark theme applies globally
  - [ ] Micro-borders and glows render (not harsh outlines)
  - [ ] Transitions smooth (150-250ms)
  - [ ] No layout shift during message streaming
  - [ ] Focus rings visible on keyboard nav

- [ ] **Accessibility**
  - [ ] Keyboard navigation works (Tab, Cmd+K, Enter, Escape)
  - [ ] Screen reader announces turns and status
  - [ ] Color contrast meets WCAG AA
  - [ ] Form labels paired with inputs

- [ ] **Performance**
  - [ ] LCP < 2s
  - [ ] TTI < 3s
  - [ ] No CLS during streaming
  - [ ] Mobile FCP < 1.5s

---

## Phase 8: Deployment

### 8.1 Merge to Production Branch

```bash
git checkout main
git merge refactor/public-ai-platform-v2 --no-ff
git push origin main
```

### 8.2 Deploy Frontend

```bash
cd apps/web
npm run build
# Deploy to Vercel / Cloudflare Pages / etc.
```

### 8.3 Monitor

- Watch for 401s in `/api/v1/threads/*/messages`
- Check streaming latency (target < 100ms first chunk)
- Monitor error rates in chat submissions
- Track signup completion rate

---

## Phase 9: Post-Launch Polish

### 9.1 A/B Test Copy

Measure signup conversion with different CTAs:
- "Build your Baseline" vs. "Get started free"
- "Understand yourself" vs. "Ask Sovereign"

### 9.2 Add Analytics

Track:
- Landing page scroll depth (hero → pricing → CTA)
- Demo chat interaction (did user watch it complete?)
- Chat submission latency (time from send to first response chunk)
- Error rates by endpoint

### 9.3 Gather Feedback

Add in-app feedback prompt after first successful turn:

```typescript
if (turns.length === 2 && sovereignTurn.isStreaming === false) {
  showFeedbackPrompt();
}
```

---

## Phase 10: Future Enhancements

### Coming Soon (Post-MVP)
- [ ] Export conversation as PDF
- [ ] Share conversation (with consent)
- [ ] Batch upload (multiple questions at once)
- [ ] Mobile app (React Native)
- [ ] Integrations (Slack, Notion, etc.)
- [ ] Team workspace collaboration
- [ ] Advanced search over past conversations

---

## Troubleshooting

### Streaming not working
**Problem:** Turn stays empty, shows "Sovereign is thinking..." forever

**Solutions:**
1. Check `/api/v1/threads/:id/messages` returns `Content-Type: text/event-stream`
2. Verify response body has line-delimited text (no JSON wrapper)
3. Check browser console for fetch errors
4. Test with curl: `curl -N http://localhost/api/v1/threads/test/messages -d '{"message":"test"}'`

### Composer disabled after error
**Problem:** After error, textarea is frozen, can't submit again

**Solution:** Check `state` is reset to `idle` after error. The submit button should re-enable.

### CSS not applying
**Problem:** v2-landing.css or v2-chat-workspace.css not loading

**Solutions:**
1. Verify files are in `apps/web/src/styles/`
2. Check import path: `import './styles/v2-landing.css';`
3. Ensure no CSS conflicts from old stylesheets
4. Check browser DevTools > Elements > Styles tab

### Authentication failing after sign-up
**Problem:** User signs up, gets redirected to `/app`, then redirected back to login

**Solutions:**
1. Verify auth token is set in cookies after signup
2. Check `/api/v1/auth/me` returns 200 (not 401)
3. Ensure CORS headers are correct if frontend != backend domain

---

## Support

For issues or questions:
1. Check this guide (use `Cmd+F` to search)
2. Review the code comments in component files
3. Run the testing checklist
4. Check GitHub issues in the repo
5. Contact: info@sovereign.defrag.app

---

**Last Updated:** 2026-09-07
**Version:** 2.0.0-beta
