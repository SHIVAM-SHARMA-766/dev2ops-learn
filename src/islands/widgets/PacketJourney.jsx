// PacketJourney — a request/packet travels through nodes on an isometric grid,
// with a continuously looping glowing packet on the active hop and a flowing
// dashed connector. Inspired by the protocol-explorer / system-design apps.
// scene props:
//   nodes: [{ id, label, sub, x, y, logo?, icon? }]   x,y in 0..100 (percent)
//   path:  [id, id, ...]        the route; step i animates hop path[i] -> path[i+1]
//   dir:   per-step override of travel direction (unused; packet follows path)
import React from 'react';

function Glyph({ logo, icon }) {
  if (logo) return <img className="pj-logo" src={`/art/logos/${logo}.svg`} alt="" width="26" height="26" />;
  if (icon) {
    const url = `url(/art/icons/${icon}.svg)`;
    return <span className="pj-icon" style={{ WebkitMaskImage: url, maskImage: url }} aria-hidden="true" />;
  }
  return <span className="pj-dot" />;
}

export default function PacketJourney({ nodes = [], path = [], activeStep = 0 }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const hop = Math.min(activeStep, Math.max(0, path.length - 2));
  const fromN = byId[path[hop]] || nodes[0];
  const toN = byId[path[hop + 1]] || fromN;
  const reached = new Set(path.slice(0, hop + 2)); // nodes up to & incl. destination

  const edges = [];
  for (let i = 0; i < path.length - 1; i++) edges.push([path[i], path[i + 1], i]);

  return (
    <div className="w-journey">
      {/* connectors + travelling packet (distortion-tolerant layer) */}
      <svg className="pj-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([a, b, i]) => {
          const na = byId[a], nb = byId[b];
          if (!na || !nb) return null;
          const active = i === hop;
          return (
            <line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              className={`pj-wire ${active ? 'is-active' : reached.has(a) && reached.has(b) ? 'is-done' : 'is-idle'}`}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* the packet — continuous loop along the active hop (HTML stays round) */}
      <span
        key={hop}
        className="pj-packet"
        style={{
          '--fx': `${fromN.x}%`, '--fy': `${fromN.y}%`,
          '--tx': `${toN.x}%`, '--ty': `${toN.y}%`,
        }}
      >
        <span className="pj-packet__core" />
      </span>

      {/* nodes */}
      {nodes.map((n) => (
        <div
          key={n.id}
          className={`pj-node ${reached.has(n.id) ? 'is-on' : ''} ${path[hop + 1] === n.id ? 'is-target' : ''}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className="pj-badge"><Glyph logo={n.logo} icon={n.icon} /></span>
          <span className="pj-label mono">{n.label}</span>
          {n.sub && <span className="pj-sub mono">{n.sub}</span>}
        </div>
      ))}
    </div>
  );
}
