// Your-progress card for the home page: level + XP, lessons, streak, badges.
// Reads localStorage on the client; renders nothing until there's progress.
import React, { useEffect, useState } from 'react';
import { getStats } from './progress.js';

export default function StatsCard({ total = 0 }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { setStats(getStats(total)); }, [total]);
  if (!stats || stats.count === 0) return null;

  const unlocked = stats.achievements.filter((a) => a.unlocked);
  const next = stats.achievements.find((a) => !a.unlocked);

  return (
    <section className="stats card" aria-label="Your progress">
      <div className="stats__row">
        <div className="stats__level">
          <span className="stats__levelnum mono">LVL {stats.level}</span>
          <div className="stats__xpbar"><span style={{ width: `${stats.xpInLevel}%` }} /></div>
          <span className="stats__xp mono">{stats.xp} XP</span>
        </div>
        <div className="stats__nums">
          <div className="stats__stat">
            <span className="stats__big mono">{stats.count}<span className="stats__slash">/{stats.total}</span></span>
            <span className="stats__label mono">lessons</span>
          </div>
          <div className="stats__stat">
            <span className="stats__big mono">🔥 {stats.streak}</span>
            <span className="stats__label mono">day streak</span>
          </div>
        </div>
      </div>

      <div className="stats__badges">
        {stats.achievements.map((a) => (
          <div key={a.id} className={`badge-chip ${a.unlocked ? 'is-on' : ''}`} title={`${a.name} — ${a.desc}`}>
            <span className="badge-chip__icon">{a.unlocked ? a.icon : '🔒'}</span>
            <span className="badge-chip__name">{a.name}</span>
          </div>
        ))}
      </div>

      <div className="stats__foot mono">
        {unlocked.length} / {stats.achievements.length} badges
        {next && <span> · next: <b>{next.name}</b> ({next.desc})</span>}
      </div>
    </section>
  );
}
