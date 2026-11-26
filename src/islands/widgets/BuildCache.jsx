// BuildCache — an animated `docker build` where each layer is CACHED (instant),
// BUILDING (shimmer), DONE or PENDING, driven per step. Teaches layer caching.
// scene props:
//   layers: ["FROM node:20", "WORKDIR /app", ...]
//   states: [ ["cached","building","pending",...], ... ]   states[activeStep][layerIndex]
//   note: [stepNote, ...]   optional (unused here; narration carries it)
import React from 'react';

const LABEL = { cached: 'CACHED', building: 'BUILDING', done: 'DONE', pending: '' };

export default function BuildCache({ layers = [], states = [], activeStep = 0 }) {
  const row = states[activeStep] || states[states.length - 1] || layers.map(() => 'pending');
  return (
    <div className="w-build card">
      <div className="w-build__bar mono">
        <span className="w-build__dot" /><span className="w-build__dot" /><span className="w-build__dot" />
        <span className="w-build__name">$ docker build .</span>
      </div>
      <div className="w-build__layers mono">
        {layers.map((ln, i) => {
          const state = row[i] || 'pending';
          return (
            <div key={i} className={`w-build__layer is-${state}`}>
              <span className="w-build__step">Step {i + 1}/{layers.length}</span>
              <span className="w-build__inst">{ln}</span>
              <span className={`w-build__badge is-${state}`}>
                {state === 'building' && <span className="w-build__spin" />}
                {LABEL[state]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
