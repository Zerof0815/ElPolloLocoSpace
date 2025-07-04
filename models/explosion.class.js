class Explosion extends MovableObject {
  currentFrame = 0;

  constructor(x, y) {
    super().loadImage(EXPLOSION[0]);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.loadImagesIntoCache(EXPLOSION);
    this.animate();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      this.img = this.imageCache[EXPLOSION[this.currentFrame]];
      this.currentFrame++;
      if (this.currentFrame >= EXPLOSION.length) {
        clearInterval(this.animationInterval);
      }
    }, 50);
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}