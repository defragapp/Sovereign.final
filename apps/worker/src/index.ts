import { Hono } from 'hono';

type Env = {
  DB: D1Database;
  AI: Ai;
  AI_GATEWAY_ID: string;
  AI_MODEL: string;
  ASSETS?: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/ready', (c) => c.json({ ready: true, service: 'sovereign-final' }));
app.get('/health', (c) => c.json({ ok: true }));

// Public shell fallback. The authenticated/product API is deliberately not mocked here;
// protected Sovereign routes are extracted from OPENAPI in the next implementation stage.
app.all('*', async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text('Sovereign assets are not built.', 503);
});

export default app;

export class ThreadCoordinator {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(): Promise<Response> {
    return Response.json({ ok: true });
  }
}
