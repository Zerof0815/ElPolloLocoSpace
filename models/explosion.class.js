class Explosion extends MovableObject {
  currentFrame = 0;

  /**
   * Creates an explosion effect at the given position.
   *
   * @constructor
   * @param {number} x - The X position of the explosion.
   * @param {number} y - The Y position of the explosion.
   */
  constructor(x, y) {
    super().loadImage(EXPLOSION[0]);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.loadImagesIntoCache(EXPLOSION);
    this.animate();
  }

  /**
   * Starts the explosion animation by cycling through the explosion frames.
   * Automatically stops when the last frame is reached.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      this.img = this.imageCache[EXPLOSION[this.currentFrame]];
      this.currentFrame++;
      if (this.currentFrame >= EXPLOSION.length) {
        clearInterval(this.animationInterval);
      }
    }, 50);
  }

  /**
   * Draws the current explosion frame onto the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}