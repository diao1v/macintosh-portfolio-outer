import { Suspense } from 'react';
import { PresentationControls } from '@react-three/drei';
import SceneLighting from './SceneLighting';
import { Loading } from './Loading';
import { lazy } from 'react';

const EnvironmentSetup = lazy(() => import('./EnvironmentSetup'));
const MacintoshModel = lazy(() => import('./MacintoshModel'));
const GlassTable = lazy(() => import('./GlassTable'));

export default function World() {
  return (
    <>
      <SceneLighting />
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  );
}
