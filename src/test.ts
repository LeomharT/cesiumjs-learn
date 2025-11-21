import "./index.css";

const root = document.querySelector("#root") as HTMLDivElement;

for (let i = 0; i < 50; i++) {
  const box = document.createElement("div");
  box.classList.add("box");
  root.append(box);
}

const boxEl = document.querySelectorAll<HTMLDivElement>(".box");

const coord = {
  x: 0,
  y: 0,
};

let translateX = 0;
let accleerationX = 0;

let translateY = 0;
let accelerationY = 0;

const positions = Array.from({ length: boxEl.length }, () => ({ x: 0, y: 0 }));

function onPointerMove(e: PointerEvent) {
  coord.x = e.clientX;
  coord.y = e.clientY;
}

root.addEventListener("pointermove", onPointerMove);

function loopRender() {
  //Update
  accleerationX += (coord.x - translateX) * 0.2;
  accleerationX *= 0.15;
  translateX += accleerationX;

  accelerationY += (coord.y - translateY) * 0.2;
  accelerationY *= 0.15;
  translateY += accelerationY;

  positions.pop();

  positions.unshift({
    x: translateX,
    y: translateY,
  });

  boxEl.forEach((el, index) => {
    const target = {
      x: positions[positions.length - (index + 1)].x,
      y: positions[positions.length - (index + 1)].y,
    };

    el.style.top = target.y - 25 + "px";
    el.style.left = target.x - 25 + "px";
  });

  //Animation
  requestAnimationFrame(loopRender);
}

loopRender();
