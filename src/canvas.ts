import {
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Uniform,
  WebGLRenderer,
} from "three";
import { Pane } from "tweakpane";
import "./canvas.css";
import fragmentShader from "./shader/rotate/fragment.glsl?raw";
import vertexShader from "./shader/rotate/vertex.glsl?raw";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2, window.devicePixelRatio),
};

const el = document.querySelector("#root");

const renderer = new WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(size.pixelRatio);
renderer.shadowMap.enabled = true;
el?.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color("#1e1e1e");

const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
camera.position.set(0, 0, 1);
camera.lookAt(scene.position);

/**
 * World
 */

const uniforms = {
  uRotate: new Uniform(0),
};

const planeGeometry = new PlaneGeometry(1, 1, 16, 16);
const planeMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});
const plane = new Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const pane = new Pane({ title: "Debug Params" });
pane.addBinding(uniforms.uRotate, "value", {
  label: "rotate deg",
  step: 0.001,
  min: 0,
  max: Math.PI * 2,
});

function render() {
  // Render
  renderer.render(scene, camera);

  // Animation
  requestAnimationFrame(render);
}
render();
