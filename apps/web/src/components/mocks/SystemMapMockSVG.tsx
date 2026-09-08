import React from 'react';

export function SystemMapMockSVG() {
  return (
    <div className="sovereign-card p-6 text-center">
      <h3 className="text-lg font-bold text-white mb-2">System Map Mock</h3>
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
        <circle cx="100" cy="100" r="90" stroke="var(--sage)" strokeWidth="2" />
        <circle cx="100" cy="100" r="5" fill="var(--cream)" />
        <line x1="100" y1="100" x2="100" y2="10" stroke="var(--sage)" strokeWidth="2" />
        <line x1="100" y1="100" x2="190" y2="100" stroke="var(--sage)" strokeWidth="2" />
        <line x1="100" y1="100" x2="30" y2="170" stroke="var(--sage)" strokeWidth="2" />
      </svg>
      <p className="text-sm text-neutral-300">Placeholder SVG representing system networks.</p>
    </div>
  );
}
