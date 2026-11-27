// BigOBlocks — a close replica of the reference "Big-O" scene, matching its
// technique (studied from the live site): pure SVG, isometric blocks with
// ROUNDED corners, a cream/blush/coral palette, hairline ink outlines and soft
// shadows, on a dark panel. A staircase of platforms (one complexity class each)
// with cream unit-cubes on top = the real step count at n = 2.
import React from 'react';

const TOP = '#faf8f3';     // top faces
const FRONT = '#f2eee7';   // front (left) face
const BLUSH = '#fbe2d8';   // side (right) face
const CORAL = '#e2705a';   // hatch
const INK = '#2a2b2f';     // outlines / text

// round every corner of a closed polygon with radius r (the reference's soft look)
function roundPoly(pts, r) {
  const n = pts.length;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = (v) => Math.hypot(v[0], v[1]) || 1;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const v1 = sub(p0, p1), v2 = sub(p2, p1);
    const r1 = Math.min(r, len(v1) / 2), r2 = Math.min(r, len(v2) / 2);
    const A = [p1[0] + (v1[0] / len(v1)) * r1, p1[1] + (v1[1] / len(v1)) * r1];
    const B = [p1[0] + (v2[0] / len(v2)) * r2, p1[1] + (v2[1] / len(v2)) * r2];
    d += (i === 0 ? `M${A[0].toFixed(1)},${A[1].toFixed(1)}` : `L${A[0].toFixed(1)},${A[1].toFixed(1)}`);
    d += `Q${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${B[0].toFixed(1)},${B[1].toFixed(1)}`;
  }
  return d + 'Z';
}

// isometric box faces (2:1). a = half top-width, H = body height.
function faces(cx, topY, a, H) {
  const hh = a / 2;
  return {
    top: [[cx, topY - hh], [cx + a, topY], [cx, topY + hh], [cx - a, topY]],
    left: [[cx - a, topY], [cx, topY + hh], [cx, topY + hh + H], [cx - a, topY + H]],
    right: [[cx + a, topY], [cx, topY + hh], [cx, topY + hh + H], [cx + a, topY + H]],
  };
}

function Block({ cx, topY, a, H, r = 4, hatch = true, cube = false }) {
  const f = faces(cx, topY, a, H);
  const hair = { fill: 'none', stroke: INK, strokeWidth: cube ? 1 : 1.1, strokeLinejoin: 'round' };
  return (
    <g>
      <path d={roundPoly(f.right, r)} fill={BLUSH} />
      {hatch && <path d={roundPoly(f.right, r)} fill="url(#boHatch)" />}
      <path d={roundPoly(f.right, r)} {...hair} />
      <path d={roundPoly(f.left, r)} fill={FRONT} />
      {hatch && <path d={roundPoly(f.left, r)} fill="url(#boHatch)" />}
      <path d={roundPoly(f.left, r)} {...hair} />
      <path d={roundPoly(f.top, r)} fill={TOP} />
      <path d={roundPoly(f.top, r)} {...hair} />
    </g>
  );
}

function cubeSpots(cx, topY, a, count) {
  const L = { 1: [[0.5, 0.5]], 2: [[0.28, 0.72], [0.72, 0.28]], 4: [[0.24, 0.76], [0.76, 0.24], [0.24, 0.24], [0.76, 0.76]] };
  return (L[count] || L[1]).map(([u, v], i) => ({ key: i, x: cx + (u - v) * a * 0.82, y: topY + (u + v - 1) * (a * 0.5) - 5 }));
}

const PLAT = [
  { cx: 92, bottomY: 300, H: 44, a: 45 },
  { cx: 214, bottomY: 300, H: 84, a: 45 },
  { cx: 336, bottomY: 300, H: 128, a: 45 },
  { cx: 458, bottomY: 300, H: 184, a: 45 },
];

export default function BigOBlocks({ items = [], nLabel = 'n = 2', activeStep = 0 }) {
  return (
    <div className="w-bigo">
      <svg viewBox="0 0 560 356" className="bigo-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="boHatch" width="6.4" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <rect width="3" height="8" fill={CORAL} />
          </pattern>
          <pattern id="boGrid" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M34 0 L0 0 0 34" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
          <filter id="boShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#000" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect x="0" y="0" width="560" height="356" rx="18" fill="#1b1712" />
        <rect x="0" y="0" width="560" height="356" rx="18" fill="url(#boGrid)" />

        {items.map((it, i) => {
          const P = PLAT[i];
          if (!P) return null;
          const topY = P.bottomY - P.H - P.a / 2;
          const shown = activeStep >= i;
          return (
            <g key={i} opacity={shown ? 1 : 0.25} style={{ transition: 'opacity 0.4s ease' }}>
              <g filter="url(#boShadow)"><Block cx={P.cx} topY={topY} a={P.a} H={P.H} /></g>
              <g>
                <rect x={P.cx - P.a * 0.5 - 30} y={topY + P.H - 26} width="60" height="22" rx="7" fill={TOP} />
                <text x={P.cx - P.a * 0.5} y={topY + P.H - 11} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12.5" fontWeight="700" fill={INK}>{it.label}</text>
              </g>
              {shown && cubeSpots(P.cx, topY, P.a, it.cubes).map((c) => (
                <Block key={c.key} cx={c.x} topY={c.y} a={10} H={10} r={2.5} hatch={false} cube />
              ))}
            </g>
          );
        })}

        {items.map((it, i) => {
          const P = PLAT[i];
          if (!P || activeStep < i) return null;
          const topY = P.bottomY - P.H - P.a / 2;
          const bx = P.cx + P.a + 7, by = topY + 4;
          return (
            <g key={`cb${i}`}>
              <path d={`M${bx - 7},${by} L${bx + 2},${by - 5} L${bx + 2},${by + 5} Z`} fill="#faf8f3" />
              <rect x={bx} y={by - 13} width="62" height="26" rx="13" fill="#faf8f3" />
              <text x={bx + 31} y={by + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill={INK}>{it.cubes} {it.cubes === 1 ? 'step' : 'steps'}</text>
            </g>
          );
        })}

        <line x1="392" y1="56" x2="458" y2="98" stroke={CORAL} strokeWidth="2.5" />
        <circle cx="458" cy="98" r="4" fill={CORAL} />
        <g transform="translate(322, 36)">
          <rect x="0" y="0" width="80" height="32" rx="10" fill={CORAL} />
          <text x="40" y="21" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="15" fontWeight="700" fill="#fff">{nLabel}</text>
        </g>
      </svg>
    </div>
  );
}
