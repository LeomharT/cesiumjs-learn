import "./canvas.css";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const el = document.querySelector("#root");

let isHoding = false;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const positions = Array.from({ length: 50 }, () => ({
  x: random(0, size.width),
  y: random(0, size.height),
  angle: random(0, Math.PI * 2),
  length: random(50, 150),
}));

const colors = [
  "#165A36",
  "#1C6E42",
  "#238551",
  "#32A467",
  "#72CA9B",
  "#5642A6",
  "#FFE39F",
  "#ABC4A2",
  "#6B9FA1",
  "#3E769E",
  "#1F4B99",
];

const canvas = document.createElement("canvas");
canvas.width = size.width;
canvas.height = size.height;
canvas.style.width = size.width + "px";
canvas.style.height = size.height + "px";
el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function clear() {
  ctx.save();
  ctx.fillStyle = "#111418";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.restore();
}

function renderGrassBlade() {
  ctx.save();
  ctx.lineWidth = 4;

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];

    ctx.save();

    ctx.translate(pos.x, pos.y);
    ctx.rotate(pos.angle);

    ctx.beginPath();
    ctx.moveTo(-pos.length / 2, 0);
    ctx.lineTo(pos.length / 2, 0);

    ctx.strokeStyle = colors[i % colors.length];
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

canvas.addEventListener("pointerdown", () => (isHoding = true));
canvas.addEventListener("pointerup", () => (isHoding = false));
canvas.addEventListener("pointermove", (e) => {
  if (!isHoding) return;

  const cursor = {
    x: e.clientX,
    y: e.clientY,
  };

  for (let i = 0; i < positions.length; i++) {
    const center = positions[i];

    const angle = Math.atan2(center.y - cursor.y, center.x - cursor.x);

    positions[i].angle = angle + Math.PI / 2;
  }
});

function render() {
  // Clean scene
  clear();
  renderGrassBlade();

  // Animation
  requestAnimationFrame(render);
}
render();
