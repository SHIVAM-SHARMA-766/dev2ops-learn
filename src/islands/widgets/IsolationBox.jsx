// IsolationBox — a process gains namespace "walls" one per step (isolation),
// then a cgroup meter fills to a cap (limits). Teaches what a container is.
// Driven by activeStep: 0 process · 1-4 the four namespaces · 5 cgroups.
import React from 'react';

const WALLS = [
  { side: 'top', label: 'PID ns', note: 'own process tree' },
  { side: 'right', label: 'NET ns', note: 'own network' },
  { side: 'bottom', label: 'MNT ns', note: 'own filesystem' },
  { side: 'left', label: 'USER ns', note: 'mapped root' },
];

export default function IsolationBox({ activeStep = 0 }) {
  const s = activeStep;
  const sealed = Math.min(Math.max(s, 0), 4); // 0..4 walls
  const showMeter = s >= 5;
  return (
    <div className="w-iso">
      <div className={`iso-box sealed-${sealed}`}>
        <div className="iso-proc mono">your app<span>process · PID 1</span></div>
        {WALLS.map((w, i) => (
          <span key={w.side} className={`iso-wall iso-wall--${w.side} ${s >= i + 1 ? 'is-on' : ''}`}>
            <b>{w.label}</b><em>{w.note}</em>
          </span>
        ))}
      </div>

      <div className={`iso-meter ${showMeter ? 'is-on' : ''}`}>
        <div className="iso-meter__top mono"><span>cgroup limit</span><span>CPU · memory · I/O</span></div>
        <div className="iso-meter__bar">
          <span className="iso-meter__fill" style={{ width: showMeter ? '68%' : '0%' }} />
          <i className="iso-meter__cap" />
        </div>
        <div className="iso-meter__hint mono">{showMeter ? 'capped — it can only use this much' : ''}</div>
      </div>
    </div>
  );
}
