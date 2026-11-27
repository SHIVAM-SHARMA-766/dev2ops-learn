// Reusable illustrated SVG pieces (not flat boxes): a 2.5D shipping container,
// a laptop, a server rack and a cloud. Theme-aware via CSS vars; depth via
// light/dark overlays. Each returns an <svg> group; place with x/y/scale.
import React from 'react';

export function Container({ x = 0, y = 0, scale = 1 }) {
  const corr = Array.from({ length: 8 }, (_, i) => 12 + i * 13);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* right side (depth) */}
      <polygon points="118,8 146,-10 146,44 118,62" fill="var(--accent)" />
      <polygon points="118,8 146,-10 146,44 118,62" fill="#000" opacity="0.2" />
      {/* top (depth) */}
      <polygon points="0,8 28,-10 146,-10 118,8" fill="var(--accent)" />
      <polygon points="0,8 28,-10 146,-10 118,8" fill="#fff" opacity="0.22" />
      {/* front face */}
      <rect x="0" y="8" width="118" height="54" rx="3" fill="var(--accent)" />
      {corr.map((cx) => (
        <line key={cx} x1={cx} y1="12" x2={cx} y2="58" stroke="#000" opacity="0.1" strokeWidth="3" />
      ))}
      <rect x="2.5" y="10.5" width="113" height="49" rx="2" fill="none" stroke="#000" opacity="0.18" strokeWidth="1.5" />
      <line x1="59" y1="11" x2="59" y2="59" stroke="#000" opacity="0.18" strokeWidth="1.5" />
      {/* door handles */}
      <rect x="52" y="28" width="3" height="14" rx="1.5" fill="#000" opacity="0.25" />
      <rect x="63" y="28" width="3" height="14" rx="1.5" fill="#000" opacity="0.25" />
    </g>
  );
}

export function Laptop({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const col = state === 'ok' ? 'var(--accent-green)' : state === 'bad' ? 'var(--accent-red)' : 'var(--ink-soft)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* base */}
      <polygon points="-14,58 94,58 104,68 -24,68" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1.5" />
      {/* lid */}
      <rect x="4" y="2" width="72" height="54" rx="4" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2" />
      <rect x="10" y="8" width="60" height="42" rx="2" fill={col} opacity="0.16" />
      <text x="40" y="37" textAnchor="middle" fontSize="24" fill={col}>
        {state === 'ok' ? '✓' : state === 'bad' ? '✕' : ''}
      </text>
    </g>
  );
}

export function Server({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const led = state === 'ok' ? 'var(--accent-green)' : state === 'bad' ? 'var(--accent-red)' : 'var(--ink-faint)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <polygon points="56,0 70,-9 70,69 56,78" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1.5" />
      <polygon points="0,0 14,-9 70,-9 56,0" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="1.5" />
      <rect x="0" y="0" width="56" height="78" rx="3" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="6" y={8 + i * 17} width="44" height="12" rx="2" fill="var(--surface-2)" />
          <circle cx="44" cy={14 + i * 17} r="2.6" fill={led} />
          <line x1="10" y1={14 + i * 17} x2="30" y2={14 + i * 17} stroke="var(--line-strong)" strokeWidth="1.5" />
        </g>
      ))}
    </g>
  );
}

export function Cloud({ x = 0, y = 0, scale = 1, state = 'idle' }) {
  const col = state === 'ok' ? 'var(--accent-green)' : 'var(--ink-soft)';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M18 46 a16 16 0 0 1 2 -31 a20 20 0 0 1 38 4 a14 14 0 0 1 0 27 z"
        fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2"
      />
      <text x="38" y="40" textAnchor="middle" fontSize="18" fill={col}>{state === 'ok' ? '✓' : '⚙'}</text>
    </g>
  );
}
