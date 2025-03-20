import { useGLTF, Html } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useMacintoshControls, useScreenControls } from './Controls';

export default function MacintoshModel() {
  const macintosh = useGLTF('./models/macintosh.glb');
  const { macX, macY, macZ, macRotationX } = useMacintoshControls();
  const { iframeX, iframeY, iframeZ, iframeXRotation, distanceFactor } =
    useScreenControls();

  useEffect(() => {
    if (macintosh.scene) {
      // Find the screen mesh
      macintosh.scene.traverse((child) => {
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
  }, [macintosh.scene]);

  return (
    <primitive
      object={macintosh.scene}
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
              src='./textures/monitor/smudges.png'
              alt=''
              className='scale-101'
            />
          </div>
        </div>
      </Html>
    </primitive>
  );
}
