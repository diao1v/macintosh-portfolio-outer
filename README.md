# Vintage Macintosh 3D Viewer

## Overview
This project uses [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [Drei](https://github.com/pmndrs/drei) to create a 3D model of a vintage Macintosh computer. The 3D model acts as an outer shell that embeds a mock Macintosh OS website via an `<iframe>`, simulating an interactive vintage computing experience.

## Features
- **3D Vintage Macintosh Model**: Built using Three.js via React Three Fiber.
- **Embedded Mock Macintosh OS**: Uses an `<iframe>` to display an external site that mimics an old Macintosh operating system.
- **Interactive Camera Controls**: Drei’s camera controls.


## Usage
- Rotate and zoom the 3D model using mouse or touch gestures.
- Click on the Macintosh screen area to interact with the embedded mock OS.

## Installation
1. Run `pnpm install` to install dependencies.
2. Run `pnpm dev` to start the development server.
3. Open `http://localhost:5173` in your browser.

## Demo
[Live Demo](https://diao1v.me)

## Acknowledgements
- Thanks [@henryjeff](https://github.com/henryjeff) for inspiring me with the idea.
- Thanks [@Darren.Hogan](https://sketchfab.com/Darren.Hogan) for providing the Macintosh 128K Computer (1984) model.

## Future Enhancements
- Optimize assets loading for better user expierence.
- Improve screen reflections for added realism.
