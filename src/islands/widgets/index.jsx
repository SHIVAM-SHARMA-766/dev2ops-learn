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
import IsolationBox from './IsolationBox.jsx';
import SizeScale from './SizeScale.jsx';
import ProblemScene from './ProblemScene.jsx';
import IconReveal from './IconReveal.jsx';
import PacketJourney from './PacketJourney.jsx';

// 3D pulls in three.js (~600KB); load it only when a 3D scene is actually shown,
// as its own chunk, so the other 72 lessons never download it. Client-only.
function Lazy3D(props) {
  const [Comp, setComp] = React.useState(null);
  React.useEffect(() => {
    let on = true;
    import('./Layers3D.jsx').then((m) => { if (on) setComp(() => m.default); });
    return () => { on = false; };
  }, []);
  if (!Comp) {
    return (
      <div className="w-three">
        <div className="three-loading mono"><span className="three-dots"><i /><i /><i /></span>loading 3D…</div>
      </div>
    );
  }
  return <Comp {...props} />;
}

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
  isolationBox: IsolationBox,
  sizeScale: SizeScale,
  problemScene: ProblemScene,
  iconReveal: IconReveal,
  packetJourney: PacketJourney,
  layers3d: Lazy3D,
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
