class MovableObject extends DrawableObject {
  x;
  y;
  height;
  width;
  speed;
  bottleSpeed;
  objectCollisionOffset;

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 30);
  }

  moveRight() {
    setInterval(() => {
      if (this.isBreaking) return;
      this.x += this.bottleSpeed;
    }, 1000 / 30);
  }

  isColliding(movableObject) {
    let offset1 = this.objectCollisionOffset || {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    let offset2 = movableObject.objectCollisionOffset || {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    return (
      this.x + this.width - offset1.right > movableObject.x + offset2.left &&
      this.y + this.height - offset1.bottom > movableObject.y + offset2.top &&
      this.x + offset1.left <
        movableObject.x + movableObject.width - offset2.right &&
      this.y + offset1.top <
        movableObject.y + movableObject.height - offset2.bottom
    );
  }
}