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

  increment() {
    this.deadChickens++;
  }

  drawIcon(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";

    ctx.fillText(`${this.deadChickens} / 10`, this.x + this.width + 10, this.y + this.height / 1.5);
  }
}