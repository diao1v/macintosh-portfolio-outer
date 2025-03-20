import { Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default function EnvironmentSetup() {
  const [hdrTexture, setHdrTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new RGBELoader();
    loader.load(
      './textures/background/kloofendal_48d_partly_cloudy_puresky_1k.hdr',
      (texture: THREE.Texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setHdrTexture(texture);
      }
    );
  }, []);

  return hdrTexture ? <Environment background map={hdrTexture} /> : null;
}
