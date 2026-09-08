import React from 'react';
import { BrandMark } from './components/ui/BrandMark';
import { LiquidMesh } from './components/ui/LiquidMesh';
import { PublicDemoChat } from './components/PublicDemoChat';
import { BaselineMockCard } from '@/components/mocks/BaselineMockCard';
import { ExpressionMockPanel } from '@/components/mocks/ExpressionMockPanel';
import { SystemMapMockSVG } from '@/components/mocks/SystemMapMockSVG';

const REAL_LIFE_QUESTIONS = [
  { scope: 'Self', text: 'How do I make decisions that actually fit me?' },
  { scope: 'Relationships', text: 'Why does the same conversation feel different to each of us?' },
  { scope: 'Family', text: 'Why does everything fall to me when something goes wrong?' },
  { scope: 'Work', text: 'What role do I keep ending up in on this team?' },
  { scope: 'Growth', text: 'What am I ready to stop repeating?' }
] as const;

const COMPARISON = {
  blank: [
    'Starts fresh each time—no continuity across conversations',
    'You must re-explain your situation over and over',
    'Gives surface-level answers because it has no real context',
    'Cannot tell the difference between similar situations in your life'
  ],
  sovereign: [
    "Remembers what you've shared about how you think, decide, and relate",
    "Uses your actual patterns to understand what's really happening",
    'Gives answers grounded in your specific situation and values',
    'Gets better at understanding you the more you use it'
  ]
} as const;

const PRICING_TIERS = [
  {
    name: 'Free',
    description: 'Everything you need to explore',
    price: '0',
    features: [
      'Unlimited conversations',
      'Explore yourself and your patterns',
      'Full access to Sovereign intelligence',
      'Privacy guaranteed—no data training'
    ],
    cta: 'Get started',
    ctaHref: '/signup',
    highlighted: false
  },
  {
    name: 'Sovereign+',
    description: 'For deeper work',
    price: '20',
    features: [
      'Everything in Free, plus:',
      'Understand your people (shared Baseline)',
      'See whole systems (family, team, group)',
      'Save and revisit insights',
      'Export conversations',
      'Priority API access'
    ],
    cta: 'Start free trial',
    ctaHref: '/signup?plan=plus',
    highlighted: true
  }
] as const;

export function PublicLanding() {
  return (
    <main
      className="relative min-h-screen bg-[var(--stage-black)] text-[var(--cream)] overflow-x-hidden selection:bg-white/20 selection:text-white page-noise"
      data-product-contract="personal-ai-v1"
    >
      {/* High-Motion Iridescent Liquid Mesh */}
      <LiquidMesh />

      {/* Stage Lighting Overlay */}
      <div className="stage-glow" />

      <div className="relative z-10 flex flex-col">
        <V2Navigation />
        <V2Hero />
        <ProductDifferentiation />
        <ConceptualPillars />
        <ExpansionSequence />
        <ProductDemoSection />
        <InsightSection />
        <ComparisonSection />
        <PricingSection />
        <FinalCallToAction />
        <V2Footer />
      </div>
    </main>
  );
}

function V2Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[#000000]/90 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a className="flex items-center gap-2.5 text-[var(--cream)] font-semibold tracking-tight transition-opacity hover:opacity-80" href="/" aria-label="Sovereign.OS home">
          <BrandMark size={22} />
          <span className="text-base font-semibold tracking-tight text-[var(--cream)]">Sovereign.OS</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--muted)]" aria-label="Public navigation">
          <a href="#pillars" className="transition-colors hover:text-[var(--cream)]">Pillars</a>
          <a href="#how-it-works" className="transition-colors hover:text-[var(--cream)]">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-[var(--cream)]">Pricing</a>
          <a href="/faq" className="transition-colors hover:text-[var(--cream)]">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            className="px-4 py-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors"
            href="/login"
          >
            Sign in
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-full bg-[var(--cream)] text-[var(--ink)] px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0"
            href="/signup"
          >
            Get started free
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="13" y2="4" />
              <polyline points="13 4 13 4 13 13 4 13" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

function V2Hero() {
  return (
    <section className="relative px-6 pt-24 pb-32 md:pt-32 md:pb-48" role="banner">
      <div className="mx-auto max-w-6xl flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono font-medium text-[var(--muted)] mb-8 tracking-widest uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--sage)] animate-pulse" />
          PERSONAL AI FOR REAL LIFE
        </div>
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tighter text-[var(--cream)] leading-[1.05] mb-8">
          Healing isn’t optional.<br />
              Holding onto the pain is.
        </h1>
        <p className="text-xl sm:text-2xl text-[var(--muted)] max-w-4xl leading-relaxed mb-6">
          Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.
        </p>
        <p className="text-xs font-mono text-[var(--subtle)] mb-12 uppercase tracking-widest">
          Start free · No card required · Review, correct, or reject any interpretation
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          <a
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--cream)] text-[var(--ink)] px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0"
            href="/signup"
          >
            Explore Sovereign.OS
            <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="13" y2="4" />
              <polyline points="13 4 13 4 13 13 4 13" />
            </svg>
          </a>
          <a
            className="inline-flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10 px-8 py-4 text-lg font-medium text-[var(--cream)] hover:border-white/20 hover:-translate-y-1 active:translate-y-0"
            href="#pillars"
          >
            See how it works
          </a>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          <div className="lg:col-span-6 w-full flex justify-center scale-110">
            <BaselineMockCard />
          </div>
          <div className="lg:col-span-6 w-full scale-110">
            <PublicDemoChat />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDifferentiation() {
  return (
    <section className="py-24 px-6 border-y border-[var(--line)] bg-white/[0.01]">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tighter text-[var(--cream)] leading-tight">
          Most AI answers the question.<br />
          <span className="text-[var(--muted)]">Sovereign tries to understand the person asking it.</span>
        </h2>
        <p className="mt-8 text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Your history, your Baseline, your expression, your relationships, and the systems you are part of become context for a more useful kind of intelligence.
        </p>
      </div>
    </section>
  );
}

function ConceptualPillars() {
  return (
    <section className="py-32 px-6" id="pillars">
      <div className="mx-auto max-w-6xl">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tighter text-[var(--cream)] leading-tight">
            One person is complex. A relationship is more complex. A system is something else entirely.
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* SELF */}
          <div className="glass-border p-10 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-2">
            <div className="space-y-6">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                SELF
              </div>
              <h3 className="text-2xl font-bold text-[var(--cream)] leading-snug">
                Your Baseline
              </h3>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Understand the qualities, patterns, strengths, tensions, and capacities that shape how you move through life.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-xs font-mono text-[var(--subtle)]">
                Understanding the context you bring.
            </div>
          </div>

          {/* BETWEEN */}
          <div className="glass-border p-10 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-2">
            <div className="space-y-6">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                BETWEEN
              </div>
              <h3 className="text-2xl font-bold text-[var(--cream)] leading-snug">
                Your Relationships
              </h3>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                See how two different ways of operating meet—and what happens between them.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-xs font-mono text-[var(--subtle)]">
                Understanding what happens between people.
            </div>
          </div>

          {/* WHOLE */}
          <div className="glass-border p-10 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-2">
            <div className="space-y-6">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                WHOLE
              </div>
              <h3 className="text-2xl font-bold text-[var(--cream)] leading-snug">
                Your Systems
              </h3>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Understand families, teams, and groups as living systems rather than collections of individuals.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-xs font-mono text-[var(--subtle)]">
                Understanding the larger system.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpansionSequence() {
  return (
    <section className="py-32 px-6 border-t border-[var(--line)] bg-black/30" id="how-it-works">
      <div className="mx-auto max-w-5xl">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tighter text-[var(--cream)] leading-tight">
            Start with you. Then widen the view.
          </h2>
        </header>

        <div className="space-y-24">
          {/* YOU */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
              <div>
                <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest block">01 · YOU</span>
                <h3 className="text-3xl font-bold text-[var(--cream)] mt-1">Explore yourself</h3>
              </div>
              <span className="text-xs font-mono text-[var(--muted)] bg-white/5 border border-white/10 px-4 py-1 rounded-full">
                Personal Context
              </span>
            </div>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-3xl mb-4 font-semibold">
              Explore how you think, decide, communicate, create, connect, and grow.
            </p>
            <p className="text-base text-[var(--muted)] leading-relaxed max-w-3xl mb-8">
              Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Decision Rhythm', 'Cognitive Framing', 'Pressure Equilibrium', 'Alignment'].map(tag => (
                <span key={tag} className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[var(--muted)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* BASELINE */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
              <div>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block">02 · YOU + YOUR PEOPLE</span>
                <h3 className="text-3xl font-bold text-[var(--cream)] mt-1">Relational intelligence</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 rounded-full">
                Quiet Reference
              </span>
            </div>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-3xl mb-4 font-semibold">
              See why the same moment lands differently—and how to bridge the gap.
            </p>
            <p className="text-base text-[var(--muted)] leading-relaxed max-w-3xl mb-10">
              With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.
            </p>
            <div className="flex justify-center scale-110">
              <BaselineMockCard />
            </div>
          </div>

          {/* EXPRESSION */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
              <div>
                <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block">03 · FROM 1:1 TO THE WHOLE SYSTEM</span>
                <h3 className="text-3xl font-bold text-[var(--cream)] mt-1">System dynamics</h3>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full">
                How context shows up
              </span>
            </div>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-3xl mb-4 font-semibold">
              See the whole system.
            </p>
            <p className="text-base text-[var(--muted)] leading-relaxed max-w-3xl mb-10">
              Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.
            </p>
            <div className="flex justify-center scale-110">
              <ExpressionMockPanel />
            </div>
          </div>

          {/* PEOPLE */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
              <div>
                <span className="font-mono text-xs text-purple-400 uppercase tracking-widest block">04</span>
                <h3 className="text-3xl font-bold text-[var(--cream)] mt-1">PEOPLE</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-4 py-1 rounded-full">
                What happens between
              </span>
            </div>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-3xl mb-10">
              Widen the view to understand what happens between you. Explore relationships through the context of both people — not just one interpretation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Person A · Processing Style</span>
                <p className="text-sm text-neutral-200">Reflective synthesis before verbal articulation. Needs space to formulate nuanced response under friction.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Person B · Processing Style</span>
                <p className="text-sm text-neutral-200">Immediate verbal iteration to resolve tension. Seeks real-time feedback to confirm relational safety.</p>
              </div>
            </div>
          </div>

          {/* SYSTEMS */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">05</span>
                <h3 className="text-3xl font-bold text-[var(--cream)] mt-1">SYSTEMS</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1 rounded-full">
                When everything connects
              </span>
            </div>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-3xl mb-10">
              See families, groups, roles, and recurring dynamics as a living system — and notice how one change affects the whole.
            </p>
            <div className="flex justify-center scale-110">
              <SystemMapMockSVG />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDemoSection() {
  return (
    <section className="py-32 px-6 border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tighter text-[var(--cream)] leading-tight">
            Bring real situations. Get more than an answer.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[var(--muted)]">
            Stop explaining your life to an AI that forgets it every time. Start with a system that already knows you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <div className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">The Interaction</div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-lg text-[var(--muted)] italic leading-relaxed">
                "Why am I so good at knowing what everyone else needs from me, but so unsure what I want?"
              </div>
            </div>
            <div className="space-y-4">
              <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest">The Sovereign Insight</div>
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-lg text-emerald-100 leading-relaxed">
                You may be highly responsive to the context around you. That can make other people's needs unusually easy to detect while your own preferences become harder to distinguish from what the situation requires.
                <br /><br />
                <span className="text-white font-semibold">Instead of asking only what you want, it may be useful to notice what remains true when nobody else needs anything from you.</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {['BASELINE', 'EXPRESSION', 'CONTEXT'].map(tag => (
                <span key={tag} className="text-xs font-mono bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[var(--muted)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 w-full scale-110">
            <PublicDemoChat />
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightSection() {
  return (
    <section className="py-32 px-6 border-t border-[var(--line)] bg-white/[0.01]">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-5xl sm:text-7xl font-normal tracking-tighter text-[var(--cream)] leading-tight mb-16">
          The questions are ordinary.<br />
          <span className="text-[var(--muted)]">The context is not.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { q: '“Why do I keep doing this?”', scope: 'SELF' },
            { q: '“Why does this relationship feel harder than it should?”', scope: 'PEOPLE' },
            { q: '“Why does changing one thing affect everyone else?”', scope: 'SYSTEMS' },
          ].map((item, i) => (
            <div key={i} className="glass-border p-8 text-left flex flex-col justify-between group hover:border-white/30 transition-all duration-300">
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-widest block">{item.scope}</span>
                <p className="text-lg text-[var(--cream)] leading-snug font-medium">{item.q}</p>
              </div>
              <div className="mt-6 text-xs text-[var(--subtle)] font-mono italic">
                An ordinary question
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="text-2xl sm:text-3xl text-[var(--cream)] font-light leading-relaxed">
            The question is only the beginning.<br />
            <span className="text-[var(--muted)]">Sovereign brings the context.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="py-32 px-6 border-t border-[var(--line)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">The Difference</p>
          <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tighter text-[var(--cream)]">Most AI starts fresh every time.</h2>
          <p className="mt-4 text-lg sm:text-xl text-[var(--muted)]">Sovereign starts with you.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Generic AI */}
          <div className="glass-border p-10 transition-all duration-300 hover:border-white/20">
            <h3 className="text-2xl font-bold text-[var(--muted)] mb-8 flex items-center gap-3">
              <span className="text-red-400">✕</span> Generic AI assistant
            </h3>
            <ul className="space-y-5">
              {COMPARISON.blank.map((item) => (
                <li key={item} className="flex items-start gap-4 text-base text-[var(--muted)] leading-relaxed">
                  <span className="text-red-400 font-bold shrink-0 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sovereign */}
          <div className="glass-border-strong p-10 relative overflow-hidden transition-all duration-300 hover:border-white/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-full pointer-events-none" />
            <h3 className="text-2xl font-bold text-[var(--cream)] mb-8 flex items-center gap-3">
              <span className="text-emerald-400">✓</span> Sovereign.OS
            </h3>
            <ul className="space-y-5">
              {COMPARISON.sovereign.map((item) => (
                <li key={item} className="flex items-start gap-4 text-base text-[var(--cream)] leading-relaxed">
                  <span className="text-emerald-400 font-bold shrink-0 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-32 px-6 border-t border-[var(--line)]" id="pricing">
      <div className="mx-auto max-w-5xl">
        <header className="mb-20 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tighter text-[var(--cream)]">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg sm:text-xl text-[var(--muted)]">Start free. Upgrade anytime if you need more.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`glass-border p-10 sm:p-14 flex flex-col justify-between transition-all duration-300 hover:border-white/30 hover:-translate-y-1 ${
                tier.highlighted ? 'glass-border-strong ring-1 ring-white/10' : ''
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-[var(--cream)]">{tier.name}</h3>
                  {tier.highlighted && (
                    <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-base text-[var(--muted)]">{tier.description}</p>
                <div className="flex items-baseline gap-1 text-[var(--cream)]">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">${tier.price}</span>
                  {tier.price !== '0' && <span className="text-lg font-medium text-[var(--muted)]">/month</span>}
                </div>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-base text-[var(--cream)]">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12">
                <a
                  className={`w-full inline-flex items-center justify-center rounded-2xl py-4 text-base font-semibold transition-all duration-300 cursor-pointer ${
                    tier.highlighted
                      ? 'bg-[var(--cream)] text-[var(--ink)] hover:bg-white hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10 text-[var(--cream)] hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                  href={tier.ctaHref}
                >
                  {tier.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCallToAction() {
  return (
    <section className="py-32 px-6 border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl">
        <div className="glass-border-strong p-16 sm:p-24 text-center relative overflow-hidden transition-all duration-300 hover:border-white/20">
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-purple-500/10 to-transparent" />
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tighter text-[var(--cream)] mb-8 leading-tight">
            Your understanding can grow with you.
          </h2>
          <p className="text-xl sm:text-2xl text-[var(--muted)] max-w-3xl mx-auto mb-12 leading-relaxed">
            Start with yourself. Expand into the people and systems that shape your life.
          </p>
          <div className="flex flex-col items-center gap-8">
            <a
              className="inline-flex items-center gap-3 rounded-2xl bg-[var(--cream)] text-[var(--ink)] px-10 py-5 text-xl font-semibold transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0"
              href="/signup"
            >
              Enter Sovereign.OS
              <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="13" y2="4" />
                <polyline points="13 4 13 4 13 13 4 13" />
              </svg>
            </a>
            <p className="text-sm font-mono text-[var(--subtle)] uppercase tracking-widest">
              Know yourself. Understand your people. See the whole system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function V2Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[#000000]/90 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <a href="/" className="flex items-center gap-2.5" aria-label="Sovereign.OS home">
              <BrandMark size={22} />
              <span className="text-base font-semibold tracking-tight text-[var(--cream)]">Sovereign.OS</span>
            </a>
            <p className="mt-2 text-xs text-[var(--muted)]">Personal AI for your real life.</p>
          </div>
          <nav className="flex flex-wrap gap-8 text-sm text-[var(--muted)]">
            <a href="#pillars" className="hover:text-[var(--cream)] transition-colors">Pillars</a>
            <a href="#how-it-works" className="hover:text-[var(--cream)] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[var(--cream)] transition-colors">Pricing</a>
            <a href="/faq" className="hover:text-[var(--cream)] transition-colors">FAQ</a>
            <a href="mailto:info@sovereign.defrag.app" className="hover:text-[var(--cream)] transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-[var(--cream)] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[var(--cream)] transition-colors">Terms</a>
          </nav>
        </div>
        <div className="mt-12 border-t border-[var(--line)] pt-6 text-center text-xs text-[var(--subtle)]">
          <p>© 2026 Sovereign.OS. Built with care for human understanding.</p>
        </div>
      </div>
    </footer>
  );
}
