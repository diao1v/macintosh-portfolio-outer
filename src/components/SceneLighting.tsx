import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { TO_1984, TO_2084, type Mode } from '../types/mode';

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

const NIGHT_BG = '#0a0514';

type Lights = Record<keyof typeof DAY, THREE.Light | null>;

/** Tween one light toward a target colour and intensity. */
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
      { intensity: intensity, duration: 0.05 },
      { intensity: 0, duration: 0.08 },
      { intensity: intensity * 0.7, duration: 0.05 },
      { intensity: 0, duration: 0.12 },
      { intensity: intensity, duration: 0.05 },
    ],
    delay,
  });
}

export default function SceneLighting({ mode }: { mode: Mode }) {
  const { scene } = useThree();
  const lights = useRef<Lights>({ ambient: null, main: null, fill: null, rim: null, spot: null, magenta: null, cyan: null });
  const first = useRef(true);

  useEffect(() => {
    const l = lights.current;
    const bg = new THREE.Color(NIGHT_BG);
    if (first.current) {
      first.current = false;
      return;
    }
    if (mode === '2084') {
      const s = TO_2084;
      (Object.keys(DAY) as (keyof typeof DAY)[]).forEach((k) => tweenLight(l[k], { ...DAY[k], intensity: 0 }, s.blackout / 1000));
      scene.background = new THREE.Color('#000000');
      flickerOn(l.cyan, NIGHT.cyan.intensity, s.cyanOn / 1000);
      flickerOn(l.magenta, NIGHT.magenta.intensity, s.magentaOn / 1000);
      const rise = s.magentaOn / 1000;
      tweenLight(l.ambient, NIGHT.ambient, 1.5, rise);
      tweenLight(l.fill, NIGHT.fill, 1.5, rise);
      tweenLight(l.spot, NIGHT.spot, 1.5, rise);
      gsap.to(scene.background as THREE.Color, { r: bg.r, g: bg.g, b: bg.b, duration: 1.5, delay: rise });
    } else {
      const s = TO_1984;
      tweenLight(l.cyan, { ...NIGHT.cyan, intensity: 0 }, s.neonOff / 1000);
      tweenLight(l.magenta, { ...NIGHT.magenta, intensity: 0 }, s.neonOff / 1000);
      (['ambient', 'fill', 'spot'] as const).forEach((k) => tweenLight(l[k], { ...NIGHT[k], intensity: 0 }, 0.2));
      gsap.to(scene.background as THREE.Color, { r: 0, g: 0, b: 0, duration: 0.2 });
      const up = s.daylight / 1000;
      (Object.keys(DAY) as (keyof typeof DAY)[]).forEach((k) => tweenLight(l[k], DAY[k], 1, up));
      // EnvironmentSetup puts the HDR sky back once its `background` prop flips; clear ours so it can.
      gsap.delayedCall(up, () => {
        scene.background = null;
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
