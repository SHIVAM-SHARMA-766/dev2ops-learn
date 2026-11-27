// Hand-crafted illustrated SVG pieces with gradients, isometric depth and soft
// shadows — brand-neutral and theme-aware. Render <ArtDefs/> once per scene <svg>
// for the shared gradients/filters, then place pieces with x/y/scale.
// Brand logos (Docker, Node, …) live under /art/logos and render via <Logo>.
import React from 'react';

export function ArtDefs() {
  return (
    <defs>
      <linearGradient id="d2oAcc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--accent)" />
        <stop offset="1" stopColor="var(--accent)" stopOpacity="0.78" />
      </linearGradient>
      <linearGradient id="d2oSurf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--surface)" />
        <stop offset="1" stopColor="var(--surface-2)" />
      </linearGradient>
      <linearGradient id="d2oScreen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
        <stop offset="1" stopColor="var(--accent)" stopOpacity="0.08" />
      </linearGradient>
      <filter id="d2oShadow" x="-40%" y="-40%" width="180%" height="190%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.16" />
      </filter>
      <filter id="d2oSoft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
  );
}

function Shadow({ cx, cy, rx = 46, ry = 9 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity="0.1" filter="url(#d2oSoft)" />;
}

// Isometric shipping container
export function Container({ x = 0, y = 0, scale = 1 }) {
  const corr = Array.from({ length: 8 }, (_, i) => 13 + i * 12.5);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Shadow cx={70} cy={72} rx={66} />
      <polygon points="118,8 146,-10 146,44 118,62" fill="url(#d2oAcc)" />
      <polygon points="118,8 146,-10 146,44 118,62" fill="#000" opacity="0.22" />
      <polygon points="0,8 28,-10 146,-10 118,8" fill="var(--accent)" />
      <polygon points="0,8 28,-10 146,-10 118,8" fill="#fff" opacity="0.26" />
      <rect x="0" y="8" width="118" height="54" rx="4" fill="url(#d2oAcc)" />
      {corr.map((cx) => (
        <line key={cx} x1={cx} y1="13" x2={cx} y2="57" stroke="#000" opacity="0.09" strokeWidth="3.5" />
      ))}
      <rect x="3" y="11" width="112" height="48" rx="3" fill="none" stroke="#fff" opacity="0.18" strokeWidth="1.3" />
      <line x1="59" y1="12" x2="59" y2="58" stroke="#000" opacity="0.16" strokeWidth="2" />
      <rect x="52" y="29" width="3.4" height="13" rx="1.7" fill="#fff" opacity="0.5" />
      <rect x="63" y="29" width="3.4" height="13" rx="1.7" fill="#fff" opacity="0.5" />
      {/* corner castings */}
      {[[0, 8], [111, 8], [0, 55], [111, 55]].map(([px, py], i) => (
        <rect key={i} x={px} y={py} width="7" height="7" rx="1.5" fill="#000" opacity="0.18" />
      ))}
    </g>
  );
}

export function Laptop({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const glyph = state === 'ok' ? '✓' : state === 'bad' ? '✕' : '';
  const col = state === 'ok' ? 'var(--accent-green)' : state === 'bad' ? 'var(--accent-red)' : 'var(--ink-soft)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Shadow cx={42} cy={70} rx={54} />
      <polygon points="-16,58 96,58 108,69 -28,69" fill="url(#d2oSurf)" stroke="var(--line-strong)" strokeWidth="1.5" />
      <rect x="-26" y="66" width="128" height="4" rx="2" fill="var(--line-strong)" />
      <rect x="4" y="0" width="76" height="56" rx="6" fill="url(#d2oSurf)" stroke="var(--line-strong)" strokeWidth="2" filter="url(#d2oShadow)" />
      <rect x="10" y="7" width="64" height="42" rx="3" fill={state === 'idle' ? 'url(#d2oScreen)' : col} fillOpacity={state === 'idle' ? 1 : 0.18} />
      {glyph && <text x="42" y="36" textAnchor="middle" fontSize="26" fontWeight="700" fill={col}>{glyph}</text>}
    </g>
  );
}

export function Server({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const led = state === 'ok' ? 'var(--accent-green)' : state === 'bad' ? 'var(--accent-red)' : 'var(--accent-amber)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Shadow cx={30} cy={82} rx={40} />
      <polygon points="58,2 72,-8 72,70 58,80" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1.4" />
      <polygon points="0,2 14,-8 72,-8 58,2" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="1.4" />
      <rect x="0" y="2" width="58" height="78" rx="5" fill="url(#d2oSurf)" stroke="var(--line-strong)" strokeWidth="2" filter="url(#d2oShadow)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="6" y={9 + i * 17} width="46" height="12" rx="2.5" fill="var(--surface-2)" stroke="var(--line)" strokeWidth="1" />
          <circle cx="45" cy={15 + i * 17} r="2.8" fill={led}>
            {state !== 'idle' && <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" begin={`${i * 0.2}s`} />}
          </circle>
          <line x1="11" y1={15 + i * 17} x2="30" y2={15 + i * 17} stroke="var(--line-strong)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

export function Database({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const top = state === 'ok' ? 'var(--accent)' : 'var(--accent-teal)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Shadow cx={30} cy={78} rx={34} />
      <path d="M2 14 v48 a28 11 0 0 0 56 0 v-48 z" fill="url(#d2oSurf)" stroke="var(--line-strong)" strokeWidth="2" />
      <ellipse cx="30" cy="38" rx="28" ry="11" fill="none" stroke="var(--line-strong)" strokeWidth="1.3" opacity="0.6" />
      <ellipse cx="30" cy="14" rx="28" ry="11" fill={top} opacity="0.85" stroke="var(--line-strong)" strokeWidth="2" />
      <ellipse cx="30" cy="14" rx="28" ry="11" fill="#fff" opacity="0.15" />
    </g>
  );
}

export function Cloud({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const col = state === 'ok' ? 'var(--accent-green)' : 'var(--ink-soft)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Shadow cx={38} cy={54} rx={34} ry={7} />
      <path d="M18 48 a16 16 0 0 1 2 -31 a20 20 0 0 1 38 4 a14 14 0 0 1 0 27 z"
        fill="url(#d2oSurf)" stroke="var(--line-strong)" strokeWidth="2" filter="url(#d2oShadow)" />
      <text x="38" y="42" textAnchor="middle" fontSize="18" fontWeight="700" fill={col}>{state === 'ok' ? '✓' : '⚙'}</text>
    </g>
  );
}

export function Box({ x = 0, y = 0, scale = 1, color = 'var(--accent)' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <polygon points="24,2 46,13 24,24 2,13" fill={color} />
      <polygon points="24,2 46,13 24,24 2,13" fill="#fff" opacity="0.25" />
      <polygon points="2,13 24,24 24,46 2,35" fill={color} />
      <polygon points="2,13 24,24 24,46 2,35" fill="#000" opacity="0.12" />
      <polygon points="46,13 24,24 24,46 46,35" fill={color} />
      <polygon points="46,13 24,24 24,46 46,35" fill="#000" opacity="0.24" />
    </g>
  );
}

// Brand logo from the vendored pack under /art/logos (e.g. "docker").
export function Logo({ name, x = 0, y = 0, size = 44 }) {
  return <image href={`/art/logos/${name}.svg`} x={x} y={y} width={size} height={size} />;
}
