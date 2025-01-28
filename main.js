import * as THREE from 'three';
<<<<<<< HEAD
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createTorusMesh } from './torus.js';
=======
import { makeNoise2D } from 'fast-simplex-noise';

const noise2D = new makeNoise2D();
>>>>>>> 4dcfc05 (fri night commit)

let scene, camera, renderer, controls;
let light;
let angle = 0.0

<<<<<<< HEAD
function init() {
    const canvas = document.getElementById('canvas');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    light = new THREE.DirectionalLight(0xff4500, 50);
    light.position.set(10, 0, 0);
    light.castShadow = true;
    scene.add(light);

    const torus = createTorusMesh(light.position);
    scene.add(torus);

    createStarField();

    window.addEventListener('resize', onWindowResize);
  
    // Start render loop
    render();
}

function createStarField() {
    const starCount = 2000;

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        transparent: true,
    });

    // Generate random star positions
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 0] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
=======
const radialAmnt = 400;
const tubularAmnt = 800;
const rc = 1;
const rt = .4;
const geometry = new THREE.TorusGeometry(rc, rt, radialAmnt, tubularAmnt);


function parametrizeUV(x, y, z, Rc, Rt) {
    let u = Math.atan2(y, x);
    
    let Cu = {x: Rc * Math.cos(u), y: Rc * Math.sin(u)};
    let dx = x - Cu.x;
    let dy = y - Cu.y;
    let dz = z;
    let v = Math.atan2(dz, Math.sqrt(dx*dx + dy*dy));

    if (u < 0) u += 2 * Math.PI;
    if (v < 0) v += 2 * Math.PI;

    return {u: u, v: v};
}

function calculateNormal(x, y, z, Rc, Rt) {
    // Parametrize UV to find the center of the torus tube circle
    let u = Math.atan2(y, x);
    let Cu = new THREE.Vector3(Rc * Math.cos(u), Rc * Math.sin(u), 0); // Center of the tube

    // Vector from the torus tube center to the point
    let toPoint = new THREE.Vector3(x, y, z).sub(Cu);

    // The normal vector is along this direction
    let normal = toPoint.normalize();

    return normal;
}

/// looping through coords to set height
const pos = geometry.attributes.position;
for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    let uv_dict = parametrizeUV(x, y, z, rc, rt);
    let u = uv_dict.u*180/Math.PI;
    let v = uv_dict.v*180/Math.PI;
    console.log('v coord: ', v);

    let normal = calculateNormal(x, y, z, rc, rt);

    let noiseValue = noise2D(u, v);
    let displacement = noiseValue * .01;
    console.log('displacement: ', displacement);
    // let displacement = 0;
    if (u > 50 && u < 140) {
        if (v > 0 && v < 90) {
            displacement = Math.abs(.5 + (Math.sin(v / 10) + Math.sin(u / 10)) + Math.random()) / 50;
        }
    }
    if (u > 140 && u < 160) {
        if (v > 0 && v < 90) {
            displacement = Math.abs(1.5 + (Math.sin(v / 5) + Math.sin(u / 5)) + Math.random()) / 40;
        }
    }
    
    pos.setXYZ(i, x + normal.x * displacement, y + normal.y * displacement, z + normal.z * displacement);
>>>>>>> 4dcfc05 (fri night commit)
}

<<<<<<< HEAD
function onWindowResize() {
=======

// const texture = new THREE.TextureLoader().load('./textures/earth.jpeg'); // Replace with your texture
// const dMap = new THREE.TextureLoader().load('./textures/grayscale.jpeg');
const material = new THREE.MeshStandardMaterial({
    // map: texture,
    color: 0x188888,
    wireframe: true,
    // displacementMap: dMap,
    // displacementScale: .1,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);


// Add light
const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(5, 5, 5);
scene.add(light);

// Position Camera
camera.position.z = 1.5;
// camera.position.y = -1;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x = -.55;
    torus.rotation.y += -.001;
    torus.rotation.z += -.002;
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
>>>>>>> 4dcfc05 (fri night commit)
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    requestAnimationFrame(render);
    // rotate light
    angle += 0.01;
    const radius = 10.0;
    light.position.set(
      radius * Math.cos(angle),
      0, 
      radius * Math.sin(angle)
    );
    controls.update();
    renderer.render(scene, camera);
}

init();