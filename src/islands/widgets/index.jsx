// Widget registry. A lesson's `scene.widget` (or a step's `viz.widget`) names
// one of these; props come from the YAML. Add a widget here and it's available
// to every course — this is how the platform scales without per-lesson code.
import React from 'react';
import StagedReveal from './StagedReveal.jsx';
import CodeWalk from './CodeWalk.jsx';
import Diagram from './Diagram.jsx';
import TerminalReplay from './TerminalReplay.jsx';
import Compare from './Compare.jsx';
import Flow from './Flow.jsx';
import BuildCache from './BuildCache.jsx';
import ShipScene from './ShipScene.jsx';
import LayerStack from './LayerStack.jsx';
import VmVsContainer from './VmVsContainer.jsx';
import VolumeScene from './VolumeScene.jsx';

const REGISTRY = {
  stagedReveal: StagedReveal,
  codeWalk: CodeWalk,
  diagram: Diagram,
  terminalReplay: TerminalReplay,
  compare: Compare,
  flow: Flow,
  buildCache: BuildCache,
  shipScene: ShipScene,
  layerStack: LayerStack,
  vmVsContainer: VmVsContainer,
  volumeScene: VolumeScene,
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
