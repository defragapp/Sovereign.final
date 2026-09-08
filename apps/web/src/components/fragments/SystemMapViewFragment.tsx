import React, { useState } from 'react';

interface SystemNode {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  highlight?: boolean;
}

const NODES: SystemNode[] = [
  { id: 'you', label: 'You', role: 'Reflective Baseline', x: 80, y: 120, highlight: true },
  { id: 'lead', label: 'Partner / Lead', role: 'Direct Verbal Action', x: 260, y: 50 },
  { id: 'team', label: 'Team / Family', role: 'Tension Absorption', x: 260, y: 190 },
];

export function SystemMapViewFragment() {
  const [activeVector, setActiveVector] = useState<string | null>(null);

  return (
    <div
      className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a0a]/90 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
      aria-label="System Map View Demonstration"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-300">
              System Map View · Multi-Party Relationship Vectors
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Mapping how tension, roles, and pressure move through connected humans.
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-neutral-400 hidden sm:inline-block">
          Network Dynamics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Diagram Canvas */}
        <div className="lg:col-span-7 relative rounded-xl border border-white/10 bg-black/60 p-4 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-56 select-none" viewBox="0 0 360 240" fill="none" aria-label="System relationship diagram">
            {/* Ambient Equilibrium Ring */}
            <circle
              cx="190"
              cy="120"
              r="70"
              stroke="rgba(159, 186, 161, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x="190"
              y="123"
              textAnchor="middle"
              fill="rgba(159, 186, 161, 0.5)"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="0.1em"
            >
              SYSTEM EQUILIBRIUM
            </text>

            {/* Connection Vectors */}
            {/* You to Lead */}
            <line
              x1={NODES[0].x}
              y1={NODES[0].y}
              x2={NODES[1].x}
              y2={NODES[1].y}
              stroke={activeVector === 'pace' ? '#a855f7' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth={activeVector === 'pace' ? 2 : 1.2}
              strokeDasharray="4 4"
            />
            {/* You to Team */}
            <line
              x1={NODES[0].x}
              y1={NODES[0].y}
              x2={NODES[2].x}
              y2={NODES[2].y}
              stroke={activeVector === 'tension' ? '#3b82f6' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth={activeVector === 'tension' ? 2 : 1.2}
              strokeDasharray="4 4"
            />
            {/* Lead to Team */}
            <line
              x1={NODES[1].x}
              y1={NODES[1].y}
              x2={NODES[2].x}
              y2={NODES[2].y}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={1}
              strokeDasharray="2 3"
            />

            {/* Render Nodes */}
            {NODES.map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  cx={0}
                  cy={0}
                  r={18}
                  fill="#0c0c0e"
                  stroke={node.highlight ? '#9fbaa1' : 'rgba(255, 255, 255, 0.3)'}
                  strokeWidth={node.highlight ? 2 : 1}
                />
                <circle cx={0} cy={0} r={4} fill={node.highlight ? '#9fbaa1' : '#ffffff'} />
                <text
                  x={0}
                  y={30}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {node.label}
                </text>
                <text
                  x={0}
                  y={42}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.5)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {node.role}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Vector Exploration Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
            Select Active Vector:
          </span>
          <button
            type="button"
            onMouseEnter={() => setActiveVector('pace')}
            onMouseLeave={() => setActiveVector(null)}
            onFocus={() => setActiveVector('pace')}
            onBlur={() => setActiveVector(null)}
            className={`w-full rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
              activeVector === 'pace'
                ? 'border-purple-400/50 bg-purple-500/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20'
            }`}
          >
            <div className="font-semibold text-xs text-purple-300">Pacing Vector (Urgency vs Reflection)</div>
            <p className="mt-1 text-[11px] text-neutral-400 leading-snug">
              One person seeks immediate clarity while the other needs silent processing time. Neither is resisting.
            </p>
          </button>

          <button
            type="button"
            onMouseEnter={() => setActiveVector('tension')}
            onMouseLeave={() => setActiveVector(null)}
            onFocus={() => setActiveVector('tension')}
            onBlur={() => setActiveVector(null)}
            className={`w-full rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
              activeVector === 'tension'
                ? 'border-blue-400/50 bg-blue-500/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20'
            }`}
          >
            <div className="font-semibold text-xs text-blue-300">Buffering Vector (Tension Absorption)</div>
            <p className="mt-1 text-[11px] text-neutral-400 leading-snug">
              When group ambiguity peaks, one member absorbs coordination duties to preserve surface calm.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
