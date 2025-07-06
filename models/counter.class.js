class Counter extends DrawableObject {
  x;
  y;
  height;
  width;
  iconImage;
  value = 0;

  constructor(x, y, height, width, iconPath) {
    super();
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.iconImage = new Image();
    this.iconImage.src = iconPath;
  }

  increment() {
    this.value++;
  }

  drawIcon(ctx) {
    ctx.drawImage(this.iconImage, this.x, this.y, this.width, this.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";

    ctx.fillText(`${this.value} / 10`, this.x + this.width + 10, this.y + this.height / 1.5);
  }
}