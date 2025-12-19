import "./canvas.css";

type Position = {
  x: number;
  y: number;
};
type Size = {
  width: number;
  height: number;
};

/**
 * Variables
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2.0, window.devicePixelRatio),
};

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = sizes.width * sizes.pixelRatio;
canvas.height = sizes.height * sizes.pixelRatio;
canvas.style.width = sizes.width + "px";
canvas.style.height = sizes.height + "px";

const el = document.querySelector("#root");
el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.scale(sizes.pixelRatio, sizes.pixelRatio);

const pointer = {
  x: 0,
  y: 0,
};

let radius = 50;
let acceleration = false;

function cleanScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function rotateAroundCursor(time: number, radius: number = 50) {
  time *= 0.001;

  ctx.save();
  ctx.fillStyle = "#36cfc9";

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "#d3adf7";
  ctx.lineWidth = 5;

  for (let i = 0; i < 50; i++) {
    const position = {
      x: Math.cos(i + time) * radius,
      y: Math.sin(i + time) * radius,
    };

    const size = radius / 4;

    ctx.fillRect(
      pointer.x - size / 2 + position.x,
      pointer.y - size / 2 + position.y,
      size,
      size
    );
    ctx.strokeRect(
      pointer.x - size / 2 + position.x,
      pointer.y - size / 2 + position.y,
      size,
      size
    );
  }

  ctx.restore();
}

function render(time: number = 0) {
  cleanScene();

  if (acceleration) {
    radius += 15.0;
  } else {
    radius -= 15.0;
  }

  radius = Math.max(50, radius);
  radius = Math.min(300, radius);

  console.log(radius);

  rotateAroundCursor(time, radius);

  // Animation
  requestAnimationFrame(render);
}

render();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  canvas.width = sizes.width * sizes.pixelRatio;
  canvas.height = sizes.height * sizes.pixelRatio;
  canvas.style.width = sizes.width + "px";
  canvas.style.height = sizes.height + "px";

  cleanScene();
});

window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

window.addEventListener("pointerdown", () => {
  acceleration = true;
});
window.addEventListener("pointerup", () => {
  acceleration = false;
});
