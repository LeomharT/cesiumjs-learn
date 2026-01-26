import "./canvas.css";
import { fs, vs } from "./penger";

type Vector2 = {
  x: number;
  y: number;
};

type Vector3 = Vector2 & {
  z: number;
};

const font = new FontFace(
  "Alimama_ShuHeiTi_Bold",
  "url(Alimama_ShuHeiTi_Bold.ttf)",
  {
    style: "italic",
    weight: "400",
    stretch: "condensed",
  },
);
document.fonts.add(font);
await font.load();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight,
};

const canvas = document.createElement("canvas");
canvas.width = sizes.width;
canvas.height = sizes.height;
canvas.style.widows = sizes.width + "px";
canvas.style.height = sizes.height + "px";

const el = document.querySelector("#root");
el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function clear() {
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, sizes.width, sizes.height);
  ctx.restore();
}
clear();

function point(v: Vector2) {
  ctx.save();
  const s = 10;
  ctx.fillStyle = "#A8DF8E";
  ctx.fillRect(v.x - s / 2, v.y - s / 2, s, s);
  ctx.restore();
}

function screen(v: Vector2) {
  const x = ((v.x + 1.0) / 2.0) * sizes.width;
  const y = -((v.y - 1.0) / 2.0) * sizes.height;

  return {
    x,
    y,
  };
}

function project(v: Vector3) {
  return {
    x: v.x / v.z,
    y: (v.y / v.z) * sizes.aspect,
  };
}

function translateZ(v: Vector3, dz: number) {
  return {
    ...v,
    z: v.z + dz,
  };
}

function line(from: Vector2, to: Vector2) {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#A8DF8E";
  ctx.stroke();

  ctx.restore();
}

function rotate(v: Vector3, angle: number) {
  const x = v.x * Math.cos(angle) - v.z * Math.sin(angle);
  const z = v.x * Math.sin(angle) + v.z * Math.cos(angle);

  return {
    x,
    y: v.y,
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

let prevTime = 0.0;
let dz = 1.5;
let angle = 0.0;

function render(time: number = 0) {
  clear();

  // Delta
  const dt = (time - prevTime) / 1000;
  prevTime = time;

  // dz += dt;
  angle += dt;

  // Render
  for (const v of _vs) {
    // point(screen(project(translateZ(rotate(v, angle), dz))));
  }

  for (const f of _fs) {
    for (let i = 0; i < f.length; i++) {
      const a = _vs[f[i]];
      const b = _vs[f[(i + 1) % f.length]];

      line(
        screen(project(translateZ(rotate(a, angle), dz))),
        screen(project(translateZ(rotate(b, angle), dz))),
      );
    }
  }

  // Animation
  requestAnimationFrame(render);
}
render();
