// Compare — two columns side by side (before/after, A vs B).
// scene props:
//   left:  { title, items: [string] }
//   right: { title, items: [string] }
//   highlight: [[rowIdx,...], ...]   optional: highlight[activeStep] = rows lit on both sides
import React from 'react';

function Col({ col, lit, side }) {
  return (
    <div className={`w-compare__col w-compare__col--${side}`}>
      <div className="w-compare__title mono">{col.title}</div>
      <ul className="w-compare__items">
        {(col.items || []).map((it, i) => (
          <li key={i} className={lit && lit.has(i) ? 'is-lit' : ''}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Compare({ left, right, highlight, activeStep = 0 }) {
  const lit = highlight ? new Set(highlight[activeStep] || []) : null;
  return (
    <div className="w-compare">
      <Col col={left || {}} lit={lit} side="left" />
      <div className="w-compare__vs mono">vs</div>
      <Col col={right || {}} lit={lit} side="right" />
    </div>
  );
}
