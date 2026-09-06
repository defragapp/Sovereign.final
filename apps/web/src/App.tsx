import { useEffect, useState, useId, type ReactNode, type FormEvent } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  Sparkles,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  if (route === '/how-it-works') return <InfoPage title="How it works" onBack={() => go('/')} />;
  if (route === '/pricing') return <Pricing onBack={() => go('/')} />;
  if (route === '/faq') return <FAQ onBack={() => go('/')} />;
  if (route === '/terms') return <LegalPage title="Terms of Service" onBack={() => go('/')} />;
  if (route === '/privacy') return <LegalPage title="Privacy Policy" onBack={() => go('/')} />;
  return <Landing />;
}

function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8">
      <button aria-label="Sovereign home" onClick={() => go('/')} className="flex items-center gap-3">
        <span className="sovereign-mark" aria-hidden="true" />
        <span className="text-[15px] font-medium tracking-[-0.02em]">Sovereign</span>
      </button>
      <nav className="hidden items-center gap-1 md:flex">
        <NavLink href="/how-it-works" label="How it works" />
        <NavLink href="/pricing" label="Pricing" />
        <NavLink href="/faq" label="FAQ" />
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => go('/login')}>Sign in</Button>
        <Button size="sm" onClick={() => go('/signup')}>Get started</Button>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: Route; label: string }) {
  return (
    <button
      onClick={() => go(href)}
      className="rounded-full px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--cream)]"
    >
      {label}
    </button>
  );
}

function Landing() {
  return (
    <div className="page-noise min-h-screen bg-[var(--ink)]">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <section className="grid min-h-[calc(100svh-84px)] items-center gap-14 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--sage)]">Private personal AI for real life</p>
            <h1 className="text-balance text-5xl font-medium tracking-[-0.055em] leading-[0.97] md:text-7xl">
              Understand yourself.<br />Understand your people.<br />
              <span className="text-[var(--muted)]">See the whole system.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[var(--muted)] md:text-lg">
              Sovereign starts with a private Baseline, then helps you make sense of real questions, relationships, decisions, communication, pressure, and recurring patterns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => go('/signup')}>Get started</Button>
              <Button variant="secondary" size="lg" onClick={() => go('/how-it-works')}>See how it works</Button>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,#151513,#0f0f0e)] p-4 shadow-2xl shadow-black/30">
              <div className="rounded-[22px] border border-[var(--line)] bg-[#10100f] p-4 md:p-5">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[var(--cream)]">
                    <span className="sovereign-mark scale-75" />Sovereign
                  </div>
                  <span className="text-xs text-[var(--subtle)]">Private · Grounded</span>
                </div>
                <div className="ml-auto max-w-[82%] rounded-2xl bg-[var(--surface-2)] px-4 py-3 text-sm leading-6 text-[var(--cream)]">
                  Why do I keep overthinking what to say when I feel misunderstood?
                </div>
                <div className="mt-6 max-w-[92%] space-y-3 text-sm leading-6 text-[var(--muted)]">
                  <p className="font-medium text-[var(--cream)]">Start with what is happening right now rather than treating the whole pattern as one collapse.</p>
                  <p>When communication feels misunderstood, your Baseline tends to seek immediate cognitive precision. Naming what you actually observed reduces the pressure to solve the other person&apos;s perception all at once.</p>
                  <div className="pt-2">
                    <button onClick={() => go('/signup')} className="inline-flex items-center gap-2 text-xs font-medium text-[var(--cream)] hover:underline">
                      <span>Begin your Baseline</span>
                      <ArrowUp className="h-3.5 w-3.5 rotate-45" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-[var(--line)] py-14">
          <div className="grid gap-8 md:grid-cols-3">
            <Capability title="Yourself" body="Explore how you think, decide, communicate, create, connect, respond under pressure, and grow." />
            <Capability title="Your people" body="Look at what happens between people without collapsing two distinct individuals into one narrative." />
            <Capability title="The whole system" body="Understand patterns across families, teams, groups, and other consented relationships." />
          </div>
        </section>
      </main>
    </div>
  );
}

function Capability({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-sm">
      <div className="mb-3 text-sm text-[var(--sage)]">{title}</div>
      <p className="text-[15px] leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

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
      if (res.next) {
        go(res.next as Route);
      } else {
        go('/app');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Code redemption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-noise flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <button onClick={() => go('/')} className="mx-auto mb-10 flex items-center gap-3">
          <span className="sovereign-mark" />
          <span className="text-sm font-medium">Sovereign</span>
        </button>
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <h1 className="text-2xl font-medium tracking-[-0.03em]">
            {isSignup ? 'Create your Sovereign account' : 'Sign in to Sovereign'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
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
            <form className="mt-7 space-y-4" onSubmit={handleRequest}>
              {isSignup && (
                <div>
                  <label className="mb-1 block text-xs text-[var(--subtle)]">Your Name</label>
                  <Input
                    placeholder="First and last name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs text-[var(--subtle)]">Email Address</label>
                <Input
                  placeholder="you@domain.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {isSignup && (
                <div className="space-y-2 pt-2 text-xs text-[var(--muted)]">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" required className="mt-0.5 rounded border-[var(--line)]" />
                    <span>I confirm I am 18 years of age or older.</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" required className="mt-0.5 rounded border-[var(--line)]" />
                    <span>
                      I agree to the{' '}
                      <button type="button" onClick={() => go('/terms')} className="underline hover:text-[var(--cream)]">
                        Terms
                      </button>{' '}
                      and{' '}
                      <button type="button" onClick={() => go('/privacy')} className="underline hover:text-[var(--cream)]">
                        Privacy Policy
                      </button>.
                    </span>
                  </label>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? 'Continue' : 'Send sign-in link'}
              </Button>
            </form>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
                <p className="font-medium text-[var(--cream)]">Link and code sent</p>
                <p className="mt-1 text-xs">
                  We sent a private sign-in link to <span className="text-[var(--cream)]">{email}</span>. Click the link in your email, or enter the 6-digit code below.
                </p>
              </div>
              <form className="space-y-3" onSubmit={handleVerifyCode}>
                <label className="block text-xs text-[var(--subtle)]">6-digit verification code</label>
                <Input
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center font-mono text-lg tracking-widest"
                  required
                />
                <Button type="submit" className="w-full" disabled={loading || code.trim().length < 6}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm & Open'}
                </Button>
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

          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--subtle)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--sage)]" />
            <span>Private account context stays private.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="page-noise flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--sage)]" />
            <h2 className="text-lg font-medium">Opening your private session...</h2>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-red-400">Unable to redeem link</h2>
            <p className="text-xs text-[var(--muted)]">{errorMessage}</p>
            <Button onClick={() => go('/login')} className="w-full">Back to sign in</Button>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-4">
            <Check className="mx-auto h-8 w-8 text-[var(--sage)]" />
            <h2 className="text-lg font-medium">Session authenticated</h2>
          </div>
        )}
      </div>
    </div>
  );
}

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
      // Poll baseline status
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
    <div className="page-noise min-h-screen bg-[var(--ink)] px-5 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="sovereign-mark" />
            <span className="text-sm font-medium">Sovereign Onboarding</span>
          </div>
          {session && (
            <span className="text-xs text-[var(--subtle)]">Account: {session.accountId.slice(0, 8)}...</span>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
            {error}
          </div>
        )}

        {step === 'intake' && (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--sage)]">Step 1 of 2</p>
            <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Establish your private Baseline</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Your raw birth details are computed strictly for your Baseline and never enter model prompt context.
            </p>

            <form onSubmit={handleBaselineSubmit} className="mt-7 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[var(--subtle)]">Birth Date</label>
                <Input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-[var(--subtle)]">Birthplace (City, State/Country)</label>
                <Input
                  placeholder="e.g. San Francisco, California, US"
                  required
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-[var(--subtle)]">Birthplace Timezone</label>
                <Input
                  placeholder="e.g. America/Los_Angeles"
                  required
                  value={birthTimezone}
                  onChange={(e) => setBirthTimezone(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-[var(--subtle)]">Time Certainty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['exact', 'approximate', 'unknown'] as const).map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => setBirthTimeCertainty(cert)}
                      className={`rounded-xl border py-2 text-xs capitalize transition ${
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
                  <label className="mb-1 block text-xs text-[var(--subtle)]">Birth Time (24h)</label>
                  <Input
                    type="time"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>
              )}

              <Button type="submit" className="mt-6 w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Establish Baseline'}
              </Button>
            </form>
          </div>
        )}

        {step === 'computing' && (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--sage)]" />
            <h2 className="mt-4 text-xl font-medium">Computing your private Baseline</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {baselineStatus?.message || 'Reducing astronomical coordinates into grounded personal themes...'}
            </p>
          </div>
        )}

        {step === 'plan' && (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs text-[var(--sage)]">
              <Check className="h-4 w-4" />
              <span>Baseline established</span>
            </div>
            <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Choose your launch tier</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Every tier includes your private Baseline and authenticated personal workspace.
            </p>

            <div className="mt-6 space-y-4">
              <div
                onClick={() => setSelectedPlan('free')}
                className={`cursor-pointer rounded-2xl border p-5 transition ${
                  selectedPlan === 'free'
                    ? 'border-[var(--cream)] bg-[var(--surface-2)]'
                    : 'border-[var(--line)] hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--sage)]">Standard</span>
                    <h3 className="text-lg font-medium">Free Tier ($0)</h3>
                  </div>
                  <span className="text-sm text-[var(--cream)]">10 AI turns / month</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                  Private Baseline, Today surface, grounded Sovereign answers.
                </p>
              </div>

              <div
                onClick={() => setSelectedPlan('sovereign_plus')}
                className={`cursor-pointer rounded-2xl border p-5 transition ${
                  selectedPlan === 'sovereign_plus'
                    ? 'border-[var(--cream)] bg-[var(--surface-2)]'
                    : 'border-[var(--line)] hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--sage)]">Unlimited Depth</span>
                    <h3 className="text-lg font-medium">Sovereign+ ($20 / month)</h3>
                  </div>
                  <span className="text-sm text-[var(--cream)]">300 AI turns / month</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                  People comparison, multi-participant systems, and extended library retention.
                </p>
              </div>
            </div>

            <Button onClick={handlePlanSubmit} className="mt-8 w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enter Sovereign Workspace'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Workspace() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [baseline, setBaseline] = useState<BaselineStatus | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [threadId] = useState(() => `t_${crypto.randomUUID().slice(0, 12)}`);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

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

      // Refresh entitlements
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

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      {/* Choose what this connection may use. */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[#0b0b0a]/90 px-4 backdrop-blur md:px-6">
        <button onClick={() => go('/')} className="flex items-center gap-3">
          <span className="sovereign-mark" />
          <span className="text-sm font-medium">Sovereign</span>
        </button>
        <div className="flex items-center gap-2 text-xs">
          {entitlements && (
            <span className="rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-[var(--muted)]">
              {entitlements.plan === 'free' ? 'Free' : 'Sovereign+'} ·{' '}
              {entitlements.aiTurnsRemaining !== undefined
                ? `${entitlements.aiTurnsRemaining} turns left`
                : 'Active'}
            </span>
          )}
          {baseline?.ready && (
            <span className="hidden items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-[var(--sage)] sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Baseline Grounded
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              go('/');
            }}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100svh-64px)] max-w-4xl flex-col px-4 md:px-8">
        {errorBanner && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {errorBanner}
          </div>
        )}

        <div className="flex-1 py-8 md:py-12">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col justify-center">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--sage)]">Private Workspace</p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.045em] md:text-5xl">
                What is happening in your life right now?
              </h1>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Ask in ordinary language. Sovereign answers from your private Baseline, surfaces active dynamics, and keeps unknowns explicit.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  'Why do I feel so reactive in this conversation?',
                  'How can I approach this difficult decision?',
                  'What part of my pattern is showing up right now?'
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(q)}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-left text-xs text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--cream)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-8">
              {messages.map((message) =>
                message.role === 'user' ? (
                  <div
                    key={message.id}
                    className="ml-auto max-w-[85%] rounded-2xl bg-[var(--surface-2)] px-4 py-3 text-sm leading-6 text-[var(--cream)]"
                  >
                    {message.text}
                  </div>
                ) : (
                  <article key={message.id} className="space-y-6">
                    {message.answer ? (
                      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <div className="flex items-center justify-between text-xs text-[var(--subtle)]">
                          <span className="font-mono uppercase tracking-wider text-[var(--sage)]">
                            {message.answer.mode}
                          </span>
                          <span className="capitalize">{message.answer.confidence}</span>
                        </div>

                        <h2 className="mt-3 text-xl font-medium tracking-[-0.02em] text-[var(--cream)]">
                          {message.answer.headline}
                        </h2>

                        <div className="mt-4 text-sm leading-7 text-[var(--muted)]">
                          <p>{message.answer.direct_answer}</p>
                        </div>

                        {message.answer.sections && message.answer.sections.length > 0 && (
                          <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-4">
                            {message.answer.sections.map((sec) => (
                              <div
                                key={sec.id}
                                className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4"
                              >
                                <div className="text-xs font-medium uppercase tracking-wider text-[var(--cream)]">
                                  {sec.label}
                                </div>
                                <div className="mt-2 text-xs leading-6 text-[var(--muted)]">
                                  {sec.body}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.basis && message.basis.length > 0 && (
                          <div className="mt-6 border-t border-[var(--line)] pt-4">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--subtle)]">
                              Grounded Basis
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {message.basis.map((b) => (
                                <span
                                  key={b.id}
                                  className="inline-flex items-center gap-1 rounded-md border border-[var(--line)] bg-[#0c0c0b] px-2 py-1 text-[11px] text-[var(--muted)]"
                                >
                                  <span>{b.display}</span>
                                  <span className="text-[9px] text-[var(--subtle)]">({b.uncertainty})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4 text-xs text-[var(--subtle)]">
                          <span>{message.answer.correction_prompt || 'Does this match today?'}</span>
                          {!message.feedbackGiven ? (
                            <div className="flex items-center gap-1.5">
                              {(['yes', 'partly', 'not_today'] as const).map((choice) => (
                                <button
                                  key={choice}
                                  type="button"
                                  onClick={() => handleFeedback(message.id, choice)}
                                  className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] hover:border-[var(--line-strong)] hover:text-[var(--cream)] capitalize"
                                >
                                  {choice.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--sage)]">
                              Feedback recorded: {message.feedbackGiven.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="answer-prose rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-sm leading-7 text-[var(--muted)]">
                        {message.text.split(/\n\n/).map((par, i) => (
                          <p key={i}>{par}</p>
                        ))}
                      </div>
                    )}
                  </article>
                )
              )}

              {sending && (
                <div className="flex items-center gap-2 text-xs text-[var(--subtle)]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Sovereign is synthesizing your answer...</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 pb-4 pt-2 md:pb-7">
          <div className="rounded-2xl border border-[var(--line-strong)] bg-[#111110]/95 p-2 backdrop-blur">
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
                className="min-h-12 border-0 bg-transparent px-2 py-2 shadow-none focus:ring-0 text-sm"
                disabled={sending}
              />
              <Button size="sm" aria-label="Send" onClick={send} disabled={sending || !input.trim()}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="mt-2 text-center text-[11px] text-[var(--subtle)]">
            Private by default · Model context is restricted to consenting data
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoPage({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <PageFrame title={title} onBack={onBack}>
      <div className="space-y-12">
        <InfoSection
          label="01"
          title="Start with you"
          body="Sovereign begins with a private Baseline: a consistent reference built around you."
        />
        <InfoSection
          label="02"
          title="Bring a real question"
          body="Ask in ordinary language. You do not need to know a framework or special terminology."
        />
        <InfoSection
          label="03"
          title="Add context when it matters"
          body="Your current situation, a person, or a wider group can be brought in when it is useful and consented."
        />
      </div>
    </PageFrame>
  );
}

function InfoSection({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="grid gap-3 border-t border-[var(--line)] pt-7 md:grid-cols-[80px_1fr]">
      <div className="text-xs text-[var(--sage)]">{label}</div>
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.03em]">{title}</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--muted)]">{body}</p>
      </div>
    </div>
  );
}

function Pricing({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="Pricing" onBack={onBack}>
      <div className="grid gap-5 md:grid-cols-2">
        <Plan
          name="Free"
          price="$0"
          body="A private Baseline and a focused way to start using Sovereign."
          items={['Baseline', 'Today surface', '10 AI turns / month', 'Strict privacy guarantee']}
        />
        <Plan
          name="Sovereign+"
          price="$20 / month"
          body="More room for deeper personal and shared-context work."
          items={[
            'Everything in Free',
            '300 AI turns / month',
            'People & relational comparisons',
            'Multi-participant systems',
            'Library retention continuity'
          ]}
          featured
        />
      </div>
    </PageFrame>
  );
}

function Plan({
  name,
  price,
  body,
  items,
  featured
}: {
  name: string;
  price: string;
  body: string;
  items: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 md:p-8 ${
        featured ? 'border-[var(--line-strong)] bg-[var(--surface)]' : 'border-[var(--line)]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-[var(--sage)]">{name}</div>
          <div className="mt-3 text-3xl font-medium tracking-[-0.04em]">{price}</div>
        </div>
        {featured && <Sparkles className="h-5 w-5 text-[var(--sage)]" />}
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{body}</p>
      <div className="mt-7 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-sm text-[var(--muted)]">
            <span>—</span>
            {item}
          </div>
        ))}
      </div>
      <Button className="mt-8 w-full" variant={featured ? 'primary' : 'secondary'} onClick={() => go('/signup')}>
        Get started
      </Button>
    </div>
  );
}

function FAQ({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame title="FAQ" onBack={onBack}>
      <div className="max-w-3xl divide-y divide-[var(--line)]">
        {[
          [
            'What is Sovereign?',
            'A private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.'
          ],
          [
            'What is a Baseline?',
            'A private reference built around you that gives Sovereign consistent context when it helps answer a question.'
          ],
          [
            'Does Sovereign know what another person feels or intends?',
            'No. Sovereign can work with consented information about another person, but it does not claim access to private motives, exact emotions, or hidden intentions.'
          ]
        ].map(([q, a]) => (
          <details key={q} className="py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
              {q}
              <ChevronDown className="h-4 w-4 text-[var(--subtle)]" />
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">{a}</p>
          </details>
        ))}
      </div>
    </PageFrame>
  );
}

function LegalPage({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <PageFrame title={title} onBack={onBack}>
      <div className="max-w-3xl space-y-6 text-sm leading-7 text-[var(--muted)]">
        <p>Effective Date: August 17, 2026</p>
        <p>
          Sovereign is designed with strict privacy boundaries: your raw birth details and exact coordinates are used only to establish your private Baseline and never enter language-model prompt context.
        </p>
        <p>
          Conversations and responses remain private to your authenticated account. Consented sharing with other accounts requires explicit approval for each participant.
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
    <div className="min-h-screen bg-[var(--ink)]">
      <Header />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-14 md:px-8 md:pt-20">
        <button onClick={onBack} className="mb-10 text-sm text-[var(--muted)] hover:text-[var(--cream)]">
          ← Back
        </button>
        <h1 className="text-4xl font-medium tracking-[-0.045em] md:text-6xl">{title}</h1>
        <div className="mt-12">{children}</div>
      </main>
    </div>
  );
}

