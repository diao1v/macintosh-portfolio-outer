import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { useTableControls } from './Controls';

export default function GlassTable() {
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
        transmission={0.95}
        ior={0.9}
      />
    </Box>
  );
} 