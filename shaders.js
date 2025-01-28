export const ShadedVertexSource = `
    attribute float biomeFlag;
    attribute float height;
    varying vec3 vNormal;
    varying vec3 vPosition;
    flat out float vBiomeFlag; //do not interpolate
    varying float vHeight;

    void main() {
        vNormal = normalMatrix * normal;
        vPosition = vec3(modelMatrix * vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vBiomeFlag = biomeFlag;
        vHeight = height;
    }
`

export const ShadedFragmentSource = `
    precision highp float;

    flat in float vBiomeFlag;
    varying float vHeight;

    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec3 LightPosition;

    void main() {
        vec3 ka, kd, ks;
        float n;
        float biomeFactor = 0.0;
        if (vBiomeFlag == 0.0) {
            ka = vec3(0.05, 0.1, 0.3); // Ocean

            vec3 kdLow = vec3(0.03, 0.02, 0.46);
            vec3 kdHigh = vec3(0.34, 0.66, 0.75);
            biomeFactor = (vHeight + 1.0)/1.0;
            biomeFactor = pow(biomeFactor, 5.0);
            kd = kdLow*(1.0-biomeFactor) + kdHigh*biomeFactor; //interpolate as gradient

            ks = vec3(0.9, 0.9, 0.9);
            n = 100.0;
        } else if (vBiomeFlag == 1.0) { // Sand dune
            ka = vec3(0.9, 0.8, 0.3);
            
            vec3 kdLow = vec3(0.96, 0.94, 0.72);
            vec3 kdHigh = vec3(0.54, 0.38, 0.04);
            biomeFactor = (vHeight - 0.0)/0.05;
            kd = kdLow*(1.0-biomeFactor) + kdHigh*biomeFactor;

            ks = vec3(0.2, 0.2, 0.1);
            n = 15.0;
            
        } else if (vBiomeFlag == 2.0) { // Forest
            ka = vec3(0.2, 0.4, 0.2);

            vec3 kdLow = vec3(0.32, 0.88, 0.40);
            vec3 kdHigh = vec3(0.00, 0.25, 0.04);
            biomeFactor = (vHeight - 0.05)/0.35;
            biomeFactor = 0.666*biomeFactor + 0.333;
            kd = kdLow*(1.0-biomeFactor) + kdHigh*biomeFactor;
            
            ks = vec3(0.3, 0.5, 0.3);
            n = 30.0;
        } else if (vBiomeFlag == 3.0) { //Mountains
            ka = vec3(0.1, 0.1, 0.1);

            vec3 kdLow = vec3(0.36, 0.24, 0.06);
            vec3 kdHigh = vec3(0.82, 0.81, 0.80);
            biomeFactor = (vHeight - 0.4)/0.6;
            biomeFactor = biomeFactor*biomeFactor;
            kd = kdLow*(1.0-biomeFactor) + kdHigh*biomeFactor;

            ks = vec3(0.1, 0.1, 0.1);
            n = 20.0;
        } 

        gl_FragColor = vec4(0,0,0,1);
        vec3 LightIntensity = vec3(1.5);
        vec3 ambient = ka*LightIntensity;

        vec3 lightRay = normalize(LightPosition-vPosition);
        vec3 normal = normalize(vNormal);
        vec3 viewRay = normalize(-vPosition);
        vec3 diffuse = kd*LightIntensity*max(0.0, dot(normal, lightRay));

        vec3 h = normalize(lightRay + viewRay);
        vec3 specular = ks*LightIntensity*pow(max(0.0, dot(normal, h)), n);

        vec3 color = ambient*0.2 + diffuse + specular*0.8;
        gl_FragColor = vec4(color, 1.0);
    }
`;