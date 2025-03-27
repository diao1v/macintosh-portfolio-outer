import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { allAssetsLoaded } from './utils/preload';
import World from './components/World';
import DeviceDetection from './components/DeviceDetection';
import { LoadingScreen } from './components/LoadingScreen';
import HelpIcon from './components/Help/HelpIcon';

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    allAssetsLoaded.then(() => {
      setTimeout(() => {
        setAssetsLoaded(true);
      }, 500);
    });
  }, []);

  return (
    <DeviceDetection>
      {!assetsLoaded ? (
        <LoadingScreen />
      ) : (
        <Canvas
          camera={{
            position: [0, 0, 100],
            fov: 75,
          }}
        >
          <World />
        </Canvas>
      )}
      {assetsLoaded ? <HelpIcon position='bottom-right' /> : null}
    </DeviceDetection>
  );
}

export default App;
