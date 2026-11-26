// Diagram — a small node/edge graph where nodes activate per step.
// scene props:
//   nodes: [{ id, label, sub, x, y }]      x,y in 0..100 (percent of canvas)
//   edges: [[fromId, toId], ...]
//   active: [[id, ...], ...]               active[activeStep] = ids lit for that step
import React from 'react';

export default function Diagram({ nodes = [], edges = [], active = [], activeStep = 0 }) {
  const lit = new Set(active[activeStep] || nodes.map((n) => n.id));
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const litEdge = ([a, b]) => lit.has(a) && lit.has(b);

  return (
    <div className="w-diagram">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-diagram__edges">
        {edges.map(([a, b], i) => {
          const na = byId[a], nb = byId[b];
          if (!na || !nb) return null;
          return (
            <line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              className={litEdge([a, b]) ? 'is-on' : 'is-off'}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className={`w-node ${lit.has(n.id) ? 'is-on' : 'is-off'}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className="w-node__label mono">{n.label}</span>
          {n.sub && <span className="w-node__sub mono">{n.sub}</span>}
        </div>
      ))}
    </div>
  );
}
