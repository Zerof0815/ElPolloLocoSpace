class Counter extends DrawableObject {
  x;
  y;
  height;
  width;
  deadChickens = 0;

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