// "Continue where you left off" — reads localStorage on the client and shows a
// link to the most recent lesson. Renders nothing server-side / when empty.
import React, { useEffect, useState } from 'react';
import { getResume } from './progress.js';

export default function ResumeBanner() {
  const [resume, setResume] = useState(null);
  useEffect(() => { setResume(getResume()); }, []);
  if (!resume || !resume.path) return null;
  return (
    <a className="resume" href={resume.path}>
      <span className="resume__icon">↪</span>
      <span className="resume__text">
        <span className="resume__label mono">Continue where you left off</span>
        <span className="resume__lesson">{resume.courseTitle} · {resume.title}</span>
      </span>
      <span className="resume__cta mono">Resume →</span>
    </a>
  );
}
