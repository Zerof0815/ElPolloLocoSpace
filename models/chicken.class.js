class Chicken extends MovableObject {
  x = Math.floor(Math.random() * 400) + 800;
  y;
  height;
  width;
  chickenLifes;
  deadImage;
  isDead = false;
  IMAGES_WALKING;
  objectCollisionOffset = {
    left: 15,
    right: 15,
    top: 15,
    bottom: 15,
  };

  /**
   * Creates a new Chicken enemy with specified attributes.
   *
   * @constructor
   * @param {string} imagePath - Path to the chicken's image.
   * @param {number} height - The height of the chicken.
   * @param {number} width - The width of the chicken.
   * @param {number} speed - The movement speed of the chicken.
   * @param {string[]} walkingImages - Image array for the walking animation.
   * @param {number} chickenLifes - Number of lives the chicken has.
   * @param {string} deadImage - Image to show when the chicken dies.
   */
  constructor(
    imagePath,
    height,
    width,
    speed,
    walkingImages,
    chickenLifes,
    deadImage
  ) {
    super().loadImage(imagePath);
    this.IMAGES_WALKING = walkingImages;
    this.loadImagesIntoCache(this.IMAGES_WALKING);
    this.deadImage = deadImage;
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.chickenLifes = chickenLifes;
    this.moveLeft();
    this.animate();
  }

  /**
   * Starts the walking animation by cycling through the walking image frames at regular intervals.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      let frameIndex = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }

  /**
   * Stops the animation and displays the static dead image. Also stops movement.
   */
  deathAnimation() {
    clearInterval(this.animationInterval);
    const deadSprite = new Image();
    deadSprite.src = this.deadImage;
    this.img = deadSprite;
    this.speed = 0;
  }
}