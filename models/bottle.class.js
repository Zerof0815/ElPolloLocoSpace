class Bottle extends MovableObject {
  bottleSpeed = 10;

  constructor(x, y) {
    super();
    this.x = x - 110;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.loadImage(
      "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    );
    this.loadImagesIntoCache(BOTTLE_ANIMATION);
    this.moveRight();
    this.animate();
  }

  animate() {
    setInterval(() => {
      let frameIndex = this.currentImage % BOTTLE_ANIMATION.length;
      let path = BOTTLE_ANIMATION[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }
}