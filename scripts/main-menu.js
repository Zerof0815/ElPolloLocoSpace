function howToPlayButton() {
    const startScreen = document.getElementById("start-screen");
    const howToScreen = document.getElementById("how-to-window");

    startScreen.style.display = "none";
    howToScreen.style.display = "flex";
}

function backToMainMenu() {
    const startScreen = document.getElementById("start-screen");
    const howToScreen = document.getElementById("how-to-window");

    startScreen.style.display = "flex";
    howToScreen.style.display = "none";
}