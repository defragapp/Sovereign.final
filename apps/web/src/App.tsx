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
          <SovereignMark size={26} className="transition-transform group-hover:scale-110 text-white" />
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
  subtitle,
  onBack,
  children
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-8 md:px-8">
      <button 
        onClick={onBack} 
        className="mb-8 font-mono text-[10px] text-[var(--sage,#9fbaa1)] hover:text-white transition inline-flex items-center gap-2 uppercase tracking-widest cursor-pointer"
      >
        <ArrowUp className="h-3 w-3 -rotate-90" /> Back to Home
      </button>
      <div className="text-center space-y-4 mb-16">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#fafafa] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-xs text-white/50 tracking-wide uppercase">
            {subtitle}
          </p>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function LegalPage({ title, onBack }: { title: string; onBack: () => void }) {
  const isPrivacy = title.toLowerCase().includes('privacy');

  return (
    <PageFrame
      title={title}
      subtitle="Last Updated: August 17, 2026"
      onBack={onBack}
    >
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a]/80 p-8 sm:p-12 space-y-10 shadow-2xl">
        <div className="space-y-3 border-b border-white/10 pb-8">
          <h2 className="font-display text-2xl text-white">Contact Us</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            If you have questions about this policy or account preferences, contact support directly through your Sovereign account settings.
          </p>
        </div>

        {isPrivacy ? (
          <>
            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Introduction</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Sovereign.OS is committed to protecting your privacy. This Privacy Policy explains how we store, process, and safeguard your personal information when you use our personal intelligence platform.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Information We Collect</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Sovereign operates with strict data isolation boundaries:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-white/70 leading-relaxed pl-2">
                <li><strong className="text-white">Account Information:</strong> Email address, optional profile name, and passkey/session identifiers.</li>
                <li><strong className="text-white">Baseline Data:</strong> Private personal references, birth parameters, and context profiles stored strictly for your account.</li>
                <li><strong className="text-white">Interaction Context:</strong> Conversation threads and relational comparison inputs.</li>
                <li><strong className="text-white">Technical Metadata:</strong> Authenticated token signatures, session security timestamps, and standard audit logs.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Data Protection & Architectural Isolation</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Raw birth parameters, exact coordinates, and private notes remain encrypted and isolated in database storage. They are never exposed in raw prompt text to external foundation models. Conversations and responses remain strictly private to your authenticated session.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Your Rights & Control</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                You maintain complete ownership of your data. You may review, export, or permanently delete your account, Baseline context, and saved conversations at any time through account settings.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Acceptance of Terms</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                By accessing or using Sovereign.OS, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the platform.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Service Description</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Sovereign provides personal AI capabilities, relational dynamic comparisons, and system mapping. Sovereign is designed as a tool for personal inquiry, decision reflection, and self-understanding. It does not provide medical treatment, therapeutic diagnosis, or legally binding advice.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">User Accounts & Eligibility</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                You must be 18 years of age or older to register an account independently. You are responsible for maintaining the security of your authentication credentials and passkeys.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl text-white">Acceptable Use</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-white/70 leading-relaxed pl-2">
                <li>Use the service to harm, harass, or impersonate others.</li>
                <li>Attempt to reverse-engineer or bypass data isolation security controls.</li>
                <li>Use automated systems to extract private user data without authorization.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </PageFrame>
  );
}
