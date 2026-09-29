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
        // Transmission renders the scene behind the glass in a separate pass that blacks out
        // the post-processing composer when the table fills the view. 2084 uses plain dark glass.
        transmission={mode === '1984' ? 0.95 : 0}
        color={mode === '1984' ? '#ffffff' : '#0b0716'}
        ior={0.9}
      />
    </Box>
  );
} 