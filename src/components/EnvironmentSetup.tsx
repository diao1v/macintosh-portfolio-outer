import { Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { preloadedAssets } from '../utils/preload';
import { Texture } from 'three';

export default function EnvironmentSetup() {
  const [hdrTexture, setHdrTexture] = useState<Texture | null>(null);

  useEffect(() => {
    // Use the preloaded HDR texture
    preloadedAssets.hdr.then(setHdrTexture);
  }, []);

  return hdrTexture ? <Environment background map={hdrTexture} /> : null;
}
