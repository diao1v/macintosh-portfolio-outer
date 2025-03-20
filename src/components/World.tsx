import { PresentationControls } from '@react-three/drei';
import SceneLighting from './SceneLighting';
import EnvironmentSetup from './EnvironmentSetup';
import MacintoshModel from './MacintoshModel';
import GlassTable from './GlassTable';

export default function World() {
  return (
    <>
      <SceneLighting />
      <EnvironmentSetup />
      <PresentationControls
        global
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        zoom={1}
        snap={true}
        cursor={true}
      >
        <MacintoshModel />
        <GlassTable />
      </PresentationControls>
    </>
  );
}
