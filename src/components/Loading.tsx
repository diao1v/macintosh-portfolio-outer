import { Html, useProgress } from '@react-three/drei';

export function Loading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className='loading'>
        <div className='progress'>{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}
