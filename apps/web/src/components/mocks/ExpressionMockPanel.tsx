import React from 'react';

export function ExpressionMockPanel() {
  return (
    <div className="glass-border p-6 w-full max-w-2xl text-left grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Input Query</div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-neutral-300 italic">
          "Why do I feel anxious when the project deadline is far away, but calm when it's imminent?"
        </div>
      </div>
      <div className="space-y-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Contextual Synthesis</div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-100">
          <strong>Baseline Match:</strong> High-Responsivity to ambiguous timelines. Transition from <span className="text-white">Anxiety</span> to <span className="text-white">Action</span> triggered by critical temporal proximity.
        </div>
      </div>
    </div>
  );
}
