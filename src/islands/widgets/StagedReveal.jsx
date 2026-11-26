// StagedReveal — a column of items revealed one per step.
// scene props: { items: [{ label, note, tag }], caption? }
// Items up to the active step are shown; the current one is highlighted.
import React from 'react';

export default function StagedReveal({ items = [], caption, activeStep = 0 }) {
  return (
    <div className="w-staged">
      <div className="w-staged__list">
        {items.map((it, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
          return (
            <div key={i} className={`w-staged__item is-${state}`}>
              <span className="w-staged__num mono">{i + 1}</span>
              <div className="w-staged__body">
                <div className="w-staged__label mono">
                  {it.label}
                  {it.tag && <span className="w-staged__tag">{it.tag}</span>}
                </div>
                {it.note && <div className="w-staged__note">{it.note}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {caption && <div className="w-caption mono">{caption}</div>}
    </div>
  );
}
