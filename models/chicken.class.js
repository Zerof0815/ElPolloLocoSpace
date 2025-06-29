class Chicken extends MovableObject {
  x = Math.floor(Math.random() * 400) + 800;
  y;
  height;
  width;
  chickenLifes;
  isDead = false;
  IMAGES_WALKING;

  constructor(imagePath, height, width, speed, walkingImages, chickenLifes) {
    super().loadImage(imagePath);
    this.IMAGES_WALKING = walkingImages;
    this.loadImagesIntoCache(this.IMAGES_WALKING);
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.chickenLifes = chickenLifes;
    this.moveLeft();
    this.animate();
  }

  animate() {
    setInterval(() => {
      //Walk animation
      let frameIndex = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }
}