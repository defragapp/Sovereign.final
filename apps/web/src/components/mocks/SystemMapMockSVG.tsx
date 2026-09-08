import React from 'react';

export function SystemMapMockSVG() {
  return (
    <div className="glass-border p-6 w-full max-w-md flex flex-col items-center justify-center space-y-6">
      <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">System Topology Map</div>
      <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
        <circle cx="100" cy="60" r="6" fill="white" className="animate-pulse" />
        <circle cx="60" cy="30" r="4" fill="rgba(159, 186, 161, 0.6)" />
        <circle cx="140" cy="30" r="4" fill="rgba(159, 186, 161, 0.6)" />
        <circle cx="60" cy="90" r="4" fill="rgba(196, 171, 161, 0.6)" />
        <circle cx="140" cy="90" r="4" fill="rgba(196, 171, 161, 0.6)" />
        <line x1="100" y1="60" x2="60" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="100" y1="60" x2="140" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="100" y1="60" x2="60" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="100" y1="60" x2="140" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M60 30 Q 100 30 140 30" stroke="rgba(255,255,255,0.1)" fill="none" strokeDasharray="4 4" />
        <path d="M60 90 Q 100 90 140 90" stroke="rgba(255,255,255,0.1)" fill="none" strokeDasharray="4 4" />
      </svg>
      <div className="flex gap-4 text-[10px] font-mono text-neutral-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white" /> Core
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400/60" /> Node A
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-clay/60" /> Node B
        </div>
      </div>
    </div>
  );
}
