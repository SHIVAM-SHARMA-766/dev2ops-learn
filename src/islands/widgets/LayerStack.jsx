// LayerStack — read-only image layers stack up one per step; a writable layer
// lands on top; a final step animates "copy-up" of a file into the writable layer.
// scene props:
//   layers: [{ label, sub }]     read-only layers, bottom → top
//   writable: { label }          the container's writable layer (appears after all layers)
//   copyUp: true                 animate copy-up on the last step
import React from 'react';

export default function LayerStack({ layers = [], writable, copyUp, caption, activeStep = 0 }) {
  const total = layers.length + (writable ? 1 : 0);
  const showWritable = writable && activeStep >= layers.length;
  const copyUpNow = copyUp && writable && activeStep >= total; // one step past the writable layer

  // render top → bottom (writable first)
  return (
    <div className="w-stack">
      <div className="w-stack__col">
        {writable && (
          <div className={`stack-layer stack-layer--writable ${showWritable ? 'is-in' : 'is-out'}`}>
            <span className="stack-layer__label mono">{writable.label}</span>
            <span className="stack-layer__tag">writable</span>
            {copyUpNow && <span className="stack-copyup" aria-hidden="true">📄</span>}
          </div>
        )}
        {layers.slice().reverse().map((l, ri) => {
          const i = layers.length - 1 - ri; // real index bottom=0
          const visible = activeStep >= i;
          return (
            <div key={i} className={`stack-layer ${visible ? 'is-in' : 'is-out'} ${copyUpNow && i === 0 ? 'is-source' : ''}`}>
              <span className="stack-layer__label mono">{l.label}</span>
              {l.sub && <span className="stack-layer__sub">{l.sub}</span>}
            </div>
          );
        })}
      </div>
      <div className="w-caption mono">{copyUpNow ? 'copy-up: editing a lower file copies it into the writable layer first' : caption}</div>
    </div>
  );
}
