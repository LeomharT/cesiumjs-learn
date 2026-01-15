varying vec2 vUv;

uniform float uRotate;

vec2 rotate2D(vec2 p, float angle)
{
    mat2 m = mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );

    return m * p;
}

void main() {
    vec3 color = vec3(1.0);
    vec2 uv    = vUv;

    vec3 color1 = vec3(0.768, 0.113, 0.498);
    vec3 color2 = vec3(0.325, 0.113, 0.670);

    uv -= vec2(0.5);
    uv = rotate2D(uv, uRotate);
    uv += vec2(0.5);

    color = mix(
        color1,
        color2,
        uv.x
    );

    gl_FragColor = vec4(color, 1.0);
}