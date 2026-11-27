// BigOBlocks — a bespoke, tailor-made visual for the Big-O lesson: each
// complexity class is an isometric tower of hatched 3D cubes (the number of
// "steps" for the current n). Not a generic chart — purpose-built for this one
// concept, the way the reference apps craft a visual per lesson.
import React from 'react';

const HW = 15, HH = 7.5, BH = 13; // cube half-width, half-top-height, body height

function Cube({ cx, topY, tone, active }) {
  const base = active ? 'var(--accent)' : 'var(--ink-soft)';
  const top = `M${cx},${topY - HH} L${cx + HW},${topY} L${cx},${topY + HH} L${cx - HW},${topY} Z`;
  const left = `M${cx - HW},${topY} L${cx},${topY + HH} L${cx},${topY + HH + BH} L${cx - HW},${topY + BH} Z`;
  const right = `M${cx + HW},${topY} L${cx},${topY + HH} L${cx},${topY + HH + BH} L${cx + HW},${topY + BH} Z`;
  return (
    <g>
      <path d={top} fill={base} opacity={active ? 0.95 : 0.5} />
      <path d={top} fill="#fff" opacity="0.22" />
      <path d={left} fill={base} opacity={active ? 0.85 : 0.42} />
      <path d={right} fill={base} opacity={active ? 0.85 : 0.42} />
      <path d={right} fill="url(#bigoHatch)" opacity={active ? 0.9 : 0.4} />
      <path d={`${top} ${left} ${right}`} fill="none" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.8" />
    </g>
  );
}

export default function BigOBlocks({ items = [], nLabel, caption, activeStep = 0 }) {
  const cols = items.length;
  const gap = 84;
  const startX = 70;
  const groundY = 300;

  return (
    <div className="w-bigo">
      <svg viewBox="0 0 440 340" className="bigo-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="bigoHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(60)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity="0.16" strokeWidth="2" />
          </pattern>
        </defs>
        {nLabel && (
          <g>
            <rect x="180" y="8" width="80" height="24" rx="6" fill="var(--accent)" />
            <text x="220" y="24" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill="var(--accent-ink)">{nLabel}</text>
          </g>
        )}
        {items.map((it, i) => {
          const cx = startX + i * gap;
          const revealed = activeStep >= i;
          const active = activeStep === i;
          const count = revealed ? it.blocks : 0;
          return (
            <g key={i} style={{ transition: 'opacity 0.3s' }} opacity={revealed ? 1 : 0.25}>
              {Array.from({ length: count }, (_, k) => (
                <Cube key={k} cx={cx} topY={groundY - k * BH} tone={it.tone} active={active} />
              ))}
              <text x={cx} y={groundY + 28} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill={active ? 'var(--accent)' : 'var(--ink)'}>{it.label}</text>
              <text x={cx} y={groundY + 44} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-faint)">{it.blocks} {it.blocks === 1 ? 'step' : 'steps'}</text>
            </g>
          );
        })}
      </svg>
      {caption && <div className="w-caption mono">{caption}</div>}
    </div>
  );
}
