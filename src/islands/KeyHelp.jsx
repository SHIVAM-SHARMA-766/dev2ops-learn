// Keyboard shortcut cheat-sheet. Press ? to open, Esc to close.
import React, { useState, useEffect } from 'react';

const KEYS = [
  ['← →', 'Previous / next step'],
  ['Space', 'Play / pause the lesson'],
  ['R', 'Replay from the start'],
  ['Ctrl K  /  /', 'Search all lessons'],
  ['?', 'This help'],
  ['Esc', 'Close a dialog'],
];

export default function KeyHelp() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '?' && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  if (!open) return null;
  return (
    <div className="keyhelp" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onMouseDown={() => setOpen(false)}>
      <div className="keyhelp__panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="keyhelp__title mono">Keyboard shortcuts</div>
        <ul className="keyhelp__list">
          {KEYS.map(([k, d]) => (
            <li key={k}><kbd className="keyhelp__kbd mono">{k}</kbd><span>{d}</span></li>
          ))}
        </ul>
        <div className="keyhelp__foot mono">press esc to close</div>
      </div>
    </div>
  );
}
