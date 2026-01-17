/**
 * (x, y, z)
 *
 * x' = x / z
 * y' = y / z
 */

import "./canvas.css";

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

  const s = 300;
  ctx.fillStyle = "#9929EA";
  ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);

  ctx.restore();
}

point({ x: size.width / 2, y: size.height / 2 });
