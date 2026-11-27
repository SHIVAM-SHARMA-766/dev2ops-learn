// BigOBlocks — a bespoke, reference-grade visual for the Big-O lesson:
// a bold isometric staircase of hatched platforms (one complexity class each),
// with unit-cubes on top showing the real step count at n = 2, consistent
// "N steps" callouts, and an n tag wired to the tallest block.
import React from 'react';

// 2:1 isometric box. a = half-width of the top diamond, H = body height.
function isoBox(cx, topY, a, H) {
  const hh = a / 2;
  return {
    top: `M${cx},${topY - hh} L${cx + a},${topY} L${cx},${topY + hh} L${cx - a},${topY} Z`,
    left: `M${cx - a},${topY} L${cx},${topY + hh} L${cx},${topY + hh + H} L${cx - a},${topY + H} Z`,
    right: `M${cx + a},${topY} L${cx},${topY + hh} L${cx},${topY + hh + H} L${cx + a},${topY + H} Z`,
  };
}

function UnitCube({ x, y, s = 12 }) {
  const b = isoBox(x, y, s, s * 0.95);
  return (
    <g>
      <path d={b.left} fill="#ece5d6" stroke="#2b2620" strokeOpacity="0.55" strokeWidth="1" />
      <path d={b.right} fill="url(#boHatch)" stroke="#2b2620" strokeOpacity="0.55" strokeWidth="1" />
      <path d={b.top} fill="#fbf7f0" stroke="#2b2620" strokeOpacity="0.55" strokeWidth="1" />
    </g>
  );
}

// cube positions on a platform's top diamond (u,v in 0..1 across the two axes)
function cubeSpots(cx, topY, a, count) {
  const layouts = {
    1: [[0.5, 0.5]],
    2: [[0.25, 0.75], [0.75, 0.25]],
    3: [[0.25, 0.75], [0.75, 0.25], [0.75, 0.75]],
    4: [[0.22, 0.78], [0.78, 0.22], [0.22, 0.22], [0.78, 0.78]],
  };
  return (layouts[count] || layouts[1]).map(([u, v], i) => ({
    key: i,
    x: cx + (u - v) * a * 0.9,
    y: topY + (u + v - 1) * (a * 0.5) - 6,
  }));
}

const PLAT = [
  { cx: 78, bottomY: 292, H: 40, a: 46 },
  { cx: 174, bottomY: 288, H: 74, a: 46 },
  { cx: 272, bottomY: 284, H: 116, a: 46 },
  { cx: 374, bottomY: 280, H: 176, a: 46 },
];

export default function BigOBlocks({ items = [], nLabel = 'n = 2', caption, activeStep = 0 }) {
  return (
    <div className="w-bigo">
      <svg viewBox="0 0 480 320" className="bigo-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="boHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(55)">
            <rect width="7" height="7" fill="#f3eee4" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#d94f32" strokeWidth="3.6" strokeOpacity="0.92" />
          </pattern>
        </defs>

        {items.map((it, i) => {
          const P = PLAT[i];
          if (!P) return null;
          const topY = P.bottomY - P.H - P.a / 2;
          const b = isoBox(P.cx, topY, P.a, P.H);
          const shown = activeStep >= i;
          const active = activeStep === i;
          return (
            <g key={i} opacity={shown ? 1 : 0.16} style={{ transition: 'opacity 0.35s' }}>
              <path d={b.right} fill="url(#boHatch)" />
              <path d={b.left} fill="#2e2821" />
              {active && <path d={b.left} fill="var(--accent)" opacity="0.22" />}
              <path d={b.top} fill="#efe8da" />
              <path d={b.top} fill="#fff" opacity="0.16" />
              <path d={`${b.top} ${b.left} ${b.right}`} fill="none" stroke="#1f1b16" strokeOpacity="0.5" strokeWidth="1.4" />
              {/* label centred on the dark front face */}
              <text x={P.cx - P.a * 0.5} y={topY + P.H * 0.6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11.5" fontWeight="700" fill="#fbf7f0">{it.label}</text>
              {/* unit cubes on top */}
              {shown && cubeSpots(P.cx, topY, P.a, it.cubes).map((c) => <UnitCube key={c.key} x={c.x} y={c.y} />)}
            </g>
          );
        })}

        {/* N-steps callouts — a second pass so they sit on top of every block */}
        {items.map((it, i) => {
          const P = PLAT[i];
          if (!P || activeStep < i) return null;
          const topY = P.bottomY - P.H - P.a / 2;
          return (
            <g key={`cb${i}`} transform={`translate(${P.cx + P.a + 4}, ${topY + 6})`}>
              <rect x="0" y="-12" width="58" height="24" rx="12" fill="#2b2620" />
              <text x="29" y="4" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill="#fbf7f0">{it.cubes} {it.cubes === 1 ? 'step' : 'steps'}</text>
            </g>
          );
        })}

        {/* n tag, wired to the tallest block's top */}
        <line x1="330" y1="78" x2="374" y2="98" stroke="var(--accent)" strokeWidth="2.5" />
        <circle cx="374" cy="98" r="3.5" fill="var(--accent)" />
        <g transform="translate(262, 54)">
          <rect x="0" y="0" width="74" height="30" rx="8" fill="var(--accent)" />
          <text x="37" y="20" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14" fontWeight="700" fill="#fff">{nLabel}</text>
        </g>
      </svg>
      {caption && <div className="w-caption mono">{caption}</div>}
    </div>
  );
}
