class Bottle extends MovableObject {
  bottleSpeed = 10;
  isBreaking = false;
  objectCollisionOffset = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  };
  bottleAudio;

  /**
   * Creates a new bottle instance at the specified position.
   *
   * @constructor
   * @param {number} x - The initial X position where the bottle is created.
   * @param {number} y - The initial Y position where the bottle is created.
   */
  constructor(x, y) {
    super();
    this.x = x - 100;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.loadImage(
      "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    );
    this.loadImagesIntoCache(BOTTLE_ANIMATION.ROTATE);
    this.loadImagesIntoCache(BOTTLE_ANIMATION.BREAK);
    this.moveRight();
    this.animate();
    this.bottleAudio = new Audio("assets/audio/bottleBreak.mp3");
  }

  /**
   * Starts the bottle's rotation animation using the ROTATE image sequence.
   * Continues until the bottle starts breaking.
   */
  animate() {
    setInterval(() => {
      if (this.isBreaking) return;
      let frameIndex = this.currentImage % BOTTLE_ANIMATION.ROTATE.length;
      let path = BOTTLE_ANIMATION.ROTATE[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }

  /**
   * Initiates the bottle breaking animation and sets its state to breaking.
   * @param {Function} removeCallback - Callback to remove the bottle after animation completes.
   */
  breakAnimation(removeCallback) {
    this.isBreaking = true;

    let frameIndex = 0;
    const totalFrames = BOTTLE_ANIMATION.BREAK.length;

    this.breakAnimationInterval(frameIndex, totalFrames, removeCallback);
  }

  /**
   * Handles the animation frames for the bottle breaking sequence.
   * @param {number} frameIndex - Index of the current animation frame.
   * @param {number} totalFrames - Total number of frames in the breaking animation.
   * @param {Function} removeCallback - Callback to remove the bottle after animation ends.
   */
  breakAnimationInterval(frameIndex, totalFrames, removeCallback) {
    const breakInterval = setInterval(() => {
      let currentFrame = frameIndex % BOTTLE_ANIMATION.BREAK.length;
      let path = BOTTLE_ANIMATION.BREAK[currentFrame];
      this.img = this.imageCache[path];

      frameIndex++;

      if (frameIndex >= totalFrames) {
        clearInterval(breakInterval);
        if (removeCallback) removeCallback();
      }
    }, 50);
  }

  /**
   * Plays the sound effect for the bottle breaking.
   */
  breakSound() {
    const bottleBreakSound = this.bottleAudio.cloneNode();
    bottleBreakSound.volume = 0.2;
    bottleBreakSound.play();
  }
}