// CodeWalk — a code block whose lines light up per step.
// scene props: { lines: ["..."], highlights: [[lineIdx,...], ...], filename? }
// highlights[activeStep] is the set of 0-based line indexes to emphasize.
import React from 'react';

export default function CodeWalk({ lines = [], highlights = [], filename, activeStep = 0 }) {
  const active = new Set(highlights[activeStep] || []);
  const hasHl = highlights.length > 0;
  return (
    <div className="w-code card">
      <div className="w-code__bar mono">
        <span className="w-code__dot" /><span className="w-code__dot" /><span className="w-code__dot" />
        <span className="w-code__name">{filename || 'example'}</span>
      </div>
      <pre className="w-code__pre">
        {lines.map((ln, i) => {
          const on = !hasHl || active.has(i);
          return (
            <div key={i} className={`w-code__line ${on ? 'is-on' : 'is-off'}`}>
              <span className="w-code__ln mono">{String(i + 1).padStart(2, ' ')}</span>
              <code>{ln === '' ? ' ' : ln}</code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
