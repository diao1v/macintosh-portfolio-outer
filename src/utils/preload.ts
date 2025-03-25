import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import macintoshModel from '../assets/models/macintosh.glb';
import smudgesImage from '../assets/textures/monitor/smudges.jpg';
import hdrBackground from '../assets/textures/background/kloofendal_48d_partly_cloudy_puresky_1k.hdr';
import keySound1 from '../assets/audio/keyboard/key_1.mp3';
import keySound2 from '../assets/audio/keyboard/key_2.mp3';
import keySound3 from '../assets/audio/keyboard/key_3.mp3';
import mouseClick from '../assets/audio/mouse/mouse.mp3';

const textureLoader = new THREE.TextureLoader();
const hdrLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();

const loadAudio = (url: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = url;

    audio.addEventListener('canplaythrough', () => {
      resolve(audio);
    });

    audio.addEventListener('error', (err) => {
      reject(err);
    });

    audio.load();
  });
};

// Preload HDR
const hdrPromise = new Promise((resolve) => {
  hdrLoader.load(hdrBackground, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    resolve(texture);
  });
});

// Preload keyboard sounds
const keySound1Promise = loadAudio(keySound1);
const keySound2Promise = loadAudio(keySound2);
const keySound3Promise = loadAudio(keySound3);

// Preload mouse click sound
const mouseClickPromise = loadAudio(mouseClick);

// Export all preloaded assets
export const preloadedAssets = {
  hdr: hdrPromise as Promise<THREE.Texture>,
  smudges: new Promise<THREE.Texture>((resolve) => {
    textureLoader.load(smudgesImage, resolve);
  }),
  macintosh: new Promise<GLTF>((resolve) => {
    gltfLoader.load(macintoshModel, resolve);
  }),
  keyboardSounds: Promise.all([
    keySound1Promise,
    keySound2Promise,
    keySound3Promise,
  ]),
  mouseClick: mouseClickPromise,
};

// Create a promise that resolves when all assets are loaded
export const allAssetsLoaded = Promise.all([
  preloadedAssets.hdr,
  preloadedAssets.smudges,
  preloadedAssets.macintosh,
  preloadedAssets.keyboardSounds,
  preloadedAssets.mouseClick,
]).then((results) => {
  return new Promise((resolve) => setTimeout(resolve, 300, results));
});
