import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { useTableControls } from './Controls';
import type { Mode } from '../types/mode';

export default function GlassTable({ mode }: { mode: Mode }) {
  const { position, dimensions, rotation } = useTableControls();

  return (
    <Box
      args={[dimensions.width, dimensions.height, dimensions.depth]}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      <meshPhysicalMaterial
        metalness={0.9}
        roughness={0.05}
        envMapIntensity={0.9}
        transparent={true}
        opacity={0.5}
        side={THREE.DoubleSide}
        reflectivity={0.2}
        clearcoat={1}
        clearcoatRoughness={0.05}
        // No transmission: its separate render pass blacks out the post-processing composer
        // whenever the table fills the view. Tinted reflective glass reads the same from the screen.
        transmission={0}
        color={mode === '1984' ? '#dfe9f5' : '#0b0716'}
        ior={0.9}
      />
    </Box>
  );
} 