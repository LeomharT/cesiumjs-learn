/**
 * (x, y, z)
 *
 * x' = x / z
 * y' = y / z
 */

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.createElement("canvas");
canvas.style.width = size.width + "px";
canvas.style.height = size.height + "px";
