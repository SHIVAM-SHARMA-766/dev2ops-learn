// VolumeScene — shows why data needs a volume. A container writes data into its
// own layer; remove it and the data is gone. With a volume, the data survives.
// Driven by activeStep (0..4).
import React from 'react';

export default function VolumeScene({ activeStep = 0 }) {
  const s = activeStep;
  const containerGone = s === 1; // removed, no volume
  const hasVolume = s >= 2;
  const container2Gone = s === 3; // removed, with volume
  const showContainer = s !== 1 && !(s === 3);
  return (
    <div className="w-vol">
      {/* the container */}
      <div className={`vol-container ${showContainer ? 'is-in' : 'is-out'}`}>
        <span className="vol-container__label mono">container</span>
        {!hasVolume && (
          <span className={`vol-data vol-data--inside ${s >= 0 ? 'is-in' : ''}`}>📦 data</span>
        )}
        {hasVolume && <span className="vol-pipe" aria-hidden="true" />}
      </div>

      {/* external volume */}
      {hasVolume && (
        <div className="vol-volume is-in">
          <span className="vol-volume__label mono">volume</span>
          <span className="vol-data vol-data--saved">💾 data</span>
        </div>
      )}

      {/* status line */}
      <div className={`vol-status mono ${containerGone ? 'is-bad' : container2Gone || s === 4 ? 'is-good' : ''}`}>
        {s === 0 && 'Container writes data into its own writable layer.'}
        {s === 1 && '✗ Container removed — the data went with it.'}
        {s === 2 && 'Now the data lives in a volume, outside the container.'}
        {s === 3 && '✓ Container removed — the volume (and data) survive.'}
        {s >= 4 && '✓ A fresh container re-attaches the volume — data still there.'}
      </div>
    </div>
  );
}
