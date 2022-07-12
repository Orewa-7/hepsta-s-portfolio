uniform float uSize;

attribute float aScale;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    /**
    * Size
    */
    gl_PointSize = uSize * aScale;
    // simulate sizeAttenuation
    gl_PointSize *= (1.0 / - viewPosition.z);
    // pour enlever les zfighting(pas vraiment le vrai nom) derrière
    gl_PointSize = max(2., gl_PointSize);
}