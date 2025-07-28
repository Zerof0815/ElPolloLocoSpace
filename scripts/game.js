let canvas;
let world;
let joystick;
let isDeviceVertical;
const crosshair = document.getElementById("crosshair");
const joystickContainer = document.getElementById("joystick");
const mobileOverlay = document.getElementById("mobile-overlay");
let keyboard = new Keyboard();

/**
 * Checks if the current device supports touch events.
 * @returns {boolean} True if the device supports touch, otherwise false.
 */
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Initializes the game by setting up the canvas, world, mobile orientation, and controls.
 */
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    checkMobileOrientation();
    initMobileControls();
}

/**
 * Initializes mobile controls if the device supports touch input.
 */
function initMobileControls() {
  if (isTouchDevice()) {
    joystick = new Joystick("joystick", "stick", keyboard);
    handleMobileControlls();
  };
}

/**
 * Updates the visibility of mobile overlay and controls based on device orientation.
 */
function updateMobileOverlayAndControls() {
  if (isDeviceVertical) {
    hideMobileControlls();
  } else {
    mobileOverlay.style.display = "none";

    if (isTouchDevice()) {
      showMobileControlls();
    }
  };

  crosshair.addEventListener("contextmenu", (e) => e.preventDefault());
  joystickContainer.addEventListener("contextmenu", (e) => e.preventDefault());
}

/**
 * Hides mobile control elements like the joystick and crosshair, and shows the overlay.
 */
function hideMobileControlls() {
  mobileOverlay.style.display = "flex";

  if (joystickContainer) {
    joystickContainer.style.display = "none";
  }
  if (crosshair) {
    crosshair.style.display = "none";
  }
}

/**
 * Shows mobile control elements like the joystick and crosshair.
 */
function showMobileControlls() {
  if (joystickContainer) {
    joystickContainer.style.display = "block";
  }
  if (crosshair) {
    crosshair.style.display = "block";
  }
}

/**
 * Periodically checks the device orientation and updates overlay and controls accordingly.
 */
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

/**
 * Sets up event listeners for mobile controls related to the crosshair element.
 */
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

/**
 * Restarts the game by clearing all timers, stopping audio, and creating a new game world.
 */
function restartGame() {
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
    clearTimeout(i);
    cancelAnimationFrame(i);
  }

  world.backgroundMusic.pause();
  world.backgroundMusic.currentTime = 0;
  world.bossMusic.pause();
  world.bossMusic.currentTime = 0;

  createNewWorld();
}

/**
 * Ends the game by clearing timers and stopping all music.
 */
function endGame() {
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
    clearTimeout(i);
    cancelAnimationFrame(i);
  }

  world.backgroundMusic.pause();
  world.backgroundMusic.currentTime = 0;
  world.bossMusic.pause();
  world.bossMusic.currentTime = 0;
}

/**
 * Creates a new game world by replacing the old canvas with a new one.
 */
function createNewWorld() {
  const oldCanvas = document.getElementById("canvas");
  const newCanvas = oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

  world = new World(newCanvas, keyboard);
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