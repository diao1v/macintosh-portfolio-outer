import { Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { preloadedAssets } from '../utils/preload';
import { Texture } from 'three';
import type { Mode } from '../types/mode';

export default function EnvironmentSetup({ mode }: { mode: Mode }) {
  const [hdrTexture, setHdrTexture] = useState<Texture | null>(null);

  useEffect(() => {
    // Use the preloaded HDR texture
    preloadedAssets.hdr.then(setHdrTexture);
  }, []);

  // The HDR stays as the reflection environment in both modes; it is only the visible sky in 1984.
  return hdrTexture ? <Environment background={mode === '1984'} map={hdrTexture} environmentIntensity={mode === '1984' ? 1 : 0.05} /> : null;
}
