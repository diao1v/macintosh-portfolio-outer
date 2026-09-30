import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import gsap from 'gsap';
import GlassTable from './GlassTable';
import EnvironmentSetup from './EnvironmentSetup';
import MacintoshModel from './MacintoshModel';
import { preloadedAssets } from '../utils/preload';
import SceneLighting from './SceneLighting';
import Effects from './Effects';
import NeonRig from './NeonRig';
import { SWITCH, type Mode } from '../types/mode';

export default function World({ started, mode }: { started: boolean; mode: Mode }) {
  const { camera } = useThree();
  const [hdrLoaded, setHdrLoaded] = useState(false);
  // `lit` is the palette currently on screen; it follows `mode` when the new lights come on.
  const [lit, setLit] = useState<Mode>(mode);
  const firstMode = useRef(true);

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

  // Mode switch: camera pulls back with the old lights, and flies back in after the new ones are on.
  useEffect(() => {
    if (firstMode.current) {
      firstMode.current = false;
      return;
    }
    const look = () => {
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, { z: 45, y: 4, duration: 1.1, delay: SWITCH.pullBack / 1000, ease: 'power2.inOut', onUpdate: look });
    gsap.to(camera.position, { z: 5, y: 0, duration: 1.4, delay: SWITCH.flyIn / 1000, ease: 'expo.out', onUpdate: look });
    const t = setTimeout(() => setLit(mode), SWITCH.lightsOn);
    return () => clearTimeout(t);
  }, [mode, camera]);

  useEffect(() => {
    // Only run the fly-in once loading is done, so it plays as the reveal
    // instead of being wasted behind the loading screen.
    if (!started) return;

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
  }, [camera, started]);

  return (
    <>
      <SceneLighting mode={mode} />
      <NeonRig mode={mode} />
      <EnvironmentSetup lit={lit} />
      <PresentationControls global polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]} zoom={1} snap={true} cursor={true}>
        <MacintoshModel started={started} mode={mode} />
        {hdrLoaded ? <GlassTable mode={lit} /> : null}
      </PresentationControls>
      <Effects active={lit === '2084'} />
    </>
  );
}
