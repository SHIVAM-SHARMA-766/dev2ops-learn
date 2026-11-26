// Ctrl+K search over every lesson. Fetches the static index on first open,
// filters client-side, keyboard-navigable. Opened by Ctrl+K / "/" or the
// `d2o-open-search` event (fired by the nav button).
import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(null);
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const load = useCallback(() => {
    if (index) return;
    fetch('/search-index.json')
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex([]));
  }, [index]);

  const openIt = useCallback(() => { setOpen(true); setQ(''); setSel(0); load(); }, [load]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openIt(); }
      else if (e.key === '/' && !open && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); openIt(); }
      else if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => openIt();
    window.addEventListener('keydown', onKey);
    window.addEventListener('d2o-open-search', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('d2o-open-search', onOpen); };
  }, [open, openIt]);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const results = (() => {
    if (!index) return [];
    const term = q.trim().toLowerCase();
    if (!term) return index.slice(0, 8);
    const terms = term.split(/\s+/);
    return index
      .map((e) => {
        const hay = `${e.title} ${e.summary} ${e.chapter} ${e.course} ${e.keywords}`.toLowerCase();
        const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0)
          + (e.title.toLowerCase().includes(term) ? 3 : 0);
        return { e, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.e);
  })();

  const onResultsKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter' && results[sel]) { window.location.href = results[sel].path; }
  };

  if (!open) return null;

  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search lessons" onMouseDown={() => setOpen(false)}>
      <div className="search__panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="search__bar">
          <span className="search__icon mono">⌕</span>
          <input
            ref={inputRef}
            className="search__input"
            placeholder="Search lessons…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onResultsKey}
          />
          <kbd className="search__esc mono">esc</kbd>
        </div>
        <div className="search__results">
          {!index && <div className="search__empty mono">Loading…</div>}
          {index && results.length === 0 && <div className="search__empty mono">No lessons match “{q}”.</div>}
          {results.map((r, i) => (
            <a
              key={r.path}
              href={r.path}
              className={`search__item ${i === sel ? 'is-sel' : ''}`}
              data-accent={r.accent}
              onMouseEnter={() => setSel(i)}
            >
              <span className="search__itemicon">{r.courseIcon || '◆'}</span>
              <span className="search__itemtext">
                <span className="search__itemtitle">{r.title}</span>
                <span className="search__itemmeta mono">{r.course} · {r.chapter}{r.minutes ? ` · ${r.minutes} min` : ''}</span>
              </span>
              <span className="search__enter mono">↵</span>
            </a>
          ))}
        </div>
        <div className="search__foot mono">↑ ↓ to move · ↵ to open · esc to close</div>
      </div>
    </div>
  );
}
