import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import macintoshModel from '../assets/models/macintosh.glb';
import smudgesImage from '../assets/textures/monitor/smudges.jpg';
import hdrBackground from '../assets/textures/background/kloofendal_48d_partly_cloudy_puresky_1k.hdr';

const textureLoader = new THREE.TextureLoader();
const hdrLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();

export const preloadedAssets = {
  hdr: new Promise<THREE.Texture>((resolve) => {
    hdrLoader.load(hdrBackground, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      resolve(texture);
    });
  }),

  smudges: new Promise<THREE.Texture>((resolve) => {
    textureLoader.load(smudgesImage, resolve);
  }),

  macintosh: new Promise<GLTF>((resolve) => {
    gltfLoader.load(macintoshModel, resolve);
  }),
};

export const allAssetsLoaded = Promise.all(Object.values(preloadedAssets)).then(
  (results) => {
    return new Promise((resolve) => setTimeout(resolve, 300, results));
  }
);
