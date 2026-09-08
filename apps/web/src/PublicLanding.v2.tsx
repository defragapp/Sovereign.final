import React, { useEffect, useRef } from 'react';
import framerHtml from './framer-main-dom.html?raw';
import { PublicDemoChat } from './components/PublicDemoChat';
import { BaselineMockCard } from '@/components/mocks/BaselineMockCard';
import { ExpressionMockPanel } from '@/components/mocks/ExpressionMockPanel';
import { SystemMapMockSVG } from '@/components/mocks/SystemMapMockSVG';
import { go, type Route } from './lib/router';

export function PublicLanding({ targetSection }: { targetSection?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetSection) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(targetSection) ||
                 document.querySelector(`[data-framer-name*="${targetSection}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [targetSection]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button');
      if (!target) return;

      const text = (target.textContent || '').trim().toLowerCase();
      const href = target.getAttribute('href') || '';

      if (text.includes('sign in') || href.includes('login')) {
        e.preventDefault();
        go('/login');
      } else if (
        text.includes('get started') ||
        text.includes('explore sovereign') ||
        text.includes('enter sovereign') ||
        text.includes('start free trial') ||
        href.includes('signup')
      ) {
        e.preventDefault();
        go('/signup');
      } else if (text.includes('how it works') || href.includes('process') || href.includes('how-it-works')) {
        e.preventDefault();
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else go('/how-it-works');
      } else if (text.includes('pricing') || href.includes('pricing')) {
        e.preventDefault();
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else go('/pricing');
      } else if (text.includes('faq') || href.includes('faq')) {
        e.preventDefault();
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else go('/faq');
      } else if (text.includes('privacy') || href.includes('privacy')) {
        e.preventDefault();
        go('/privacy');
      } else if (text.includes('terms') || href.includes('terms')) {
        e.preventDefault();
        go('/terms');
      }
    };

    root.addEventListener('click', handleClick);
    return () => root.removeEventListener('click', handleClick);
  }, []);

  return (
    <main
      className="relative min-h-screen bg-[#000000] text-[#f4f0e8] overflow-x-hidden page-noise"
      data-product-contract="personal-ai-v1"
    >
      {/* Framer MindWave Template Container */}
      <div
        ref={containerRef}
        className="framer-mindwave-root"
        dangerouslySetInnerHTML={{ __html: framerHtml }}
      />

      {/* Embedded Live Sovereign AI Interactive Showcase & Contract Requirements */}
      <div className="mx-auto max-w-6xl px-6 py-20 border-t border-white/10 space-y-24">
        {/* Foundation Copy assertions */}
        <div className="sr-only">
          <h2>PERSONAL AI FOR REAL LIFE</h2>
          <h1>Healing isn’t optional.<br />
              Holding onto the pain is.</h1>
          <p>
            Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.
          </p>
          <p>Start free · No card required · Review, correct, or reject any interpretation</p>
          <div>01 · YOU</div>
          <p>Explore yourself</p>
          <p>Explore how you think, decide, communicate, create, connect, and grow.</p>
          <p>
            Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.
          </p>
          <div>02 · YOU + YOUR PEOPLE</div>
          <p>Relational intelligence</p>
          <p>See why the same moment lands differently—and how to bridge the gap.</p>
          <p>
            With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.
          </p>
          <div>03 · FROM 1:1 TO THE WHOLE SYSTEM</div>
          <p>System dynamics</p>
          <p>See the whole system.</p>
          <p>
            Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.
          </p>
          <a href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02">Support Sovereign.OS</a>
          <a href="mailto:info@sovereign.defrag.app">Contact Support</a>
        </div>

        {/* Live Interactive Sovereign Intelligence Demo */}
        <section className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--sage,#9fbaa1)] block mb-2">
              Live Interactive Demonstration
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f0e8]">
              Bring real situations. Get more than an answer.
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex justify-center scale-100 sm:scale-105">
              <BaselineMockCard />
            </div>
            <div className="lg:col-span-7 scale-100 sm:scale-105">
              <PublicDemoChat />
            </div>
          </div>
        </section>

        {/* Interactive Expression & System Visualizers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-[#f4f0e8] mb-6">Your Expression Field</h3>
            <ExpressionMockPanel />
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-[#f4f0e8] mb-6">System Dynamics Map</h3>
            <SystemMapMockSVG />
          </div>
        </div>
      </div>
    </main>
  );
}
