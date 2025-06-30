class Chicken extends MovableObject {
  x = Math.floor(Math.random() * 400) + 800;
  y;
  height;
  width;
  chickenLifes;
  deadImage;
  IMAGES_WALKING;
  objectCollisionOffset = {
    left: 15,
    right: 15,
    top: 15,
    bottom: 15,
  };

  constructor(imagePath, height, width, speed, walkingImages, chickenLifes, deadImage) {
    super().loadImage(imagePath);
    this.IMAGES_WALKING = walkingImages;
    this.loadImagesIntoCache(this.IMAGES_WALKING);
    this.deadImage = deadImage;
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.chickenLifes = chickenLifes;
    this.moveLeft();
    this.animate();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      let frameIndex = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[frameIndex];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }

  deathAnimation() {
    clearInterval(this.animationInterval);
    const deadSprite = new Image();
    deadSprite.src = this.deadImage;
    this.img = deadSprite;
    this.speed = 0;  
  }
}