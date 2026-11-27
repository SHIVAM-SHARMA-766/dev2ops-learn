// IconReveal — a row of real graphics revealed one per step. Each item is either
// a brand `logo` (original colours, from /art/logos) or a mono `icon` (tinted to
// the accent, from /art/icons). The active item is highlighted.
// scene props: items: [{ logo | icon, label, note }], caption?
import React from 'react';

function Graphic({ logo, icon }) {
  if (logo) return <img className="ir-logo" src={`/art/logos/${logo}.svg`} alt="" width="40" height="40" />;
  const url = `url(/art/icons/${icon}.svg)`;
  return <span className="ir-icon" style={{ WebkitMaskImage: url, maskImage: url }} aria-hidden="true" />;
}

export default function IconReveal({ items = [], caption, activeStep = 0 }) {
  return (
    <div className="w-iconreveal">
      <div className="ir-row">
        {items.map((it, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
          return (
            <div key={i} className={`ir-item is-${state}`}>
              <div className="ir-badge"><Graphic logo={it.logo} icon={it.icon} /></div>
              <div className="ir-label mono">{it.label}</div>
              {it.note && <div className="ir-note">{it.note}</div>}
            </div>
          );
        })}
      </div>
      {caption && <div className="w-caption mono">{caption}</div>}
    </div>
  );
}
