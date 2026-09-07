import { BrandMark } from './components/ui/BrandMark';
import { LiquidMesh } from './components/ui/LiquidMesh';
import { PublicDemoChat } from './components/PublicDemoChat';

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
      className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden selection:bg-white/20 selection:text-white"
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
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.12) 40%, transparent 75%), radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.18) 0px, transparent 50%), radial-gradient(at 90% 15%, rgba(168, 85, 247, 0.16) 0px, transparent 50%), radial-gradient(at 50% 85%, rgba(6, 182, 212, 0.14) 0px, transparent 50%), #000000',
        }}
      />

      <div className="relative z-10 flex flex-col">
        <V2Navigation />
        <V2Hero />
        <HowItWorks />
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a className="flex items-center gap-2.5 text-white font-semibold tracking-tight transition-opacity hover:opacity-80" href="/" aria-label="Sovereign.OS home">
          <BrandMark size={22} />
          <span className="text-base font-semibold tracking-tight text-white">Sovereign</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400" aria-label="Public navigation">
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
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
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
    <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32" role="banner">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Personal AI for your real life
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Understand yourself.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Understand your people.
            </span>
            <br />
            <span className="text-neutral-400">See the whole system.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl leading-relaxed">
            Sovereign is a Baseline-first private AI for understanding yourself, your relationships, and the human systems around you. Build your Baseline once, then explore how you think, decide, communicate, and respond under pressure.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              href="/signup"
            >
              Start free — no card required
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="13" y2="4" />
                <polyline points="13 4 13 4 13 13 4 13" />
              </svg>
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10 px-6 py-3.5 text-base font-medium text-white"
              href="#how-it-works"
            >
              See how it works
            </a>
          </div>
          <p className="mt-6 text-xs text-neutral-500">
            Your data stays private. Your responses are never used to train AI.
          </p>
        </div>
        <div className="lg:col-span-5 w-full">
          <PublicDemoChat />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-20 px-6" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">How Sovereign works</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Three steps from your first question to understanding.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-sm font-bold text-white mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3">You share what matters</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Tell Sovereign about a decision, a relationship, or a moment that's confusing. The more context you give, the better.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-sm font-bold text-white mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sovereign grounds in your patterns</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Instead of generic advice, Sovereign returns to how you actually think, decide, and relate. It shows you the reasoning so you can accept, correct, or reject it.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-sm font-bold text-white mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3">You understand more clearly</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              You get answers rooted in your situation. Not guesses. Not one-size-fits-all wisdom. Clarity about what's actually happening and what matters to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RealLifeQuestions() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Real questions people ask Sovereign</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Start with what's on your mind right now.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAL_LIFE_QUESTIONS.map((q) => (
            <button
              key={q.text}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 text-left flex flex-col justify-between group transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:-translate-y-1 cursor-pointer"
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
    <section className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">The Difference</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Most AI starts fresh every time.</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Sovereign starts with you.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Generic AI */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:border-white/20">
            <h3 className="text-xl font-bold text-neutral-400 mb-6 flex items-center gap-2">
              <span className="text-red-400">✕</span> Generic ChatGPT-style AI
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
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-purple-500/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-full pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Sovereign
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
    <section className="py-20 px-6" id="pricing">
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Simple, transparent pricing</h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">Start free. Upgrade anytime if you need more.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white/5 backdrop-blur-md border ${
                tier.highlighted ? 'border-white/25 ring-1 ring-white/15' : 'border-white/10'
              } rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-white/30`}
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
                      ? 'bg-white text-black hover:bg-neutral-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
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
    <section className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-purple-500/10 to-transparent" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to understand yourself better?
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
            Start a free conversation with Sovereign. No card required. Your data stays completely private.
          </p>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
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
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <a href="/" className="flex items-center gap-2.5" aria-label="Sovereign.OS home">
              <BrandMark size={22} />
              <span className="text-base font-semibold tracking-tight text-white">Sovereign</span>
            </a>
            <p className="mt-2 text-xs text-neutral-400">Personal AI for your real life.</p>
          </div>
          <nav className="flex flex-wrap gap-8 text-sm text-neutral-400">
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
