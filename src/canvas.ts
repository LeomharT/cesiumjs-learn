import "./canvas.css";

type RectPosition = {
  x: number;
  y: number;
};
type RectSize = {
  width: number;
  height: number;
};

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2, window.devicePixelRatio),
};

const root = document.querySelector("#root") as HTMLDivElement;

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.width = size.width * size.pixelRatio;
canvas.height = size.height * size.pixelRatio;

canvas.style.width = size.width + "px";
canvas.style.height = size.height + "px";

root.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.scale(size.pixelRatio, size.pixelRatio);

function cleanCanvas() {
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, size.width, size.height);
}
cleanCanvas();

/**
 * Box
 */

const box = {
  count: 50,
  width: 50,
  height: 50,
};

function renderBox(position: RectPosition, size: RectSize) {
  ctx.save();

  // Rect
  const gradient = ctx.createLinearGradient(
    position.x,
    position.y,
    position.x + size.width,
    position.y
  );

  gradient.addColorStop(0, "#531dab");
  gradient.addColorStop(1, "#c41d7f");
  ctx.fillStyle = gradient;
  ctx.fillRect(position.x, position.y, size.width, size.height);

  // Border
  ctx.setLineDash([10, 5]);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#d3f261";

  ctx.beginPath();
  // Top Left
  ctx.moveTo(position.x, position.y);
  // Top Right
  ctx.lineTo(position.x + size.width, position.y);
  // Bottom Right
  ctx.lineTo(position.x + size.width, position.y + size.height);
  // Bottom Left
  ctx.lineTo(position.x, position.y + size.height);

  ctx.closePath();

  ctx.stroke();

  ctx.restore();
}

const positions = Array.from({ length: box.count }, () => ({ x: 0, y: 0 }));

for (let i = 0; i < 50; i++) {
  renderBox({ x: 0, y: 0 }, { width: 50, height: 50 });
}

let translateX = 0;
let accelerationX = 0;

let translateY = 0;
let accelerationY = 0;

let target = {
  x: 0,
  y: 0,
};

function onPointerMove(e: PointerEvent) {
  target.x = e.clientX;
  target.y = e.clientY;
}

window.addEventListener("pointermove", onPointerMove);

function render() {
  // Update
  accelerationY += (target.y - translateY) * 0.2;
  accelerationY *= 0.15;
  translateY += accelerationY;

  accelerationX += (target.x - translateX) * 0.2;
  accelerationX *= 0.15;
  translateX += accelerationX;

  positions.pop();
  positions.unshift({ x: translateX, y: translateY });
  cleanCanvas();

  for (let i = 0; i < box.count; i++) {
    const target = {
      x: positions[positions.length - (i + 1)].x,
      y: positions[positions.length - (i + 1)].y,
    };

    renderBox(
      {
        x: target.x - 25,
        y: target.y - 25,
      },
      { width: 50, height: 50 }
    );
  }

  // Animation
  requestAnimationFrame(render);
}

render();
