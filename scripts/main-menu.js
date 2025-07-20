const mobileOverlay = document.getElementById("mobile-overlay");
const impressum = document.getElementById("impressum");
const startScreen = document.getElementById("start-screen");
const howToScreen = document.getElementById("how-to-window");
let isDeviceVertical;

function howToPlayButton() {
  startScreen.style.display = "none";
  howToScreen.style.display = "flex";
}

function backToMainMenu() {
  startScreen.style.display = "flex";
  howToScreen.style.display = "none";
}

function init() {
  checkMobileOrientation();
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function updateMobileOverlay() {
  if (isDeviceVertical) {
    mobileOverlay.style.display = "flex";
  } else {
    mobileOverlay.style.display = "none";
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
    updateMobileOverlay();
  }, 500);
}

function openImpressum() {
  startScreen.style.display = "none";
  impressum.style.display = "block";
}

function closeImpressum() {
  startScreen.style.display = "flex";
  impressum.style.display = "none";
}
