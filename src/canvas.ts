import { Colors } from "@blueprintjs/colors";
import "./canvas.css";
import { ConvexObjectBreaker } from "three/examples/jsm/Addons.js";
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const el = document.querySelector("#root");

const canvas = document.createElement("canvas");
canvas.width = size.width;
canvas.height = size.height;
canvas.style.width = size.width + "px";
canvas.style.height = size.height + "px";
el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function clean() {
  ctx.save();
  ctx.fillStyle = Colors.BLACK;
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.restore();
}

const cursor = {
  x: 0,
  y: 0,
};

function renderCursor(x: number, y: number) {
  ctx.save();

  const s = 50;
  ctx.fillStyle = Colors.BLUE3;
  ctx.fillRect(x - s / 2, y - s / 2, s, s);

  ctx.restore();
}

canvas.addEventListener("pointermove", (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

let accelerationY = 0;
let translateY = 0;

let accelerationX = 0;
let translateX = 0;

function render() {
  clean();

  // Update
  accelerationY += (cursor.y - translateY) * 0.12;
  accelerationY *= 1.0;
  translateY = accelerationY;

  accelerationX += (cursor.x - translateX) * 0.12;
  accelerationY *= 1.0;
  translateX = accelerationX;

  renderCursor(translateX, translateY);
  requestAnimationFrame(render);
}

render();
