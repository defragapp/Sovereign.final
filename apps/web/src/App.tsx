import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUp, ChevronDown, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Route = '/' | '/how-it-works' | '/pricing' | '/faq' | '/login' | '/signup' | '/app';

type Message = { role: 'user' | 'assistant'; text: string };

const sampleAnswer = `Start with the part that is happening now rather than trying to solve the whole relationship at once.\n\nYou may be reaching for certainty because the situation feels unresolved. That can make the next conversation carry more weight than it needs to. A useful next step is to name what you actually observed, say what you need, and leave room for the other person's response to be different from your expectation.\n\nWhat still needs to be known is what they intended and what they are ready to discuss.`;

function currentRoute(): Route {
  const path = window.location.pathname as Route;
  return ['/', '/how-it-works', '/pricing', '/faq', '/login', '/signup', '/app'].includes(path) ? path : '/';
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
  if (route === '/login' || route === '/signup') return <Auth mode={route.slice(1) as 'login' | 'signup'} />;
  if (route === '/how-it-works') return <InfoPage title="How it works" onBack={() => go('/')} />;
  if (route === '/pricing') return <Pricing onBack={() => go('/')} />;
  if (route === '/faq') return <FAQ onBack={() => go('/')} />;
  return <Landing />;
}

function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8">
      <button aria-label="Sovereign.OS home" onClick={() => go('/')} className="flex items-center gap-3">
        <span className="sovereign-mark" aria-hidden="true" />
        <span className="text-[15px] font-medium tracking-[-0.02em]">Sovereign.OS</span>
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
  return <button onClick={() => go(href)} className="rounded-full px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--cream)]">{label}</button>;
}

function Landing() {
  return (
    <div className="page-noise min-h-screen bg-[var(--ink)]">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <section className="grid min-h-[calc(100svh-84px)] items-center gap-14 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--sage)]">Private personal AI for real life</p>
            <h1 className="text-balance text-5xl font-medium tracking-[-0.055em] leading-[0.97] md:text-7xl">Understand yourself.<br />Understand your people.<br /><span className="text-[var(--muted)]">See the whole system.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[var(--muted)] md:text-lg">Sovereign starts with a private Baseline, then helps you make sense of real questions, relationships, decisions, communication, pressure, and recurring patterns.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => go('/signup')}>Get started</Button>
              <Button variant="secondary" size="lg" onClick={() => go('/how-it-works')}>See how it works</Button>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,#151513,#0f0f0e)] p-4 shadow-2xl shadow-black/30">
              <div className="rounded-[22px] border border-[var(--line)] bg-[#10100f] p-4 md:p-5">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[var(--cream)]"><span className="sovereign-mark scale-75" />Sovereign</div>
                  <span className="text-xs text-[var(--subtle)]">Private</span>
                </div>
                <div className="ml-auto max-w-[82%] rounded-2xl bg-[var(--surface-2)] px-4 py-3 text-sm leading-6 text-[var(--cream)]">Why do I keep overthinking what to say?</div>
                <div className="mt-6 max-w-[92%] text-sm leading-6 text-[var(--muted)]">
                  Start with what is happening now, rather than treating the whole pattern as one problem.
                  <button onClick={() => go('/app')} className="mt-5 flex items-center gap-2 text-[var(--cream)] hover:opacity-80"><span>Open Sovereign</span><ArrowUp className="h-4 w-4 rotate-45" /></button>
                </div>
                <div className="mt-10 rounded-2xl border border-[var(--line)] bg-[#0c0c0b] p-3">
                  <div className="flex items-end gap-3"><Textarea value="" readOnly placeholder="Ask Sovereign about your life..." className="min-h-14 border-0 bg-transparent px-1 py-1 shadow-none focus:ring-0"/><Button size="sm" aria-label="Send"><ArrowUp className="h-4 w-4"/></Button></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-[var(--line)] py-14">
          <div className="grid gap-8 md:grid-cols-3">
            <Capability title="Yourself" body="Explore how you may think, decide, communicate, create, connect, respond under pressure, and grow." />
            <Capability title="Your people" body="Look at what happens between people without collapsing two distinct people into one story." />
            <Capability title="The whole system" body="Understand patterns across families, teams, groups, and other consented situations." />
          </div>
        </section>
      </main>
    </div>
  );
}

function Capability({ title, body }: { title: string; body: string }) {
  return <div className="max-w-sm"><div className="mb-3 text-sm text-[var(--sage)]">{title}</div><p className="text-[15px] leading-6 text-[var(--muted)]">{body}</p></div>;
}

function Workspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const send = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((current) => [...current, { role: 'user', text: value }, { role: 'assistant', text: sampleAnswer }]);
    setText('');
  };
  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <header className="flex h-16 items-center justify-between border-b border-[var(--line)] px-4 md:px-6">
        <button onClick={() => go('/')} className="flex items-center gap-3"><span className="sovereign-mark"/><span className="text-sm font-medium">Sovereign</span></button>
        <div className="flex items-center gap-1"><Button variant="ghost" size="sm">Your Baseline</Button><Button variant="ghost" size="sm">Account</Button></div>
      </header>
      <div className="mx-auto flex min-h-[calc(100svh-64px)] max-w-5xl flex-col px-4 md:px-8">
        <div className="flex-1 py-8 md:py-12">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
              <p className="text-sm text-[var(--sage)]">Sovereign</p>
              <h1 className="mt-3 text-4xl font-medium tracking-[-0.045em] md:text-6xl">What is happening in your life right now?</h1>
              <p className="mt-5 max-w-xl text-[15px] leading-6 text-[var(--muted)]">Ask in ordinary language. Sovereign uses the context you have shared and keeps unknowns explicit.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Why do I react this way?', 'What just happened?', 'Should I say something now?'].map((q) => <Button key={q} variant="secondary" size="sm" onClick={() => setText(q)}>{q}</Button>)}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-8">
              {messages.map((message, index) => message.role === 'user' ? (
                <div key={index} className="ml-auto max-w-[86%] rounded-2xl bg-[var(--surface-2)] px-4 py-3 text-[15px] leading-6">{message.text}</div>
              ) : (
                <article key={index} className="answer-prose max-w-2xl text-[15px] leading-7 text-[var(--muted)]">
                  {message.text.split(/\n\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  <div className="mt-6 flex items-center gap-2 text-xs text-[var(--subtle)]"><ShieldCheck className="h-3.5 w-3.5"/>Based on your shared context</div>
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="sticky bottom-0 pb-4 pt-2 md:pb-7">
          <div className="rounded-2xl border border-[var(--line-strong)] bg-[#111110]/95 p-2 backdrop-blur">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="sm" aria-label="Add context"><Plus className="h-4 w-4" /></Button>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask Sovereign about your life..." className="min-h-12 border-0 bg-transparent px-2 py-2 shadow-none focus:ring-0" />
              <Button size="sm" aria-label="Send" onClick={send}><ArrowUp className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="mt-2 text-center text-[11px] text-[var(--subtle)]">Private by default · Shared context is consented</div>
        </div>
      </div>
    </div>
  );
}

function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup';
  return (
    <div className="page-noise flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <button onClick={() => go('/')} className="mx-auto mb-10 flex items-center gap-3"><span className="sovereign-mark"/><span className="text-sm font-medium">Sovereign.OS</span></button>
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <h1 className="text-2xl font-medium tracking-[-0.03em]">{signup ? 'Create your Sovereign account' : 'Sign in to Sovereign'}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{signup ? 'Start with a private account. Your Baseline comes next.' : 'Use your email to continue.'}</p>
          <form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); go(signup ? '/app' : '/app'); }}>
            {signup && <Input placeholder="Your name" autoComplete="name" />}
            <Input placeholder="Email address" type="email" autoComplete="email" required />
            <Button type="submit" className="w-full">{signup ? 'Continue' : 'Send sign-in link'}</Button>
          </form>
          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--subtle)]"><ShieldCheck className="h-3.5 w-3.5"/>Private account context stays private.</div>
        </div>
      </div>
    </div>
  );
}

function InfoPage({ title, onBack }: { title: string; onBack: () => void }) {
  return <PageFrame title={title} onBack={onBack}><div className="space-y-12"><InfoSection label="01" title="Start with you" body="Sovereign begins with a private Baseline: a consistent reference built around you."/><InfoSection label="02" title="Bring a real question" body="Ask in ordinary language. You do not need to know a framework or special terminology."/><InfoSection label="03" title="Add context when it matters" body="Your current situation, a person, or a wider group can be brought in when it is useful and consented."/></div></PageFrame>;
}

function InfoSection({ label, title, body }: { label: string; title: string; body: string }) { return <div className="grid gap-3 border-t border-[var(--line)] pt-7 md:grid-cols-[80px_1fr]"><div className="text-xs text-[var(--sage)]">{label}</div><div><h2 className="text-2xl font-medium tracking-[-0.03em]">{title}</h2><p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--muted)]">{body}</p></div></div>; }

function Pricing({ onBack }: { onBack: () => void }) { return <PageFrame title="Pricing" onBack={onBack}><div className="grid gap-5 md:grid-cols-2"><Plan name="Free" price="$0" body="A private Baseline and a focused way to start using Sovereign." items={['Baseline','Today','Explore','10 AI turns / month']} /><Plan name="Sovereign+" price="$20 / month" body="More room for deeper personal and shared-context work." items={['Everything in Free','300 AI turns / month','People','Systems','Library continuity']} featured /></div></PageFrame>; }

function Plan({name, price, body, items, featured}: {name:string;price:string;body:string;items:string[];featured?:boolean}) { return <div className={`rounded-3xl border p-6 md:p-8 ${featured ? 'border-[var(--line-strong)] bg-[var(--surface)]' : 'border-[var(--line)]'}`}><div className="flex items-start justify-between"><div><div className="text-sm text-[var(--sage)]">{name}</div><div className="mt-3 text-3xl font-medium tracking-[-0.04em]">{price}</div></div>{featured && <Sparkles className="h-5 w-5 text-[var(--sage)]"/>}</div><p className="mt-4 text-sm leading-6 text-[var(--muted)]">{body}</p><div className="mt-7 space-y-3">{items.map((item) => <div key={item} className="flex gap-2 text-sm text-[var(--muted)]"><span>—</span>{item}</div>)}</div><Button className="mt-8 w-full" variant={featured ? 'primary' : 'secondary'} onClick={() => go('/signup')}>Get started</Button></div>; }

function FAQ({ onBack }: { onBack: () => void }) { return <PageFrame title="FAQ" onBack={onBack}><div className="max-w-3xl divide-y divide-[var(--line)]">{[['What is Sovereign?','A private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.'],['What is a Baseline?','A private reference built around you that gives Sovereign consistent context when it helps answer a question.'],['Does Sovereign know what another person feels or intends?','No. Sovereign can work with consented information about another person, but it does not claim access to private motives, exact emotions, or hidden intentions.']].map(([q,a]) => <details key={q} className="py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">{q}<ChevronDown className="h-4 w-4 text-[var(--subtle)]"/></summary><p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">{a}</p></details>)}</div></PageFrame>; }

function PageFrame({ title, onBack, children }: { title:string;onBack:()=>void;children:ReactNode }) { return <div className="min-h-screen bg-[var(--ink)]"><Header/><main className="mx-auto max-w-5xl px-5 pb-20 pt-14 md:px-8 md:pt-20"><button onClick={onBack} className="mb-10 text-sm text-[var(--muted)] hover:text-[var(--cream)]">← Back</button><h1 className="text-4xl font-medium tracking-[-0.045em] md:text-6xl">{title}</h1><div className="mt-12">{children}</div></main></div>; }
