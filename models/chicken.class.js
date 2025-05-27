class Chicken extends MovableObject {
  x = 550;
  y = Math.floor(Math.random() * 400) + 10;
  height;
  width;
  IMAGES_WALKING;

  constructor(imagePath, height, width, speed, walkingImages) {
    super().loadImage(imagePath);
    this.IMAGES_WALKING = walkingImages;
    this.loadImagesIntoCache(this.IMAGES_WALKING);
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.moveLeft();
    this.animate();
  }

  animate() {
    setInterval(() => {
      let frameIndex = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }
}