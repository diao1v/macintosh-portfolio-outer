import { Html } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { useMacintoshControls, useScreenControls } from './Controls';
import { preloadedAssets } from '../utils/preload';
import { Group } from 'three';

export default function MacintoshModel() {
  const [model, setModel] = useState<Group | null>(null);
  const [smudgesDataUrl, setSmudgesDataUrl] = useState('');
  const { macX, macY, macZ, macRotationX } = useMacintoshControls();
  const { iframeX, iframeY, iframeZ, iframeXRotation, distanceFactor } =
    useScreenControls();
  const imageRef = useRef(null);

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
    if (model) {
      // Find the screen mesh
      model.traverse((child) => {
        if (
          child.name === 'Computer_Screen_0' ||
          child.name.includes('Screen')
        ) {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              child.material.metalness = 0.2;
              child.material.roughness = 0.7;
              child.material.envMapIntensity = 0.3;
              child.material.color = new THREE.Color(0x222222);
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
              child.material.transparent = false;
              child.material.opacity = 1.0;
            }
          }
        }
      });
    }
  }, [model]);

  if (!model || !smudgesDataUrl) return null;

  return (
    <primitive
      object={model}
      position={[macX, macY, macZ]}
      rotation-x={macRotationX}
    >
      <Html
        transform
        wrapperClass='htmlScreen'
        distanceFactor={distanceFactor}
        position={[iframeX, iframeY, iframeZ]}
        rotation-x={iframeXRotation}
      >
        <div className='relative w-full h-full'>
          <iframe src='https://os.diao1v.me' className='z-10 relative ' />
          <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-999'>
            <img
              ref={imageRef}
              src={smudgesDataUrl}
              alt=''
              className='scale-101'
              crossOrigin='anonymous'
            />
          </div>
        </div>
      </Html>
    </primitive>
  );
}
