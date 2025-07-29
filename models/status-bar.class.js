class StatusBar extends DrawableObject {
  x;
  y;
  height;
  width;
  percentage = 100;
  healthBarImg;

  /**
   * Creates a status bar (e.g., health, boss health).
   *
   * @constructor
   * @param {number} x - X position of the status bar.
   * @param {number} y - Y position of the status bar.
   * @param {number} height - Height of the status bar.
   * @param {number} width - Width of the status bar.
   * @param {string[]} healthBarImg - Array of image paths for status levels.
   */
  constructor(x, y, height, width, healthBarImg) {
    super().loadImagesIntoCache(healthBarImg);
    this.healthBarImg = healthBarImg;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.setPercentage(100);
  }

  /**
   * Updates the health percentage and changes the displayed health bar image accordingly.
   * @param {number} percentage - The current health percentage (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = Math.floor(this.percentage / 20);
    index = Math.min(index, this.healthBarImg.length - 1);
    const path = this.healthBarImg[index];
    this.img = this.imageCache[path];
  }
}