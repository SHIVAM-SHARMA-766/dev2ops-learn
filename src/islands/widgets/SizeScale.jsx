// SizeScale — image bases shrink step by step. Each bar's height encodes size;
// the active one is highlighted. Teaches "smaller base = less to ship & attack".
// scene props: items: [{ label, mb, note }]   (largest first)
import React from 'react';

export default function SizeScale({ items = [], activeStep = 0 }) {
  const max = Math.max(...items.map((i) => i.mb), 1);
  return (
    <div className="w-size">
      <div className="size-row">
        {items.map((it, i) => {
          const shown = activeStep >= i;
          const active = activeStep === i;
          const h = 18 + Math.round((it.mb / max) * 150);
          return (
            <div key={i} className={`size-col ${shown ? 'is-in' : 'is-out'} ${active ? 'is-active' : ''}`}>
              <span className="size-mb mono">{it.mb >= 1 ? `${it.mb}MB` : '~0'}</span>
              <div className="size-bar" style={{ height: `${shown ? h : 0}px` }} />
              <span className="size-label mono">{it.label}</span>
              {it.note && <span className="size-note">{it.note}</span>}
            </div>
          );
        })}
      </div>
      <div className="w-caption mono">smaller base → faster pulls, fewer packages, fewer CVEs</div>
    </div>
  );
}
