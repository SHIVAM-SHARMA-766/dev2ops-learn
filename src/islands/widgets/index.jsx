// Widget registry. A lesson's `scene.widget` (or a step's `viz.widget`) names
// one of these; props come from the YAML. Add a widget here and it's available
// to every course — this is how the platform scales without per-lesson code.
import React from 'react';
import StagedReveal from './StagedReveal.jsx';
import CodeWalk from './CodeWalk.jsx';
import Diagram from './Diagram.jsx';

const REGISTRY = {
  stagedReveal: StagedReveal,
  codeWalk: CodeWalk,
  diagram: Diagram,
};

export function Scene({ scene, activeStep, steps }) {
  if (!scene || !scene.widget) {
    return (
      <div className="w-empty mono">
        <span>No visual for this lesson yet.</span>
      </div>
    );
  }
  const Widget = REGISTRY[scene.widget];
  if (!Widget) {
    return <div className="w-empty mono">Unknown widget: {scene.widget}</div>;
  }
  const { widget, ...props } = scene;
  return <Widget {...props} activeStep={activeStep} steps={steps} />;
}

export const widgetNames = Object.keys(REGISTRY);
