import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Layers,
  Loader2,
  LogOut,
  Plus,
  Sliders,
  Sparkles,
  User,
  Users,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Accordion, type AccordionItem } from '@/components/Accordion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { AmbientMesh } from '@/components/ui/AmbientMesh';
import { ContextScroller, type NarrativeBlock } from '@/components/ui/ContextScroller';
import {
  checkSession,
  requestSignup,
  requestLogin,
  redeemAuth,
  logout,
  getBaselineStatus,
  submitBaseline,
  getAccountOnboarding,
  completeAccountOnboarding,
  getEntitlements,
  sendThreadMessage,
  submitCorrection,
  type AuthSession,
  type BaselineStatus,
  type Entitlements,
  type SovereignAnswerV2,
  type BasisRegistryItem
} from '@/lib/api';

type Route =
  | '/'
  | '/how-it-works'
  | '/pricing'
  | '/faq'
  | '/terms'
  | '/privacy'
  | '/login'
  | '/signup'
  | '/auth/redeem'
  | '/onboarding'
  | '/app';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  answer?: SovereignAnswerV2;
  basis?: BasisRegistryItem[];
  feedbackGiven?: 'yes' | 'partly' | 'not_today';
}

function currentRoute(): Route {
  const path = window.location.pathname;
  if (path.startsWith('/auth/redeem')) return '/auth/redeem';
  const known: Route[] = [
    '/',
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
  return known.includes(path as Route) ? (path as Route) : '/';
}

function go(path: Route) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

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
   THE REFERENCE FIELD (Spatial Motif)
   ========================================================================= */
export function ReferenceField({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="w-full h-full text-[var(--line-strong)] opacity-40" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="200" y1="20" x2="200" y2="220" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="60" y1="120" x2="340" y2="120" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="200" y1="50" x2="110" y2="120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="200" y1="50" x2="290" y2="120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="110" y1="120" x2="200" y2="190" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="290" y1="120" x2="200" y2="190" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
        
        <circle cx="200" cy="50" r="3" fill="var(--cream)" />
        <circle cx="110" cy="120" r="3" fill="var(--cream)" />
        <circle cx="290" cy="120" r="3" fill="var(--cream)" />
        <circle cx="200" cy="190" r="3" fill="var(--cream)" />
        <circle cx="200" cy="120" r="4.5" stroke="var(--cream)" strokeWidth="1" fill="var(--ink)" />
      </svg>
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

  if (route === '/app') return <Workspace />;
  if (route === '/onboarding') return <Onboarding />;
  if (route === '/auth/redeem') return <Redeem />;
  if (route === '/login' || route === '/signup') return <Auth mode={route.slice(1) as 'login' | 'signup'} />;
  if (route === '/how-it-works') return <InfoPage onBack={() => go('/')} />;
  if (route === '/pricing') return <Pricing onBack={() => go('/')} />;
  if (route === '/faq') return <FAQ onBack={() => go('/')} />;
  if (route === '/terms') return <LegalPage title="Terms of Service" onBack={() => go('/')} />;
  if (route === '/privacy') return <LegalPage title="Privacy Policy" onBack={() => go('/')} />;
  return <Landing />;
}

/* =========================================================================
   PUBLIC HEADER
   ========================================================================= */
/* =========================================================================
   PUBLIC HEADER
   ========================================================================= */
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[var(--ink)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
        <button aria-label="Sovereign home" onClick={() => go('/')} className="flex items-center gap-2.5 group shrink-0">
          <SovereignMark size={20} className="transition-transform group-hover:scale-105" />
          <span className="text-sm font-medium tracking-tight text-[var(--cream)]">Sovereign.OS</span>
        </button>
        <nav className="hidden items-center gap-12 md:flex">
          <button onClick={() => go('/how-it-works')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors">How it works</button>
          <button onClick={() => go('/pricing')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors">Pricing</button>
          <button onClick={() => go('/faq')} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] transition-colors">FAQ</button>
        </nav>
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => go('/login')}
            className="text-xs font-medium text-[var(--muted)] hover:text-[var(--cream)] px-2.5 py-1.5 transition-colors whitespace-nowrap"
          >
            Sign in
          </button>
          <button
            onClick={() => go('/signup')}
            className="rounded-full bg-[var(--cream)] px-4 py-2 text-xs font-medium text-[var(--ink)] hover:bg-white transition-colors whitespace-nowrap shadow-sm"
          >
            Build Your Baseline
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================================
   PUBLIC LANDING PAGE — SOVEREIGN.OS NARRATIVE PROGRESSION
   ========================================================================= */
function Landing() {
  const heroView = useInView({ threshold: 0.1 });
  const previewView = useInView({ threshold: 0.1 });
  const engineView = useInView({ threshold: 0.1 });
  const pricingView = useInView({ threshold: 0.1 });
  const finalView = useInView({ threshold: 0.1 });

  const baselineAccordionItems: AccordionItem[] = [
    {
      id: 'overthinking',
      question: 'Why do I keep overthinking what to say when I feel misunderstood?',
      observation: 'Your Baseline requires reflective processing before articulation. When you feel misunderstood, you instinctively draft multiple speech variants in real time to prevent incorrect perceptions.',
      pattern: 'Over-refinement is an attempt to manage the other party\'s internal reaction before they have finished processing.',
      shift: 'Separate the observation from the resolution. Name the disconnect cleanly, pause the conversation, and return only when your internal clarity stabilizes.'
    },
    {
      id: 'boundaries',
      question: 'How can I set a clear boundary without causing avoidable tension?',
      observation: 'Your communication tendency defaults to softening statements under relational pressure, which can obscure the boundary line.',
      pattern: 'Conflating clarity with aggression leads you to overexplain your reasons, inviting debate on the condition rather than securing the boundary.',
      shift: 'State the boundary in one declarative sentence. Allow the silence after the statement without rushing to reassure.'
    },
    {
      id: 'pressure',
      question: 'Why do I take on full responsibility when group expectations collapse?',
      observation: 'Under group stress, your Baseline activates early overfunctioning as an internal stabilizer.',
      pattern: 'Absorbing unassigned responsibility protects the team pace short-term but creates structural resentment long-term.',
      shift: 'Pause before stepping into vacant execution roles. Distinguish between your commitment and the group\'s system mechanics.'
    }
  ];

  const narrativeBlocks: NarrativeBlock[] = [
    {
      id: 'self',
      tag: '01 / SELF',
      title: 'Personal Baseline',
      subtitle: 'Clarity on your own mechanics.',
      body: 'Stop second-guessing your instincts. See your blind spots, trace your decision loops, and understand why you hit recurring walls.',
      accordionItems: baselineAccordionItems
    },
    {
      id: 'people',
      tag: '02 / PEOPLE',
      title: 'Relational Inquiry',
      subtitle: 'Map the friction.',
      body: 'Compare your Baseline against a partner, colleague, or collaborator. Expose the structural root of recurring miscommunications without assigning blame.',
      sampleCard: {
        headerTag: 'RELATIONAL OVERLAY',
        headerTitle: 'PAIR MECHANICS',
        headline: 'Direct Speech vs. Reflective Processing',
        body: "When Partner A demands immediate resolution during tension, Partner B's Baseline shifts into withdrawal to process. This sequence creates an escalating pursuit loop unrelated to love or commitment."
      }
    },
    {
      id: 'systems',
      tag: '03 / SYSTEMS',
      title: 'System Dynamics',
      subtitle: 'Expose the invisible tension.',
      body: 'Map group dynamics across teams, families, and co-founders. Understand who drives, who absorbs pressure, and where execution breaks down.',
      sampleCard: {
        headerTag: 'SYSTEM MAP',
        headerTitle: 'EXECUTIVE TEAM',
        headline: 'Unassigned Pressure Concentration',
        body: 'When strategic goals are ambiguous, systemic pressure concentrates on team members with high responsibility baselines, causing bottlenecking before operational milestones are missed.'
      }
    }
  ];

  return (
    <div className="page-noise relative min-h-screen bg-[var(--platform-bg)] text-[var(--cream)] overflow-x-hidden">
      {/* 0. AMBIENT MESH BACKGROUND */}
      <AmbientMesh />

      <Header />

      <main className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 pb-32 space-y-24 sm:space-y-32">
        {/* 1. HERO */}
        <section
          ref={heroView.ref}
          data-visible={heroView.isInView}
          className="landing-hero pt-20 sm:pt-28 text-center animate-fade-up"
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md px-4 py-1.5 text-[11px] font-medium text-[var(--muted)] mb-10 tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sage)]" />
              <span>PRIVATE PERSONAL AI</span>
            </div>

            <h1
              className="text-editorial text-4xl sm:text-6xl md:text-7xl text-[var(--cream)] leading-[1.06]"
              style={{ fontFamily: 'var(--serif-primary)' }}
            >
              Know yourself.<br />
              Understand your relationships.<br />
              See the whole system.
            </h1>

            <p className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed mt-6">
              Sovereign is private AI built on your Baseline. It does not give generic advice. It uses your unique mechanics to decode decisions, navigate relationship friction, and expose unseen dynamics in groups.
            </p>

            <div className="flex flex-row items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => go('/signup')}
                className="bg-white text-black px-8 py-3.5 rounded-full font-medium shadow-lg transition-colors hover:bg-neutral-100 cursor-pointer"
              >
                Build Your Baseline
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => go('/how-it-works')}
                className="border border-white/20 text-white/70 px-8 py-3.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                How it works
              </motion.button>
            </div>
          </div>
        </section>

        {/* 2. DEMONSTRATION UI OUTPUT (WORKSPACE CARD) */}
        <section
          ref={previewView.ref}
          data-visible={previewView.isInView}
          className="mt-24 py-4 animate-fade-up"
        >
          <GlassPanel className="p-6 sm:p-10 space-y-6">
            {/* Inquiry Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <span className="font-utility text-[10px] text-[var(--subtle)]">INQUIRY</span>
                <p className="font-statement text-base sm:text-xl text-[var(--cream)] font-medium">
                  &ldquo;Why do I keep overthinking what to say when I feel misunderstood?&rdquo;
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-utility text-[var(--sage)] shrink-0 hidden sm:inline-block">
                BASELINE GROUNDED
              </span>
            </div>

            {/* Structured Sovereign Answer v2 */}
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="font-utility text-[10px] text-[var(--sage)]">GROUNDED OBSERVATION</span>
                <p className="font-explanation text-sm sm:text-base text-[var(--cream)]/90 leading-relaxed">
                  Your Baseline requires reflective processing before articulation. When you feel misunderstood, you instinctively draft multiple speech variants in real time to prevent incorrect perceptions.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-5">
                <span className="font-utility text-[10px] text-[var(--sage)]">THE STRUCTURAL PATTERN</span>
                <p className="font-explanation text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  Over-refinement is an attempt to manage the other party&apos;s internal reaction before they have finished processing.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-5">
                <span className="font-utility text-[10px] text-[var(--sage)]">THE SHIFT</span>
                <p className="font-explanation text-sm sm:text-base text-[var(--cream)] font-medium leading-relaxed">
                  Separate the observation from the resolution. Name the disconnect cleanly, pause the conversation, and return only when your internal clarity stabilizes.
                </p>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* 3. THE ENGINE (THE BASELINE PITCH) */}
        <section
          ref={engineView.ref}
          data-visible={engineView.isInView}
          className="border-t border-white/5 pt-20 sm:pt-24 text-center animate-fade-up"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="font-utility text-[10px] text-[var(--sage)] tracking-widest uppercase">THE BASELINE ENGINE</span>
            <h2 className="text-editorial text-3xl sm:text-5xl text-[var(--cream)] leading-tight">
              Context that doesn&apos;t reset.
            </h2>
            <p className="font-explanation text-base sm:text-lg text-[var(--muted)] leading-relaxed">
              Most AI starts from zero every time you open a tab. Sovereign doesn&apos;t. Your Baseline is a secure, living reference of how you process pressure, communicate under stress, and make decisions. Every inquiry is grounded in your exact mechanics.
            </p>
          </div>
        </section>

        {/* 4. CONTEXT SCROLLER (THREE-TIER NARRATIVE ARCHITECTURE) */}
        <section className="border-t border-white/5 pt-12 sm:pt-16">
          <ContextScroller blocks={narrativeBlocks} />
        </section>

        {/* 5. ACCESS & PRICING */}
        <section
          ref={pricingView.ref}
          data-visible={pricingView.isInView}
          className="border-t border-white/5 pt-20 sm:pt-24 animate-fade-up"
        >
          <div className="max-w-xl">
            <span className="font-utility text-[10px] text-[var(--sage)] tracking-widest uppercase">ACCESS & PRICING</span>
            <h2 className="text-editorial text-3xl sm:text-4xl text-[var(--cream)] mt-3">
              Simple, transparent access.
            </h2>
            <p className="mt-3 font-explanation text-sm sm:text-base text-[var(--muted)]">
              Start with your private Baseline at no cost. Add depth when you are ready to examine relationships and whole systems.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <GlassPanel className="p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="font-utility text-xs text-[var(--muted)]">STANDARD</span>
                  <div className="mt-2 text-editorial text-3xl text-[var(--cream)]">Free ($0)</div>
                </div>
                <p className="font-explanation text-xs sm:text-sm text-[var(--muted)]">
                  A private Baseline and a quiet way to begin asking questions.
                </p>
                <div className="space-y-2 font-explanation text-xs text-[var(--cream)]/90 pt-2 border-t border-white/5">
                  <div>— Private personal Baseline</div>
                  <div>— Today thinking environment</div>
                  <div>— 10 AI turns per month</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => go('/signup')}
                className="w-full rounded-xl border border-white/10 py-3 text-xs font-medium text-[var(--cream)] hover:bg-white/5 transition-colors cursor-pointer"
              >
                Start Free
              </motion.button>
            </GlassPanel>

            <GlassPanel className="p-7 flex flex-col justify-between space-y-6 border-t border-white/20 bg-white/[0.045]">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-utility text-xs text-[var(--sage)]">SOVEREIGN+</span>
                    <div className="mt-2 text-editorial text-3xl text-[var(--cream)]">$20 / mo</div>
                  </div>
                  <Sparkles className="h-5 w-5 text-[var(--sage)]" />
                </div>
                <p className="font-explanation text-xs sm:text-sm text-[var(--muted)]">
                  Room for deeper personal exploration, relational intelligence, and systems.
                </p>
                <div className="space-y-2 font-explanation text-xs text-[var(--cream)]/90 pt-2 border-t border-white/5">
                  <div>— Everything in Free</div>
                  <div>— 300 AI turns per month</div>
                  <div>— Relational inquiry & system dynamics</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => go('/signup')}
                className="w-full rounded-xl bg-white py-3 text-xs font-medium text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Start Sovereign+
              </motion.button>
            </GlassPanel>
          </div>
        </section>

        {/* 6. FINAL ACTION */}
        <section
          ref={finalView.ref}
          data-visible={finalView.isInView}
          className="border-t border-white/5 pt-24 text-center animate-fade-up"
        >
          <div className="max-w-xl mx-auto space-y-8">
            <SovereignMark size={32} className="mx-auto text-[var(--cream)]" />
            <h2 className="text-editorial text-3xl sm:text-5xl text-[var(--cream)] leading-tight">
              Know yourself.<br />
              Understand your relationships.<br />
              See the whole system.
            </h2>
            <p className="font-explanation text-base text-[var(--muted)] max-w-md mx-auto">
              Establish your private reference in under two minutes.
            </p>
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => go('/signup')}
                className="bg-white text-black px-8 py-3.5 rounded-full font-medium shadow-lg hover:bg-neutral-100 transition-all cursor-pointer"
              >
                Build Your Baseline
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-10 text-xs text-[var(--subtle)]">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SovereignMark size={14} />
            <span className="font-medium text-[var(--muted)]">Sovereign.OS</span>
          </div>
          <div className="flex gap-6 font-utility text-[10px]">
            <button onClick={() => go('/terms')} className="hover:text-[var(--cream)] transition-colors cursor-pointer">Terms</button>
            <button onClick={() => go('/privacy')} className="hover:text-[var(--cream)] transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => go('/pricing')} className="hover:text-[var(--cream)] transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => go('/faq')} className="hover:text-[var(--cream)] transition-colors cursor-pointer">FAQ</button>
          </div>
          <div className="font-explanation">© {new Date().getFullYear()} Sovereign.OS. Private personal AI.</div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   AUTHENTICATION — SIGNUP / LOGIN
   ========================================================================= */
function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        await requestSignup(email, name);
      } else {
        await requestLogin(email);
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await redeemAuth({ email, code: code.trim() });
      if (res.next) go(res.next as Route);
      else go('/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Code redemption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-noise flex min-h-screen items-center justify-center px-6 py-12 bg-[var(--ink)] text-[var(--cream)]">
      <div className="w-full max-w-md">
        <button onClick={() => go('/')} className="mx-auto mb-8 flex items-center gap-2.5 group">
          <SovereignMark size={20} className="transition-transform group-hover:scale-105" />
          <span className="text-sm font-medium tracking-tight">Sovereign</span>
        </button>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 md:p-9 shadow-xl">
          <h1 className="font-statement text-2xl text-[var(--cream)]">
            {isSignup ? 'Create your Sovereign account' : 'Sign in to Sovereign'}
          </h1>
          <p className="mt-2 font-explanation text-sm">
            {isSignup
              ? 'Start with a private account. Your Baseline comes next.'
              : 'Sign in with your email address.'}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {!sent ? (
            <form className="mt-6 space-y-4" onSubmit={handleRequest}>
              {isSignup && (
                <div>
                  <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Your Name</label>
                  <Input
                    placeholder="First and last name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[var(--line)] bg-[var(--surface-2)] text-sm rounded-lg"
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Email Address</label>
                <Input
                  placeholder="you@domain.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[var(--line)] bg-[var(--surface-2)] text-sm rounded-lg"
                />
              </div>

              {isSignup && (
                <div className="space-y-2.5 pt-2 text-xs text-[var(--muted)]">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 rounded border-[var(--line)] bg-transparent" />
                    <span>I confirm I am 18 years of age or older.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 rounded border-[var(--line)] bg-transparent" />
                    <span>
                      I agree to the{' '}
                      <button type="button" onClick={() => go('/terms')} className="underline text-[var(--cream)]">Terms</button>
                      {' '}and{' '}
                      <button type="button" onClick={() => go('/privacy')} className="underline text-[var(--cream)]">Privacy Policy</button>.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-lg bg-[var(--cream)] py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-white transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? 'Continue' : 'Send sign-in link'}
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-xs text-[var(--muted)]">
                <p className="font-medium text-[var(--cream)] text-sm">Link and code sent</p>
                <p className="mt-1">
                  We sent a private sign-in link to <span className="text-[var(--cream)]">{email}</span>. Check your inbox or enter the 6-digit code below.
                </p>
              </div>
              <form className="space-y-3" onSubmit={handleVerifyCode}>
                <label className="block font-utility text-[11px] text-[var(--subtle)]">6-digit verification code</label>
                <Input
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center font-mono text-lg tracking-widest border-[var(--line)] bg-[var(--surface-2)] rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || code.trim().length < 6}
                  className="w-full rounded-lg bg-[var(--cream)] py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-white transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm & Open'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="w-full text-center text-xs text-[var(--subtle)] hover:text-[var(--cream)]"
              >
                Use a different email address
              </button>
            </div>
          )}

          <div className="mt-7 border-t border-[var(--line)] pt-4 text-xs font-explanation text-center text-[var(--subtle)]">
            Your account stays private. Sovereign uses the context you choose to provide to build your personal reference.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   REDEEM AUTH
   ========================================================================= */
function Redeem() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing redemption token in URL.');
      return;
    }
    redeemAuth({ token })
      .then((res) => {
        setStatus('success');
        if (res.next) go(res.next as Route);
        else go('/app');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Invalid or expired token.');
      });
  }, []);

  return (
    <div className="page-noise flex min-h-screen items-center justify-center px-6 bg-[var(--ink)] text-[var(--cream)]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center space-y-4">
        {status === 'loading' && (
          <div className="space-y-3">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-[var(--sage)]" />
            <h2 className="font-statement text-base">Opening your private session...</h2>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <h2 className="font-statement text-base text-red-400">Unable to redeem link</h2>
            <p className="font-explanation text-xs">{errorMessage}</p>
            <Button onClick={() => go('/login')} className="w-full">Back to sign in</Button>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-3">
            <Check className="mx-auto h-7 w-7 text-[var(--sage)]" />
            <h2 className="font-statement text-base">Session authenticated</h2>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   ONBOARDING — BASELINE INTAKE & TIER SELECTION
   ========================================================================= */
function Onboarding() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [baselineStatus, setBaselineStatus] = useState<BaselineStatus | null>(null);
  const [step, setStep] = useState<'loading' | 'intake' | 'computing' | 'plan' | 'done'>('loading');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthplace, setBirthplace] = useState('San Francisco, CA, US');
  const [birthTimezone, setBirthTimezone] = useState(
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles' : 'America/Los_Angeles'
  );
  const [birthTimeCertainty, setBirthTimeCertainty] = useState<'exact' | 'approximate' | 'unknown'>('approximate');
  const [birthTime, setBirthTime] = useState('12:00');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'sovereign_plus'>('free');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSession().then(async (user) => {
      if (!user) {
        go('/login');
        return;
      }
      setSession(user);
      try {
        const bl = await getBaselineStatus();
        setBaselineStatus(bl);
        if (bl.ready) {
          const acct = await getAccountOnboarding();
          if (acct.completed) {
            go('/app');
          } else {
            setStep('plan');
          }
        } else {
          setStep('intake');
        }
      } catch {
        setStep('intake');
      }
    });
  }, []);

  const handleBaselineSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitBaseline({
        birthDate,
        birthplace,
        birthTimezone,
        birthTimeCertainty,
        birthTime: birthTimeCertainty !== 'unknown' ? birthTime : undefined
      });
      setStep('computing');
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts += 1;
        try {
          const status = await getBaselineStatus();
          setBaselineStatus(status);
          if (status.ready || attempts > 15) {
            clearInterval(interval);
            setLoading(false);
            setStep('plan');
          }
        } catch {
          if (attempts > 10) {
            clearInterval(interval);
            setLoading(false);
            setStep('plan');
          }
        }
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Baseline establishment failed');
      setLoading(false);
    }
  };

  const handlePlanSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await completeAccountOnboarding(selectedPlan);
      go('/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Plan onboarding failed');
      setLoading(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ink)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--sage)]" />
      </div>
    );
  }

  return (
    <div className="page-noise min-h-screen bg-[var(--ink)] text-[var(--cream)] px-6 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2.5">
            <SovereignMark size={18} />
            <span className="text-sm font-medium tracking-tight">Sovereign</span>
          </div>
          {session && (
            <span className="font-utility text-[10px] text-[var(--subtle)]">Account: {session.accountId.slice(0, 8)}</span>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {step === 'intake' && (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 md:p-9 shadow-xl">
            <p className="font-utility text-[var(--sage)]">STEP 1 OF 2</p>
            <h1 className="mt-2 font-statement text-2xl md:text-3xl text-[var(--cream)]">
              Let&apos;s build your Baseline.
            </h1>
            <p className="mt-2 font-explanation text-sm">
              This becomes the private reference Sovereign uses to understand your context. Your birth details stay private to you and are never shared with AI model providers or used to train models.
            </p>

            <form onSubmit={handleBaselineSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Birth Date</label>
                <Input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="border-[var(--line)] bg-[var(--surface-2)] text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Birthplace (City, State/Country)</label>
                <Input
                  placeholder="e.g. San Francisco, California, US"
                  required
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                  className="border-[var(--line)] bg-[var(--surface-2)] text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Birthplace Timezone</label>
                <Input
                  placeholder="e.g. America/Los_Angeles"
                  required
                  value={birthTimezone}
                  onChange={(e) => setBirthTimezone(e.target.value)}
                  className="border-[var(--line)] bg-[var(--surface-2)] text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Time Certainty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['exact', 'approximate', 'unknown'] as const).map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => setBirthTimeCertainty(cert)}
                      className={`rounded-lg border py-2 text-xs capitalize transition ${
                        birthTimeCertainty === cert
                          ? 'border-[var(--cream)] bg-[var(--surface-2)] text-[var(--cream)]'
                          : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              {birthTimeCertainty !== 'unknown' && (
                <div>
                  <label className="mb-1.5 block font-utility text-[11px] text-[var(--subtle)]">Birth Time (24h)</label>
                  <Input
                    type="time"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="border-[var(--line)] bg-[var(--surface-2)] text-sm rounded-lg"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-lg bg-[var(--cream)] py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-white transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Establish Baseline'}
              </button>
            </form>
          </div>
        )}

        {step === 'computing' && (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-10 text-center space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--sage)]" />
            <h2 className="font-statement text-xl text-[var(--cream)]">Computing your private Baseline</h2>
            <p className="font-explanation text-xs max-w-sm mx-auto">
              {baselineStatus?.message || 'Reducing astronomical coordinates into grounded personal themes...'}
            </p>
          </div>
        )}

        {step === 'plan' && (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 md:p-9 shadow-xl">
            <div className="flex items-center gap-2 font-utility text-[11px] text-[var(--sage)]">
              <Check className="h-4 w-4" />
              <span>BASELINE ESTABLISHED</span>
            </div>
            <h1 className="mt-2 font-statement text-2xl md:text-3xl text-[var(--cream)]">
              Choose your launch tier
            </h1>
            <p className="mt-2 font-explanation text-sm">
              Both tiers include your private Baseline and authenticated personal workspace.
            </p>

            <div className="mt-6 space-y-3">
              <div
                onClick={() => setSelectedPlan('free')}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  selectedPlan === 'free'
                    ? 'border-[var(--cream)] bg-[var(--surface-2)]'
                    : 'border-[var(--line)] hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-utility text-[10px] text-[var(--muted)]">STANDARD</span>
                    <h3 className="font-statement text-base text-[var(--cream)]">Free Tier ($0)</h3>
                  </div>
                  <span className="font-utility text-xs text-[var(--cream)]">10 turns / mo</span>
                </div>
                <p className="mt-1 font-explanation text-xs">Private Baseline, Today surface, grounded Sovereign answers.</p>
              </div>

              <div
                onClick={() => setSelectedPlan('sovereign_plus')}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  selectedPlan === 'sovereign_plus'
                    ? 'border-[var(--cream)] bg-[var(--surface-2)]'
                    : 'border-[var(--line)] hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-utility text-[10px] text-[var(--sage)]">UNLIMITED DEPTH</span>
                    <h3 className="font-statement text-base text-[var(--cream)]">Sovereign+ ($20 / mo)</h3>
                  </div>
                  <span className="font-utility text-xs text-[var(--cream)]">300 turns / mo</span>
                </div>
                <p className="mt-1 font-explanation text-xs">People comparisons, multi-participant systems, and extended library retention.</p>
              </div>
            </div>

            <button
              onClick={handlePlanSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-[var(--cream)] py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-white transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enter Sovereign Workspace'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   AUTHENTICATED WORKSPACE — WRITING & THINKING ENVIRONMENT
   ========================================================================= */
type WorkspaceTab = 'today' | 'explore' | 'people' | 'systems' | 'library' | 'you';
// Choose what this connection may use.
function Workspace() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [baseline, setBaseline] = useState<BaselineStatus | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('today');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [threadId] = useState(() => `t_${crypto.randomUUID().slice(0, 12)}`);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // People view state
  const [people, setPeople] = useState<{ id: string; name: string; relation: string; note: string }[]>([
    { id: 'p1', name: 'Partner', relation: 'Spouse / Partner', note: 'Opposing coping style under pressure; seeks connection when I need space.' }
  ]);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);

  useEffect(() => {
    checkSession().then(async (user) => {
      if (!user) {
        go('/login');
        return;
      }
      setSession(user);
      try {
        const [bl, ent] = await Promise.all([getBaselineStatus(), getEntitlements()]);
        setBaseline(bl);
        setEntitlements(ent);
        if (!bl.ready) {
          go('/onboarding');
        }
      } catch {
        // Fallback for fresh sessions
      }
    });
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setErrorBanner(null);
    const userMsgId = `m_${crypto.randomUUID()}`;
    const assistantPlaceholderId = `m_${crypto.randomUUID()}`;
    const userMsg: ChatMessage = { id: userMsgId, role: 'user', text };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    const idempotencyKey = `turn_${crypto.randomUUID()}`;

    try {
      const response = await sendThreadMessage(threadId, text, idempotencyKey);
      const assistantMsg: ChatMessage = {
        id: assistantPlaceholderId,
        role: 'assistant',
        text: response.text,
        answer: response.answer,
        basis: response.basis
      };
      setMessages((prev) => [...prev, assistantMsg]);
      getEntitlements().then(setEntitlements).catch(() => {});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Turn request failed';
      setErrorBanner(msg);
    } finally {
      setSending(false);
    }
  };

  const handleFeedback = async (messageId: string, choice: 'yes' | 'partly' | 'not_today') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedbackGiven: choice } : m))
    );
    try {
      await submitCorrection(threadId, choice);
    } catch {
      // Ignored non-fatal feedback error
    }
  };

  const handleAddPerson = (e: FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    setPeople((prev) => [
      ...prev,
      {
        id: `p_${Date.now()}`,
        name: newPersonName.trim(),
        relation: newPersonRelation.trim() || 'Collaborator',
        note: 'Added for distinct relational examination without collapsing perspectives.'
      }
    ]);
    setNewPersonName('');
    setNewPersonRelation('');
    setShowAddPerson(false);
  };

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--cream)] flex flex-col md:flex-row">
      {/* NAVIGATION RAIL */}
      <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-[var(--line)] bg-[var(--surface)] flex flex-row md:flex-col justify-between p-4 md:p-6 z-20">
        <div className="space-y-6 w-full">
          <div className="flex items-center justify-between">
            <button onClick={() => go('/')} className="flex items-center gap-2.5 group">
              <SovereignMark size={20} className="transition-transform group-hover:scale-105" />
              <span className="text-[15px] font-medium tracking-tight">Sovereign</span>
            </button>
            <span className="font-utility text-[9px] text-[var(--sage)] md:hidden">
              {entitlements?.plan === 'free' ? 'Free' : 'Sovereign+'}
            </span>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {[
              { id: 'today', label: 'Today', icon: Compass },
              { id: 'explore', label: 'Explore', icon: Sliders },
              { id: 'people', label: 'People', icon: Users },
              { id: 'systems', label: 'Systems', icon: Layers },
              { id: 'library', label: 'Library', icon: BookOpen },
              { id: 'you', label: 'You', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition ${
                    isActive
                      ? 'bg-[var(--surface-2)] text-[var(--cream)] font-medium border border-[var(--line)]'
                      : 'text-[var(--muted)] hover:text-[var(--cream)] hover:bg-[var(--surface-2)]/50'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:block pt-6 border-t border-[var(--line)] space-y-3">
          {entitlements && (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-[11px] text-[var(--muted)]">
              <div className="flex justify-between font-utility text-[9px]">
                <span className="text-[var(--sage)]">{entitlements.plan === 'free' ? 'FREE PLAN' : 'SOVEREIGN+'}</span>
                <span>{entitlements.aiTurnsRemaining !== undefined ? `${entitlements.aiTurnsRemaining} left` : 'Active'}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="font-utility text-[10px] text-[var(--subtle)]">PRIVATE SESSION</span>
            <button
              onClick={async () => {
                await logout();
                go('/');
              }}
              className="text-[var(--subtle)] hover:text-[var(--cream)] transition p-1"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-[calc(100svh-60px)] md:min-h-screen bg-[var(--ink)]">
        {errorBanner && (
          <div className="mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {errorBanner}
          </div>
        )}

        {/* TODAY VIEW (Primary conversation & thinking surface) */}
        {activeTab === 'today' && (
          <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-8">
            <div className="flex-1">
              {messages.length === 0 ? (
                <div className="flex min-h-[55vh] flex-col justify-center relative">
                  <ReferenceField className="absolute -right-20 -top-10 w-96 h-64 opacity-20" />
                  <div className="relative z-10 space-y-3">
                    <p className="font-utility text-[var(--sage)]">TODAY</p>
                    <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
                      What would you like to understand?
                    </h1>
                    <p className="font-explanation text-sm max-w-lg">
                      Ask in ordinary language. Sovereign answers from your private Baseline, surfaces active dynamics, and keeps unknowns explicit.
                    </p>

                    <div className="mt-8 space-y-2 pt-2">
                      <span className="font-utility text-[10px] text-[var(--subtle)]">OR START WITH A SITUATION:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Why do I keep overthinking what to say?',
                          'Why does this conversation keep going the same way?',
                          'What am I missing about what is happening between us?',
                          'How should I approach this decision?'
                        ].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setInput(q)}
                            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-left text-xs text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--cream)] transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-36">
                  {messages.map((message) =>
                    message.role === 'user' ? (
                      <div
                        key={message.id}
                        className="ml-auto max-w-[85%] rounded-xl bg-[var(--surface-2)] border border-[var(--line)] px-4 py-3 text-sm leading-relaxed text-[var(--cream)]"
                      >
                        {message.text}
                      </div>
                    ) : (
                      <article key={message.id} className="space-y-4">
                        {message.answer ? (
                          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8 space-y-5">
                            <div className="flex items-center justify-between font-utility text-[10px] text-[var(--subtle)]">
                              <span className="text-[var(--sage)] flex items-center gap-1.5">
                                <SovereignMark size={12} />
                                <span>GROUNDED REFERENCE</span>
                              </span>
                              <span className="text-[var(--subtle)]">PRIVATE</span>
                            </div>

                            <h2 className="font-statement text-xl md:text-2xl text-[var(--cream)]">
                              {message.answer.headline}
                            </h2>

                            <div className="font-explanation text-sm md:text-[15px] leading-relaxed">
                              <p>{message.answer.direct_answer}</p>
                            </div>

                            {message.answer.sections && message.answer.sections.length > 0 && (
                              <div className="space-y-2.5 border-t border-[var(--line)] pt-4">
                                {message.answer.sections.map((sec) => (
                                  <div key={sec.id} className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-1">
                                    <div className="font-utility text-[9px] text-[var(--subtle)] uppercase tracking-wider">{sec.label}</div>
                                    <div className="font-explanation text-xs leading-relaxed text-[var(--cream)]">{sec.body}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {message.basis && message.basis.length > 0 && (
                              <div className="border-t border-[var(--line)] pt-3 flex flex-wrap items-center gap-1.5">
                                <span className="font-utility text-[9px] text-[var(--subtle)] mr-1">Sources:</span>
                                {message.basis.map((b) => (
                                  <span key={b.id} className="font-utility text-[10px] rounded-md border border-[var(--line)] bg-[#0c0c0b] px-2 py-0.5 text-[var(--muted)]">
                                    {b.display}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="border-t border-[var(--line)] pt-4 flex items-center justify-between text-xs text-[var(--subtle)]">
                              <span>{message.answer.correction_prompt || 'Does this match today?'}</span>
                              {!message.feedbackGiven ? (
                                <div className="flex gap-2">
                                  {(['yes', 'partly', 'not_today'] as const).map((choice) => (
                                    <button
                                      key={choice}
                                      onClick={() => handleFeedback(message.id, choice)}
                                      className="rounded border border-[var(--line)] px-2 py-0.5 text-xs hover:border-[var(--line-strong)] hover:text-[var(--cream)] capitalize"
                                    >
                                      {choice.replace('_', ' ')}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[var(--sage)]">Recorded: {message.feedbackGiven.replace('_', ' ')}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 font-explanation text-sm leading-relaxed">
                            {message.text}
                          </div>
                        )}
                      </article>
                    )
                  )}

                  {sending && (
                    <div className="flex items-center gap-2 text-xs text-[var(--subtle)] pt-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sovereign is synthesizing your answer...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* INPUT BOX */}
            <div className="sticky bottom-4 pt-2">
              <div className="rounded-xl border border-[var(--line-strong)] bg-[#111110]/95 p-2 backdrop-blur shadow-2xl">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Ask Sovereign about your life..."
                    className="min-h-12 border-0 bg-transparent px-2 py-2 shadow-none focus:ring-0 text-sm text-[var(--cream)]"
                    disabled={sending}
                  />
                  <Button size="sm" aria-label="Send" onClick={send} disabled={sending || !input.trim()}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
                Private by default · Model context is restricted to consenting data
              </div>
            </div>
          </div>
        )}

        {/* PEOPLE VIEW */}
        {activeTab === 'people' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
            <div>
              <p className="font-utility text-[var(--sage)] mb-2">PEOPLE</p>
              <h1 className="font-statement text-3xl text-[var(--cream)]">
                Understand what happens between people.
              </h1>
              <p className="mt-3 font-explanation text-sm">
                Add people you choose to include and explore conversations, patterns, and situations without collapsing two distinct perspectives into one.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-utility text-[11px] text-[var(--subtle)]">INCLUDED PEOPLE ({people.length})</span>
                <button
                  onClick={() => setShowAddPerson(!showAddPerson)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--cream)] hover:border-[var(--line-strong)] transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add someone</span>
                </button>
              </div>

              {showAddPerson && (
                <form onSubmit={handleAddPerson} className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-5 space-y-3">
                  <div className="font-statement text-sm text-[var(--cream)]">Add someone to your context</div>
                  <Input
                    placeholder="Name or identifier (e.g. Alex, Manager, Partner)"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    required
                    className="border-[var(--line)] bg-[var(--surface)] text-sm rounded-lg"
                  />
                  <Input
                    placeholder="Relational role (e.g. Partner, Colleague, Co-founder)"
                    value={newPersonRelation}
                    onChange={(e) => setNewPersonRelation(e.target.value)}
                    className="border-[var(--line)] bg-[var(--surface)] text-sm rounded-lg"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={() => setShowAddPerson(false)} className="px-3 py-1.5 text-xs text-[var(--muted)]">Cancel</button>
                    <button type="submit" className="rounded-lg bg-[var(--cream)] px-3.5 py-1.5 text-xs font-medium text-[var(--ink)]">Add person</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {people.map((person) => (
                  <div key={person.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-statement text-base text-[var(--cream)]">{person.name}</div>
                      <span className="font-utility text-[10px] text-[var(--sage)]">{person.relation}</span>
                    </div>
                    <p className="font-explanation text-xs text-[var(--muted)]">{person.note}</p>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setActiveTab('today');
                          setInput(`What is happening between me and ${person.name} in our conversations?`);
                        }}
                        className="rounded border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]"
                      >
                        Examine dynamic →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SYSTEMS VIEW */}
        {activeTab === 'systems' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
            <div>
              <p className="font-utility text-[var(--sage)] mb-2">SYSTEMS</p>
              <h1 className="font-statement text-3xl text-[var(--cream)]">
                See the whole system.
              </h1>
              <p className="mt-3 font-explanation text-sm">
                Examine group dynamics and recurring patterns across families, teams, and partnerships without collapsing everyone into one story.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center space-y-4">
              <ReferenceField className="mx-auto w-80 h-48 opacity-30" />
              <div className="font-statement text-lg text-[var(--cream)]">Interconnected Relational Dynamics</div>
              <p className="font-explanation text-xs max-w-md mx-auto">
                When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
              </p>
              <button
                onClick={() => {
                  setActiveTab('today');
                  setInput('What is the recurring pattern in our team meetings when decisions stall?');
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-xs text-[var(--cream)] hover:border-[var(--line-strong)]"
              >
                <span>Ask about a system dynamic</span>
                <ArrowUp className="h-3.5 w-3.5 rotate-45" />
              </button>
            </div>
          </div>
        )}

        {/* EXPLORE VIEW */}
        {activeTab === 'explore' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
            <div>
              <p className="font-utility text-[var(--sage)] mb-2">EXPLORE</p>
              <h1 className="font-statement text-3xl text-[var(--cream)]">
                Explore recurring patterns.
              </h1>
              <p className="mt-3 font-explanation text-sm">
                Examine how you tend to think, decide, communicate, connect, and respond under pressure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Decision Making', q: 'How does my Baseline evaluate risk when deadlines accelerate?' },
                { title: 'Communication Under Stress', q: 'Why do I become overly precise when feeling criticized?' },
                { title: 'Momentum & Energy', q: 'Where does my focus naturally sustain without burnout?' },
                { title: 'Boundaries & Trust', q: 'How do I balance autonomy with intimate connection?' }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
                  <div className="font-utility text-[10px] text-[var(--sage)]">{item.title}</div>
                  <div className="font-statement text-sm text-[var(--cream)]">{item.q}</div>
                  <button
                    onClick={() => {
                      setActiveTab('today');
                      setInput(item.q);
                    }}
                    className="pt-2 text-xs text-[var(--muted)] hover:text-[var(--cream)] underline inline-block"
                  >
                    Explore this pattern →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIBRARY VIEW */}
        {activeTab === 'library' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
            <div>
              <p className="font-utility text-[var(--sage)] mb-2">LIBRARY</p>
              <h1 className="font-statement text-3xl text-[var(--cream)]">
                Your saved references.
              </h1>
              <p className="mt-3 font-explanation text-sm">
                Active threads are scheduled for 30-day deletion under private retention; saved notes and core themes remain in your private library.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-statement text-sm text-[var(--cream)]">Current Active Thread</span>
                <span className="font-utility text-[10px] text-[var(--subtle)]">30-DAY RETENTION ACTIVE</span>
              </div>
              <p className="font-explanation text-xs text-[var(--muted)]">
                Thread ID: <span className="font-mono">{threadId}</span> · Started today
              </p>
              <div className="text-xs text-[var(--subtle)]">
                Messages: {messages.length} · Privacy policy enforced
              </div>
            </div>
          </div>
        )}

        {/* YOU / BASELINE VIEW */}
        {activeTab === 'you' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
            <div>
              <p className="font-utility text-[var(--sage)] mb-2">YOU</p>
              <h1 className="font-statement text-3xl text-[var(--cream)]">
                A private reference built around you.
              </h1>
              <p className="mt-3 font-explanation text-sm">
                It gives Sovereign context for how you tend to operate, carried quietly into your conversations.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div className="flex items-center gap-2">
                  <SovereignMark size={16} />
                  <span className="font-statement text-sm text-[var(--cream)]">Baseline Reference Status</span>
                </div>
                <span className="font-utility text-[10px] text-[var(--sage)]">
                  {baseline?.ready ? 'GROUNDED & ACTIVE' : 'INITIALIZING'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Cognitive Framing', value: 'Precision / Structural' },
                  { label: 'Decision Rhythm', value: 'Values Alignment First' },
                  { label: 'Communication Tone', value: 'Direct / Nuanced' },
                  { label: 'Generative Momentum', value: 'Autonomous Flow' },
                  { label: 'Relational Trust', value: 'Deliberate Bonding' },
                  { label: 'Friction Response', value: 'Internal Reflection' }
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3 space-y-1">
                    <div className="font-utility text-[9px] text-[var(--subtle)]">{item.label}</div>
                    <div className="font-statement text-xs text-[var(--cream)]">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--line)] pt-4 text-xs font-explanation text-[var(--subtle)]">
                Raw birth coordinates remain sealed. Sovereign uses this interpretive context — not as a box you have to fit into.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================================
   PUBLIC INFORMATION PAGES (HOW IT WORKS, PRICING, FAQ, LEGAL)
   ========================================================================= */
function InfoPage({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="How Sovereign Works" onBack={onBack}>
      <div className="space-y-12">
        <InfoSection
          label="01"
          title="Start with you"
          body="Sovereign begins with your Baseline: a private reference built around you that captures how you think, decide, communicate, connect, and respond under pressure."
        />
        <InfoSection
          label="02"
          title="Bring real situations"
          body="Ask in ordinary language about decisions, relationships, or recurring patterns. Sovereign grounds its response in your personal reference rather than delivering generic chatbot replies."
        />
        <InfoSection
          label="03"
          title="Understand what happens between people"
          body="Add people you choose to include to examine relational dynamics without collapsing two distinct perspectives into one."
        />
        <InfoSection
          label="04"
          title="See the whole system"
          body="Families, teams, and groups have patterns that no single person created alone. Sovereign illuminates the wider system while keeping individual contexts intact."
        />

        <div id="support" className="border-t border-[var(--line)] pt-8 mt-12 space-y-3">
          <h3 className="font-statement text-xl text-[var(--cream)]">Support Sovereign.OS from $1.</h3>
          <p className="font-explanation text-xs text-[var(--muted)]">
            Separate from subscriptions. Support is voluntary and does not change Free or Sovereign+ access. Contributions use a secure one-time amount from $1.
          </p>
          <div className="flex gap-4 text-xs text-[var(--subtle)]">
            <span>$10 suggested</span>
            <span>$25 suggested</span>
          </div>
          <a
            href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg border border-[var(--line)] px-4 py-2 text-xs text-[var(--cream)] hover:border-[var(--line-strong)]"
          >
            Make a voluntary support contribution →
          </a>
        </div>
      </div>
    </PageFrame>
  );
}

function InfoSection({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="grid gap-3 border-t border-[var(--line)] pt-7 md:grid-cols-[80px_1fr]">
      <div className="font-utility text-xs text-[var(--sage)]">{label}</div>
      <div>
        <h2 className="font-statement text-2xl text-[var(--cream)]">{title}</h2>
        <p className="mt-3 max-w-2xl font-explanation text-[15px] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Pricing({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="Pricing" onBack={onBack}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-6">
          <div>
            <div className="font-utility text-xs text-[var(--muted)]">STANDARD</div>
            <div className="mt-2 font-statement text-3xl text-[var(--cream)]">Free ($0)</div>
          </div>
          <p className="font-explanation text-sm">A private Baseline and a focused way to start using Sovereign.</p>
          <div className="space-y-2.5 font-explanation text-xs">
            <div>— Private personal Baseline</div>
            <div>— Today thinking surface</div>
            <div>— 10 AI turns / month</div>
            <div>— Strict architectural privacy</div>
          </div>
          <button onClick={() => go('/signup')} className="w-full rounded-lg border border-[var(--line)] py-2.5 text-xs text-[var(--cream)] hover:border-[var(--line-strong)]">
            Start Free
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-utility text-xs text-[var(--sage)]">SOVEREIGN+</div>
              <div className="mt-2 font-statement text-3xl text-[var(--cream)]">$20 / month</div>
            </div>
            <Sparkles className="h-5 w-5 text-[var(--sage)]" />
          </div>
          <p className="font-explanation text-sm">Room for deeper personal exploration, relational intelligence, and systems.</p>
          <div className="space-y-2.5 font-explanation text-xs">
            <div>— Everything in Free</div>
            <div>— 300 AI turns / month</div>
            <div>— People & relational dynamic comparisons</div>
            <div>— Multi-participant system mapping</div>
            <div>— Extended library retention</div>
          </div>
          <button onClick={() => go('/signup')} className="w-full rounded-lg bg-[var(--cream)] py-2.5 text-xs font-medium text-[var(--ink)] hover:bg-white">
            Start Sovereign+
          </button>
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3">
        <h4 className="font-statement text-base text-[var(--cream)]">Support Sovereign.OS</h4>
        <p className="font-explanation text-xs text-[var(--muted)]">
          Support is separate from a subscription. Support does not unlock paid features or change your account access. One-time amount from $1.
        </p>
        <a
          href="https://donate.stripe.com/dRm6oG61T2KSaAhdjO67S02"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg border border-[var(--line)] px-4 py-2 text-xs text-[var(--cream)] hover:border-[var(--line-strong)]"
        >
          Voluntary Contribution Link
        </a>
      </div>
    </PageFrame>
  );
}

function FAQ({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="Frequently Asked Questions" onBack={onBack}>
      <div className="max-w-3xl divide-y divide-[var(--line)]">
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
          <details key={q} className="py-6 group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-statement text-lg text-[var(--cream)]">
              {q}
              <ChevronDown className="h-4 w-4 text-[var(--subtle)] transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-4 font-explanation text-sm max-w-2xl">{a}</p>
          </details>
        ))}
      </div>
    </PageFrame>
  );
}

function LegalPage({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <PageFrame title={title} onBack={onBack}>
      <div className="max-w-3xl space-y-6 font-explanation text-sm leading-relaxed text-[var(--muted)]">
        <p className="font-utility text-xs text-[var(--subtle)]">EFFECTIVE DATE: AUGUST 17, 2026</p>
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
    </PageFrame>
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
    <div className="page-noise min-h-screen bg-[var(--ink)] text-[var(--cream)]">
      <Header />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-10 md:px-8 md:pt-16">
        <button onClick={onBack} className="mb-8 font-utility text-xs text-[var(--muted)] hover:text-[var(--cream)] transition">
          ← Back
        </button>
        <h1 className="font-display text-4xl md:text-6xl text-[var(--cream)]">{title}</h1>
        <div className="mt-12">{children}</div>
      </main>
    </div>
  );
}
