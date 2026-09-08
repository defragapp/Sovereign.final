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
   FRAMER MINDWAVE GLOBAL NAVBAR
   ========================================================================= */
export function FramerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (path: Route) => {
    setMobileOpen(false);
    go(path);
  };

  const scrollToSection = (id: string) => {
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

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-8 max-w-7xl mx-auto pointer-events-none">
      <div className="pointer-events-auto relative rounded-2xl border border-white/10 bg-[#0a0a0a]/90 px-6 py-3.5 shadow-2xl transition-all duration-300 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <button
          onClick={() => nav('/')}
          className="flex items-center gap-3 cursor-pointer group"
          aria-label="Sovereign.OS Home"
        >
          <img
            src="https://framerusercontent.com/images/0O5v3itGAnPaIlNYp2Dtalj5s.png"
            alt="Sovereign Logo"
            className="w-8 h-8 rounded-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="font-display text-xl tracking-tight text-[#fafafa]">
            Sovereign.OS
          </span>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => nav('/how-it-works')}
            className="text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Explore
          </button>
          <button
            onClick={() => nav('/pricing')}
            className="text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => nav('/faq')}
            className="text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => nav('/login')}
            className="text-xs font-medium text-white/80 hover:text-white px-3 py-2 transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => nav('/signup')}
            className="relative group overflow-hidden rounded-xl bg-gradient-to-b from-[#262626] to-[#171717] px-4 py-2 text-xs font-medium text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Enter Sovereign.OS
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-amber-500/20 via-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition cursor-pointer"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden mt-2 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-6 space-y-3 shadow-2xl">
          <button
            onClick={() => nav('/how-it-works')}
            className="block w-full text-left py-2 text-xs text-white/80 hover:text-white transition cursor-pointer border-b border-white/5"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-xs text-white/80 hover:text-white transition cursor-pointer border-b border-white/5"
          >
            Explore
          </button>
          <button
            onClick={() => nav('/pricing')}
            className="block w-full text-left py-2 text-xs text-white/80 hover:text-white transition cursor-pointer border-b border-white/5"
          >
            Pricing
          </button>
          <button
            onClick={() => nav('/faq')}
            className="block w-full text-left py-2 text-xs text-white/80 hover:text-white transition cursor-pointer border-b border-white/5"
          >
            FAQ
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => nav('/login')}
              className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-medium text-white hover:bg-white/5 transition cursor-pointer text-center"
            >
              Sign in
            </button>
            <button
              onClick={() => nav('/signup')}
              className="w-full rounded-xl bg-gradient-to-b from-[#262626] to-[#171717] border border-white/20 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition cursor-pointer text-center shadow-lg"
            >
              Enter Sovereign.OS
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================================
   FRAMER MINDWAVE GLOBAL FOOTER
   ========================================================================= */
export function FramerFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a] text-[#fafafa] py-16 px-6 sm:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://framerusercontent.com/images/0O5v3itGAnPaIlNYp2Dtalj5s.png"
              alt="Sovereign Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-display text-2xl tracking-tight text-white">
              Sovereign.OS
            </span>
          </div>
          <p className="text-xs text-white/60 max-w-sm leading-relaxed">
            Private personal intelligence for real life. Understand yourself, your relationships, and the systems around you.
          </p>
          <div className="text-[10px] text-white/40 font-mono">
            © 2026 Sovereign.OS · All rights reserved.
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--sage,#9fbaa1)]">
            Platform
          </h4>
          <ul className="space-y-2 text-xs text-white/70">
            <li>
              <button onClick={() => go('/how-it-works')} className="hover:text-white transition cursor-pointer">
                How It Works
              </button>
            </li>
            <li>
              <button onClick={() => go('/pricing')} className="hover:text-white transition cursor-pointer">
                Pricing
              </button>
            </li>
            <li>
              <button onClick={() => go('/faq')} className="hover:text-white transition cursor-pointer">
                FAQ
              </button>
            </li>
            <li>
              <button onClick={() => go('/login')} className="hover:text-white transition cursor-pointer">
                Sign In
              </button>
            </li>
            <li>
              <button onClick={() => go('/signup')} className="hover:text-white transition cursor-pointer">
                Create Account
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Support Column */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--sage,#9fbaa1)]">
            Legal & Support
          </h4>
          <ul className="space-y-2 text-xs text-white/70">
            <li>
              <button onClick={() => go('/privacy')} className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => go('/terms')} className="hover:text-white transition cursor-pointer">
                Terms of Service
              </button>
            </li>
            <li>
              <a
                href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition cursor-pointer flex items-center gap-1.5"
              >
                Voluntary Support Contribution →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   FRAMER MINDWAVE GLOBAL LAYOUT SHELL
   ========================================================================= */
export function FramerLayoutShell({ children, showFooter = true }: { children: ReactNode; showFooter?: boolean }) {
  return (
    <div className="framer-mindwave-root relative min-h-screen bg-[#000000] text-[#f4f0e8] overflow-x-hidden page-noise">
      <div className="stage-glow" />
      <FramerNavbar />
      <main className="relative z-10 pt-6">{children}</main>
      {showFooter && <FramerFooter />}
    </div>
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
    return (
      <FramerLayoutShell showFooter={false}>
        <Auth mode="login" />
      </FramerLayoutShell>
    );
  }

  if (route === '/app') {
    return (
      <FramerLayoutShell showFooter={false}>
        <SovereignIntelligenceWorkspace />
      </FramerLayoutShell>
    );
  }

  if (route === '/onboarding') {
    return (
      <FramerLayoutShell>
        <PlanOnboarding />
      </FramerLayoutShell>
    );
  }

  if (route === '/auth/redeem') {
    return (
      <FramerLayoutShell>
        <Redeem />
      </FramerLayoutShell>
    );
  }

  if (route === '/login' || route === '/signup') {
    return (
      <FramerLayoutShell>
        <Auth mode={route.slice(1) as 'login' | 'signup'} />
      </FramerLayoutShell>
    );
  }

  if (route === '/how-it-works') {
    return <PublicLanding targetSection="process" />;
  }

  if (route === '/pricing') {
    return <PublicLanding targetSection="pricing" />;
  }

  if (route === '/faq') {
    return <PublicLanding targetSection="faq" />;
  }

  if (route === '/terms') {
    return (
      <FramerLayoutShell>
        <LegalPage title="Terms of Service" onBack={() => go('/')} />
      </FramerLayoutShell>
    );
  }

  if (route === '/privacy') {
    return (
      <FramerLayoutShell>
        <LegalPage title="Privacy Policy" onBack={() => go('/')} />
      </FramerLayoutShell>
    );
  }

  if (isAppDomain) {
    return (
      <FramerLayoutShell showFooter={false}>
        <Auth mode="login" />
      </FramerLayoutShell>
    );
  }

  return <PublicLanding />;
}

/* =========================================================================
   PAGE FRAME & SUB-PAGES WRAPPED IN FRAMER MINDWAVE DESIGN SYSTEM
   ========================================================================= */
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
    <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-6 md:px-8">
      <button 
        onClick={onBack} 
        className="mb-8 font-mono text-[10px] text-[var(--sage,#9fbaa1)] hover:text-white transition flex items-center gap-2 uppercase tracking-widest cursor-pointer"
      >
        <ArrowUp className="h-3 w-3 rotate-90" /> Back to Home
      </button>
      <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight mb-12">
        {title}
      </h1>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function InfoPage({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="How Sovereign Works" onBack={onBack}>
      <div className="space-y-12">
        {[
          { label: '01', title: 'Start with you', body: 'Sovereign begins with your Baseline: a private reference built around you that captures how you think, decide, communicate, connect, and respond under pressure.' },
          { label: '02', title: 'Bring real situations', body: 'Ask in ordinary language about decisions, relationships, or recurring patterns. Sovereign grounds its response in your personal reference rather than delivering generic chatbot replies.' },
          { label: '03', title: 'Understand what happens between people', body: 'Add people you choose to include to examine relational dynamics without collapsing two distinct perspectives into one.' },
          { label: '04', title: 'See the whole system', body: 'Families, teams, and groups have patterns that no single person created alone. Sovereign illuminates the wider system while keeping individual contexts intact.' },
        ].map((item) => (
          <div key={item.label} className="glass-border p-8 rounded-3xl space-y-4 transition-all duration-300 hover:border-white/20">
            <div className="font-mono text-xs text-[var(--sage,#9fbaa1)] tracking-widest">{item.label}</div>
            <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">{item.title}</h2>
            <p className="max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">{item.body}</p>
          </div>
        ))}

        <div id="support" className="glass-border p-8 rounded-3xl mt-12 space-y-6">
          <h3 className="font-display text-2xl text-white">Support Sovereign.OS from .</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Separate from subscriptions. Support is voluntary and does not change Free or Sovereign+ access. Contributions use a secure one-time amount from .
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
        <div className="glass-border p-8 sm:p-10 rounded-3xl space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest">Standard</span>
              <div className="mt-2 font-display text-4xl text-white">Free (zsh)</div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              A private Baseline and a focused way to start using Sovereign.
            </p>
            <div className="space-y-3 text-xs text-white/90 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> Private personal Baseline
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> Today thinking surface
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> 10 AI turns / month
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> Strict architectural privacy
              </div>
            </div>
          </div>
          <button onClick={() => go('/signup')} className="w-full rounded-xl border border-white/20 py-3 text-xs font-medium text-white hover:bg-white/5 transition cursor-pointer">
            Start Free
          </button>
        </div>

        <div className="glass-border-strong p-8 sm:p-10 rounded-3xl space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-[var(--sage,#9fbaa1)] uppercase tracking-widest">Sovereign+</span>
                <div className="mt-2 font-display text-4xl text-white"> / month</div>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--sage,#9fbaa1)]" />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Room for deeper personal exploration, relational intelligence, and systems.
            </p>
            <div className="space-y-3 text-xs text-white/90 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> Everything in Free
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> 300 AI turns / month
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> People & relational dynamic comparisons
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> Multi-participant system mapping
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-3.5 w-3.5 text-[var(--sage,#9fbaa1)]" /> Extended library retention
              </div>
            </div>
          </div>
          <button onClick={() => go('/signup')} className="w-full rounded-xl bg-white py-3 text-xs font-medium text-black hover:bg-neutral-200 transition cursor-pointer shadow-lg font-semibold">
            Start Sovereign+
          </button>
        </div>
      </div>

      <div className="glass-border p-8 rounded-3xl mt-12 space-y-4">
        <h4 className="font-display text-xl text-white">Support Sovereign.OS</h4>
        <p className="text-xs text-white/70 leading-relaxed">
          Support is separate from a subscription. Support does not unlock paid features or change your account access. One-time amount from .
        </p>
        <a
          href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl border border-white/20 px-6 py-3 text-xs text-white hover:bg-white/5 transition cursor-pointer"
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
            <summary className="flex items-center justify-between gap-4 font-display text-lg text-white list-none">
              {q}
              <ChevronDown className="h-4 w-4 text-white/50 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-white/70 leading-relaxed">{a}</p>
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
      <div className="max-w-3xl glass-border p-8 sm:p-12 rounded-3xl space-y-6">
        <p className="font-mono text-[10px] text-[var(--sage,#9fbaa1)] uppercase tracking-widest">
          EFFECTIVE DATE: AUGUST 17, 2026
        </p>
        <div className="space-y-6 text-sm leading-relaxed text-white/70">
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
