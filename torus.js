import * as THREE from 'three';
import { makeNoise4D } from 'fast-simplex-noise';
import { ShadedVertexSource, ShadedFragmentSource} from './shaders.js';

const noise4D = new makeNoise4D();

function parametrizeUV(x, y, z, Rc, Rt) {
    let u = Math.atan2(y, x);
    
    let Cu = new THREE.Vector3(Rc * Math.cos(u), Rc * Math.sin(u), 0);
    let dC = new THREE.Vector3(x - Cu.x, y - Cu.y, z);
    //project dC onto the xy plane
    let v = Math.atan2(Math.sqrt(dC.x*dC.x + dC.y*dC.y), dC.z);
    if (dC.dot(Cu) < 0) {
        v = Math.atan2(-Math.sqrt(dC.x*dC.x + dC.y*dC.y), dC.z);
    }
    v -= Math.PI/2;
    if (u < 0) u += 2 * Math.PI;
    if (v < 0) v += 2 * Math.PI;

    return { u, v };
}

function calculateNormal(x, y, z, Rc) {
    let u = Math.atan2(y, x);
    // Center of torus ring
    const Cu = new THREE.Vector3(Rc * Math.cos(u), Rc * Math.sin(u), 0);
    // Outward direction
    return new THREE.Vector3(x, y, z).sub(Cu).normalize();
}

function fBm(u, v, octaves, H, frequency) {
    let value = 0;
    let amplitude = 2.5;
    for (let i = 0; i < octaves; i++) {
        const scale = frequency * Math.pow(2, i);
        const n = noise4D(
            scale * Math.cos(u),
            scale * Math.sin(u),
            scale * Math.cos(v),
            scale * Math.sin(v)
        );
        value += amplitude * n;
        amplitude *= Math.pow(2, -H);
    }
    return value;
}

export function createTorusMesh(lightPosition) {
    const rc = 1; // main radius
    const rt = 0.4; // tube radius
    const radialAmnt = 800;
    const tubularAmnt = 1600;

    const geometry = new THREE.TorusGeometry(rc, rt, radialAmnt, tubularAmnt);

    const pos = geometry.attributes.position;
    const biomeFlag = new Float32Array(pos.count);
    const heights = new Float32Array(pos.count);

    const dunePhaseU = Math.random() * 2*Math.PI;
    const dunePhaseV = Math.random() * 2*Math.PI;

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        const { u, v } = parametrizeUV(x, y, z, rc, rt);

        const n1 = Math.cos(u);
        const n2 = Math.sin(u);
        const n3 = Math.cos(v);
        const n4 = Math.sin(v);
        let noiseValue = noise4D(n1, n2, n3, n4);
        heights[i] = noiseValue;

        if (noiseValue <= 0.0) {
            biomeFlag[i] = 0.0; // Ocean
        } else if (noiseValue < 0.05) {
            biomeFlag[i] = 1.0; // Sand dunes
        } else if (noiseValue < 0.4) {
            biomeFlag[i] = 2.0; // Forest
        } else {
            biomeFlag[i] = 3.0; // Mountains
        }

        // Outward normal to displace along
        const normal = calculateNormal(x, y, z, rc);

        // Baseline displacement
        let displacement = noiseValue / 8;

        // fractional brownian motion for mountains
        if (biomeFlag[i] === 3.0) {
            displacement += fBm(u, v, 8.0, 0.8, 4.0) / 150.0;
        }

        // sinusoidal displacement for sand dunes
        if (biomeFlag[i] === 1.0) {
            const freq = 10.0;
            const amp  = 1 / 120; 
            let uTerm = Math.sin(u * 2*Math.PI * freq + dunePhaseU) * amp;
            let vTerm = Math.sin(v * 2*Math.PI * freq + dunePhaseV) * amp;
            displacement += (uTerm + vTerm)*0.5;
        }

        // Update vertex position
        pos.setXYZ(i,
            x + normal.x * displacement,
            y + normal.y * displacement,
            z + normal.z * displacement
        );
    }

    geometry.setAttribute('biomeFlag', new THREE.BufferAttribute(biomeFlag, 1));
    geometry.setAttribute('height', new THREE.BufferAttribute(heights, 1));
    pos.needsUpdate = true;

    // hook up with shaders
    const material = new THREE.ShaderMaterial({
        vertexShader: ShadedVertexSource,
        fragmentShader: ShadedFragmentSource,
        uniforms: {
            LightPosition: { value: lightPosition }
        }
    });

    return new THREE.Mesh(geometry, material);
}