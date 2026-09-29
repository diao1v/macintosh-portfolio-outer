import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { allAssetsLoaded } from './utils/preload';
import World from './components/World';
import DeviceDetection from './components/DeviceDetection';
import { LoadingScreen } from './components/LoadingScreen';
import HelpIcon from './components/Help/HelpIcon';
import ModeToggle from './components/ModeToggle';
import { TO_1984, TO_2084, type Mode } from './types/mode';

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>('1984');
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    allAssetsLoaded.then(() => {
      setTimeout(() => {
        setAssetsLoaded(true);
      }, 500);
    });
  }, []);

  const toggle = () => {
    const next: Mode = mode === '1984' ? '2084' : '1984';
    setMode(next);
    setSwitching(true);
    setTimeout(() => setSwitching(false), next === '2084' ? TO_2084.done : TO_1984.done);
  };

  return (
    <DeviceDetection>
      {/* Canvas always mounts so the scene renders behind the loading screen.
          By the time the loading overlay is removed, the sky and model are ready. */}
      <Canvas
        camera={{
          position: [0, 0, 100],
          fov: 75,
        }}
      >
        <World started={assetsLoaded} mode={mode} />
      </Canvas>
      {!assetsLoaded ? <LoadingScreen /> : null}
      {assetsLoaded ? <HelpIcon position='bottom-right' /> : null}
      {assetsLoaded ? <ModeToggle mode={mode} disabled={switching} onToggle={toggle} /> : null}
    </DeviceDetection>
  );
}

export default App;
