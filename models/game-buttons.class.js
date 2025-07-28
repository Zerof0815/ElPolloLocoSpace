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

  /**
   * Checks if the given mouse coordinates are within the button's area.
   * @param {number} mouseX - The x-coordinate of the mouse or touch.
   * @param {number} mouseY - The y-coordinate of the mouse or touch.
   * @returns {boolean} True if the pointer is over the button, otherwise false.
   */
  contains(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }

  /**
   * Executes the `onClick` callback if the button is clicked.
   * @param {number} mouseX - The x-coordinate of the click.
   * @param {number} mouseY - The y-coordinate of the click.
   */
  handleClick(mouseX, mouseY) {
    if (this.contains(mouseX, mouseY)) {
      if (this.onClick) this.onClick();
    }
  }

  /**
   * Checks if the mouse is currently hovering over the button.
   * @param {number} mouseX - The x-coordinate of the mouse.
   * @param {number} mouseY - The y-coordinate of the mouse.
   * @returns {boolean} True if hovered, otherwise false.
   */
  isHovered(mouseX, mouseY) {
    return this.contains(mouseX, mouseY);
  }

  /**
   * Creates a Home button that ends the game and returns to the main menu.
   * @returns {GameButton} A configured home button instance.
   */
  static createHomeButton() {
    return new GameButton(310, 15, GAME_BUTTONS.HOME, () => {
      endGame();
      const mainMenu = document.getElementById("start-screen");
      const gameScreen = document.getElementById("game-screen");
      mainMenu.style.display = "flex";
      gameScreen.style.display = "none";
    });
  }

  /**
   * Creates a Restart button that ends the current audio and restarts the game.
   * @param {Object} world - The current game world instance.
   * @returns {GameButton} A configured restart button instance.
   */
  static createRestartButton(world) {
    return new GameButton(390, 15, GAME_BUTTONS.RESTART, () => {
      world.endAudio(world.backgroundMusic);
      restartGame();
    });
  }

  /**
   * Creates a Sound/Mute toggle button that updates the game's mute state.
   * @param {Object} world - The current game world instance.
   * @returns {GameButton} A configured sound toggle button instance.
   */
  static createSoundButton(world) {
    return new GameButton(470, 15, GAME_BUTTONS.SOUND, () => {
      world.isMuted = !world.isMuted;
      localStorage.setItem("isMuted", world.isMuted ? "true" : "false");
      world.isGameMuted();
    });
  }
}