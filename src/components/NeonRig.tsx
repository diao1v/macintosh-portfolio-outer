import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { SWITCH, type Mode } from '../types/mode';

/** Visible neon tubes around the machine, each with its own point light. Off and hidden in 1984. */
const TUBES: { color: string; position: [number, number, number]; rotation: [number, number, number]; length: number }[] = [
  { color: '#19e6ff', position: [-30, 10, -18], rotation: [0, 0, 0.2], length: 18 },
  { color: '#ff2bd6', position: [30, 8, -16], rotation: [0, 0, -0.25], length: 18 },
  { color: '#8a3dff', position: [-22, -14, -30], rotation: [0, 0, Math.PI / 2], length: 22 },
  { color: '#39ff14', position: [24, -12, -32], rotation: [0, 0, Math.PI / 2], length: 22 },
  { color: '#ff7a1a', position: [0, 22, -36], rotation: [0, 0, Math.PI / 2], length: 30 },
  { color: '#2b6bff', position: [0, -20, 20], rotation: [0, 0, Math.PI / 2], length: 26 },
];
const GLOW = 6;
const LIGHT = 260;

export default function NeonRig({ mode }: { mode: Mode }) {
  const materials = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  const group = useRef<THREE.Group>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const off = SWITCH.lightsOff / 1000;
    const on = SWITCH.lightsOn / 1000;
    if (mode === '2084') {
      gsap.delayedCall(on, () => {
        if (group.current) group.current.visible = true;
      });
      TUBES.forEach((_, i) => {
        // Each tube ignites a beat after the last, with a stutter that bloom turns into a flash.
        const delay = on + 0.15 + i * 0.14;
        const stutter = (peak: number) => [
          { v: peak, duration: 0.04 },
          { v: 0, duration: 0.07 },
          { v: peak * 0.6, duration: 0.05 },
          { v: 0, duration: 0.1 },
          { v: peak, duration: 0.04 },
        ];
        const m = materials.current[i];
        const l = lights.current[i];
        if (m) gsap.to(m, { keyframes: stutter(GLOW).map((k) => ({ emissiveIntensity: k.v, duration: k.duration })), delay });
        if (l) gsap.to(l, { keyframes: stutter(LIGHT).map((k) => ({ intensity: k.v, duration: k.duration })), delay });
      });
    } else {
      // Neon dies with the rest of the lights and the tubes vanish in the dark.
      materials.current.forEach((m) => m && gsap.to(m, { emissiveIntensity: 0, duration: 0.15, delay: off }));
      lights.current.forEach((l) => l && gsap.to(l, { intensity: 0, duration: 0.15, delay: off }));
      gsap.delayedCall(off + 0.2, () => {
        if (group.current) group.current.visible = false;
      });
    }
  }, [mode]);

  return (
    <group ref={group} visible={false}>
      {TUBES.map((t, i) => (
        <group key={i} position={t.position} rotation={t.rotation}>
          <mesh>
            <boxGeometry args={[0.5, t.length, 0.5]} />
            <meshStandardMaterial
              ref={(r) => void (materials.current[i] = r)}
              color='#0a0a0a'
              emissive={t.color}
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>
          <pointLight ref={(r) => void (lights.current[i] = r)} color={t.color} intensity={0} distance={90} />
        </group>
      ))}
    </group>
  );
}
