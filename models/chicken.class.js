class Chicken extends MovableObject {
  x = 550;
  y = Math.floor(Math.random() * 400) + 10;
  height;
  width;

  constructor(imagePath, height, width) {
    super().loadImage(imagePath);
    this.height = height;
    this.width = width;
    this.chickenMoveLeft()
  }

  chickenMoveLeft() {
    setInterval(() => {
      this.x -= 3;
    }, 1000 / 30);
  }
}