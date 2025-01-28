import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createTorusMesh } from './torus.js';

let scene, camera, renderer, controls;
let light;
let angle = 0.0

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
}

function onWindowResize() {
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