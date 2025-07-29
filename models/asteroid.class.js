class Asteroid extends MovableObject {
  /**
   * Creates a new asteroid instance.
   *
   * @constructor
   * @param {string} imagePath - The path to the asteroid image.
   * @param {number} x - The X position of the asteroid.
   * @param {number} y - The Y position of the asteroid.
   * @param {number} width - The width of the asteroid.
   * @param {number} height - The height of the asteroid.
   * @param {number} speed - The speed of the asteroid.
   */
  constructor(imagePath, x, y, width, height, speed) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.moveLeft();
  }
}
