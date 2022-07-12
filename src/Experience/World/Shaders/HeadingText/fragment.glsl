uniform float uTime;

void main(){
    float intensity = cos(uTime  * 0.001) * .25 + .75;
    intensity = clamp(intensity, 0.5, 1.);
    gl_FragColor = vec4(vec3(1.), intensity);
}