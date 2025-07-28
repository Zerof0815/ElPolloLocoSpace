const impressum = document.getElementById("impressum");
const startScreen = document.getElementById("start-screen");
const howToScreen = document.getElementById("how-to-window");

/**
 * Hides the start screen and shows the "How To Play" screen.
 */
function howToPlayButton() {
  startScreen.style.display = "none";
  howToScreen.style.display = "flex";
}

/**
 * Returns from the "How To Play" screen back to the main start screen.
 */
function backToMainMenu() {
  startScreen.style.display = "flex";
  howToScreen.style.display = "none";
}

/**
 * Initializes the menu by checking the mobile device orientation.
 */
function initMenu() {
  checkMobileOrientation();
}

/**
 * Starts the game by hiding the start screen, showing the game screen, and initializing the game.
 */
function startGame() {
  startScreen.style.display = "none";
  document.getElementById("game-screen").style.display = "flex";
  init();
}

/**
 * Detects whether the current device supports touch input.
 * @returns {boolean} True if the device supports touch input, false otherwise.
 */
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Updates the visibility of the mobile overlay based on device orientation.
 */
function updateMobileOverlay() {
  if (isDeviceVertical) {
    mobileOverlay.style.display = "flex";
  } else {
    mobileOverlay.style.display = "none";
  }
}

/**
 * Periodically checks the device orientation and updates the mobile overlay visibility accordingly.
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
    updateMobileOverlay();
  }, 500);
}

/**
 * Opens the impressum screen by hiding the start screen and showing the impressum element.
 */
function openImpressum() {
  startScreen.style.display = "none";
  impressum.style.display = "block";
}

/**
 * Closes the impressum screen by hiding it and showing the start screen.
 */
function closeImpressum() {
  startScreen.style.display = "flex";
  impressum.style.display = "none";
}
