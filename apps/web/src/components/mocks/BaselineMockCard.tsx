import React from 'react';

export function BaselineMockCard() {
  return (
    <div className="glass-border p-6 w-full max-w-md text-left space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Baseline Analysis</span>
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs text-neutral-400">Cognitive Processing</span>
          <span className="text-xs text-white font-mono">Symmetric</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 w-3/4" />
        </div>
        <div className="flex justify-between items-end pt-2">
          <span className="text-xs text-neutral-400">Pressure Response</span>
          <span className="text-xs text-white font-mono">Reflective</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-400 w-1/2" />
        </div>
      </div>
      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-[10px] text-neutral-500 font-mono">Confidence: High</span>
        <span className="text-[10px] text-neutral-500 font-mono">Ver: 2.1.0</span>
      </div>
    </div>
  );
}
