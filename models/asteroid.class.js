class Asteroid extends MovableObject {

  constructor(imagePath, x, y, width, height, changeX) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.asteroidMoveLeft(changeX);
  }

  asteroidMoveLeft(changeX) {
    setInterval(() => {
      this.x -= changeX;
    }, 1000 / 30);
  }
}
