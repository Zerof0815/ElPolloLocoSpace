class GameButton extends DrawableObject {
  x;
  y;
  height = 35;
  width = 35;
  muteImg;
  onClick;

  /**
   * Creates a new interactive game button.
   *
   * @constructor
   * @param {number} x - X position of the button.
   * @param {number} y - Y position of the button.
   * @param {string} img - Image path for the button.
   * @param {Function} onClick - Callback function to execute when the button is clicked.
   */
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
    const restartButton = new GameButton(390, 15, GAME_BUTTONS.RESTART, () => {
      world.muteHandler.stopSound(world.backgroundMusic);
      restartGame();
    });

    GameButton.startButtonPulse(
      restartButton,
      () => world.character?.isDead || world.endboss?.isDead
    );

    return restartButton;
  }

  /**
   * Creates a Sound/Mute toggle button that updates the game's mute state.
   * @param {Object} world - The current game world instance.
   * @returns {GameButton} A configured sound toggle button instance.
   */
  static createSoundButton(world) {
    return new GameButton(470, 15, GAME_BUTTONS.SOUND, () => {
      world.muteHandler.toggleMute();
    });
  }

  /**
   * Starts a pulse animation by scaling the button's width and height.
   * The button stays centered by adjusting its x and y positions.
   *
   * @param {GameButton} button - The button to animate.
   * @param {Function} conditionFn - A function returning true when the button should pulse.
   * @param {number} intervalMs - The interval for the pulse animation.
   */
  static startButtonPulse(button, conditionFn, intervalMs = 50) {
    let growing = true;
    let pulseAmount = 0;
    const maxPulse = 5;
    const original = {
      width: button.width,
      height: button.height,
      x: button.x,
      y: button.y,
    };
    setInterval(() => {
      if (!conditionFn()) {
        GameButton.resetButton(button, original);
        return;
      }
      ({ growing, pulseAmount } = GameButton.updatePulse(
        growing,
        pulseAmount,
        maxPulse
      ));
      GameButton.applyPulse(button, original, pulseAmount);
    }, intervalMs);
  }

  /**
   * Resets the button to its original size and position.
   * @param {GameButton} button - The button to reset.
   * @param {{width: number, height: number, x: number, y: number}} original - Original values.
   */
  static resetButton(button, original) {
    button.width = original.width;
    button.height = original.height;
    button.x = original.x;
    button.y = original.y;
  }

  /**
   * Updates the current pulse state (direction and size).
   * @param {boolean} growing - Current growth direction.
   * @param {number} pulseAmount - Current pulse amount.
   * @param {number} maxPulse - Maximum pulse value.
   * @returns {{ growing: boolean, pulseAmount: number }}
   */
  static updatePulse(growing, pulseAmount, maxPulse) {
    if (growing) {
      pulseAmount += 0.5;
      if (pulseAmount >= maxPulse) growing = false;
    } else {
      pulseAmount -= 0.5;
      if (pulseAmount <= 0) growing = true;
    }
    return { growing, pulseAmount };
  }

  /**
   * Applies the pulse effect to button size and position.
   * @param {GameButton} button - The button to animate.
   * @param {{width: number, height: number, x: number, y: number}} original - Original values.
   * @param {number} pulseAmount - Amount to scale the button.
   */
  static applyPulse(button, original, pulseAmount) {
    button.width = original.width + pulseAmount;
    button.height = original.height + pulseAmount;
    button.x = original.x - pulseAmount / 2;
    button.y = original.y - pulseAmount / 2;
  }
}