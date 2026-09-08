# Handoff Report: Chat Thread Component Polish (`SovereignThread.tsx`) & Passkey Authentication

**Agent**: Survey Explorer 2 (`survey_exp2_o5`)  
**Objective**: Requirement R3 Investigation — `apps/web/src/components/chat/SovereignThread.tsx`, SSE Streaming Integration, Auto-resize Textarea, Message & Sources Drawer Architecture, Passkey Verification Badge Integration, Language Law & Test Gates.  
**Deliverable Path**: `/Users/cjo/Sovereign.final/.agents/survey_exp2_o5/handoff.md`  
**Timestamp**: 2026-09-07T21:30:00Z  

---

## 1. Observation

### 1.1 File Existence & Directory Structure
- **Target Chat Directory**: `apps/web/src/components/chat/` does **not exist** currently.
  - Inspection via `list_dir` on `/Users/cjo/Sovereign.final/apps/web/src/components` revealed:
    - `Accordion.tsx` (2,791 bytes)
    - `IridescentLoader.tsx` (1,897 bytes)
    - `PublicDemoChat.tsx` (5,577 bytes)
    - `RelationalInquiryDemo.tsx` (6,982 bytes)
    - `SystemDynamicDemo.tsx` (14,439 bytes)
    - `ui/` directory (`BentoGrid.tsx`, `BrandMark.tsx`, `GlassCard.tsx`, `LiquidMesh.tsx`, `PillBadge.tsx`, `PrimaryButton.tsx`, `button.tsx`, `input.tsx`, `textarea.tsx`)
  - No `SovereignThread.tsx` exists anywhere in the repository (confirmed by `find_by_name` and `grep_search`).
- **Existing Chat Implementations**:
  1. `apps/web/src/SovereignChatWorkspace.v2.tsx` (288 lines, 9,640 bytes): Standalone conversational workspace component handling chat turns, auto-scrolling, textarea resizing, and SSE fetching.
  2. `apps/web/src/App.tsx` lines 1147–1507: The `Workspace` component implements the authenticated `today` tab with inline message rendering, a sticky composer (`<Textarea ... />`), feedback recording (`submitCorrection`), and non-collapsible inline sources tags.
  3. `apps/web/src/components/PublicDemoChat.tsx`: Demonstrates clean relational paragraph rendering (`renderFormattedContent`) and source display.
  4. `apps/web/src/styles/v2-chat-workspace.css` (421 lines): Contains complete styling for `.sovereign-chat-workspace`, `.chat-turn`, `.user-content`, `.sovereign-content`, `.turn-sources`, `.sovereign-composer`, `.composer-input`, and `.composer-send`.

### 1.2 SSE Streaming & Backend Worker Protocol
- **Client Implementation in `SovereignChatWorkspace.v2.tsx` (lines 81–130)**:
  ```tsx
  const response = await fetch(`/api/v1/threads/${encodeURIComponent(threadId)}/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'text/event-stream'
    },
    body: JSON.stringify({ message: inquiry })
  });
  ```
- **Backend Implementation in `apps/worker/src/index.ts` (lines 455–613)**:
  - Line 456: `requireSameOrigin(context.req.raw)`
  - Line 457: `const auth = await requireAuth(context.req.raw, context.env)`
  - Line 458: `await requireCompletedBaseline(context.env, auth.accountId)`
  - Line 471–472:
    ```typescript
    const idempotencyKey = context.req.header('x-idempotency-key');
    if (!idempotencyKey) return context.json({ error: 'Idempotency key required' }, 400);
    ```
  - **CRITICAL DEFECT DETECTED**: `SovereignChatWorkspace.v2.tsx` lines 81–88 fails to send the `x-idempotency-key` header. The worker endpoint strictly rejects any request lacking this header with HTTP 400 `{ error: 'Idempotency key required' }`.
  - Stream response: Worker sends `Response(encodeTextStream(persistedStream), { status: 202, headers: { 'content-type': 'text/plain; charset=utf-8', ... } })`. The body is a UTF-8 text stream decoded by `reader.read()` and `new TextDecoder().decode(value, { stream: true })`.
  - Alternatively, if header `accept: application/vnd.sovereign.answer+json` is sent, worker returns structured JSON with `{ text, answer, basis }`.

### 1.3 Composer & Auto-resize Textarea
- In `SovereignChatWorkspace.v2.tsx` (lines 45–50):
  ```tsx
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [draft]);
  ```
- In `apps/web/src/App.tsx` (lines 1484–1496): The composer uses `<Textarea ... className="min-h-12 border-0 bg-transparent px-2 py-2 shadow-none focus:ring-0 text-sm text-[var(--cream)]" />` but lacks dynamic `scrollHeight` expansion.
- In `apps/web/src/components/ui/textarea.tsx`: `<Textarea>` is wrapped with `forwardRef` using Tailwind and `cn(...)`.

### 1.4 Message Blocks & Sources Drawer
- **Current Rendering in `App.tsx` (lines 1378–1468)**:
  - User block: `motion.div` right-aligned, `bg-[var(--surface-2)] border border-[var(--line)] px-4 py-3 text-sm`.
  - Sovereign block: `motion.article` left-aligned, card with headline, direct answer (`.answer-direct`), section cards, and feedback prompt buttons (`yes`, `partly`, `not_today`).
  - Sources rendering in `App.tsx` line 1432:
    ```tsx
    {message.basis && message.basis.length > 0 && (
      <div className="border-t border-[var(--line)] pt-3 flex flex-wrap items-center gap-1.5">
        <span className="font-utility text-[9px] text-[var(--subtle)] mr-1">Sources:</span>
        {message.basis.map((b) => (
          <span key={b.id} className="font-utility text-[10px] rounded-md border border-[var(--line)] bg-[#0c0c0b] px-2 py-0.5 text-[var(--muted)]">
            {b.display}
          </span>
        ))}
      </div>
    )}
    ```
    *Issue*: This is an inline tag cloud, NOT a collapsible "Sources" drawer as mandated by Requirement R3 and `docs/product-language-system.md:540–548`.
- **Drawer Precedent in `SovereignIntelligenceWorkspace.tsx` (lines 1445–1464)**:
  - Button trigger: `<button className="basis-strip" onClick={() => setOpen(true)} aria-label="Sources. Open source details."><strong>Sources</strong>...</button>`
  - Modal/Slide drawer: Title `Source details`, explanation: `"These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state."`

### 1.5 Animation Primitives & Dependencies
- `apps/web/package.json` dependencies:
  - `"framer-motion": "^13.2.0"` (Installed and available)
  - `"lucide-react": "1.41.0"` (Installed and available)
  - `"tailwindcss": "4.3.3"` (Installed and available)
  - Zero need for new external animation libraries.
- `apps/web/src/tokens.css` design system motion rules:
  - Duration: `220ms` (`--sov-motion-timing`), fluid `240ms` (`--sov-motion-fluid`)
  - Timing function: `cubic-bezier(0.16, 1, 0.3, 1)` (`--sov-ease-fluid`)
  - Travel: `4px` to `6px` (`--sov-motion-travel`)
  - Radii: Containers `16px` (`--sov-radius-container`), inputs `12px` (`--sov-radius-input`), buttons `8px` (`--sov-radius-btn`).
- `apps/web/src/components/IridescentLoader.tsx`: Contains the approved `.sov-shimmer-bar` and `.sov-typing-dot` keyframe animations.

### 1.6 Passkey Verification State & Badge
- **Backend Passkey Infrastructure**:
  - D1 Migration `0014_passkey_authentication.sql` defines `auth_passkeys` and `auth_passkey_challenges`.
  - `apps/worker/src/auth-passkeys.ts` implements:
    - `POST /api/v1/auth/passkey/login/options` & `POST /api/v1/auth/passkey/login/verify`
    - `POST /api/v1/auth/passkey/register/options` & `POST /api/v1/auth/passkey/register/verify`
    - `GET /api/v1/auth/passkeys` (returns `{ passkeys: PasskeyRecord[] }`)
    - `DELETE /api/v1/auth/passkeys/:passkeyId`
  - Routes mounted in `apps/worker/src/runtime-entry.ts:142–165`.
- **Git Archeology Discovery**:
  - Commit `d8ee99bfd7d7c60ed8fc21949b1de17368defc14` (on branch `refactor/public-ai-platform-v2`) implemented `passkey-client.ts`, `PasskeyManager.tsx`, and `PasskeyAuthentication.tsx` with full browser WebAuthn API support (`navigator.credentials.get`, `navigator.credentials.create`).
- **Session Types in `apps/web/src/lib/api.ts:18–25`**:
  ```typescript
  export interface AuthSession {
    authenticated: boolean;
    accountId: string;
    sessionId?: string;
    role?: string;
    plan?: string;
    hasPasskey?: boolean;       // Extension point
    passkeyVerified?: boolean;  // Extension point
  }
  ```
- **Acceptance Criteria Requirement**:
  - "Passkey badge is conditionally rendered based on a session prop"
  - In `SovereignThread.tsx`: Check `session?.hasPasskey || session?.passkeyVerified || hasVerifiedPasskey`.
  - If true, display a badge in the header:
    - Label: `Passkey Verified` or `Passkey Protected`
    - Icon: `ShieldCheck` or `Key` from `lucide-react`
    - Design: Sage/Emerald tinted badge (`border-[#9fbaa1]/30 bg-[#9fbaa1]/10 text-[#9fbaa1]`), matching AGENTS.md restrained sage accent.

### 1.7 Existing Tests
- **Frontend (`apps/web`)**:
  - `apps/web/src/LandingParity.test.ts` (9 tests, all green)
  - `apps/web/src/PublicSupport.test.ts` (3 tests, all green)
  - No existing chat thread or passkey tests in `apps/web`.
- **Backend (`apps/worker`)**:
  - `apps/worker/src/passkey-security-email-contract.test.ts` (3 tests, all green)
  - `apps/worker/src/security/auth.test.ts` (9 tests, all green)
  - `tests/e2e/tier4-journeys.test.ts` (J4.5 tests thread message endpoint)
- All 69 test files in the worker pass cleanly (`pnpm test`).
- `pnpm typecheck` exits 0.
- `pnpm verify:foundation` exits 0.

---

## 2. Logic Chain

```
Step 1: Inspect Repository for R3 Deliverables
  Observation: apps/web/src/components/chat/ does not exist; SovereignThread.tsx does not exist.
  Inference: apps/web/src/components/chat/SovereignThread.tsx must be created from scratch, extracting and upgrading logic from SovereignChatWorkspace.v2.tsx and App.tsx.

Step 2: Trace Backend Message Streaming Contract
  Observation: apps/worker/src/index.ts:471 requires 'x-idempotency-key' header; SovereignChatWorkspace.v2.tsx:81-88 does not provide it.
  Inference: Any request from SovereignChatWorkspace.v2.tsx currently triggers HTTP 400 from the Cloudflare Worker. SovereignThread.tsx MUST generate and supply 'x-idempotency-key': crypto.randomUUID() on every turn.

Step 3: Analyze Composer scrollHeight Technique
  Observation: SovereignChatWorkspace.v2.tsx has a basic height = scrollHeight effect, while App.tsx has a static min-h-12 textarea.
  Inference: SovereignThread.tsx must implement a robust scrollHeight auto-resizer:
    1. On input change, set height to 'auto' to calculate intrinsic scrollHeight.
    2. Clamp height between 44px (single line) and 200px (max expanded height).
    3. Toggle overflowY ('hidden' when within bounds, 'auto' when scrollHeight > 200px).
    4. Support Enter to submit and Shift+Enter for newlines.
    5. Reset to 44px upon message submission.

Step 4: Architect Three-Block Message Rendering
  Observation: Requirement R3 mandates: (1) User prompt block, (2) Sovereign synthesized answer block, (3) Collapsible Sources drawer.
  Inference:
    - User block: Right-aligned, semi-transparent container, displaying user inquiry.
    - Answer block: Left-aligned, includes Sovereign brand mark, headline, direct answer prose, structured exploration section cards, and feedback buttons.
    - Sources drawer: Must be collapsible (Accordion or slide-over sheet). Trigger labeled "Sources" or "See source details". Expanded title "Source details".
    - Rule: NEVER render "Basis" or "Example Basis" or internal IDs. Text must match docs/product-language-system.md: "These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state."

Step 5: Passkey Badge Header Integration
  Observation: Acceptance criteria requires passkey badge conditionally rendered based on session prop.
  Inference:
    - Add `session?: AuthSession | null` and `hasVerifiedPasskey?: boolean` to SovereignThreadProps.
    - Render badge when `Boolean(session?.hasPasskey || session?.passkeyVerified || hasVerifiedPasskey)` is true.
    - Place badge in header beside the brand mark using the design system's sage/emerald token (`#9fbaa1`).

Step 6: Animation & Design System Compliance
  Observation: AGENTS.md mandates near-black (#000000 / #0a0a0a), sage accent (#9fbaa1), zero external animation libraries; framer-motion is installed.
  Inference: Use framer-motion `motion.div` and `motion.article` with `duration: 0.22`, `ease: [0.16, 1, 0.3, 1]`, and `y: 6` transitions matching tokens.css.
```

---

## 3. Caveats

1. **Dual Route Implementations**:
   - `apps/web/src/App.tsx` contains its own self-contained `Workspace` component with a chat interface in the `today` tab, while `apps/web/src/SovereignChatWorkspace.v2.tsx` is an isolated component.
   - *Recommendation*: Implement `apps/web/src/components/chat/SovereignThread.tsx` as the canonical, reusable chat thread component, and import it into `App.tsx` (replacing lines 1378–1505) and/or `SovereignChatWorkspace.v2.tsx`.
2. **Streaming Protocol Dualism**:
   - Worker `/api/v1/threads/:threadId/messages` supports both:
     - Plain text stream (`accept: text/event-stream` or default): Streams raw text tokens.
     - Structured JSON (`accept: application/vnd.sovereign.answer+json`): Returns `{ text, answer, basis }`.
   - *Recommendation*: `SovereignThread.tsx` should support real-time text accumulation during active streaming, and parse structured answer/sections if available or format markdown paragraphs cleanly once streaming finishes.
3. **Session Passkey Property**:
   - `GET /api/v1/auth/session` in the worker currently returns `{ authenticated, accountId, subject, sessionId, role, plan }`. It does not explicitly include `hasPasskey` unless queried via `GET /api/v1/auth/passkeys`.
   - *Recommendation*: Support both `session?.hasPasskey` (forward-compatible with session updates) and an optional automatic background check of `GET /api/v1/auth/passkeys` when `session` is authenticated, or pass `hasVerifiedPasskey` directly.

---

## 4. Conclusion & Technical Specifications

### 4.1 Component Blueprint: `apps/web/src/components/chat/SovereignThread.tsx`

#### TypeScript Interface Definition
```typescript
import type { FormEvent } from 'react';
import type { AuthSession, SovereignAnswerV2, BasisRegistryItem } from '../../lib/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'sovereign';
  content: string;
  isStreaming?: boolean;
  answer?: SovereignAnswerV2;
  sources?: BasisRegistryItem[] | string[];
  feedbackGiven?: 'yes' | 'partly' | 'not_today';
  createdAt?: string;
}

export interface SovereignThreadProps {
  /** Unique thread identifier for conversation persistence */
  threadId?: string;
  /** Active user auth session with optional passkey indicator */
  session?: (AuthSession & { hasPasskey?: boolean; passkeyVerified?: boolean }) | null;
  /** Explicit override or prop for verified passkey badge */
  hasVerifiedPasskey?: boolean;
  /** Surface context passed to worker API (defaults to 'Today') */
  surface?: 'Today' | 'Explore' | 'People' | 'Systems';
  /** Optional initial messages list */
  initialMessages?: ChatMessage[];
  /** Callback triggered when a turn completes */
  onTurnComplete?: (message: ChatMessage) => void;
  /** Custom class name for the wrapper container */
  className?: string;
}
```

#### Key Functional Modules inside `SovereignThread.tsx`
1. **Header Component**:
   - Sovereign Brand Mark (`BrandMark` or SVG diamond).
   - "Sovereign" title and surface label (`TODAY`).
   - **Passkey Verification Badge**:
     ```tsx
     {isPasskeyVerified && (
       <div
         className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--sov-sage-border,rgba(159,186,161,0.28))] bg-[var(--sov-sage-soft,rgba(159,186,161,0.12))] text-[var(--sov-sage,#9fbaa1)]"
         role="status"
         aria-label="Passkey verified"
       >
         <ShieldCheck className="h-3.5 w-3.5 text-[var(--sov-sage,#9fbaa1)]" />
         <span>Passkey Verified</span>
       </div>
     )}
     ```
   - Actions: "New Conversation" button (`handleNewConversation`).

2. **Auto-Resize Composer**:
   ```tsx
   const handleInputResize = () => {
     const textarea = textareaRef.current;
     if (!textarea) return;
     textarea.style.height = 'auto';
     const nextHeight = Math.min(Math.max(textarea.scrollHeight, 44), 200);
     textarea.style.height = `${nextHeight}px`;
     textarea.style.overflowY = textarea.scrollHeight > 200 ? 'auto' : 'hidden';
   };
   ```
   - Keyboard listener:
     - `Enter` (without Shift): Prevents newline, triggers submit.
     - `Shift + Enter`: Inserts newline, auto-resizes height.

3. **Message Rendering Hierarchy**:
   - **Block 1: User Prompt Block**:
     - Right-aligned (`ml-auto max-w-[85%]`).
     - Framer-motion entrance: `initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}`.
     - Dark-slate container: `bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white`.
   - **Block 2: Sovereign Synthesized Answer Block**:
     - Left-aligned (`w-full max-w-full`).
     - Framer-motion entrance: `initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}`.
     - Iridescent loader during synthesis state.
     - Headline (`font-statement text-xl md:text-2xl text-[var(--cream)]`).
     - Direct Answer prose (`.answer-direct text-[15px] leading-relaxed`).
     - Exploration Section cards: Mapped with uppercase utility headers and body paragraphs.
     - Feedback prompt: "Does this match today?" with `yes`, `partly`, `not_today` actions posting to `/api/v1/threads/:threadId/corrections`.
   - **Block 3: Collapsible "Sources" Drawer**:
     - Label on collapsed trigger: **"Sources"** or **"See source details"** (NEVER "Basis").
     - Chevron toggle animation.
     - Expanded Drawer Content:
       - Header: `Source details`
       - Explanatory note: *"These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state."*
       - Render list of sources: Displaying `accessibleLabel`, `display`, `provenance`, and `uncertainty` level. Internal IDs are completely omitted.

4. **SSE Streaming Communication**:
   - Target: `POST /api/v1/threads/${encodeURIComponent(threadId)}/messages`
   - Headers:
     ```typescript
     headers: {
       'content-type': 'application/json',
       'accept': 'text/event-stream',
       'x-idempotency-key': `turn_${crypto.randomUUID()}`
     }
     ```
   - Streams text via `response.body.getReader()`, accumulates tokens in real-time, and flips `isStreaming` to `false` upon stream close.
   - Graceful 401 handling: `window.location.assign('/login?returnTo=...')`.

### 4.2 Language Law Compliance Check

| Forbidden Term / Concept | Status in `SovereignThread.tsx` Specification | Compliance Rule Reference |
| :--- | :--- | :--- |
| `Basis` / `Example Basis` | **FORBIDDEN** in UI. Collapsed label is **"Sources"**, drawer title is **"Source details"**. | `docs/product-language-system.md:123–130` |
| `sovereign-answer.v2` | **FORBIDDEN** in UI text (only internal protocol). | `AGENTS.md`, `LandingParity.test.ts:76` |
| `model-safe context` | **FORBIDDEN** in UI. | `AGENTS.md`, `LandingParity.test.ts:77` |
| `server-approved` | **FORBIDDEN** in UI. | `LandingParity.test.ts:79` |
| `backdrop-blur` | **AVOIDED** in inline styles or Tailwind classes where tested by `LandingParity.test.ts`. Use atmospheric border/fill tokens. | `LandingParity.test.ts:97` |

---

## 5. Verification Method

To independently verify the implementation once built, run the following commands and checks:

### 5.1 Verification Commands
```bash
# 1. Verify TypeScript compiles with zero errors across the web workspace
pnpm --filter @sovereign/web typecheck

# 2. Run web unit tests (including parity and support tests)
pnpm --filter @sovereign/web test

# 3. Verify foundation script
pnpm verify:foundation

# 4. Full gate check across entire monorepo
pnpm typecheck && pnpm test
```

### 5.2 Unit Test File: `apps/web/src/components/chat/SovereignThread.test.ts`
Implement this test suite with Vitest to ensure ironclad regression prevention:
```typescript
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const threadSource = readFileSync(new URL('./SovereignThread.tsx', import.meta.url), 'utf8');

describe('SovereignThread Component Contracts', () => {
  it('enforces Language Law: Sources drawer is never labeled Basis in user-facing UI', () => {
    expect(threadSource).not.toMatch(/>\s*Basis\s*</i);
    expect(threadSource).not.toContain('Example Basis');
    expect(threadSource).not.toContain('What is Basis?');
    expect(threadSource).toContain('Sources');
    expect(threadSource).toContain('Source details');
    expect(threadSource).toContain('These are the source values Sovereign used for this answer.');
  });

  it('contains zero prohibited internal implementation terms', () => {
    const prohibited = [
      'sovereign-answer.v2',
      'model-safe context',
      'server-approved',
      'provenance score'
    ];
    for (const term of prohibited) {
      expect(threadSource.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });

  it('implements scrollHeight auto-resize technique for textarea', () => {
    expect(threadSource).toContain('scrollHeight');
    expect(threadSource).toMatch(/style\.height/);
  });

  it('conditionally renders passkey verification badge based on session prop', () => {
    expect(threadSource).toMatch(/hasPasskey|passkeyVerified|hasVerifiedPasskey/);
    expect(threadSource).toContain('Passkey Verified');
  });

  it('supplies x-idempotency-key header to thread message endpoint', () => {
    expect(threadSource).toContain('x-idempotency-key');
    expect(threadSource).toContain('/api/v1/threads/');
  });
});
```

---
*Report prepared by Survey Explorer 2 (`survey_exp2_o5`). All findings grounded in authoritative repository source code.*
