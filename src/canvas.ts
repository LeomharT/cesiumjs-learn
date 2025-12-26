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

const position = {
  x: 0,
  y: 0,
};

const COLORS = [
  "#1d39c4",
  "#531dab",
  "#c41d7f",
  "#0958d9",
  "#08979c",
  "#389e0d",
  "#d4380d",
  "#cf1322",
  "#d46b08",
  "#7cb305",
  "#d48806",
  "#ffec3d",
];

function randomColor() {
  return COLORS[Math.ceil(Math.random() * COLORS.length - 1)];
}

function cleanScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
cleanScene();

const colorArr = Array.from({ length: 50 }, () => [
  randomColor(),
  randomColor(),
]);

const positionArr = Array.from({ length: 50 }, () => ({ x: 0, y: 0 }));

function renderRect(time: number) {
  for (let i = 0; i < 50; i++) {
    ctx.save();

    const center = {
      x: positionArr[positionArr.length - 1 - i].x - 25,
      y: positionArr[positionArr.length - 1 - i].y - 25,
    };
    ctx.fillStyle = colorArr[i][0];
    ctx.fillRect(center.x, center.y, 50, 50);

    ctx.strokeStyle = colorArr[i][1];
    ctx.lineWidth = 4;
    ctx.lineDashOffset = -time * 0.01;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(center.x, center.y, 50, 50);

    ctx.restore();
  }
}

let translateX = 0;
let accelerationX = 0;

let translateY = 0;
let accelerationY = 0;

function render(time: number = 0) {
  // Reset canvas
  cleanScene();

  // Update
  accelerationX += (pointer.x - translateX) * 0.002;
  accelerationX *= 0.95;
  translateX += accelerationX;

  accelerationY += (pointer.y - translateY) * 0.002;
  accelerationY *= 0.95;
  translateY += accelerationY;

  position.x = translateX;
  position.y = translateY;

  positionArr.pop();
  positionArr.unshift({ ...position });

  // Render scene
  renderRect(time);

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
