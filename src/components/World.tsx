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
import { TO_1984, TO_2084, type Mode } from '../types/mode';

export default function World({ started, mode }: { started: boolean; mode: Mode }) {
  const { camera } = useThree();
  const [hdrLoaded, setHdrLoaded] = useState(false);
  const [effects, setEffects] = useState(false);

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

  // Bloom joins at the first neon flicker and leaves the instant neon cuts out.
  useEffect(() => {
    if (mode !== '2084') {
      setEffects(false);
      return;
    }
    const t = setTimeout(() => setEffects(true), TO_2084.cyanOn);
    return () => clearTimeout(t);
  }, [mode]);

  // Camera choreography: pull back so the whole machine is in view for the blackout and
  // the neon flicker, then fly back into the screen as it glitches on.
  const firstMode = useRef(true);
  useEffect(() => {
    if (firstMode.current) {
      firstMode.current = false;
      return;
    }
    const s = mode === '2084' ? TO_2084 : TO_1984;
    const look = () => {
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, { z: 45, y: 4, duration: 1, delay: s.pullBack / 1000, ease: 'power2.inOut', onUpdate: look });
    gsap.to(camera.position, { z: 5, y: 0, duration: 1.4, delay: s.flyIn / 1000, ease: 'expo.out', onUpdate: look });
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
      <EnvironmentSetup mode={mode} />
      <PresentationControls global polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]} zoom={1} snap={true} cursor={true}>
        <MacintoshModel started={started} mode={mode} />
        {hdrLoaded ? <GlassTable mode={mode} /> : null}
      </PresentationControls>
      <Effects active={effects} />
    </>
  );
}
