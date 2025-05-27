class Asteroid extends MovableObject {

  constructor(imagePath, x, y, width, height, speed) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed
    this.moveLeft();
  }
}
