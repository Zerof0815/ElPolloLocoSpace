class SpitChicken extends Chicken {
  /**
   * Creates a specialized chicken that can be used for projectile behavior.
   *
   * @constructor
   * @param {number} x - X position.
   * @param {number} y - Y position.
   * @param {number} angle - Firing angle for the spit chicken.
   */
  constructor(x, y, angle) {
    super(
      CHICKEN_IMAGES.SMALL[0],
      50,
      50,
      4,
      CHICKEN_IMAGES.SMALL,
      1,
      CHICKEN_IMAGES.SMALL_DEAD
    );
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.angle = angle;
  }

  /**
   * Updates the position of the SpitChicken based on its speed and angle.
   */
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }
}