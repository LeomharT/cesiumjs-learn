import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
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

const box = {
  count: 30,
  hx: 50,
  hy: 50,
};

const cursor = {
  x: 0,
  y: 0,
};

let accelerationX = 0;
let translateX = 0;

let accelerationY = 0;
let translateY = 0;

/**
 * Document Object Module
 */

const el = document.querySelector("#root") as HTMLDivElement;

const canvas = document.createElement("canvas");

canvas.width = sizes.width * sizes.pixelRatio;
canvas.height = sizes.height * sizes.pixelRatio;

canvas.style.width = sizes.width + "px";
canvas.style.height = sizes.height + "px";

el?.append(canvas);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.scale(sizes.pixelRatio, sizes.pixelRatio);

function cleanScene() {
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, sizes.width, sizes.height);
}

function drawBox(position: Position, size: Size) {
  const fixed = {
    x: position.x - size.width / 2.0,
    y: position.y - size.height / 2.0,
  };

  ctx.save();

  ctx.fillStyle = "#F9DFDF";
  ctx.fillRect(fixed.x, fixed.y, size.width, size.height);

  ctx.restore();
}

/**
 * Debug
 */

const pane = new Pane({ title: "Debug Params" });
pane.element.parentElement!.style.width = "380px";
pane.registerPlugin(EssentialsPlugin);

const fpsGraph: any = pane.addBlade({
  view: "fpsgraph",
  label: undefined,
  rows: 4,
});

/**
 * Event
 */

function render() {
  fpsGraph.begin();

  // Update
  accelerationY += (cursor.y - translateY) * 0.002;
  accelerationY *= 0.95;
  translateY += accelerationY;

  accelerationX += (cursor.x - translateX) * 0.002;
  accelerationX *= 0.95;
  translateX += accelerationX;

  // Render
  cleanScene();

  drawBox(
    {
      x: translateX,
      y: translateY,
    },
    {
      width: box.hx,
      height: box.hy,
    }
  );

  // Animation
  requestAnimationFrame(render);

  fpsGraph.end();
}
render();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  canvas.width = sizes.width * sizes.pixelRatio;
  canvas.height = sizes.height * sizes.pixelRatio;

  canvas.style.width = sizes.width + "px";
  canvas.style.height = sizes.height + "px";

  ctx.scale(sizes.pixelRatio, sizes.pixelRatio);
}
window.addEventListener("resize", resize);

function onPointerMove(e: PointerEvent) {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
}
el.addEventListener("pointermove", onPointerMove);
