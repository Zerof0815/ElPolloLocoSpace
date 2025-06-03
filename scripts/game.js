let canvas;
let world;
let keyboard = new Keyboard();

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

window.addEventListener("blur", () => {
  keyboard.w = keyboard.a = keyboard.s = keyboard.d = keyboard.SPACE = false;
});

console.log("Nur so");
