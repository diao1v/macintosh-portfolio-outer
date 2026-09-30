import { Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { preloadedAssets } from '../utils/preload';
import { Texture } from 'three';
import type { Mode } from '../types/mode';

/** Reflections only. The visible sky is driven by SceneLighting so it can go black on cue. */
export default function EnvironmentSetup({ lit }: { lit: Mode }) {
  const [hdrTexture, setHdrTexture] = useState<Texture | null>(null);

  useEffect(() => {
    // Use the preloaded HDR texture
    preloadedAssets.hdr.then(setHdrTexture);
  }, []);

  return hdrTexture ? <Environment background={false} map={hdrTexture} environmentIntensity={lit === '1984' ? 1 : 0.05} /> : null;
}
