import { Pane } from "tweakpane";
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

function cleanScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
cleanScene();

const params = {
  frequency: 0.05,
};

const lastCoord = {
  x: 0,
  y: window.innerHeight / 2.0,
};

function renderCosLine(time: number) {
  ctx.save();

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#531dab";

  const centerY = window.innerHeight / 2.0;

  ctx.beginPath();

  const progress = time * 0.1;

  const y = Math.cos(progress * params.frequency) * 100 + centerY;

  ctx.moveTo(lastCoord.x, lastCoord.y);
  ctx.lineTo(progress, y);

  ctx.stroke();
  ctx.restore();

  lastCoord.x = progress;
  lastCoord.y = y;
}

const pane = new Pane({ title: "Debug Params" });
pane.element.parentElement!.style.width = "380px";
pane
  .addBinding(params, "frequency", {
    min: 0,
    max: 0.1,
    step: 0.001,
  })
  .on("change", () => {
    cleanScene();
    ctx.moveTo(lastCoord.x, lastCoord.y);
    renderCosLine(0.0);
  });

function render(time: number = 0) {
  renderCosLine(time);

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
