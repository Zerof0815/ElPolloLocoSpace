class Endboss extends MovableObject {
    x = 1000;
    y = 0;
    height;
    width;
    speed;
    currentImage = 0;
    imageCache = {};
    animationInterval;
    movementInterval;

    constructor(imagePath, height, width, speed, walkingImages) {
      super().loadImage(imagePath);
      this.height = height;
      this.width = width;
      this.speed = speed;
      this.IMAGES_WALKING = walkingImages;

      this.loadImagesIntoCache(ENDBOSS.WALK);
      this.loadImagesIntoCache(ENDBOSS.ALERT);
      this.loadImagesIntoCache(ENDBOSS.ATTACK);

      // comment out if endboss should move
      this.moveToTargetX(460);
      this.startAnimation(ENDBOSS.WALK, 200, true);
    }

    startAnimation(imageArray, intervalTime, loop = true, onComplete = null) {
        this.currentImage = 0;
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            const frame = imageArray[this.currentImage];
            this.img = this.imageCache[frame];
            this.currentImage++;

            if (this.currentImage >= imageArray.length) {
                if (loop) {
                    this.currentImage = 0;
                } else {
                    clearInterval(this.animationInterval);
                    if (onComplete) onComplete();
                }
            }
        }, intervalTime);
    }

    moveToTargetX(targetX) {
        if (this.movementInterval) clearInterval(this.movementInterval);
        
        this.movementInterval = setInterval(() => {
            if (this.x > targetX) {
                this.x -= this.speed;
            } else {
                clearInterval(this.movementInterval);
                this.x = targetX;
                clearInterval(this.animationInterval);

                setTimeout(() => {
                    this.startAnimation(ENDBOSS.ALERT, 150, false, () => {
                        this.startAnimation(ENDBOSS.ATTACK, 200, true);
                    });
                }, 3000);
            }
        }, 1000 / 30);
    }
}
