class Background extends MovableObject {
  /**
   * Creates a new background instance.
   *
   * @constructor
   * @param {string} imagePath - The path to the background image.
   * @param {number} x - The X position of the background.
   * @param {number} y - The Y position of the background.
   * @param {number} width - The width of the background.
   * @param {number} height - The height of the background.
   */
  constructor(imagePath, x, y, width, height) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}