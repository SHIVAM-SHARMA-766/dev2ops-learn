// Flow — a node graph with a dot that travels the path one hop per step.
// The dot animates (CSS transition) as the step changes, so a request / packet
// is seen moving hop by hop.
// scene props:
//   nodes: [{ id, label, sub, x, y }]   x,y in 0..100 (percent)
//   path: [id, id, ...]                 the route the dot follows
//   labels: [stepLabel, ...]            optional caption per hop
import React from 'react';

export default function Flow({ nodes = [], path = [], activeStep = 0 }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const hop = Math.min(activeStep, Math.max(0, path.length - 1));
  const dotNode = byId[path[hop]] || nodes[0] || { x: 50, y: 50 };
  const litIds = new Set(path.slice(0, hop + 1));
  const activeSeg = hop > 0 ? [path[hop - 1], path[hop]] : null;

  const isActiveEdge = (a, b) =>
    activeSeg && ((activeSeg[0] === a && activeSeg[1] === b) || (activeSeg[0] === b && activeSeg[1] === a));

  // edges = consecutive pairs along the path
  const edges = [];
  for (let i = 0; i < path.length - 1; i++) edges.push([path[i], path[i + 1]]);

  return (
    <div className="w-flow">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-flow__edges">
        {edges.map(([a, b], i) => {
          const na = byId[a], nb = byId[b];
          if (!na || !nb) return null;
          return (
            <line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              className={isActiveEdge(a, b) ? 'is-active' : litIds.has(a) && litIds.has(b) ? 'is-done' : 'is-idle'}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* the travelling dot */}
      <div className="w-flow__dot" style={{ left: `${dotNode.x}%`, top: `${dotNode.y}%` }}>
        <span className="w-flow__ping" />
      </div>

      {nodes.map((n) => (
        <div
          key={n.id}
          className={`w-node ${litIds.has(n.id) ? 'is-on' : 'is-off'} ${path[hop] === n.id ? 'is-here' : ''}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className="w-node__label mono">{n.label}</span>
          {n.sub && <span className="w-node__sub mono">{n.sub}</span>}
        </div>
      ))}
    </div>
  );
}
