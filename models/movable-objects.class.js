class MovableObject extends DrawableObject {
  x;
  y;
  height;
  width;
  speed;
  bottleSpeed;
  objectCollisionOffset;

  /**
   * Continuously moves the object to the left at the specified speed.
   * Movement is updated approximately 30 times per second.
   */
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 30);
  }

  /**
   * Continuously moves the object to the right at the bottleSpeed.
   * Movement is updated approximately 30 times per second.
   * Does nothing if the object is currently breaking.
   */
  moveRight() {
    setInterval(() => {
      if (this.isBreaking) return;
      this.x += this.bottleSpeed;
    }, 1000 / 30);
  }

  /**
   * Checks if this object is colliding with another movable object,
   * using collision offsets to adjust hitboxes.
   * @param {MovableObject} movableObject - The other object to check collision with.
   * @returns {boolean} True if the objects are colliding, otherwise false.
   */
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

    return this.calculateHitbox(offset1, offset2, movableObject);
  }

  /**
   * Calculates whether the hitboxes of this object and another
   * object overlap, accounting for their collision offsets.
   * @param {{left: number, right: number, top: number, bottom: number}} offset1 - This object's collision offset.
   * @param {{left: number, right: number, top: number, bottom: number}} offset2 - The other object's collision offset.
   * @param {MovableObject} movableObject - The other object to check collision with.
   * @returns {boolean} True if the hitboxes overlap, otherwise false.
   */
  calculateHitbox(offset1, offset2, movableObject) {
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