// TerminalReplay — a fake terminal that reveals command/output blocks per step.
// scene props:
//   prompt: "$"                       (optional, default "$")
//   blocks: [{ cmd, out }]            cmd typed at the prompt, out printed below
//   reveal: [n0, n1, ...]             reveal[activeStep] = how many blocks shown
// If reveal is omitted, step i shows i+1 blocks.
import React from 'react';
import CopyButton from './CopyButton.jsx';

export default function TerminalReplay({ prompt = '$', blocks = [], reveal, activeStep = 0 }) {
  const shown = reveal ? reveal[activeStep] ?? reveal[reveal.length - 1] : activeStep + 1;
  const visible = blocks.slice(0, shown);
  const allText = blocks.map((b) => `${prompt} ${b.cmd}`).join('\n');

  return (
    <div className="w-term card">
      <div className="w-term__bar mono">
        <span className="w-term__dot" /><span className="w-term__dot" /><span className="w-term__dot" />
        <span className="w-term__name">bash</span>
        <CopyButton text={allText} className="w-term__copy" />
      </div>
      <div className="w-term__body mono">
        {visible.map((b, i) => {
          const isLast = i === visible.length - 1;
          return (
            <div key={i} className={`w-term__block ${isLast ? 'is-fresh' : ''}`}>
              <div className="w-term__cmd">
                <span className="w-term__prompt">{prompt}</span>
                <span>{b.cmd}</span>
                {isLast && <span className="w-term__cursor" />}
              </div>
              {b.out && <pre className="w-term__out">{b.out.replace(/\n$/, '')}</pre>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
