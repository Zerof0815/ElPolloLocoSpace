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

  animate() {
    setInterval(() => {
      if (this.isBreaking) return;
      let frameIndex = this.currentImage % BOTTLE_ANIMATION.ROTATE.length;
      let path = BOTTLE_ANIMATION.ROTATE[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }

  breakAnimation(removeCallback) {
    this.isBreaking = true;

    let frameIndex = 0;
    const totalFrames = BOTTLE_ANIMATION.BREAK.length;

    this.breakAnimationInterval(frameIndex, totalFrames, removeCallback);
  }

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

  breakSound() {
    const bottleBreakSound = this.bottleAudio.cloneNode();
    bottleBreakSound.volume = 0.2;
    bottleBreakSound.play();
  }
}