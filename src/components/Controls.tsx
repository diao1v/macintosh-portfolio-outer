import { useControls, folder } from 'leva';

const controlsConfig = {
  collapsed: true, 
  render: () => false, // hide the controls
};

export function useMacintoshControls() {
  return useControls({
    'Scene Controls': folder(
      {
        macX: { value: 20.0, min: -100, max: 100, step: 0.01 },
        macY: { value: -26.67, min: -100, max: 100, step: 0.01 },
        macZ: { value: 23.73, min: -100, max: 100, step: 0.01 },
        macRotationX: { value: 0.1, min: -Math.PI, max: Math.PI, step: 0.01 },
      },
      controlsConfig
    ),
  });
}

export function useScreenControls() {
  return useControls({
    'Scene Controls': folder(
      {
        iframeX: { value: -20.14, min: -100, max: 100, step: 0.01 },
        iframeY: { value: 23.65, min: -100, max: 100, step: 0.01 },
        iframeZ: { value: -32.34, min: -100, max: 100, step: 0.01 },
        iframeXRotation: {
          value: -0.1,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
        },
        distanceFactor: { value: 6.22, min: 0.1, max: 10, step: 0.01 },
      },
      controlsConfig
    ),
  });
}

export function useTableControls() {
  return useControls({
    'Scene Controls': folder(
      {
        position: {
          value: { x: 0, y: -23, z: -18 },
          step: 1,
        },
        dimensions: {
          value: { width: 100, height: 1, depth: 100 },
          min: 1,
          max: 100,
          step: 1,
        },
        rotation: {
          value: { x: 0.11, y: 0, z: 0 },
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
        },
      },
      controlsConfig
    ),
  });
}
