class Chicken extends MovableObject {
  x = 550;
  y = Math.floor(Math.random() * 400) + 10;
  height;
  width;
  IMAGES_WALKING = [
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor(imagePath, height, width, speed) {
    super().loadImage(imagePath);
    this.loadImagesIntoCache(this.IMAGES_WALKING)
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.moveLeft();
    this.animate()
  }

  animate() {
    setInterval(() => {
      let frameIndex = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++
    }, 100);
  }
}