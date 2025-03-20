import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

function SceneLighting() {
  const { scene } = useThree();
  const [colors] = useState({
    top: '#4568DC',
    bottom: '#B06AB3',
    ambient: '#c4d7ff',
    main: '#ffffff',
    fill: '#0088ff',
    rim: '#ff6a00',
    spot: '#f0f8ff',
    point1: '#ff00ff',
    point2: '#00ffff',
  });

  useEffect(() => {
    const topColor = new THREE.Color(colors.top);
    const bottomColor = new THREE.Color(colors.bottom);

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, topColor.getStyle());
      gradient.addColorStop(1, bottomColor.getStyle());

      context.fillStyle = gradient;
      context.fillRect(0, 0, 2, 512);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      scene.background = texture;
    }

    return () => {
      scene.background = null;
    };
  }, [scene, colors.top, colors.bottom]);

  return (
    <>
      {/* Vibrant ambient light */}
      <ambientLight intensity={1.5} color={colors.ambient} />

      {/* Strong main light */}
      <directionalLight
        position={[10, 20, 15]}
        intensity={3.5}
        color={colors.main}
      />

      {/* Intense fill light */}
      <directionalLight
        position={[-15, 10, 10]}
        intensity={2.0}
        color={colors.fill}
      />

      {/* Strong rim light */}
      <directionalLight
        position={[0, 5, -20]}
        intensity={1.5}
        color={colors.rim}
      />

      {/* Bright spotlight */}
      <spotLight
        position={[0, 15, 20]}
        angle={0.4}
        penumbra={0.8}
        intensity={4}
        color={colors.spot}
        castShadow
        shadow-mapSize={[2048, 2048]}
        target-position={[0, 0, 0]}
      />

      {/* Point light 1 */}
      <pointLight
        position={[-10, -5, 5]}
        intensity={1.5}
        color={colors.point1}
        distance={50}
      />

      {/* Point light 2 */}
      <pointLight
        position={[10, -5, 5]}
        intensity={1.5}
        color={colors.point2}
        distance={50}
      />
    </>
  );
}

export default SceneLighting;
