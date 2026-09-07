import React from 'react';

export interface BaselineVector {
  dimension: string;
  tendency: string;
  weight: number;
  descriptor: string;
}

const MOCK_VECTORS: BaselineVector[] = [
  { dimension: 'Cognitive Framing', tendency: 'Structural / Nuanced', weight: 92, descriptor: 'High Stability' },
  { dimension: 'Decision Rhythm', tendency: 'Values Alignment First', weight: 88, descriptor: 'Reflective' },
  { dimension: 'Communication Pace', tendency: 'Internal Processing', weight: 85, descriptor: 'Deliberate' },
  { dimension: 'Pressure Equilibrium', tendency: 'Autonomous Reset', weight: 79, descriptor: 'Independent' },
  { dimension: 'Relational Stance', tendency: 'Distinct Boundaries', weight: 91, descriptor: 'High Fidelity' },
];

export function BaselineViewFragment({ compact = false }: { compact?: boolean }) {
  const displayVectors = compact ? MOCK_VECTORS.slice(0, 3) : MOCK_VECTORS;

  return (
    <div
      className={`w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1 ${
        compact ? 'max-w-md' : 'max-w-xl'
      }`}
      aria-label="Baseline View Demonstration"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-neutral-300">
            Baseline Design · Context Vectors
          </span>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-neutral-400">
          Steady Reference
        </span>
      </div>

      <div className="space-y-3">
        {displayVectors.map((vec) => (
          <div key={vec.dimension} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-white">{vec.dimension}</span>
              <span className="text-neutral-400 font-mono text-[11px]">{vec.tendency}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500/70 via-blue-500/70 to-emerald-400/70 transition-all duration-500"
                style={{ width: `${vec.weight}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Weight: {vec.weight}%</span>
              <span>{vec.descriptor}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
        <span>Quiet reference across every turn</span>
        <span className="text-emerald-400 font-medium">Active &amp; Correctable</span>
      </div>
    </div>
  );
}
