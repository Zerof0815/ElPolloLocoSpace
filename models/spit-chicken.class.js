class SpitChicken extends Chicken {
  constructor(x, y, angle) {
    super(CHICKEN_IMAGES.SMALL[0], 50, 50, 4, CHICKEN_IMAGES.SMALL, 1, CHICKEN_IMAGES.SMALL_DEAD);
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.angle = angle;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }
}