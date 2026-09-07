import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const indexHtml = read('../index.html');
const stylesCss = read('./styles.css');
const appTsx = read('./App.tsx');

describe('React Codebase Production Parity (Milestone 2)', () => {
  it('integrates Google Fonts for Inter and JetBrains Mono in index.html', () => {
    expect(indexHtml).toContain('https://fonts.googleapis.com');
    expect(indexHtml).toContain('https://fonts.gstatic.com');
    expect(indexHtml).toContain('family=Inter:wght@400;500;600;700');
    expect(indexHtml).toContain('family=JetBrains+Mono:wght@400;500;600');
  });

  it('prioritizes Inter and JetBrains Mono in styles.css', () => {
    expect(stylesCss).toContain('--font-sans: "Inter"');
    expect(stylesCss).toContain('--font-mono: "JetBrains Mono"');
    expect(stylesCss).toContain('--sans-primary: var(--font-sans)');
    expect(stylesCss).toContain('--platform-bg: #000000');
    expect(stylesCss).toContain('--sage: #9fbaa1');
  });

  it('implements Founder Hero with exact copy and typographic apostrophe', () => {
    expect(appTsx).toContain('PERSONAL AI FOR REAL LIFE');
    expect(appTsx).toContain('Healing isn’t optional.<br />\n              Holding onto the pain is.');
    expect(appTsx).toContain(
      'Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.'
    );
    expect(appTsx).toContain(
      'Start free · No card required · Review, correct, or reject any interpretation'
    );
  });

  it('implements Three-Layer Scope progression (01, 02, 03) with exact copy', () => {
    // Layer 01
    expect(appTsx).toContain('01 · YOU');
    expect(appTsx).toContain('Explore yourself');
    expect(appTsx).toContain('Explore how you think, decide, communicate, create, connect, and grow.');
    expect(appTsx).toContain(
      'Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.'
    );

    // Layer 02
    expect(appTsx).toContain('02 · YOU + YOUR PEOPLE');
    expect(appTsx).toContain('Relational intelligence');
    expect(appTsx).toContain('See why the same moment lands differently—and how to bridge the gap.');
    expect(appTsx).toContain(
      'With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.'
    );

    // Layer 03
    expect(appTsx).toContain('03 · FROM 1:1 TO THE WHOLE SYSTEM');
    expect(appTsx).toContain('System dynamics');
    expect(appTsx).toContain('See the whole system.');
    expect(appTsx).toContain(
      'Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.'
    );
  });

  it('implements Sovereign Answer Demo window with relational triad and inline sources drawer', () => {
    expect(appTsx).toContain('Why does the same conversation feel urgent to me and pressuring to them?');
    expect(appTsx).toContain('Ask Sovereign');
    expect(appTsx).toContain('WHAT YOU MAY BE BRINGING');
    expect(appTsx).toContain('WHAT THEY MAY BE BRINGING');
    expect(appTsx).toContain('WHAT HAPPENS BETWEEN YOU');
    expect(appTsx).toContain('See source details');
    expect(appTsx).toContain('These are the source values Sovereign used for this answer.');
    expect(appTsx).not.toContain("alert('Sources details");
    expect(appTsx).not.toContain('alert(');
  });

  it('contains zero prohibited terms in user-facing UI copy', () => {
    const prohibitedTerms = [
      'sovereign-answer.v2',
      'model-safe context',
      'model context',
      'server-approved',
      'One private foundation',
      'Separate helping from carrying',
      'See where responsibility keeps landing',
      'Understand both sides and what happens between you',
      'Ask about your life',
      'Ask Sovereign about your life',
      'authority',
      'What is Basis?',
      'What does Basis prove?',
      'What would you like to understand'
    ];
    for (const term of prohibitedTerms) {
      expect(appTsx.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });

  it('enforces UI styling contract with zero forbidden glassmorphism or blur tokens', () => {
    expect(appTsx).not.toContain('backdrop-blur');
    expect(appTsx).toContain('bg-[#000000]');
  });

  it('implements canonical Today authenticated headline, privacy note, and systems copy', () => {
    expect(appTsx).toContain('What is active for you now?');
    expect(appTsx).toContain('placeholder="Ask Sovereign…"');
    expect(appTsx).toContain('Private by default · Sovereign uses only consented data');
    expect(appTsx).toContain('how pressure moves');
  });

  it('preserves all non-landing routes and voluntary support URL integrity', () => {
    const routes = [
      '/how-it-works',
      '/pricing',
      '/faq',
      '/terms',
      '/privacy',
      '/login',
      '/signup',
      '/auth/redeem',
      '/onboarding',
      '/app'
    ];
    for (const r of routes) {
      expect(appTsx).toContain(`'${r}'`);
    }

    const generalSupportUrl = 'https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02';
    expect(appTsx).toContain(generalSupportUrl);
  });
});
