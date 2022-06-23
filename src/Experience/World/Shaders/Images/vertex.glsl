
uniform float uTime;
uniform float uScroll;


varying vec2 vUv;
varying float vElevation;

void main()
{
    //instanceMatrix
    //modelMatrix
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float frenquency = abs(clamp(uScroll, -20.0, 20.0));

    float elevation = sin(modelPosition.x * frenquency *  0.75) * 0.1;
    elevation += sin(modelPosition.y * frenquency *  0.5) * 0.1;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
}