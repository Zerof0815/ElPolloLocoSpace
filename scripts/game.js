let canvas;
let world;
let joystick;
let isDeviceVertical;
const crosshair = document.getElementById("crosshair");
const joystickContainer = document.getElementById("joystick");
const mobileOverlay = document.getElementById("mobile-overlay");
let keyboard = new Keyboard();

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    checkMobileOrientation();
    initMobileControls();
}

function initMobileControls() {
  if (isTouchDevice()) {
    joystick = new Joystick("joystick", "stick", keyboard);
    handleMobileControlls();
  }
}

function updateMobileOverlayAndControls() {
  if (isDeviceVertical) {
    mobileOverlay.style.display = "flex";

    if (joystickContainer) {
      joystickContainer.style.display = "none";
    }
    if (crosshair) {
      crosshair.style.display = "none";
    }
  } else {
    mobileOverlay.style.display = "none";

    if (isTouchDevice()) {
      if (joystickContainer) {
        joystickContainer.style.display = "block";
      }
      if (crosshair) {
        crosshair.style.display = "block";
      }
    }
  }
}

function checkMobileOrientation() {
  setInterval(() => {
    if (screen.width <= screen.height && isTouchDevice()) {
      isDeviceVertical = true;
      mobileOverlay.style.display = "flex";
    } else {
      isDeviceVertical = false;
      mobileOverlay.style.display = "none";
    }
    updateMobileOverlayAndControls();
  }, 500);
}

function handleMobileControlls() {
  crosshair.addEventListener("touchstart", () => {
    keyboard.SPACE = true;
  });

  crosshair.addEventListener("touchend", () => {
    keyboard.SPACE = false;
  });

  crosshair.addEventListener("mousedown", () => {
    keyboard.SPACE = true;
  });

  crosshair.addEventListener("mouseup", () => {
    keyboard.SPACE = false;
  });
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