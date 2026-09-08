import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { BrandMark } from './components/ui/BrandMark';
import { LiquidMesh } from './components/ui/LiquidMesh';
import { IridescentLoader } from './components/IridescentLoader';
import { requestSignup, requestLogin, redeemAuth } from './lib/api';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export interface AuthProps {
  mode: 'login' | 'signup';
}

export function PasskeyAuthentication({ mode }: AuthProps) {
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
      if (res.next) navigate(res.next);
      else navigate('/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Code redemption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center px-4 py-12 text-white">
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a]/80 p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display tracking-tight text-white">
              {isSignup ? 'Create your Sovereign account' : 'Sign in to Sovereign'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
              {isSignup
                ? 'Start with a private account. Your Baseline comes next.'
                : 'Sign in with your email address.'}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {!sent ? (
            <form className="mt-6 space-y-4" onSubmit={handleRequest}>
              {isSignup && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
                    Your Name
                  </label>
                  <input
                    placeholder="First and last name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
                  Email Address
                </label>
                <input
                  placeholder="you@domain.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:border-white/30 outline-none transition-colors"
                />
              </div>

              {isSignup && (
                <div className="space-y-2.5 pt-2 text-xs text-[var(--muted)]">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 rounded border border-white/20 bg-black/50 text-white focus:ring-0 cursor-pointer"
                    />
                    <span className="leading-relaxed">I confirm I am 18 years of age or older.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 rounded border border-white/20 bg-black/50 text-white focus:ring-0 cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/terms')}
                        className="underline text-white hover:text-neutral-200 cursor-pointer"
                      >
                        Terms
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/privacy')}
                        className="underline text-white hover:text-neutral-200 cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSignup ? (
                  'Continue'
                ) : (
                  'Send sign-in link'
                )}
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-neutral-300">
                <p className="font-medium text-white text-sm">Link and code sent</p>
                <p className="mt-1 text-neutral-400">
                  We sent a private sign-in link to{' '}
                  <span className="text-white font-medium">{email}</span>. Check your inbox or enter
                  the 6-digit code below.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleVerifyCode}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
                    6-digit verification code
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-center font-mono text-xl tracking-[0.3em] bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:border-white/30 outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || code.trim().length < 6}
                  className="w-full bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm & Open'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="w-full text-center text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Use a different email address
              </button>
            </div>
          )}

          <div className="mt-8 border-t border-white/10 pt-4 text-xs text-center text-neutral-400">
            Your account stays private. Sovereign uses the context you choose to provide to build your personal reference.
          </div>

          <div className="mt-4 text-center text-xs text-neutral-400">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-white font-medium hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-white font-medium hover:underline cursor-pointer"
                >
                  Get started free
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Redeem() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const runRedemption = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing redemption token in URL.');
      return;
    }
    try {
      const res = await redeemAuth({ token });
      setStatus('success');
      if (res.next) navigate(res.next);
      else navigate('/app');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  useEffect(() => {
    runRedemption();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#000000] overflow-hidden text-white page-noise">
      <div className="stage-glow" />
      <LiquidMesh />
      <div className="relative z-10 w-full max-w-sm glass-border p-8 text-center space-y-4">
        {status === 'loading' && (
          <>
            <IridescentLoader />
            <p className="text-sm text-neutral-400">Verifying your sign-in link...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-white">Authenticated</p>
            <p className="text-xs text-neutral-400">Opening your workspace...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
              <X className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-white">Sign-in Link Expired</p>
            <p className="text-xs text-neutral-400">
              {errorMessage || 'This link is invalid or has already been used.'}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg py-2.5 text-xs font-semibold text-white border border-white/10 hover:border-white/20 cursor-pointer"
            >
              Request a new link
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export { PasskeyAuthentication as Auth };
