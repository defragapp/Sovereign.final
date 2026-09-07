# Sovereign.OS v2 — Deployment Checklist

## 🚀 Pre-Launch (This Week)

### Frontend (Apps/Web)

- [ ] **Code Review**
  - [ ] All TypeScript passes strict mode (no `any`)
  - [ ] No console errors or warnings
  - [ ] ESLint passes without exceptions
  - [ ] Prettier formatting applied
  - [ ] Git diff reviewed by team

- [ ] **Router Setup**
  - [ ] `PublicLanding.v2.tsx` imported as default for `/`
  - [ ] `ProtectedWorkspace` route guard implemented for `/app`
  - [ ] `/login` and `/signup` routes work
  - [ ] `/app` redirects to `/login` when unauthenticated (401)
  - [ ] After signup, redirects to `/app` (not `/onboarding`)

- [ ] **CSS Integration**
  - [ ] `v2-landing.css` imported in main entry
  - [ ] `v2-chat-workspace.css` imported in main entry
  - [ ] CSS variables defined in `design-system.css`
  - [ ] No selector conflicts (use DevTools to check)
  - [ ] No layout shift on page load (check CLS)

- [ ] **Component Testing**
  - [ ] `PublicLanding.v2` renders without errors
  - [ ] Demo chat animates on load
  - [ ] All CTAs link to correct pages
  - [ ] Navigation links scroll to sections
  - [ ] `SovereignChatWorkspace.v2` renders
  - [ ] Empty state shows prompt categories
  - [ ] Clicking prompt pre-fills composer
  - [ ] Sending inquiry shows loading state

- [ ] **Performance Audit**
  - [ ] Run Lighthouse (target: > 80 all categories)
  - [ ] LCP < 2.5s (Lighthouse green)
  - [ ] CLS < 0.1 (no layout shift)
  - [ ] FID < 100ms (keyboard/click responsiveness)
  - [ ] Network waterfall < 3s
  - [ ] Mobile Lighthouse score > 70

- [ ] **Mobile Testing**
  - [ ] iPhone 12/13 (375px width)
  - [ ] Android (360px width)
  - [ ] iPad (768px width)
  - [ ] No horizontal scroll
  - [ ] Touch targets > 44px
  - [ ] Form inputs don't zoom on focus
  - [ ] Chat composer visible at bottom (not covered)

- [ ] **Accessibility**
  - [ ] WAVE scan passes (no errors)
  - [ ] Keyboard navigation works (Tab, Enter, Escape, Cmd+K)
  - [ ] Focus rings visible (dotted outline)
  - [ ] Color contrast > 4.5:1 (WCAG AA)
  - [ ] Alt text on all images
  - [ ] Form labels paired with inputs
  - [ ] ARIA labels on buttons without text
  - [ ] Screen reader test (VoiceOver/NVDA)

- [ ] **Browser Compatibility**
  - [ ] Chrome 90+ (latest 2 versions)
  - [ ] Firefox 88+ (latest 2 versions)
  - [ ] Safari 14+ (iOS + macOS)
  - [ ] Edge 90+
  - [ ] No polyfills needed (modern browsers)

### Backend (Apps/Sovereign-Worker)

- [ ] **Streaming Endpoint**
  - [ ] `POST /api/v1/threads/:threadId/messages` implemented
  - [ ] Returns `Content-Type: text/event-stream`
  - [ ] Returns `200 OK` on success, `401` if unauthenticated
  - [ ] Returns `400` if message is empty
  - [ ] Stream starts within 500ms of POST
  - [ ] First chunk arrives within 100ms
  - [ ] Response completes within 30s (no timeout)
  - [ ] Tested with curl: `curl -N http://localhost:8787/api/v1/threads/test/messages`

- [ ] **AI Integration**
  - [ ] Claude/GPT API key configured in env
  - [ ] System prompt builds from user's Baseline
  - [ ] Streaming enabled (not batch mode)
  - [ ] Error handling implemented (no 500s)
  - [ ] Rate limiting in place (if needed)
  - [ ] Token usage logged for billing

- [ ] **Database**
  - [ ] D1 schema migrated (message_turns table exists)
  - [ ] User turns saved immediately (before Sovereign response)
  - [ ] Sovereign turns saved after streaming completes
  - [ ] Queries fast (< 100ms for historical messages)
  - [ ] Backups configured
  - [ ] Indexes created on thread_id, user_id

- [ ] **Auth**
  - [ ] `/api/v1/auth/me` returns 200 if authenticated
  - [ ] `/api/v1/auth/me` returns 401 if not authenticated
  - [ ] CORS headers allow frontend domain
  - [ ] Session cookies set correctly
  - [ ] Token refresh works

- [ ] **Testing**
  - [ ] Unit tests pass (npm test)
  - [ ] Integration tests pass
  - [ ] Stress test: 10 concurrent requests (no failures)
  - [ ] Error scenarios tested (network timeout, API error, malformed input)
  - [ ] Logging works (check CloudFlare dashboard)

### Copy & Marketing

- [ ] **Landing Page Copy**
  - [ ] Hero headline approved
  - [ ] All CTAs use approved copy
  - [ ] FAQ answers reviewed
  - [ ] No banned terms ("chat", "prompt", "dashboard", etc.)
  - [ ] Pricing copy clear and accurate
  - [ ] Footer links correct

- [ ] **In-App Copy**
  - [ ] Composer placeholder: "Ask Sovereign anything..."
  - [ ] Empty state: "What would you like to explore?"
  - [ ] Loading state: "Sovereign is thinking..."
  - [ ] Error message: User-facing, not technical
  - [ ] Success message: "Saved to your insights"

- [ ] **Legal**
  - [ ] Privacy Policy updated (data handling)
  - [ ] Terms of Service reviewed
  - [ ] GDPR compliance checked (if EU traffic)
  - [ ] CCPA compliance checked (if CA traffic)
  - [ ] Cookies policy updated

### Analytics & Monitoring

- [ ] **Tracking Setup**
  - [ ] Landing page events tracked (scroll depth, clicks)
  - [ ] Sign-up funnel tracked (step 1, 2, 3...)
  - [ ] Chat events tracked (first message, error, success)
  - [ ] Performance metrics tracked (LCP, CLS, FID)
  - [ ] Error tracking configured (Sentry or equivalent)

- [ ] **Alerts**
  - [ ] 401 error rate alert (if > 5%)
  - [ ] Streaming endpoint latency alert (if > 5s)
  - [ ] Error rate alert (if > 1%)
  - [ ] Uptime monitor configured
  - [ ] On-call rotation set

---

## 🛠️ Merge to Main

- [ ] **Git Workflow**
  - [ ] All commits have descriptive messages
  - [ ] Branch rebased on latest main (no merge conflicts)
  - [ ] Create pull request with detailed description
  - [ ] Link to related issues
  - [ ] Add REFACTOR_SUMMARY.md as PR description
  - [ ] Tag reviewers
  - [ ] Wait for approvals (min 2 reviewers)
  - [ ] Squash and merge (or rebase, per team preference)

- [ ] **Pre-Deployment Verification**
  - [ ] All tests pass on CI/CD pipeline
  - [ ] No new vulnerabilities in dependencies (npm audit)
  - [ ] Build artifact size < 500KB (gzipped)
  - [ ] No console errors in staging build
  - [ ] Performance metrics stable

---

## 🚀 Deployment to Production

### Frontend Deployment (Vercel / Cloudflare Pages / etc.)

- [ ] **Pre-Deploy**
  - [ ] Environment variables set (.env.production)
  - [ ] Backend URL configured
  - [ ] Feature flags disabled/enabled as needed
  - [ ] Build passes locally: `npm run build`
  - [ ] Build artifact reviewed

- [ ] **Deploy**
  - [ ] Git push to main (or deploy button)
  - [ ] Monitor deployment logs
  - [ ] Verify build succeeds (no errors)
  - [ ] Wait for CDN distribution (< 5 min)

- [ ] **Post-Deploy (Frontend)**
  - [ ] Landing page loads (check homepage)
  - [ ] Hero demo animates
  - [ ] All links work (test 10 random links)
  - [ ] Navigation scrolls smoothly
  - [ ] Sign-up button redirects to /signup
  - [ ] CSS loads correctly (DevTools > Elements)
  - [ ] No 404s in Network tab

### Backend Deployment (Cloudflare Workers)

- [ ] **Pre-Deploy**
  - [ ] Environment variables set (wrangler.toml)
  - [ ] Database binding configured
  - [ ] API keys for Claude/GPT set
  - [ ] Deploy script tested locally: `npm run deploy`

- [ ] **Deploy**
  - [ ] `npm run deploy -- --env production`
  - [ ] Monitor deployment logs
  - [ ] Verify worker is active (CloudFlare dashboard)
  - [ ] Check routes are configured

- [ ] **Post-Deploy (Backend)**
  - [ ] Test `/api/v1/auth/me` (should return user or 401)
  - [ ] Test streaming endpoint with curl:
    ```bash
    curl -N -X POST https://api.sovereign.defrag.app/api/v1/threads/test/messages \
      -H "Content-Type: application/json" \
      -d '{"message": "test"}'
    ```
  - [ ] Check first chunk arrives within 100ms
  - [ ] Monitor CloudFlare dashboard for errors
  - [ ] Check D1 database for saved turns

### Full End-to-End Test

- [ ] **Sign-Up Flow**
  1. Navigate to https://sovereign.defrag.app
  2. Click "Get started free"
  3. Enter email, verify code
  4. Redirected to /app
  5. See empty chat state

- [ ] **First Message**
  1. Click a prompt or type a message
  2. Submit (Cmd+Enter or click send)
  3. Loading state appears
  4. Response streams in within 100ms
  5. Full response displays
  6. Can submit another message
  7. Turn history visible

- [ ] **Error Recovery**
  1. Submit message
  2. Simulate network error (DevTools > Network > Offline)
  3. Error message appears
  4. Can dismiss error
  5. Can retry submission
  6. Works normally again

---

## 💠 Day 1 Monitoring

### Hourly Checks (First 4 hours)

- [ ] **Health**
  - [ ] Landing page loading
  - [ ] Sign-up converting
  - [ ] Chat endpoint responding
  - [ ] No spike in error rate
  - [ ] Database writes working

- [ ] **Performance**
  - [ ] Landing LCP still < 2.5s
  - [ ] Chat TTFB < 500ms
  - [ ] Streaming latency < 100ms first chunk
  - [ ] No memory leaks (heap size stable)

- [ ] **Logs**
  - [ ] CloudFlare worker logs (no 500s)
  - [ ] Database logs (no connection errors)
  - [ ] Frontend errors (Sentry/monitoring tool)
  - [ ] Any 401s from auth endpoint

### Daily Checks (Day 1 → Week 1)

- [ ] **User Signups**
  - [ ] Tracking new user count
  - [ ] Signup completion rate (target: > 80%)
  - [ ] First message submission rate (target: > 70%)
  - [ ] No stalled users (stuck on loading)

- [ ] **Chat Quality**
  - [ ] Response latency (target: < 10s end-to-end)
  - [ ] Streaming success rate (target: > 99%)
  - [ ] Error frequency (target: < 1%)
  - [ ] User feedback (in-app survey)

- [ ] **Technical**
  - [ ] No unexpected 5xx errors
  - [ ] Database performance stable
  - [ ] API rate limiting not triggered
  - [ ] CDN cache hit rate > 80%

### Rollback Plan

If critical issues emerge:

```bash
# Frontend (Revert to previous deployment)
# In Vercel/Cloudflare dashboard: "Revert to previous deployment"

# Backend (Revert worker)
git revert <commit-sha>
npm run deploy -- --env production

# Notify team immediately
# Post-incident review after stabilization
```

**Rollback Criteria:**
- ❌ Streaming endpoint returning 500s for > 5 min
- ❌ > 10% sign-up failure rate
- ❌ Database connectivity lost
- ❌ Security issue discovered

---

## 📄 Post-Launch (Week 1)

- [ ] **Gather Feedback**
  - [ ] Read user comments/emails
  - [ ] Check in-app feedback survey
  - [ ] Monitor social media mentions
  - [ ] Ask early adopters for direct feedback

- [ ] **Fix Critical Bugs**
  - [ ] Create issues for all feedback items
  - [ ] Prioritize (P0 = immediate, P1 = this week, P2 = next week)
  - [ ] Assign to team members
  - [ ] Deploy fixes with feature flags if possible

- [ ] **Analyze Metrics**
  - [ ] Landing → Signup conversion rate
  - [ ] Signup → First message latency
  - [ ] Chat depth (avg messages per user)
  - [ ] Error rates (by endpoint)
  - [ ] Performance metrics (LCP, latency, etc.)

- [ ] **Celebrate** 🎉
  - [ ] Announce to team/investors
  - [ ] Share success metrics
  - [ ] Plan next features

---

## 🖥️ Deployment Runbook

### Command Checklist

```bash
# 1. Verify on staging first
cd apps/web && npm run build
cd ../sovereign-worker && npm run deploy -- --env staging

# 2. Test staging
curl -N https://staging-api.sovereign.defrag.app/api/v1/threads/test/messages

# 3. If all good, deploy prod
cd apps/sovereign-worker
npm run deploy -- --env production

# 4. Verify prod
curl -N https://api.sovereign.defrag.app/api/v1/threads/test/messages

# 5. Notify team (Slack, email, etc.)
echo "Deployment complete. Monitoring..."
```

### Important Env Vars

**Frontend:**
```
VITE_API_BASE_URL=https://api.sovereign.defrag.app
VITE_PUBLIC_TURNSTILE_KEY=your_turnstile_key
```

**Backend:**
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=<your-openai-key>
DATABASE_URL=db://...
JWT_SECRET=your_secret
```

---

## 📁 Documentation Checklist

- [ ] README updated with latest instructions
- [ ] INTEGRATION_GUIDE.md reviewed and accurate
- [ ] BACKEND_STREAMING_GUIDE.md reviewed and accurate
- [ ] marketing-copy.md up-to-date
- [ ] API documentation generated (OpenAPI/Swagger)
- [ ] Deployment guide shared with team
- [ ] Runbook printed/bookmarked

---

## 🙋 Support Contacts

**On-Call During Launch:**
- Backend: [Name] - [Phone/Slack]
- Frontend: [Name] - [Phone/Slack]
- Product: [Name] - [Phone/Slack]
- Ops: [Name] - [Phone/Slack]

**Escalation:**
1. On-call person
2. Team lead
3. Engineering manager
4. CTO

---

## ✍️ Sign-Off

- [ ] **Frontend Lead:** __________ Date: __________
- [ ] **Backend Lead:** __________ Date: __________
- [ ] **Product Manager:** __________ Date: __________
- [ ] **Ops/DevOps:** __________ Date: __________

---

**This checklist is ready for use. Print it out, check boxes as you go, and keep it in your launch war room.**

**Last Updated:** 2026-09-07
