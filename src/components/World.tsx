import { useEffect, useLayoutEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import gsap from 'gsap';
import GlassTable from './GlassTable';
import EnvironmentSetup from './EnvironmentSetup';
import MacintoshModel from './MacintoshModel';
import { preloadedAssets } from '../utils/preload';
import SceneLighting from './SceneLighting';

export default function World() {
  const { camera } = useThree();
  const [hdrLoaded, setHdrLoaded] = useState(false);

  useLayoutEffect(() => {
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    preloadedAssets.hdr.then(() => {
      setHdrLoaded(true);
    });
  }, []);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 5,
        duration: 5,
        ease: 'expo.out',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
        },
      });
    }, 100);

    return () => clearTimeout(animationTimeout);
  }, [camera]);

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
        {hdrLoaded ? <GlassTable /> : null}
      </PresentationControls>
    </>
  );
}
