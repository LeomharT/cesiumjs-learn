import { Colors } from "@blueprintjs/colors";
import {
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedMesh,
  MathUtils,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Uniform,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./canvas.css";
import fragmentShader from "./shader/fragment.glsl?raw";
import vertexShader from "./shader/vertex.glsl?raw";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2.0, window.devicePixelRatio),
};

const el = document.querySelector("#root");

const renderer = new WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(size.pixelRatio);
el?.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color(Colors.BLACK);

const camera = new PerspectiveCamera(75, size.width / size.height, 0.01, 1000);
camera.position.set(0, 3, 3);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * World
 */

const params = {
  count: 10000,
};

const positionArr = new Float32Array([
  0.0, 1.0, 0.0,
  //
  -0.15, 0.0, 0.0,
  //
  0.15, 0.0, 0.0,
]);
const positionAttr = new BufferAttribute(positionArr, 3);

const uvArr = new Float32Array([0.5, 1.0, 0.0, 0.0, 1.0, 0.0]);
const uvAttr = new BufferAttribute(uvArr, 2);

const grassGeometry = new BufferGeometry();
grassGeometry.setAttribute("position", positionAttr);
grassGeometry.setAttribute("uv", uvAttr);

const grassMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uBleadColor: new Uniform(new Color(Colors.GREEN1)),
    uTime: new Uniform(0),
  },
});
const grass = new InstancedMesh(grassGeometry, grassMaterial, params.count);
scene.add(grass);

const instance = new Object3D();

for (let i = 0; i < params.count; i++) {
  instance.position.set(
    MathUtils.randFloat(-5, 5),
    0,
    MathUtils.randFloat(-5, 5),
  );
  instance.updateMatrixWorld();

  grass.setMatrixAt(i, instance.matrix);
}

const axexHelper = new AxesHelper(1);
scene.add(axexHelper);

const mirrowGeometry = new PlaneGeometry(2, 2, 32, 32);
const mirrowMaterial = new ShaderMaterial();

function render() {
  // Update
  controls.update();
  grassMaterial.uniforms["uTime"].value += 0.1;
  // Render
  renderer.render(scene, camera);
  // Animation
  requestAnimationFrame(render);
}
render();

function resize() {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  renderer.setSize(size.width, size.height);

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
