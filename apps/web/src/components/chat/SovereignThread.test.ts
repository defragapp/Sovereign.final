import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { SovereignThread } from './SovereignThread';

const threadSource = readFileSync(new URL('./SovereignThread.tsx', import.meta.url), 'utf8');

describe('SovereignThread Component Contracts (Milestone 2 - Requirement R3)', () => {
  it('exports SovereignThread as a valid React component function', () => {
    expect(typeof SovereignThread).toBe('function');
  });

  it('enforces Language Law: Sources drawer is never labeled Basis in user-facing UI', () => {
    // User-facing JSX should never render >Basis< or similar
    expect(threadSource).not.toMatch(/>\s*Basis\s*</i);
    expect(threadSource).not.toContain('Example Basis');
    expect(threadSource).not.toContain('What is Basis?');
    expect(threadSource).not.toContain('What does Basis prove?');

    // Approved terminology
    expect(threadSource).toContain('Sources');
    expect(threadSource).toContain('See source details');
    expect(threadSource).toContain('Source details');
    expect(threadSource).toContain(
      'These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state.'
    );
  });

  it('contains zero prohibited internal implementation terms in source code', () => {
    const prohibitedTerms = [
      'sovereign-answer.v2',
      'model-safe context',
      'server-approved',
      'provenance score'
    ];
    for (const term of prohibitedTerms) {
      expect(threadSource.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });

  it('implements scrollHeight auto-resize technique for composer textarea', () => {
    expect(threadSource).toContain('scrollHeight');
    expect(threadSource).toMatch(/style\.height/);
    expect(threadSource).toContain('Math.min(Math.max(scrollHeight, 44), 200)');
    expect(threadSource).toContain('e.key === \'Enter\' && !e.shiftKey');
  });

  it('conditionally renders sage passkey verification badge based on session prop', () => {
    expect(threadSource).toMatch(/hasPasskey|passkeyVerified|hasVerifiedPasskey/);
    expect(threadSource).toContain('Passkey Verified');
    expect(threadSource).toContain('border-[#9fbaa1]/30');
    expect(threadSource).toContain('bg-[#9fbaa1]/10');
    expect(threadSource).toContain('text-[#9fbaa1]');
  });

  it('supplies x-idempotency-key header to thread message endpoint', () => {
    expect(threadSource).toContain('x-idempotency-key');
    expect(threadSource).toContain('crypto.randomUUID()');
    expect(threadSource).toContain('/api/v1/threads/');
    expect(threadSource).toContain('text/event-stream');
  });

  it('implements three distinct message block structures', () => {
    // Block 1: User prompt block
    expect(threadSource).toContain('Block 1: User prompt block');
    expect(threadSource).toContain('ml-auto max-w-[85%]');

    // Block 2: Sovereign synthesized answer block
    expect(threadSource).toContain('Block 2: Sovereign synthesized answer block');
    expect(threadSource).toContain('SOVEREIGN SYNTHESIS');
    expect(threadSource).toContain('answer-direct');

    // Block 3: Collapsible Sources drawer
    expect(threadSource).toContain('Block 3: Collapsible Sources drawer');
    expect(threadSource).toContain('toggleSourceDrawer');
    expect(threadSource).toContain('aria-expanded');
    expect(threadSource).toContain('aria-label="Sources. Open source details."');
  });

  it('uses framer-motion with fluid 220ms transitions matching tokens.css', () => {
    expect(threadSource).toContain("from 'framer-motion'");
    expect(threadSource).toContain('duration: 0.22');
    expect(threadSource).toContain('ease: [0.16, 1, 0.3, 1]');
  });

  it('does not contain forbidden backdrop-blur glassmorphism tokens', () => {
    expect(threadSource).not.toContain('backdrop-blur');
  });
});
