// ShipScene — "build once, run anywhere", illustrated. Code + deps seal into a
// shipping container (the image), which then runs on a laptop, a server and the
// cloud. Driven by activeStep (0..4).
import React from 'react';
import { Container, Laptop, Server, Cloud } from './illustrations.jsx';

function InBox({ y, label, show }) {
  return (
    <g style={{ opacity: show ? 1 : 0.12, transition: 'opacity 0.4s' }}>
      <rect x="18" y={y} width="86" height="26" rx="6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
      <text x="61" y={y + 17} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink)">{label}</text>
    </g>
  );
}

export default function ShipScene({ activeStep = 0 }) {
  const s = activeStep;
  const sealed = s >= 2;
  const targets = [
    { Comp: Laptop, x: 318, y: 8, label: 'laptop' },
    { Comp: Server, x: 332, y: 78, label: 'server' },
    { Comp: Cloud, x: 322, y: 150, label: 'cloud / CI' },
  ];
  return (
    <div className="w-illus">
      <svg viewBox="0 0 440 210" className="illus-svg">
        {/* inputs (fade out once sealed) */}
        <g style={{ opacity: sealed ? 0 : 1, transition: 'opacity 0.5s' }}>
          <InBox y={40} label="code" show={s >= 0} />
          <InBox y={92} label="+ runtime" show={s >= 1} />
          <InBox y={144} label="+ libraries" show={s >= 1} />
        </g>

        {/* the image = a shipping container */}
        <g className={sealed ? 'illus-seal' : ''} style={{ opacity: sealed ? 1 : 0, transition: 'opacity 0.4s' }}>
          <Container x={150} y={92} scale={1.05} />
          <text x="218" y="150" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink-faint)">image · sealed</text>
        </g>

        {/* targets */}
        {targets.map((t, i) => (
          <g key={i} style={{ opacity: s >= 3 ? 1 : 0.18, transition: `opacity 0.4s ${i * 100}ms` }}>
            <t.Comp x={t.x} y={t.y} scale={0.62} state={s >= 4 ? 'ok' : 'idle'} />
          </g>
        ))}

        {/* travelling container copies */}
        {s >= 3 && targets.map((t, i) => (
          <g key={`c${i}`} className="illus-fly" style={{ animationDelay: `${i * 140}ms` }}>
            <rect x={t.x - 6} y={t.y + 20} width="18" height="14" rx="2" fill="var(--accent)" />
          </g>
        ))}
      </svg>
      <div className="illus-status">
        {s === 0 && 'Start with your code.'}
        {s === 1 && 'Add the runtime and libraries it needs.'}
        {s === 2 && 'Seal it all into one image — like a shipping container.'}
        {s === 3 && 'Ship that one image anywhere.'}
        {s >= 4 && '✓ It runs identically on every machine.'}
      </div>
    </div>
  );
}
