import type { ReactNode } from 'react';
import { useState } from 'react';
import { BrandMark } from './components/ui/BrandMark';
import { GlassCard } from './components/ui/GlassCard';
import { PillBadge } from './components/ui/PillBadge';
import { PrimaryButton } from './components/ui/PrimaryButton';
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
    'Remembers what you\x27ve shared about how you think, decide, and relate',
    'Uses your actual patterns to understand what\x27s really happening',
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
    <main className="sovereign-landing v2-landing-unified" data-product-contract="personal-ai-v1">
      <V2Navigation />
      <V2Hero />
      <HowItWorks />
      <RealLifeQuestions />
      <ComparisonSection />
      <PricingSection />
      <FinalCallToAction />
      <V2Footer />
    </main>
  );
}

function V2Navigation() {
  return (
    <header className="v2-nav">
      <div className="v2-nav-inner">
        <a className="v2-wordmark" href="/" aria-label="Sovereign.OS home">
          <BrandMark />
        </a>
        <nav className="v2-nav-menu" aria-label="Public navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="/faq">FAQ</a>
        </nav>
        <div className="v2-nav-actions">
          <a className="v2-nav-signin" href="/login">Sign in</a>
          <a className="v2-nav-signup" href="/signup">
            Get started free
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <section className="v2-hero" role="banner">
      <div className="v2-hero-content">
        <div className="v2-hero-text">
          <PillBadge variant="powder" className="v2-hero-kicker">
            Personal AI for your real life
          </PillBadge>
          <h1 className="v2-hero-headline">
            Understand yourself.
            <br />
            <span className="v2-hero-accent">Understand your people.</span>
            <br />
            <span className="v2-hero-secondary">See the whole system.</span>
          </h1>
          <p className="v2-hero-lede">
            Sovereign is a Baseline-first private AI for understanding yourself, your relationships, and the human systems around you. Build your Baseline once, then explore how you think, decide, communicate, and respond under pressure.
          </p>
          <div className="v2-hero-actions">
            <a className="button-primary" href="/signup">
              Start free — no card required
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="13" y2="4" />
                <polyline points="13 4 13 4 13 13 4 13" />
              </svg>
            </a>
            <a className="button-secondary" href="#how-it-works">
              See how it works
            </a>
          </div>
          <p className="v2-hero-footnote">
            Your data stays private. Your responses are never used to train AI.
          </p>
        </div>
        <div className="v2-hero-demo">
          <PublicDemoChat />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="v2-how-it-works" id="how-it-works">
      <div className="v2-section-inner">
        <header className="v2-section-header">
          <h2>How Sovereign works</h2>
          <p>Three steps from your first question to understanding.</p>
        </header>
        <div className="v2-how-steps">
          <div className="v2-step">
            <div className="v2-step-number">1</div>
            <h3>You share what matters</h3>
            <p>Tell Sovereign about a decision, a relationship, or a moment that's confusing. The more context you give, the better.</p>
          </div>
          <div className="v2-step">
            <div className="v2-step-number">2</div>
            <h3>Sovereign grounds in your patterns</h3>
            <p>Instead of generic advice, Sovereign returns to how you actually think, decide, and relate. It shows you the reasoning so you can accept, correct, or reject it.</p>
          </div>
          <div className="v2-step">
            <div className="v2-step-number">3</div>
            <h3>You understand more clearly</h3>
            <p>You get answers rooted in your situation. Not guesses. Not one-size-fits-all wisdom. Clarity about what's actually happening and what matters to you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RealLifeQuestions() {
  return (
    <section className="v2-real-life-questions">
      <div className="v2-section-inner">
        <header className="v2-section-header">
          <h2>Real questions people ask Sovereign</h2>
          <p>Start with what's on your mind right now.</p>
        </header>
        <div className="v2-questions-grid">
          {REAL_LIFE_QUESTIONS.map((q) => (
            <button
              key={q.text}
              className="v2-question-card"
              onClick={() => {
                sessionStorage.setItem('sovereign:prefill-prompt', q.text);
                window.location.href = '/signup';
              }}
            >
              <span className="v2-question-scope">{q.scope}</span>
              <span className="v2-question-text">{q.text}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="13" y2="4" />
                <polyline points="13 4 13 4 13 13 4 13" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="v2-comparison">
      <div className="v2-section-inner">
        <header className="v2-section-header" style={{ textAlign: 'center' }}>
          <p className="v2-section-kicker">The Difference</p>
          <h2>Most AI starts fresh every time.</h2>
          <p>Sovereign starts with you.</p>
        </header>
        <div className="v2-comparison-grid">
          <div className="v2-comparison-panel negative">
            <h3>Generic ChatGPT-style AI</h3>
            <ul>
              {COMPARISON.blank.map((item) => (
                <li key={item}>
                  <span className="v2-comparison-icon">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="v2-comparison-panel positive">
            <h3>Sovereign</h3>
            <ul>
              {COMPARISON.sovereign.map((item) => (
                <li key={item}>
                  <span className="v2-comparison-icon">✓</span>
                  {item}
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
    <section className="v2-pricing" id="pricing">
      <div className="v2-section-inner">
        <header className="v2-section-header">
          <h2>Simple, transparent pricing</h2>
          <p>Start free. Upgrade anytime if you need more.</p>
        </header>
        <div className="v2-pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.name} className={`v2-pricing-card ${tier.highlighted ? 'highlighted' : ''}`}>
              <div className="v2-pricing-header">
                <h3>{tier.name}</h3>
                <p className="v2-pricing-description">{tier.description}</p>
                <div className="v2-pricing-amount">
                  <span className="v2-pricing-currency">$</span>
                  <span className="v2-pricing-number">{tier.price}</span>
                  {tier.price !== '0' && <span className="v2-pricing-period">/month</span>}
                </div>
              </div>
              <ul className="v2-pricing-features">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <span>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a className={`button-${tier.highlighted ? 'primary' : 'secondary'}`} href={tier.ctaHref}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCallToAction() {
  return (
    <section className="v2-final-cta">
      <GlassCard className="v2-cta-card">
        <div className="v2-cta-content">
          <h2>Ready to understand yourself better?</h2>
          <p>Start a free conversation with Sovereign. No card required. Your data stays completely private.</p>
          <a className="button-primary" href="/signup" style={{ marginTop: '24px' }}>
            Get started free
          </a>
        </div>
      </GlassCard>
    </section>
  );
}

function V2Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          <a href="/" className="v2-footer-wordmark" aria-label="Sovereign.OS home">
            <BrandMark />
          </a>
          <p>Personal AI for your real life.</p>
        </div>
        <nav className="v2-footer-nav">
          <div>
            <h4>Product</h4>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="/faq">FAQ</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="mailto:info@sovereign.defrag.app">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </nav>
      </div>
      <div className="v2-footer-bottom">
        <p>© 2026 Sovereign.OS. Built with care for human understanding.</p>
      </div>
    </footer>
  );
}
