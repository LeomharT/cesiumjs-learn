import "./canvas.css";
import { fs, vs } from "./penger";

type Vector2 = {
  x: number;
  y: number;
};

type Vector3 = Vector2 & {
  z: number;
};

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2, window.devicePixelRatio),
  aspect: window.innerWidth / window.innerHeight,
};

const canvas = document.createElement("canvas");
canvas.style.width = size.width + "px";
canvas.style.height = size.height + "px";
canvas.width = size.width;
canvas.height = size.height;

const el = document.querySelector("#root");
el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function clean() {
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.restore();
}
clean();

function point(p: Vector2) {
  ctx.save();
  ctx.fillStyle = "#c41d7f";
  const s = 10;
  ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  ctx.restore();
}

function screen(p: Vector2) {
  const x = ((p.x + 1.0) / 2.0) * size.width;
  const y = -((p.y - 1.0) / 2.0) * size.height;

  return {
    x,
    y,
  };
}

function project(p: Vector3) {
  return {
    x: p.x / p.z,
    y: (p.y / p.z) * size.aspect,
  };
}

function translateZ(p: Vector3, dz: number) {
  return {
    ...p,
    z: p.z + dz,
  };
}

function line(from: Vector2, to: Vector2) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#531dab";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
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

const _vs = vs ?? [
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
let dt = 0;

let dz = 1.5;
let angle = 0;

function render(time: number = 0) {
  clean();

  dt = (time - prevTime) / 1000;
  prevTime = time;

  // dz += dt;
  angle += dt;

  for (const v of _vs) {
    point(screen(project(translateZ(rotate(v, angle), dz))));
  }

  for (const f of _fs) {
    for (let i = 0; i < f.length; i++) {
      const a = _vs[f[i]];
      const b = _vs[f[(i + 1) % f.length]];

      line(
        screen(project(translateZ(rotate(a, angle), dz))),
        screen(project(translateZ(rotate(b, angle), dz)))
      );
    }
  }

  requestAnimationFrame(render);
}

render();
