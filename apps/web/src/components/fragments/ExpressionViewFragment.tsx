import React from 'react';

export function ExpressionViewFragment() {
  return (
    <div
      className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a0a]/90 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
      aria-label="Expression View Demonstration"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-300">
            Expression Lens · Raw Query vs Grounded Synthesis
          </span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500">Live Contextual Breakdown</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Raw Inquiry */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>01 · RAW QUERY INPUT</span>
            <span className="text-neutral-500">Unfiltered</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-200 leading-relaxed shadow-inner">
            <span className="text-neutral-500 font-mono text-xs block mb-1">“</span>
            Why do I keep overthinking what to say whenever I feel misunderstood?
            <span className="text-neutral-500 font-mono text-xs block mt-1">”</span>
          </div>
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-xs text-purple-300/90 leading-relaxed">
            <strong className="block font-medium mb-0.5 text-purple-200">Without Sovereign:</strong>
            Generic AI provides surface advice like &ldquo;take deep breaths and be direct.&rdquo;
          </div>
        </div>

        {/* Center Arrow */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center pt-10 text-neutral-500">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 10h12m-4-4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Right: Sovereign Contextual Breakdown */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>02 · SOVEREIGN CONTEXTUAL BREAKDOWN</span>
            <span className="text-emerald-400">Grounded in Baseline</span>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/60 p-5 space-y-3.5 shadow-xl">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wide block">
                Observed Dynamic
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                You instinctively draft multiple speech variants in real time to manage the other party’s reaction before they have finished processing.
              </p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2.5">
              <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wide block">
                Baseline Grounding
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Your Baseline indicates reflective processing before articulation. Under perceived friction, over-refinement acts as an internal stabilizer.
              </p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2.5">
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wide block">
                Suggested Shift
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                Separate the observation from the resolution. Name the disconnect cleanly in one sentence, then pause without rushing to reassure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
