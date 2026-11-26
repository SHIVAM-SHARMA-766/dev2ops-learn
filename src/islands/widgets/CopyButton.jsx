// A tiny copy-to-clipboard button, reused by code and terminal widgets.
import React, { useState } from 'react';

export default function CopyButton({ text, className = '' }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      /* clipboard blocked — ignore */
    }
  };
  return (
    <button type="button" className={`copybtn mono ${className}`} onClick={copy} aria-label="Copy">
      {done ? '✓ copied' : 'copy'}
    </button>
  );
}
