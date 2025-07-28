class GameButton extends DrawableObject {
  x;
  y;
  height = 35;
  width = 35;
  muteImg;
  onClick;

  constructor(x, y, img, onClick) {
    super();
    this.loadImage(img);
    this.muteImg = GAME_BUTTONS.NO_SOUND;
    this.x = x;
    this.y = y;
    this.onClick = onClick;
  }

  contains(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }

  handleClick(mouseX, mouseY) {
    if (this.contains(mouseX, mouseY)) {
      if (this.onClick) this.onClick();
    }
  }

  isHovered(mouseX, mouseY) {
    return this.contains(mouseX, mouseY);
  }

  static createHomeButton() {
    return new GameButton(310, 15, GAME_BUTTONS.HOME, () => {
      endGame();
      const mainMenu = document.getElementById("start-screen");
      const gameScreen = document.getElementById("game-screen");
      mainMenu.style.display = "flex";
      gameScreen.style.display = "none";
    });
  }

  static createRestartButton(world) {
    return new GameButton(390, 15, GAME_BUTTONS.RESTART, () => {
      world.endAudio(world.backgroundMusic);
      restartGame();
    });
  }

  static createSoundButton(world) {
    return new GameButton(470, 15, GAME_BUTTONS.SOUND, () => {
      world.isMuted = !world.isMuted;
      localStorage.setItem("isMuted", world.isMuted ? "true" : "false");
      world.isGameMuted();
    });
  }
}