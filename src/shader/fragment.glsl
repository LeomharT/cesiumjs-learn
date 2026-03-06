varying vec2 vUv;

uniform vec3 uBleadColor;

void main(){
    vec3 color = vec3(0.0);
    vec2 uv    = vUv;

    color = uBleadColor + uv.y * 0.5;

    gl_FragColor = vec4(color, 1.0);
}