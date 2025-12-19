import "./rotate.css";

const root = document.querySelector("#root") as HTMLDivElement;

const COUNT = 50;
const RADIUS = 300;

for (let i = 0; i < COUNT; i++) {
  const rect = document.createElement("div");
  rect.classList.add("rect");

  const x = Math.cos(i) * RADIUS;
  const y = Math.sin(i) * RADIUS;

  rect.style.left = x + window.innerWidth / 2 + "px";
  rect.style.top = y + window.innerHeight / 2 + "px";

  root.append(rect);
}

const nodes = document.querySelectorAll(".rect");

function render(time: number = 0) {
  nodes.forEach((value, index) => {
    const x = Math.cos(index + time * 0.01) * RADIUS;
    const y = Math.sin(index + time * 0.01) * RADIUS;

    if (value instanceof HTMLDivElement) {
      value.style.left = x + window.innerWidth / 2 + "px";
      value.style.top = -y + window.innerHeight / 2 + "px";
    }
  });

  requestAnimationFrame(render);
}

render();
