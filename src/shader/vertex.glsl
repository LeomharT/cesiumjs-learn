#define PI 3.1415926

varying vec2 vUv;

uniform float uTime;

vec2 rotate2D(vec2 p, float angle)
{
    mat2 m = mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
    return p * m;
}

void main(){
    // instance origin point
    vec4 instancePosition = modelMatrix * instanceMatrix * vec4(vec3(0.0), 1.0);
    vec3 viewDirection    = normalize(cameraPosition - instancePosition.xyz);

    float angle = atan(viewDirection.z, viewDirection.x);

    vec3  transformed    = position;
          transformed.xz = rotate2D(transformed.xz, angle - PI / 2.0);

    vec4 modelPosition      = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
    vec4 viewMatrix         = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewMatrix;

    gl_Position = projectionPosition;

    vUv = uv;
}