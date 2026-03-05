import { Colors } from "@blueprintjs/colors";
import { MathUtils } from "three";
import "./canvas.css";

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

const cursor = {
  x: 0,
  y: 0,
};

function clean() {
  ctx.save();
  ctx.fillStyle = Colors.BLACK;
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.restore();
}

function renderCursor() {
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = Colors.TURQUOISE4;
  ctx.arc(cursor.x, cursor.y, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const positions = Array.from({ length: 200 }, () => ({
  x: MathUtils.randFloat(0, size.width),
  y: MathUtils.randFloat(0, size.height),
  length: MathUtils.randFloat(100, 200),
  angle: 0,
}));

const colors = [
  ...["#FFB7A5", "#E9947D", "#D17257", "#B85033", "#9E2B0E"],
  ...["#FFB3D0", "#EB91AF", "#D56F90", "#BF4B72", "#A82255"],
  ...["#E1BAE1", "#BF93BE", "#9D6D9C", "#7C497B", "#5C255C"],
  ...["#D6CCFF", "#B7A8E8", "#9784D2", "#7763BC", "#5642A6"],
  ...["#B3CFFF", "#91ACE5", "#6F8ACB", "#4B6AB2", "#1F4B99"],
  ...["#97F3EB", "#78D5CC", "#58B8AE", "#369C91", "#008075"],
  ...["#B1ECB5", "#8DCD8F", "#6AAE6A", "#469047", "#1D7324"],
];

function renderBlead() {
  ctx.save();

  for (let i = 0; i < positions.length; i++) {
    ctx.save();
    const p = positions[i];
    const length = p.length / 2;

    ctx.beginPath();
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 3.0;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.moveTo(-length, 0);
    ctx.lineTo(length, 0);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function render() {
  // Clean canvas
  clean();

  // Render
  renderBlead();
  renderCursor();

  requestAnimationFrame(render);
}
render();

canvas.addEventListener("pointermove", (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];

    const theta = Math.atan2(p.y - cursor.y, p.x - cursor.x);
    positions[i].angle = theta + Math.PI / 2;
  }
});
