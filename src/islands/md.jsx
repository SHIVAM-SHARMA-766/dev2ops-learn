// A deliberately tiny Markdown-ish renderer for lesson narration.
// Supports: paragraphs, `inline code`, **bold**, *italic*, and - bullet lists.
// Lesson prose is short, so this avoids a Markdown dependency in the bundle.
import React from 'react';

function inline(text, keyBase) {
  // split on `code`, **bold**, *italic* while keeping delimiters
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    const key = `${keyBase}-${i}`;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={key}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={key}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*')) return <em key={key}>{p.slice(1, -1)}</em>;
    return <React.Fragment key={key}>{p}</React.Fragment>;
  });
}

export function Markdown({ text }) {
  if (!text) return null;
  const blocks = String(text).trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={bi} className="md-ul">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*-\s+/, ''), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{inline(block.replace(/\n/g, ' '), `${bi}`)}</p>;
      })}
    </>
  );
}
