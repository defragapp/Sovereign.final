import { useState } from 'react';

type SystemType = 'families' | 'teams' | 'groups' | 'partnerships';
type ProgressionStage = 1 | 2 | 3;

interface SystemDetail {
  type: SystemType;
  label: string;
  dynamicName: string;
  nodes: { id: string; label: string; role: string; x: number; y: number }[];
  observable: string;
  equilibrium: string;
  sovereignPerspective: string;
}

const SYSTEMS: Record<SystemType, SystemDetail> = {
  families: {
    type: 'families',
    label: 'Families',
    dynamicName: 'Tension Absorption / Triangulation',
    nodes: [
      { id: 'you', label: 'You', role: 'Baseline A', x: 80, y: 140 },
      { id: 'parent', label: 'Parent / Elder', role: 'Baseline B', x: 200, y: 50 },
      { id: 'sibling', label: 'Sibling / Partner', role: 'Baseline C', x: 320, y: 140 }
    ],
    observable: 'Direct requests or friction between two family members are routed through a third person rather than resolved directly.',
    equilibrium: 'The third person buffers conflict, preserving a calm surface in the family while leaving underlying misunderstandings unaddressed.',
    sovereignPerspective: 'Holding all three references visible reveals the stabilizing loop without blaming any individual for playing their accustomed role.'
  },
  teams: {
    type: 'teams',
    label: 'Teams',
    dynamicName: 'Over-Functioning / Execution Vacuum',
    nodes: [
      { id: 'you', label: 'You', role: 'Initiative & Review', x: 80, y: 140 },
      { id: 'lead', label: 'Lead / Sponsor', role: 'Direction & Ambiguity', x: 200, y: 50 },
      { id: 'peer', label: 'Teammates', role: 'Execution & Waiting', x: 320, y: 140 }
    ],
    observable: 'When project ambiguity arises, one person steps in to over-organize while others step back to avoid contradictory effort.',
    equilibrium: 'The team adapts to one person bearing the cognitive load of coordination, creating a cycle where others hesitate to initiate.',
    sovereignPerspective: 'Separating the observable ambiguity from personal initiative lets the team explicitly agree on decision boundaries before burnout occurs.'
  },
  groups: {
    type: 'groups',
    label: 'Groups',
    dynamicName: 'Consensus Smoothing / Unvoiced Divergence',
    nodes: [
      { id: 'you', label: 'You', role: 'Divergent Signal', x: 80, y: 140 },
      { id: 'center', label: 'Group Norm', role: 'Cohesion Pressure', x: 200, y: 50 },
      { id: 'circle', label: 'Group Members', role: 'Public Agreement', x: 320, y: 140 }
    ],
    observable: 'Disagreements are politely smoothed over in group forums, only to be re-analyzed privately in side conversations afterward.',
    equilibrium: 'The group preserves superficial unity and relational safety, but decisions carry latent hesitation and take longer to implement.',
    sovereignPerspective: 'Sovereign allows divergent viewpoints to be articulated cleanly against the baseline without requiring interpersonal confrontation.'
  },
  partnerships: {
    type: 'partnerships',
    label: 'Partnerships',
    dynamicName: 'Stress Asymmetry / Differing Recovery Rhythms',
    nodes: [
      { id: 'you', label: 'Partner A (You)', role: 'Reflective Processing', x: 80, y: 140 },
      { id: 'stressor', label: 'External Stress', role: 'Work / Demands', x: 200, y: 50 },
      { id: 'partner', label: 'Partner B', role: 'Verbal Connection', x: 320, y: 140 }
    ],
    observable: 'External stress triggers opposite recovery instincts: one partner seeks quiet space, while the other seeks immediate verbal reassurance.',
    equilibrium: 'The search for connection triggers more withdrawal, which intensifies the perceived distance. Neither partner intended to hurt the other.',
    sovereignPerspective: 'Making the dual coping rhythms visible helps both partners recognize stress responses as personal recovery rather than relationship rejection.'
  }
};

export function SystemDynamicDemo() {
  const [activeSystem, setActiveSystem] = useState<SystemType>('families');
  const [stage, setStage] = useState<ProgressionStage>(3);

  const sys = SYSTEMS[activeSystem];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8 space-y-6">
      {/* HEADER & SELECTORS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <span className="font-utility text-[10px] text-[var(--sage)]">WHOLE SYSTEM DEMONSTRATION</span>
          <div className="font-statement text-base md:text-lg text-[var(--cream)] mt-1">
            How individual references combine into interconnected systems
          </div>
        </div>

        {/* SYSTEM SELECTOR */}
        <div className="flex flex-wrap gap-1 bg-[var(--surface-2)] p-1 rounded-lg border border-[var(--line)]">
          {(['families', 'teams', 'groups', 'partnerships'] as SystemType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveSystem(type)}
              className={`px-2.5 py-1 text-xs rounded-md transition capitalize ${
                activeSystem === type
                  ? 'bg-[var(--surface)] text-[var(--cream)] border border-[var(--line)] font-medium shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* PROGRESSION STEPS: 1 -> 2 -> 3 */}
      <div className="grid grid-cols-3 gap-2 border-b border-[var(--line)] pb-4 text-center">
        <button
          onClick={() => setStage(1)}
          className={`py-2 px-3 rounded-lg border transition text-left ${
            stage === 1
              ? 'border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--cream)]'
              : 'border-transparent text-[var(--subtle)] hover:text-[var(--muted)]'
          }`}
        >
          <div className="font-utility text-[9px] uppercase tracking-wider">Step 01</div>
          <div className="font-statement text-xs mt-0.5">One Person</div>
          <div className="font-explanation text-[11px] text-[var(--muted)] hidden sm:block">Your private baseline</div>
        </button>

        <button
          onClick={() => setStage(2)}
          className={`py-2 px-3 rounded-lg border transition text-left ${
            stage === 2
              ? 'border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--cream)]'
              : 'border-transparent text-[var(--subtle)] hover:text-[var(--muted)]'
          }`}
        >
          <div className="font-utility text-[9px] uppercase tracking-wider">Step 02</div>
          <div className="font-statement text-xs mt-0.5">A Relationship</div>
          <div className="font-explanation text-[11px] text-[var(--muted)] hidden sm:block">Two distinct references</div>
        </button>

        <button
          onClick={() => setStage(3)}
          className={`py-2 px-3 rounded-lg border transition text-left ${
            stage === 3
              ? 'border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--cream)]'
              : 'border-transparent text-[var(--subtle)] hover:text-[var(--muted)]'
          }`}
        >
          <div className="font-utility text-[9px] uppercase tracking-wider">Step 03</div>
          <div className="font-statement text-xs mt-0.5">The Whole System</div>
          <div className="font-explanation text-[11px] text-[var(--muted)] hidden sm:block">Equilibrium & feedback loops</div>
        </button>
      </div>

      {/* INTERACTIVE VISUAL SYSTEM DIAGRAM */}
      <div className="relative rounded-xl border border-[var(--line)] bg-[#0c0c0b] p-6 overflow-hidden min-h-[220px] flex items-center justify-center">
        <svg className="w-full max-w-md h-48 select-none" viewBox="0 0 400 200" fill="none">
          {/* CONNECTIONS ACCORDING TO STAGE */}
          {stage >= 2 && (
            <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-[var(--line-strong)]">
              {/* You to Node 2 */}
              <line x1={sys.nodes[0].x} y1={sys.nodes[0].y} x2={sys.nodes[1].x} y2={sys.nodes[1].y} />
            </g>
          )}

          {stage === 3 && (
            <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-[var(--line-strong)]">
              {/* Node 2 to Node 3 */}
              <line x1={sys.nodes[1].x} y1={sys.nodes[1].y} x2={sys.nodes[2].x} y2={sys.nodes[2].y} />
              {/* You to Node 3 */}
              <line x1={sys.nodes[0].x} y1={sys.nodes[0].y} x2={sys.nodes[2].x} y2={sys.nodes[2].y} strokeOpacity="0.4" />
            </g>
          )}

          {/* SYSTEM EQUILIBRIUM FIELD CIRCLE IN STAGE 3 */}
          {stage === 3 && (
            <circle
              cx="200"
              cy="110"
              r="75"
              stroke="var(--sage)"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          )}

          {/* NODE 1: YOU (Always visible) */}
          <g transform={`translate(${sys.nodes[0].x}, ${sys.nodes[0].y})`}>
            <circle cx="0" cy="0" r="18" fill="var(--surface-2)" stroke="var(--cream)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4" fill="var(--cream)" />
            <text x="0" y="32" textAnchor="middle" fill="var(--cream)" fontSize="11" fontFamily="sans-serif" fontWeight="500">
              {sys.nodes[0].label}
            </text>
            <text x="0" y="44" textAnchor="middle" fill="var(--subtle)" fontSize="9" fontFamily="monospace">
              {sys.nodes[0].role}
            </text>
          </g>

          {/* NODE 2: (Visible in Stage 2 & 3) */}
          {stage >= 2 && (
            <g transform={`translate(${sys.nodes[1].x}, ${sys.nodes[1].y})`}>
              <circle cx="0" cy="0" r="16" fill="var(--surface-2)" stroke="var(--sage)" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3" fill="var(--sage)" />
              <text x="0" y="-24" textAnchor="middle" fill="var(--cream)" fontSize="11" fontFamily="sans-serif">
                {sys.nodes[1].label}
              </text>
              <text x="0" y="-12" textAnchor="middle" fill="var(--sage)" fontSize="9" fontFamily="monospace">
                {sys.nodes[1].role}
              </text>
            </g>
          )}

          {/* NODE 3: (Visible in Stage 3) */}
          {stage === 3 && (
            <g transform={`translate(${sys.nodes[2].x}, ${sys.nodes[2].y})`}>
              <circle cx="0" cy="0" r="16" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3" fill="var(--muted)" />
              <text x="0" y="32" textAnchor="middle" fill="var(--cream)" fontSize="11" fontFamily="sans-serif">
                {sys.nodes[2].label}
              </text>
              <text x="0" y="44" textAnchor="middle" fill="var(--subtle)" fontSize="9" fontFamily="monospace">
                {sys.nodes[2].role}
              </text>
            </g>
          )}

          {/* STAGE 3 DYNAMIC LABEL */}
          {stage === 3 && (
            <text x="200" y="115" textAnchor="middle" fill="var(--sage)" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">
              EQUILIBRIUM LOOP
            </text>
          )}
        </svg>
      </div>

      {/* DETAILED OBSERVATIONS FOR CURRENT STAGE */}
      <div className="space-y-4">
        {stage === 1 && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
            <span className="font-utility text-[10px] text-[var(--sage)]">STAGE 1 · YOUR INDIVIDUAL BASELINE</span>
            <div className="font-statement text-sm text-[var(--cream)]">
              Your baseline holds your internal reference.
            </div>
            <p className="font-explanation text-xs text-[var(--muted)] leading-relaxed">
              Before looking at group pressure or relational conflict, Sovereign establishes how you process information, evaluate tradeoffs, and react to stress independently.
            </p>
          </div>
        )}

        {stage === 2 && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
            <span className="font-utility text-[10px] text-[var(--sage)]">STAGE 2 · TWO DISTINCT REFERENCES</span>
            <div className="font-statement text-sm text-[var(--cream)]">
              Interactions arise between two different ways of operating.
            </div>
            <p className="font-explanation text-xs text-[var(--muted)] leading-relaxed">
              When two individuals communicate, neither is inherently the problem. Misunderstandings usually stem from differing cognitive pacing, communication styles, or recovery needs.
            </p>
          </div>
        )}

        {stage === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-1.5">
                <span className="font-utility text-[10px] text-[var(--subtle)]">WHAT IS OBSERVABLE</span>
                <p className="font-explanation text-xs leading-relaxed text-[var(--cream)]">
                  {sys.observable}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-1.5">
                <span className="font-utility text-[10px] text-[var(--subtle)]">HOW THE SYSTEM STABILIZES (EQUILIBRIUM)</span>
                <p className="font-explanation text-xs leading-relaxed text-[var(--muted)]">
                  {sys.equilibrium}
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-4 flex items-start gap-3">
              <div className="sovereign-mark shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-utility text-[10px] text-[var(--sage)]">WHAT SOVEREIGN OFFERS</span>
                <p className="font-explanation text-xs leading-relaxed text-[var(--cream)]">
                  {sys.sovereignPerspective}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
