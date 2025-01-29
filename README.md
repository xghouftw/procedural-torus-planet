# Procedural Torus Planet

## Project description
This project visualizes a procedural torus planet using the Three.js framework. The terrain is procedurally generated via simplex noise for displacement mapping, and each vertex is assigned to one of four biomes—ocean, sand dunes, forest, or mountains—based on its height. Additional noise algorithms are employed for the mountains and sand dunes to enhance visual detail. Each biome is shaded according to a gradient based on the height.

The project consisted of the following main tasks.

- Parametrization of the torus with two coordinates (radial and tubular)
- Simplex noise to procedurally displace geometry of torus
- Differentiate biomes based on height displacement (ocean, sand dunes, forest, mountains)
- Fractional brownian motion mountains and sinusoidal sand dunes
- Blinn-Phong shading (ambient+diffuse+specular lighting)
- Gradient between each biome based on height
- Orbiting star as light source
- Starry night background

## Demo
Due to technical difficulties, this project could not be deployed as a website. Its primary focus is on the graphics implementation. Please run it locally to explore and experiment with its features.

Video: [![Watch](https://img.youtube.com/vi/X8dE0CWIzwg/0.jpg)](https://www.youtube.com/watch?v=X8dE0CWIzwg)

## Running the project locally

Clone the repository:
```sh
git clone https://github.com/xghouftw/procedural-torus-planet
cd procedural-torus-planet
```

Setup python virtual environment:
```sh
python3 -m venv venv
```

Activate the virtual environment (Windows):
```sh
venv\Scripts\activate.bat
```
Or on macOS:
```sh
source venv/bin/activate
```

Install dependencies:
```sh
npm install
```

Start development server on localhost:
```sh
npx vite
```

## Learning journey
Inspired by topics learned in computer graphics class, I made a visualization of what a torus-shaped planet could look like. The most challenging portions were the UV parametrization of the torus and shading according to procedurally generated heights.

Throughout this project, I learned a lot about the Three.js library to manipulate cameras and scenes, procedural generation techniques such as simplex noise and fractional brownian motion, developing custom vertex and fragment shaders, and Blinn-Phong shading to simulate realistic lighting.