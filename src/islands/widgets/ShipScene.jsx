// ShipScene — animates "build once, run anywhere". Code + runtime + libraries
// combine into a sealed image, which then runs identically on several targets.
// Driven purely by activeStep (0..4). No props needed.
import React from 'react';

function Box({ x, y, label, tone, style }) {
  return (
    <div className={`scene-box scene-box--${tone}`} style={{ left: `${x}%`, top: `${y}%`, ...style }}>
      {label}
    </div>
  );
}

export default function ShipScene({ activeStep = 0 }) {
  const s = activeStep;
  // inputs slide to the image centre (40%,50%) and fade once merged (s>=2)
  const merged = s >= 2;
  const inputStyle = (shown) => ({
    opacity: merged ? 0 : shown ? 1 : 0.15,
    transform: merged ? 'translate(-50%,-50%) translateX(90px) scale(0.5)' : 'translate(-50%,-50%)',
  });
  const targets = [
    { x: 86, y: 24, label: '💻 laptop' },
    { x: 90, y: 50, label: '🖥️ server' },
    { x: 86, y: 76, label: '⚙️ CI' },
  ];
  return (
    <div className="w-scene w-ship">
      {/* inputs */}
      <Box x={12} y={28} label="code" tone="code" style={inputStyle(s >= 0)} />
      <Box x={12} y={50} label="runtime" tone="dep" style={inputStyle(s >= 1)} />
      <Box x={12} y={72} label="libraries" tone="dep" style={inputStyle(s >= 1)} />

      {/* the image */}
      <div
        className={`scene-image ${s >= 2 ? 'is-sealed' : ''}`}
        style={{
          left: '40%', top: '50%',
          opacity: s >= 2 ? 1 : 0.12,
          transform: `translate(-50%,-50%) scale(${s >= 2 ? 1 : 0.8})`,
        }}
      >
        <span className="scene-image__tag mono">IMAGE</span>
        <span className="scene-image__sub mono">sealed · reproducible</span>
      </div>

      {/* targets */}
      {targets.map((t, i) => (
        <div
          key={i}
          className={`scene-target ${s >= 3 ? 'is-lit' : ''}`}
          style={{ left: `${t.x}%`, top: `${t.y}%`, opacity: s >= 3 ? 1 : 0.2, transitionDelay: `${i * 120}ms` }}
        >
          <span className="scene-target__name">{t.label}</span>
          <span className="scene-target__ok mono" style={{ opacity: s >= 4 ? 1 : 0 }}>✓ runs the same</span>
        </div>
      ))}

      {/* travelling copies from image to targets (s>=3) */}
      {s >= 3 && targets.map((t, i) => (
        <span
          key={`c${i}`}
          className="scene-copy"
          style={{ left: `${t.x - 4}%`, top: `${t.y}%`, transitionDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
