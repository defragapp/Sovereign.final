# Backend Streaming Implementation Guide

Complete walkthrough for implementing SSE (Server-Sent Events) streaming in your Cloudflare Worker backend.

---

## Overview

The frontend's `useSovereignTurn` hook expects:

```
POST /api/v1/threads/:threadId/messages
Content-Type: application/json

{ "message": "Why does this keep happening?" }
```

To return:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

This is the first chunk of the response
This is chunk 2 with more content
And it continues until complete
```

---

## Step 1: Update Worker Route Handler

**File: `apps/sovereign-worker/src/routes/messages.ts`** (or equivalent)

```typescript
import { Router, Request as IttyRequest } from 'itty-router';
import type { ExecutionContext } from '@cloudflare/workers-types';

const router = Router();

interface ThreadMessage {
  message: string;
  context?: {
    surface?: string;
    personId?: string;
    systemId?: string;
  };
}

router.post(
  '/api/v1/threads/:threadId/messages',
  async (request: IttyRequest, env: Env, ctx: ExecutionContext) => {
    try {
      // 1. Authenticate
      const auth = await getAuthContext(request, env);
      if (!auth) {
        return new Response('Unauthorized', { status: 401 });
      }

      // 2. Parse request
      const { message, context } = await request.json<ThreadMessage>();
      if (!message?.trim()) {
        return new Response('Message required', { status: 400 });
      }

      const threadId = request.params.threadId as string;

      // 3. Create streaming response
      const { readable, writable } = new TransformStream<Uint8Array>();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      // 4. Start AI inference in background (non-blocking)
      ctx.waitUntil(
        (async () => {
          try {
            // Call your AI service (Claude, GPT, custom model, etc.)
            const aiResponse = await callSovereignAI({
              userId: auth.userId,
              threadId,
              message: message.trim(),
              context,
              stream: true // Enable streaming
            });

            // 5. Pipe AI response chunks to client
            const reader = aiResponse.body.getReader();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // Decode chunk
              const chunk = new TextDecoder().decode(value);
              buffer += chunk;

              // Send to client (SSE has no special format, just text)
              await writer.write(encoder.encode(chunk));
            }

            // 6. Save turn to D1
            await saveMessageTurn(env.DB, {
              threadId,
              userId: auth.userId,
              role: 'user',
              content: message.trim()
            });

            await saveMessageTurn(env.DB, {
              threadId,
              userId: auth.userId,
              role: 'assistant',
              content: buffer
            });

          } catch (error) {
            // Write error to stream
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            await writer.write(encoder.encode(`\n[ERROR] ${errorMsg}`));
          } finally {
            await writer.close();
          }
        })()
      );

      // 7. Return streaming response immediately (don't wait for AI to finish)
      return new Response(readable, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('POST /threads/:id/messages', error);
      return new Response('Internal server error', { status: 500 });
    }
  }
);

export default router;
```

---

## Step 2: Implement AI Inference

Replace `callSovereignAI` with your actual AI service.

### Option A: Using Anthropic Claude (Recommended)

```typescript
async function callSovereignAI(params: {
  userId: string;
  threadId: string;
  message: string;
  context?: Record<string, any>;
  stream: boolean;
}) {
  const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY
  });

  // Build system prompt from user's Baseline
  const baseline = await getBaselineForUser(env.DB, params.userId);
  const systemPrompt = buildSovereignSystemPrompt(baseline);

  const stream = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: params.message
      }
    ],
    stream: true
  });

  // Convert Anthropic stream to ReadableStream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          await writer.write(encoder.encode(event.delta.text));
        }
      }
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable);
}
```

### Option B: Using OpenAI

```typescript
async function callSovereignAI(params: {
  userId: string;
  threadId: string;
  message: string;
  context?: Record<string, any>;
  stream: boolean;
}) {
  const baseline = await getBaselineForUser(env.DB, params.userId);
  const systemPrompt = buildSovereignSystemPrompt(baseline);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.message }
      ],
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  // Return the response body directly (it's already a stream)
  return response;
}
```

---

## Step 3: Build System Prompt from Baseline

```typescript
function buildSovereignSystemPrompt(baseline: Baseline | null): string {
  if (!baseline) {
    return `You are Sovereign, a personal AI for understanding yourself, your relationships, and the systems around you.

Always:
- Be direct and grounded in the person's actual situation
- Show reasoning so they can accept, correct, or reject it
- Avoid generic wisdom or one-size-fits-all advice
- Return answers specific to their patterns and values`;
  }

  const facets = baseline.reducedContext?.facetProfile?.facets || [];
  const communication = facets.find(f => f.id === 'communication')?.description || '';
  const pressure = facets.find(f => f.id === 'response_pressure')?.description || '';
  const decision = facets.find(f => f.id === 'decision_making')?.description || '';

  return `You are Sovereign, a personal AI for understanding yourself, your relationships, and the systems around you.

This person's Baseline includes:
- Communication: ${communication}
- Under Pressure: ${pressure}
- Decision-Making: ${decision}

Use their patterns to:
- Ground every answer in how they actually think and decide
- Show the connection between their question and their Baseline
- Help them see what might be happening beneath the surface
- Return specific, actionable clarity

Always show your reasoning so they can accept, correct, or reject it.`;
}
```

---

## Step 4: Save Turns to D1 Database

```typescript
interface Turn {
  threadId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    surface?: string;
    sources?: string[];
  };
}

async function saveMessageTurn(
  db: D1Database,
  turn: Turn
): Promise<void> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(`
      INSERT INTO message_turns (
        id, thread_id, user_id, role, content, metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      turn.threadId,
      turn.userId,
      turn.role,
      turn.content,
      JSON.stringify(turn.metadata || {}),
      now
    )
    .run();
}
```

### D1 Schema

```sql
CREATE TABLE IF NOT EXISTS message_turns (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (thread_id) REFERENCES threads(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_message_turns_thread ON message_turns(thread_id);
CREATE INDEX idx_message_turns_user ON message_turns(user_id);
```

---

## Step 5: Handle Errors Gracefully

```typescript
// In the main handler, wrap AI call in try-catch
try {
  const aiResponse = await callSovereignAI({ ... });
  // ... stream to client
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'Sovereign is not available right now';
  
  // Send error to client (don't close stream abruptly)
  await writer.write(
    encoder.encode(`\n[ERROR] ${message}`)
  );
  
  // Log for debugging
  console.error('[Sovereign AI Error]', {
    userId: auth.userId,
    threadId,
    error: message
  });
}
```

---

## Step 6: Test the Endpoint

### Using curl

```bash
curl -N \
  -X POST http://localhost:8787/api/v1/threads/test-thread/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Why do I avoid difficult conversations?"}'
```

Expected output:
```
You likely avoid difficult conversations because...
[continues streaming chunks]
```

### Using httpie

```bash
http --stream \
  POST localhost:8787/api/v1/threads/test-thread/messages \
  message="Why do I avoid difficult conversations?" \
  "Authorization: Bearer YOUR_TOKEN"
```

---

## Step 7: Performance Optimization

### Cache Baseline Data

```typescript
const baselineCache = new Map<string, Baseline>();

async function getBaselineForUser(
  db: D1Database,
  userId: string
): Promise<Baseline | null> {
  if (baselineCache.has(userId)) {
    return baselineCache.get(userId) || null;
  }

  const baseline = await db
    .prepare('SELECT * FROM baseline WHERE user_id = ?')
    .bind(userId)
    .first() as Baseline | undefined;

  if (baseline) {
    baselineCache.set(userId, baseline);
  }

  return baseline || null;
}
```

### Timeout for Long-Running Requests

```typescript
const AI_RESPONSE_TIMEOUT = 30_000; // 30 seconds

const aiPromise = callSovereignAI({ ... });
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(
    () => reject(new Error('AI response timeout')),
    AI_RESPONSE_TIMEOUT
  )
);

const aiResponse = await Promise.race([aiPromise, timeoutPromise]);
```

---

## Step 8: Monitor & Debug

### Log Streaming Events

```typescript
async function* logStreamChunks(stream: ReadableStream) {
  const reader = stream.getReader();
  let chunkCount = 0;
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunkCount++;
      totalBytes += value.byteLength;

      // Log every 10th chunk
      if (chunkCount % 10 === 0) {
        console.log(`[Streaming] Chunk ${chunkCount}, ${totalBytes} bytes so far`);
      }

      yield value;
    }
  } finally {
    console.log(
      `[Streaming Complete] ${chunkCount} chunks, ${totalBytes} bytes total`
    );
  }
}
```

### Track Metrics

```typescript
const metrics = {
  startTime: Date.now(),
  chunkCount: 0,
  totalBytes: 0,
  errors: 0
};

// Update on each chunk
metrics.chunkCount++;
metrics.totalBytes += chunk.length;

// Log at end
console.log({
  duration: Date.now() - metrics.startTime,
  ...metrics,
  bytesPerSecond: (
    metrics.totalBytes / (Date.now() - metrics.startTime) * 1000
  ).toFixed(0)
});
```

---

## Common Issues & Solutions

### Stream closes prematurely
**Symptom:** Client receives 1-2 chunks then connection closes

**Causes:**
- Worker timeout (default 30s on Cloudflare)
- Unhandled error in AI service
- Network interruption

**Solutions:**
- Wrap AI call in try-catch
- Use `ctx.waitUntil()` for background work
- Test locally first

### Client never receives response
**Symptom:** Fetch never resolves, shows "loading" forever

**Causes:**
- Headers not set correctly (check `Content-Type: text/event-stream`)
- First chunk delayed > 60s
- CORS issue

**Solutions:**
- Verify response headers
- Check browser DevTools > Network tab
- Test endpoint with curl

### Memory leak on long streams
**Symptom:** Worker OOM (Out of Memory) on long responses

**Causes:**
- Buffer not flushed between chunks
- TransformStream not releasing memory

**Solutions:**
- Process chunks immediately, don't accumulate
- Use explicit cleanup in finally block

---

## Deployment

### Wrangler Configuration

**File: `wrangler.toml`**

```toml
[env.production]
route = "api.sovereign.defrag.app/api/*"
vars = { ENVIRONMENT = "production" }
binding = "DB"

[[env.production.d1_databases]]
binding = "DB"
database_name = "sovereign-prod"
database_id = "your-db-id"

[env.production.env]
ANTHROPIC_API_KEY = "secret"
OPENAI_API_KEY = "secret"
```

### Deploy

```bash
npm run deploy -- --env production
```

---

## References

- [MDN: Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Cloudflare Workers: Streaming Responses](https://developers.cloudflare.com/workers/runtime-apis/streams/)
- [Anthropic: Streaming API](https://docs.anthropic.com/en/docs/build-a-chat-bot#streaming)
- [OpenAI: Streaming API](https://platform.openai.com/docs/api-reference/chat/create#chat-create-stream)

---

**Last Updated:** 2026-09-07
