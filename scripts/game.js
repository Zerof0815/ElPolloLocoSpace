let canvas;
let world;
let keyboard = new Keyboard();
let isTabActive = true;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      keyboard.UP = true;
      break;
    case "KeyA":
      keyboard.LEFT = true;
      break;
    case "KeyS":
      keyboard.DOWN = true;
      break;
    case "KeyD":
      keyboard.RIGHT = true;
      break;
    case "Space":
      keyboard.SPACE = true;
      break;
  }
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    keyboard.CLICK = true;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      keyboard.UP = false;
      break;
    case "KeyA":
      keyboard.LEFT = false;
      break;
    case "KeyS":
      keyboard.DOWN = false;
      break;
    case "KeyD":
      keyboard.RIGHT = false;
      break;
    case "Space":
      keyboard.SPACE = false;
      break;
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    keyboard.CLICK = false;
  }
});

window.addEventListener("blur", () => {
  keyboard.UP = keyboard.LEFT = keyboard.DOWN = keyboard.RIGHT = keyboard.SPACE = false;
});

document.addEventListener("visibilitychange", () => {
  isTabActive = !document.hidden;
});

document.addEventListener("click", () => {
    world.startBackgroundMusic();
  }, { once: true });
