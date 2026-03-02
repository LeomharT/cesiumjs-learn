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

const positions = Array.from({ length: 500 }, () => ({
  x: random(0, size.width),
  y: random(0, size.height),
  angle: random(0, Math.PI * 2),
  length: random(50, 150),
}));

const colors = [
  ...["#FFB7A5", "#E9947D", "#D17257", "#B85033", "#9E2B0E"],
  ...["#FFC940", "#E9A133", "#D27B27", "#B9541A", "#9E2B0E"],
  ...["#E1BAE1", "#BF93BE", "#9D6D9C", "#7C497B", "#5C255C"],
  ...["#E8F8B6", "#A4D8A8", "#68B78C", "#399561", "#1D7324"],
  ...["#B3CFFF", "#91ACE5", "#6F8ACB", "#4B6AB2", "#1F4B99"],
];

const cursor = {
  x: 0,
  y: 0,
};

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

    const length = Math.sqrt(
      Math.pow(pos.x - size.width / 2, 2) +
        Math.pow(pos.y - size.height / 2, 2),
    );

    if (length < 500) continue;

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

function renderCursor(x: number, y: number) {
  ctx.save();

  ctx.fillStyle = "#F6F7F9";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

canvas.addEventListener("pointerdown", () => (isHoding = true));
canvas.addEventListener("pointerup", () => (isHoding = false));
canvas.addEventListener("pointermove", (e) => {
  if (!isHoding) return;

  cursor.x = e.clientX;
  cursor.y = e.clientY;

  for (let i = 0; i < positions.length; i++) {
    const center = positions[i];

    const angle = Math.atan2(center.y - cursor.y, center.x - cursor.x);

    positions[i].angle = angle;
  }
});

function render() {
  // Clean scene
  clear();
  renderGrassBlade();
  renderCursor(cursor.x, cursor.y);

  // Animation
  requestAnimationFrame(render);
}
render();
