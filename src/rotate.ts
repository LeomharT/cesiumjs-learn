import "./rotate.css";

const root = document.querySelector("#root") as HTMLDivElement;

const box = document.createElement("div");
box.innerText = "👉";
box.classList.add("box");
root.append(box);

let enable = false;

root.addEventListener("pointerdown", () => {
  enable = true;
});

root.addEventListener("pointerup", () => {
  enable = false;
});

function onPointerMove(e: PointerEvent) {
  if (!enable) return;

  const rect = box.getBoundingClientRect();

  const center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  const target = {
    x: e.clientX,
    y: e.clientY,
  };

  const angle = Math.atan2(target.y - center.y, target.x - center.x);

  box.style.transform = `rotate(${(angle * 180) / Math.PI}deg)`;
}

root.addEventListener("pointermove", onPointerMove);
