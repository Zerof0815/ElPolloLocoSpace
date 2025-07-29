class Counter extends DrawableObject {
  x;
  y;
  height;
  width;
  deadChickens = 0;

  /**
   * Creates a counter instance to track the number of defeated chickens.
   *
   * @constructor
   * @param {number} x - The X position.
   * @param {number} y - The Y position.
   * @param {number} height - The height of the counter.
   * @param {number} width - The width of the counter.
   * @param {string} iconPath - The path to the counter icon image.
   */
  constructor(x, y, height, width, iconPath) {
    super();
    this.loadImage(iconPath);
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  /**
   * Increments the internal counter of dead chickens by one.
   */
  increment() {
    this.deadChickens++;
  }

  /**
   * Draws the counter icon and the current count onto the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawIcon(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";

    ctx.fillText(
      `${this.deadChickens} / 10`,
      this.x + this.width + 10,
      this.y + this.height / 1.5
    );
  }
}