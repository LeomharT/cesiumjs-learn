import "./canvas.css";
import { fs, vs } from "./penger";

/**
 * (x, y, z)
 *
 * x' = x / z
 * y' = y / z
 */

type Vector2 = {
  x: number;
  y: number;
};

type Vector3 = Vector2 & {
  z: number;
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRadio: Math.min(2.0, window.devicePixelRatio),
  aspect: window.innerWidth / window.innerHeight,
};

const canvas = document.createElement("canvas");
canvas.style.width = sizes.width + "px";
canvas.style.height = sizes.height + "px";
canvas.width = sizes.width * devicePixelRatio;
canvas.height = sizes.height * devicePixelRatio;

const el = document.querySelector("#root");
el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.scale(sizes.pixelRadio, sizes.pixelRadio);

function clear() {
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, sizes.width, sizes.height);
  ctx.restore();
}
clear();

function point(p: Vector2) {
  ctx.save();
  const size = 20;

  ctx.fillStyle = "#d4380d";
  ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

  ctx.restore();
}

function screen(p: Vector2) {
  // const x = (p.x / sizes.width) * 2.0 - 1.0;
  const x = ((p.x + 1.0) / 2.0) * sizes.width;
  const y = -((p.y - 1.0) / 2.0) * sizes.height;

  return {
    x,
    y,
  };
}

function project(p: Vector3) {
  return {
    x: p.x / p.z,
    y: (p.y / p.z) * sizes.aspect,
  };
}

function translateZ(p: Vector3, dz: number) {
  return {
    x: p.x,
    y: p.y,
    z: p.z + dz,
  };
}

function line(from: Vector2, to: Vector2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#d4380d";
  ctx.stroke();
  ctx.restore();
}

function rotate(p: Vector3, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const x = p.x * c - p.z * s;
  const z = p.x * s + p.z * c;

  return {
    x,
    y: p.y,
    z,
  };
}

const _ps = vs ?? [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },

  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
];

const _fs = fs ?? [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

let prevTime = 0;
let dz = 1.25;
let angle = 0;

function render(time: number = 0) {
  clear();

  let dt = time - prevTime;
  dt /= 1000;
  prevTime = time;

  // dz += dt;

  angle += -dt;

  for (const p of _ps) {
    // point(screen(project(translateZ(rotate(p, angle), dz))));
  }

  for (const f of fs) {
    for (let i = 0; i < f.length; i++) {
      const a = _ps[f[i]];
      const b = _ps[f[(i + 1) % f.length]];

      line(
        screen(project(translateZ(rotate(a, angle), dz))),
        screen(project(translateZ(rotate(b, angle), dz)))
      );
    }
  }

  // Animation
  requestAnimationFrame(render);
}

render();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  canvas.style.width = sizes.width + "px";
  canvas.style.height = sizes.height + "px";
  canvas.width = sizes.width * devicePixelRatio;
  canvas.height = sizes.height * devicePixelRatio;

  ctx.scale(sizes.pixelRadio, sizes.pixelRadio);
}
window.addEventListener("resize", resize);
