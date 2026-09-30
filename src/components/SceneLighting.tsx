import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { preloadedAssets } from '../utils/preload';
import { SWITCH, type Mode } from '../types/mode';

const DAY = {
  ambient: { color: '#c4d7ff', intensity: 1.5 },
  main: { color: '#ffffff', intensity: 3.5 },
  fill: { color: '#0088ff', intensity: 2.0 },
  rim: { color: '#ff6a00', intensity: 1.5 },
  spot: { color: '#f0f8ff', intensity: 4 },
  magenta: { color: '#ff00ff', intensity: 1.5 },
  cyan: { color: '#00ffff', intensity: 1.5 },
};

const NIGHT = {
  ambient: { color: '#2a1650', intensity: 0.35 },
  main: { color: '#ffffff', intensity: 0 },
  fill: { color: '#0088ff', intensity: 0.4 },
  rim: { color: '#ff6a00', intensity: 0 },
  spot: { color: '#cfe8ff', intensity: 0.6 },
  // Physically based point lights: intensity is candela, falling off with distance squared.
  magenta: { color: '#ff2bd6', intensity: 500 },
  cyan: { color: '#19e6ff', intensity: 500 },
};

const NIGHT_BG = new THREE.Color('#0a0514');
const BLACK = new THREE.Color('#000000');

type Key = keyof typeof DAY;
type Lights = Record<Key, THREE.Light | null>;
const KEYS = Object.keys(DAY) as Key[];

function tweenLight(light: THREE.Light | null, to: { color: string; intensity: number }, duration: number, delay = 0) {
  if (!light) return;
  gsap.to(light, { intensity: to.intensity, duration, delay, ease: 'power2.out' });
  gsap.to(light.color, { ...new THREE.Color(to.color), duration, delay, ease: 'power2.out' });
}

/** Neon tube start-up: a few stutters, then hold. */
function flickerOn(light: THREE.Light | null, intensity: number, delay: number) {
  if (!light) return;
  gsap.to(light, {
    keyframes: [
      { intensity, duration: 0.05 },
      { intensity: 0, duration: 0.08 },
      { intensity: intensity * 0.7, duration: 0.05 },
      { intensity: 0, duration: 0.12 },
      { intensity, duration: 0.05 },
    ],
    delay,
  });
}

export default function SceneLighting({ mode }: { mode: Mode }) {
  const { scene } = useThree();
  const lights = useRef<Lights>({ ambient: null, main: null, fill: null, rim: null, spot: null, magenta: null, cyan: null });
  const hdr = useRef<THREE.Texture | null>(null);
  const first = useRef(true);

  // The sky is managed here, not by <Environment>, so it can go black on cue.
  useEffect(() => {
    preloadedAssets.hdr.then((texture) => {
      hdr.current = texture;
      if (mode === '1984') scene.background = texture;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const l = lights.current;
    const off = SWITCH.lightsOff / 1000;
    const on = SWITCH.lightsOn / 1000;

    // Lights off, sky black.
    const from = mode === '2084' ? DAY : NIGHT;
    KEYS.forEach((k) => tweenLight(l[k], { ...from[k], intensity: 0 }, 0.4, off));
    gsap.delayedCall(off, () => {
      scene.background = BLACK.clone();
    });

    // New lights on.
    if (mode === '2084') {
      flickerOn(l.cyan, NIGHT.cyan.intensity, on);
      flickerOn(l.magenta, NIGHT.magenta.intensity, on + 0.4);
      (['ambient', 'fill', 'spot'] as const).forEach((k) => tweenLight(l[k], NIGHT[k], 1.5, on + 0.4));
      gsap.delayedCall(on + 0.4, () => {
        if (scene.background instanceof THREE.Color) gsap.to(scene.background, { ...NIGHT_BG, duration: 1.5 });
      });
    } else {
      KEYS.forEach((k) => tweenLight(l[k], DAY[k], 1.0, on));
      gsap.delayedCall(on, () => {
        scene.background = hdr.current;
        scene.backgroundIntensity = 0;
        gsap.to(scene, { backgroundIntensity: 1, duration: 1.0 });
      });
    }
  }, [mode, scene]);

  return (
    <>
      <ambientLight ref={(r) => void (lights.current.ambient = r)} intensity={DAY.ambient.intensity} color={DAY.ambient.color} />
      <directionalLight ref={(r) => void (lights.current.main = r)} position={[10, 20, 15]} intensity={DAY.main.intensity} color={DAY.main.color} />
      <directionalLight ref={(r) => void (lights.current.fill = r)} position={[-15, 10, 10]} intensity={DAY.fill.intensity} color={DAY.fill.color} />
      <directionalLight ref={(r) => void (lights.current.rim = r)} position={[0, 5, -20]} intensity={DAY.rim.intensity} color={DAY.rim.color} />
      <spotLight
        ref={(r) => void (lights.current.spot = r)}
        position={[0, 15, 20]}
        angle={0.4}
        penumbra={0.8}
        intensity={DAY.spot.intensity}
        color={DAY.spot.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        target-position={[0, 0, 0]}
      />
      <pointLight ref={(r) => void (lights.current.magenta = r)} position={[-12, 6, 9]} intensity={DAY.magenta.intensity} color={DAY.magenta.color} distance={120} />
      <pointLight ref={(r) => void (lights.current.cyan = r)} position={[12, 6, 9]} intensity={DAY.cyan.intensity} color={DAY.cyan.color} distance={120} />
    </>
  );
}
