import React from 'react';
import { BrandMark } from './components/ui/BrandMark';
import { LiquidMesh } from './components/ui/LiquidMesh';
import { PublicDemoChat } from './components/PublicDemoChat';
import { BaselineViewFragment } from './components/fragments/BaselineViewFragment';
import { ExpressionViewFragment } from './components/fragments/ExpressionViewFragment';
import { SystemMapViewFragment } from './components/fragments/SystemMapViewFragment';

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
      className="relative min-h-screen bg-[#000000] text-gray-100 overflow-x-hidden selection:bg-white/20 selection:text-white"
      data-product-contract="personal-ai-v1"
    >
      {/* High-Motion Iridescent Liquid Mesh */}
      <LiquidMesh />

      {/* Global CSS mesh gradient fallback & dark stage spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 40%, transparent 75%), radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.06) 0px, transparent 50%), radial-gradient(at 90% 15%, rgba(168, 85, 247, 0.05) 0px, transparent 50%), radial-gradient(at 50% 85%, rgba(6, 182, 212, 0.05) 0px, transparent 50%), #000000',
        }}
      />

      <div className="relative z-10 flex flex-col">
        <V2Navigation />
        <V2Hero />
        <ConceptualPillars />
        <ExpansionSequence />
        <RealLifeQuestions />
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#000000]/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a className="flex items-center gap-2.5 text-white font-semibold tracking-tight transition-opacity hover:opacity-80" href="/" aria-label="Sovereign.OS home">
          <BrandMark size={22} />
          <span className="text-base font-semibold tracking-tight text-white">Sovereign.OS</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400" aria-label="Public navigation">
          <a href="#pillars" className="transition-colors hover:text-white">Pillars</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <a href="/faq" className="transition-colors hover:text-white">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            href="/login"
          >
            Sign in
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:-translate-y-1 active:translate-y-0"
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
    <section className="relative px-6 pt-16 pb-20 md:pt-20 md:pb-28" role="banner">
      <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          PERSONAL AI FOR REAL LIFE
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.12]">
          Understand yourself.
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Understand your people.
          </span>
          <br />
          <span className="text-neutral-400">See the whole system.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-3xl leading-relaxed">
          Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you. Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0"
            href="/signup"
          >
            Start free — no card required
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="13" y2="4" />
              <polyline points="13 4 13 4 13 13 4 13" />
            </svg>
          </a>
          <a
            className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10 px-6 py-3.5 text-base font-medium text-white hover:border-white/20 hover:-translate-y-1 active:translate-y-0"
            href="#pillars"
          >
            See how it works
          </a>
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Start free · No card required · Review, correct, or reject any interpretation
        </p>

        {/* Above-the-fold Hero Stage Preview: Compact BaselineViewFragment & PublicDemoChat */}
        <div className="mt-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          <div className="lg:col-span-6 w-full flex justify-center">
            <BaselineViewFragment compact={true} />
          </div>
          <div className="lg:col-span-6 w-full">
            <PublicDemoChat />
          </div>
        </div>
      </div>
    </section>
  );
}

function ConceptualPillars() {
  return (
    <section className="py-20 px-6 border-t border-white/10" id="pillars">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-block rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-neutral-400 mb-3">
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Three conceptual pillars</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">
            A unified intelligence model that expands naturally from the individual outward.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: SELF — Your Baseline */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
                SELF — Your Baseline
              </div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                Explore how you think, decide, communicate, create, connect, and grow.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Your Baseline gives Sovereign a consistent reference for how you process, evaluate tradeoffs, and respond under pressure—without reducing you to a score or type.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-neutral-500">
              01 · Private Reference
            </div>
          </div>

          {/* Card 2: BETWEEN — Your Relationships */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-400 mb-4">
                BETWEEN — Your Relationships
              </div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                See why the same moment lands differently—and how to bridge the gap.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                With mutual permission, Sovereign examines both people’s Baselines while keeping each person distinct. Understand where timing, pacing, and coping styles differ when they meet.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-neutral-500">
              02 · Mutual Permission
            </div>
          </div>

          {/* Card 3: WHOLE — Your Systems */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-purple-400 mb-4">
                WHOLE — Your Systems
              </div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                See the whole system.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Move from 1:1 interactions to families, teams, and groups. Map how pressure travels through the network, why familiar roles return, and what changes when one person responds differently.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-neutral-500">
              03 · Network Dynamics
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpansionSequence() {
  return (
    <section className="py-24 px-6 border-t border-white/10 bg-black/30" id="how-it-works">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
            Vertical Scroll Expansion Sequence
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            YOU → BASELINE → EXPRESSION → PEOPLE → SYSTEMS
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300">
            From your quiet internal reference to multi-party relationship vectors.
          </p>
        </header>

        {/* Step Progression Visual Track */}
        <div className="space-y-16">
          {/* 01 · YOU */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block">01 / 05</span>
                <h3 className="text-2xl font-bold text-white mt-1">YOU · Self-Exploration</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full self-start md:self-auto">
                First Turn
              </span>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
              Explore how you think, decide, communicate, create, connect, and grow. Sovereign provides room for genuine self-reflection—examining decision-making, pressure response, Shadow, Gift, and Alignment without reducing you to a static profile.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-neutral-300">Decision Rhythm</span>
              <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-neutral-300">Cognitive Framing</span>
              <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-neutral-300">Pressure Equilibrium</span>
              <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-neutral-300">Alignment</span>
            </div>
          </div>

          {/* 02 · BASELINE */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block">02 / 05</span>
                <h3 className="text-2xl font-bold text-white mt-1">BASELINE · Quiet Reference</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start md:self-auto">
                Grounding Layer
              </span>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed max-w-3xl mb-8">
              Your Baseline gives Sovereign a consistent reference across every turn. A private reference built around you, so Sovereign can begin with more than the current prompt alone.
            </p>
            <div className="flex justify-center">
              <BaselineViewFragment compact={false} />
            </div>
          </div>

          {/* 03 · EXPRESSION */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block">03 / 05</span>
                <h3 className="text-2xl font-bold text-white mt-1">EXPRESSION · Grounded Synthesis</h3>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full self-start md:self-auto">
                Contextual Breakdown
              </span>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed max-w-3xl mb-8">
              Distinguish what is steady from what changes under pressure, through current conditions, or the actual situation. Ground raw inquiries into structural understanding.
            </p>
            <div className="flex justify-center">
              <ExpressionViewFragment />
            </div>
          </div>

          {/* 04 · PEOPLE */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="font-mono text-xs text-purple-400 uppercase tracking-widest block">04 / 05</span>
                <h3 className="text-2xl font-bold text-white mt-1">PEOPLE · Relational Intelligence</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full self-start md:self-auto">
                Mutual Consent
              </span>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed max-w-3xl mb-6">
              See why the same moment lands differently—and how to bridge the gap. With mutual permission, Sovereign examines both people’s Baselines while keeping each person distinct. Understand where timing, communication, pressure, or decision styles differ when they meet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-2">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Person A · Processing Style</span>
                <p className="text-sm text-neutral-200">Reflective synthesis before verbal articulation. Needs space to formulate nuanced response under friction.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-2">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Person B · Processing Style</span>
                <p className="text-sm text-neutral-200">Immediate verbal iteration to resolve tension. Seeks real-time feedback to confirm relational safety.</p>
              </div>
            </div>
          </div>

          {/* 05 · SYSTEMS */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">05 / 05</span>
                <h3 className="text-2xl font-bold text-white mt-1">SYSTEMS · Multi-Party Dynamics</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start md:self-auto">
                System Equilibrium
              </span>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed max-w-3xl mb-8">
              Move from 1:1 interactions to families, teams, and groups. Map how pressure travels through the network, why familiar roles return, and what changes when one person responds differently.
            </p>
            <div className="flex justify-center">
              <SystemMapViewFragment />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RealLifeQuestions() {
  return (
    <section className="py-20 px-6 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Real questions people ask Sovereign</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Start with what's on your mind right now.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAL_LIFE_QUESTIONS.map((q) => (
            <button
              key={q.text}
              type="button"
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 text-left flex flex-col justify-between group transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                sessionStorage.setItem('sovereign:prefill-prompt', q.text);
                window.location.href = '/signup';
              }}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <span className="inline-block rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-300">
                  {q.scope}
                </span>
                <svg className="w-4 h-4 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="13" y2="4" />
                  <polyline points="13 4 13 4 13 13 4 13" />
                </svg>
              </div>
              <span className="text-base font-medium text-gray-100 group-hover:text-white leading-snug">
                {q.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="py-20 px-6 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">The Difference</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Most AI starts fresh every time.</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Sovereign starts with you.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Generic AI */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <h3 className="text-xl font-bold text-neutral-400 mb-6 flex items-center gap-2">
              <span className="text-red-400">✕</span> Generic AI assistant
            </h3>
            <ul className="space-y-4">
              {COMPARISON.blank.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sovereign */}
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-full pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Sovereign.OS
            </h3>
            <ul className="space-y-4">
              {COMPARISON.sovereign.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-100 leading-relaxed">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
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
    <section className="py-20 px-6 border-t border-white/10" id="pricing">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Simple, transparent pricing</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Start free. Upgrade anytime if you need more.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white/5 backdrop-blur-md border ${
                tier.highlighted ? 'border-white/20 ring-1 ring-white/10' : 'border-white/10'
              } rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-white/30 hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                  {tier.highlighted && (
                    <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-neutral-400">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1 text-white">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">${tier.price}</span>
                  {tier.price !== '0' && <span className="text-sm font-medium text-neutral-400">/month</span>}
                </div>
                <ul className="mt-8 space-y-3.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-100">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <a
                  className={`w-full inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    tier.highlighted
                      ? 'bg-white text-black hover:bg-neutral-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0'
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
    <section className="py-20 px-6 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-10 sm:p-14 text-center relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-purple-500/10 to-transparent" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Know yourself. Understand your people. See the whole system.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
            Start free with Sovereign.OS. Build your Baseline, then explore what you want to understand next.
          </p>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0"
            href="/signup"
          >
            Get started free
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="13" y2="4" />
              <polyline points="13 4 13 4 13 13 4 13" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function V2Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#000000]/80 backdrop-blur-md mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <a href="/" className="flex items-center gap-2.5" aria-label="Sovereign.OS home">
              <BrandMark size={22} />
              <span className="text-base font-semibold tracking-tight text-white">Sovereign.OS</span>
            </a>
            <p className="mt-2 text-xs text-neutral-400">Personal AI for your real life.</p>
          </div>
          <nav className="flex flex-wrap gap-8 text-sm text-neutral-400">
            <a href="#pillars" className="hover:text-white transition-colors">Pillars</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="mailto:info@sovereign.defrag.app" className="hover:text-white transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          </nav>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-neutral-500">
          <p>© 2026 Sovereign.OS. Built with care for human understanding.</p>
        </div>
      </div>
    </footer>
  );
}
