import { Canvas } from '@react-three/fiber';
import World from './components/World';
import { useEffect, useState } from 'react';
import { allAssetsLoaded } from './utils/preload';
import LoadingScreen from './components/LoadingScreen';
import SoundEffects from './components/SoundEffects';

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
    <>
      {!assetsLoaded ? (
        <LoadingScreen />
      ) : (
        <>
          <Canvas
            camera={{
              position: [0, 0, 100],
              fov: 75,
            }}
          >
            <World />
          </Canvas>

          <SoundEffects />
        </>
      )}
    </>
  );
}

export default App;
