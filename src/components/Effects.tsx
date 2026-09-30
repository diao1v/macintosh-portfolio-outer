import { Bloom, ChromaticAberration, EffectComposer, Scanline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const ABERRATION = new THREE.Vector2(0.0007, 0.0007);
const NONE = new THREE.Vector2(0, 0);

/**
 * The composer renders in both modes so its shaders are compiled long before the switch
 * (enabling it mid-transition left the canvas black while they compiled). In 1984 the
 * effects are zeroed. The device gate keeps phones out, so this is desktop-only.
 */
export default function Effects({ active }: { active: boolean }) {
  return (
    <EffectComposer frameBufferType={THREE.FloatType}>
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.25} intensity={active ? 0.9 : 0} mipmapBlur />
      <ChromaticAberration offset={active ? ABERRATION : NONE} radialModulation={false} modulationOffset={0} />
      <Scanline density={0.6} blendFunction={BlendFunction.OVERLAY} opacity={active ? 0.05 : 0} />
    </EffectComposer>
  );
}
