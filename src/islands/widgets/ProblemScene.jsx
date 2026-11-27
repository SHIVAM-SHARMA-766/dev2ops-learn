// ProblemScene — the beginner "works on my machine" story, illustrated.
// Laptop (works) ships an app to a server (breaks). Driven by activeStep.
import React from 'react';
import { Laptop, Server } from './illustrations.jsx';

const STATUS = [
  { text: 'It runs perfectly on your laptop.', tone: 'good' },
  { text: 'So you send the same app to the server…', tone: '' },
  { text: '✕ …and it breaks. Same code — different machine.', tone: 'bad' },
  { text: 'Different OS, missing libraries, wrong versions.', tone: 'bad' },
  { text: 'What if the app carried its whole environment with it?', tone: '' },
];

export default function ProblemScene({ activeStep = 0 }) {
  const s = activeStep;
  const pkgX = s >= 1 ? 250 : 70; // app package slides toward the server
  const status = STATUS[Math.min(s, STATUS.length - 1)];
  return (
    <div className="w-illus">
      <svg viewBox="0 0 420 180" className="illus-svg" role="img" aria-label="An app that works on a laptop but breaks on the server">
        <Laptop x={20} y={56} scale={1.05} state="ok" />
        <text x="62" y="140" textAnchor="middle" className="illus-cap">your laptop</text>

        <Server x={330} y={44} scale={1.05} state={s >= 2 ? 'bad' : 'idle'} />
        <text x="362" y="140" textAnchor="middle" className="illus-cap">the server</text>

        {/* dashed path */}
        <line x1="110" y1="92" x2="320" y2="92" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="4 5" opacity={s >= 1 ? 0.6 : 0.2} />

        {/* the app package */}
        <g className="illus-pkg" style={{ transform: `translateX(${pkgX}px)`, opacity: 1 }}>
          <rect x="-16" y="76" width="34" height="30" rx="4" fill="var(--accent)" />
          <rect x="-16" y="76" width="34" height="9" rx="4" fill="#000" opacity="0.14" />
          <text x="1" y="98" textAnchor="middle" fontSize="15" fill="var(--accent-ink)">📦</text>
        </g>

        {s >= 2 && <text x="300" y="54" fontSize="22" fill="var(--accent-red)">✕</text>}
      </svg>
      <div className={`illus-status ${status.tone === 'good' ? 'is-good' : status.tone === 'bad' ? 'is-bad' : ''}`}>
        {status.text}
      </div>
    </div>
  );
}
