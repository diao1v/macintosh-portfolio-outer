import { Html } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useMacintoshControls, useScreenControls } from './Controls';
import { preloadedAssets } from '../utils/preload';
import { Group } from 'three';
import { SWITCH, type Mode } from '../types/mode';

const SITES: Record<Mode, string> = {
  '1984': import.meta.env.VITE_IFRAME_WEBSITE,
  '2084': import.meta.env.VITE_IFRAME_WEBSITE_2084,
};

const CASE_NIGHT = { color: new THREE.Color('#14121a'), emissive: new THREE.Color('#7a2bff'), emissiveIntensity: 0.07 };
const GLITCH_MS = 1200;

function isScreen(child: THREE.Object3D) {
  return child.name === 'Computer_Screen_0' || child.name.includes('Screen');
}

export default function MacintoshModel({ started, mode }: { started: boolean; mode: Mode }) {
  const [model, setModel] = useState<Group | null>(null);
  const [smudgesDataUrl, setSmudgesDataUrl] = useState('');
  const [site, setSite] = useState<Mode>('1984');
  const [oracleMounted, setOracleMounted] = useState(false);
  // off: CRT power-off animation, picture collapses and stays dark. glitch: boot tear over the new site.
  const [screen, setScreen] = useState<'on' | 'off' | 'glitch'>('on');
  const { macX, macY, macZ, macRotationX } = useMacintoshControls();
  const { iframeX, iframeY, iframeZ, iframeXRotation, distanceFactor } = useScreenControls();
  const imageRef = useRef(null);
  const caseMaterials = useRef<Map<THREE.MeshStandardMaterial, { color: THREE.Color; emissive: THREE.Color; emissiveIntensity: number }>>(new Map());
  const first = useRef(true);

  useEffect(() => {
    // Use preloaded model
    preloadedAssets.macintosh.then((gltf) => setModel(gltf.scene));

    // Use preloaded smudges texture
    preloadedAssets.smudges.then((texture) => {
      const canvas = document.createElement('canvas');
      canvas.width = texture.image.width;
      canvas.height = texture.image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(texture.image, 0, 0);
        setSmudgesDataUrl(canvas.toDataURL('image/png'));
      }
    });
  }, []);

  useEffect(() => {
    if (!model) return;
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const material = child.material as THREE.MeshStandardMaterial;
      if (isScreen(child)) {
        material.metalness = 0.2;
        material.roughness = 0.7;
        material.envMapIntensity = 0.3;
        material.color = new THREE.Color(0x222222);
        material.emissive = new THREE.Color(0x000000);
        material.emissiveIntensity = 0;
        material.transparent = false;
        material.opacity = 1.0;
      } else if (material.isMeshStandardMaterial && !caseMaterials.current.has(material)) {
        // Remember the daylight look so 1984 can restore it exactly.
        caseMaterials.current.set(material, {
          color: material.color.clone(),
          emissive: material.emissive.clone(),
          emissiveIntensity: material.emissiveIntensity,
        });
      }
    });
  }, [model]);

  // Mode transition: the screen shuts down at once; the case relights with the new lights;
  // the screen boots the new system after the camera is back in.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    setScreen('off');
    const on = SWITCH.lightsOn / 1000;
    caseMaterials.current.forEach((day, m) => {
      const to = mode === '2084' ? CASE_NIGHT : day;
      gsap.to(m.color, { ...to.color, duration: 1.2, delay: on });
      gsap.to(m.emissive, { ...to.emissive, duration: 1.2, delay: on });
      gsap.to(m, { emissiveIntensity: to.emissiveIntensity, duration: 1.2, delay: on });
    });
    at(SWITCH.boot, () => setScreen('glitch'));
    at(SWITCH.boot + GLITCH_MS / 2, () => {
      if (mode === '2084') setOracleMounted(true);
      setSite(mode);
    });
    at(SWITCH.boot + GLITCH_MS, () => setScreen('on'));
    return () => timers.forEach(clearTimeout);
  }, [mode]);

  if (!model || !smudgesDataUrl) return null;

  return (
    <primitive object={model} position={[macX, macY, macZ]} rotation-x={macRotationX}>
      {/* Drei's <Html> projects the iframe on top of the canvas with a very high
          z-index, so it would punch through the loading overlay. Only mount it
          once loading is done, when the model + sky are revealed. */}
      {started ? (
        <Html transform wrapperClass='htmlScreen' distanceFactor={distanceFactor} position={[iframeX, iframeY, iframeZ]} rotation-x={iframeXRotation}>
          <div className='relative w-full h-full'>
            {/* Both sites stay mounted once visited, so switching back does not reboot the OS. */}
            <div className={`relative z-10 ${screen === 'off' ? 'screen-off' : ''}`}>
              <iframe src={SITES['1984']} className='relative' style={{ display: site === '1984' ? 'block' : 'none' }} />
              {oracleMounted && <iframe src={SITES['2084']} className='relative' style={{ display: site === '2084' ? 'block' : 'none' }} />}
            </div>
            <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-999'>
              <img ref={imageRef} src={smudgesDataUrl} alt='' className='scale-101' crossOrigin='anonymous' />
            </div>
            {screen === 'glitch' && <div className='screen-cover screen-cover--glitch' />}
          </div>
        </Html>
      ) : null}
    </primitive>
  );
}
