import { PublicLanding } from "./PublicLanding.v2";
import { SovereignChatWorkspace as SovereignIntelligenceWorkspace } from "./SovereignChatWorkspace.v2";
import { Auth, Redeem } from "./PasskeyAuthentication";
import { PlanOnboarding } from "./PlanOnboarding";

import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from './hooks/useInView';
import { Accordion, type AccordionItem } from './components/Accordion';
import {
  go,
  currentRoute,
  type Route
} from './lib/router';

/* =========================================================================
   SOVEREIGN MARK / SEAL
   ========================================================================= */
export function SovereignMark({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 text-[var(--cream)] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" fillOpacity="0.95" />
      </svg>
    </span>
  );
}

/* =========================================================================
   ROUTER & APP ROOT
   ========================================================================= */
export function App() {
  const [route, setRoute] = useState<Route>(currentRoute());

  useEffect(() => {
    const onPop = () => setRoute(currentRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isAppDomain = hostname.includes('app.defrag.app');
  {/* Choose what this connection may use. */}

  if (isAppDomain && route === '/') {
    return <Auth mode="login" />;
  }

  if (route === '/app') return <SovereignIntelligenceWorkspace />;
  if (route === '/onboarding') return <PlanOnboarding />;
  if (route === '/auth/redeem') return <Redeem />;
  if (route === '/login' || route === '/signup') return <Auth mode={route.slice(1) as 'login' | 'signup'} />;
  if (route === '/how-it-works') return <InfoPage onBack={() => go('/')} />;
  if (route === '/pricing') return <Pricing onBack={() => go('/')} />;
  if (route === '/faq') return <FAQ onBack={() => go('/')} />;
  if (route === '/terms') return <LegalPage title="Terms of Service" onBack={() => go('/')} />;
  if (route === '/privacy') return <LegalPage title="Privacy Policy" onBack={() => go('/')} />;

  if (isAppDomain) {
    return <Auth mode="login" />;
  }

  return <PublicLanding />;
}

/* =========================================================================
   PUBLIC HEADER
   ========================================================================= */
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToLayer = (id: string) => {
    setMobileOpen(false);
    if (window.location.pathname !== '/') {
      go('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nav = (path: Route) => { setMobileOpen(false); go(path); };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[#000000]/90 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <button aria-label="Sovereign home" onClick={() => nav('/')} className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
          <SovereignMark size={20} className="transition-transform group-hover:scale-105" />
          <span className="text-sm font-medium tracking-tight text-[var(--cream)]">Sovereign.OS</span>
        </button>
        <nav className="hidden items-center gap-8 md:flex">
          <button onClick={() => nav('/how-it-works')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors cursor-pointer">How it works</button>
          <button onClick={() => scrollToLayer('layer-01')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors cursor-pointer">01 · You</button>
          <button onClick={() => scrollToLayer('layer-02')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors cursor-pointer">02 · People</button>
          <button onClick={() => nav('/pricing')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors cursor-pointer">Pricing</button>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => nav('/login')}
            className="hidden sm:block text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] px-2.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => nav('/signup')}
            className="rounded-full bg-[var(--cream)] px-4 py-2 text-xs font-medium text-[var(--ink)] hover:bg-white transition colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            Get started
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--cream)] md:hidden transition cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--line)] bg-[#050505] px-6 py-4 space-y-1">
          {[
            { label: 'How it works', action: () => nav('/how-it-works') },
            { label: '01 · You', action: () => scrollToLayer('layer-01') },
            { label: '02 · People', action: () => scrollToLayer('layer-02') },
            { label: '03 · Whole System', action: () => scrollToLayer('layer-03') },
            { label: 'Pricing', action: () => nav('/pricing') },
            { label: 'FAQ', action: () => nav('/faq') },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="block w-full text-left py-2.5 text-sm text-[var(--muted)] hover:text-[var(--cream)] transition cursor-pointer border-b border-white/[0.04] last:border-0"
            >
              {label}
            </button>
          ))}
          <div className="flex gap-3 pt-3">
            <button onClick={() => nav('/login')} className="flex-1 rounded-lg border border-white/10 py-2.5 text-xs font-medium text-[var(--cream)] hover:bg-white/5 transition cursor-pointer">Sign in</button>
            <button onClick={() => nav('/signup')} className="flex-1 rounded-lg bg-[var(--cream)] py-2.5 text-xs font-medium text-[var(--ink)] hover:bg-white transition cursor-pointer">Get started</button>
          </div>
        </div>
      )}
    </header>
  );
}

function PageFrame({
  title,
  onBack,
  children
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="page-noise relative min-h-screen bg-[#000000] text-[var(--cream)] overflow-x-hidden">
      <div className="stage-glow" />
      <Header />
      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-10 md:px-8 md:pt-16">
        <button 
          onClick={onBack} 
          className="mb-8 font-mono text-[10px] text-[var(--muted)] hover:text-[var(--cream)] transition flex items-center gap-2 uppercase tracking-widest cursor-pointer"
        >
          <ArrowUp className="h-3 w-3 rotate-90" /> Back to Home
        </button>
        <h1 className="font-display text-4xl md:text-6xl text-[var(--cream)] tracking-tight mb-12">
          {title}
        </h1>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}

function InfoPage({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="How Sovereign Works" onBack={onBack}>
      <div className="space-y-16">
        {[
          { label: '01', title: 'Start with you', body: 'Sovereign begins with your Baseline: a private reference built around you that captures how you think, decide, communicate, connect, and respond under pressure.' },
          { label: '02', title: 'Bring real situations', body: 'Ask in ordinary language about decisions, relationships, or recurring patterns. Sovereign grounds its response in your personal reference rather than delivering generic chatbot replies.' },
          { label: '03', title: 'Understand what happens between people', body: 'Add people you choose to include to examine relational dynamics without collapsing two distinct perspectives into one.' },
          { label: '04', title: 'See the whole system', body: 'Families, teams, and groups have patterns that no single person created alone. Sovereign illuminates the wider system while keeping individual contexts intact.' },
        ].map((item) => (
          <div key={item.label} className="grid gap-6 border-t border-white/10 pt-12 md:grid-cols-[100px_1fr]">
            <div className="font-mono text-xs text-[var(--sage)] tracking-widest">{item.label}</div>
            <div className="space-y-4">
              <h2 className="font-display text-3xl text-[var(--cream)] leading-tight">{item.title}</h2>
              <p className="max-w-2xl text-base text-[var(--muted)] leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}

        <div id="support" className="glass-border p-8 mt-20 space-y-6">
          <h3 className="font-display text-2xl text-[var(--cream)]">Support Sovereign.OS from $1.</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Separate from subscriptions. Support is voluntary and does not change Free or Sovereign+ access. Contributions use a secure one-time amount from $1.
          </p>
          <a
            href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-white px-6 py-3 text-xs font-medium text-black hover:bg-neutral-200 transition cursor-pointer"
          >
            Make a voluntary support contribution →
          </a>
        </div>
      </div>
    </PageFrame>
  );
}

function Pricing({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="Pricing" onBack={onBack}>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="glass-border p-8 sm:p-10 space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">Standard</span>
              <div className="mt-2 font-display text-4xl text-[var(--cream)]">Free ($0)</div>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              A private Baseline and a focused way to start using Sovereign.
            </p>
            <div className="space-y-3 text-xs text-[var(--cream)]/90 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> Private personal Baseline
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> Today thinking surface
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> 10 AI turns / month
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> Strict architectural privacy
              </div>
            </div>
          </div>
          <button onClick={() => go('/signup')} className="w-full rounded-xl border border-white/20 py-3 text-xs font-medium text-[var(--cream)] hover:bg-white/5 transition cursor-pointer">
            Start Free
          </button>
        </div>

        <div className="glass-border-strong p-8 sm:p-10 space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-[var(--sage)] uppercase tracking-widest">Sovereign+</span>
                <div className="mt-2 font-display text-4xl text-[var(--cream)]">$20 / month</div>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--sage)]" />
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Room for deeper personal exploration, relational intelligence, and systems.
            </p>
            <div className="space-y-3 text-xs text-[var(--cream)]/90 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> Everything in Free
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> 300 AI turns / month
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> People & relational dynamic comparisons
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> Multi-participant system mapping
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3 w-3 text-[var(--sage)]" /> Extended library retention
              </div>
            </div>
          </div>
          <button onClick={() => go('/signup')} className="w-full rounded-xl bg-[var(--cream)] py-3 text-xs font-medium text-[var(--ink)] hover:bg-white transition cursor-pointer shadow-lg">
            Start Sovereign+
          </button>
        </div>
      </div>

      <div className="glass-border p-8 mt-16 space-y-4">
        <h4 className="font-display text-xl text-[var(--cream)]">Support Sovereign.OS</h4>
        <p className="font-explanation text-xs text-[var(--muted)] leading-relaxed">
          Support is separate from a subscription. Support does not unlock paid features or change your account access. One-time amount from $1.
        </p>
        <a
          href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl border border-white/20 px-6 py-3 text-xs text-[var(--cream)] hover:bg-white/5 transition cursor-pointer"
        >
          Voluntary Contribution Link →
        </a>
      </div>
    </PageFrame>
  );
}

function FAQ({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="Frequently Asked Questions" onBack={onBack}>
      <div className="max-w-3xl space-y-4">
        {[
          [
            'What is Sovereign?',
            'A private personal AI environment for understanding yourself, your relationships, your decisions, and the systems around you.'
          ],
          [
            'What is a Baseline?',
            'A private reference built around you that gives Sovereign consistent context when it helps answer a question, instead of starting from scratch each time.'
          ],
          [
            'Does Sovereign know what another person feels or intends?',
            'No. Sovereign can work with consented information about another person, but it does not claim access to private motives, exact emotions, or hidden intentions.'
          ],
          [
            'Can I support Sovereign.OS without subscribing?',
            'Yes. Voluntary support does not unlock paid features or change your plan. It is a separate one-time contribution and is not presented as tax-deductible.'
          ]
        ].map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/20 cursor-pointer">
            <summary className="flex items-center justify-between gap-4 font-display text-lg text-[var(--cream)] list-none">
              {q}
              <ChevronDown className="h-4 w-4 text-[var(--subtle)] transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="font-explanation text-sm text-[var(--muted)] leading-relaxed">{a}</p>
            </div>
          </details>
        ))}
      </div>
    </PageFrame>
  );
}

function LegalPage({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <PageFrame title={title} onBack={onBack}>
      <div className="max-w-3xl glass-border p-8 sm:p-12 space-y-6">
        <p className="font-mono text-[10px] text-[var(--subtle)] uppercase tracking-widest">
          EFFECTIVE DATE: AUGUST 17, 2026
        </p>
        <div className="space-y-6 font-explanation text-sm leading-relaxed text-[var(--muted)]">
          <p>
            Sovereign is built with strict data isolation: your raw birth date, exact coordinates, and private notes are stored strictly for your Baseline and never enter language-model prompt context.
          </p>
          <p>
            Conversations and responses remain private to your authenticated account. Consented sharing with other accounts requires explicit approval for each participant.
          </p>
          <p>
            Sovereign does not sell personal information or train public artificial intelligence models on your private data.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
