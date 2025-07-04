class Endboss extends MovableObject {
    x = 1000;
    y = 0;
    height;
    width;
    speed;
    currentImage = 0;
    endbossLifes = 5;
    isDead = false;
    imageCache = {};
    animationInterval;
    movementInterval;
    isMoving = false;
    explosions = [];
    objectCollisionOffset = {
        left: 80,
        right: 350,
        top: 105,
        bottom: 135,
    };

    constructor(imagePath, height, width, speed, walkingImages) {
      super().loadImage(imagePath);
      this.height = height;
      this.width = width;
      this.speed = speed;
      this.IMAGES_WALKING = walkingImages;

      this.loadImagesIntoCache(ENDBOSS.WALK);
      this.loadImagesIntoCache(ENDBOSS.ALERT);
      this.loadImagesIntoCache(ENDBOSS.ATTACK);
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

    startMoving() {
        this.isMoving = true;
        this.moveToTargetX(460);
        this.startAnimation(ENDBOSS.WALK, 200, true);
    }

    deathAnimation() {
        if (this.isDead) return;
        this.isDead = true;

        // ATTACK-Animation läuft weiter → also NICHT stoppen!
        // Aber falls du willst, kannst du sicherheitshalber den Loop neu starten:
        this.startAnimation(ENDBOSS.ATTACK, 200, true);

        // Starte Explosionen & Bewegung
        this.startExplosionLoop();
        this.startDeathMovement();
    }

    startExplosionLoop() {
        this.explosionInterval = setInterval(() => {
            this.spawnExplosion();
        }, 200); // Alle 200ms eine neue Explosion
    }

    spawnExplosion() {
        const hitboxWidth = this.width - this.objectCollisionOffset.left - this.objectCollisionOffset.right;
        const hitboxHeight = this.height - this.objectCollisionOffset.top - this.objectCollisionOffset.bottom;

        const randomX = this.x + this.objectCollisionOffset.left + Math.random() * hitboxWidth;
        const randomY = this.y + this.objectCollisionOffset.top + Math.random() * hitboxHeight;


        const explosion = new Explosion(randomX, randomY);
        this.explosions.push(explosion);
        console.log(this.explosions);
        

        // Explosion nach 1s wieder entfernen
        setTimeout(() => {
            const index = this.explosions.indexOf(explosion);
            if (index > -1) {
            this.explosions.splice(index, 1);
            }
        }, 400);
    }

    startDeathMovement() {
        this.deathMoveInterval = setInterval(() => {
            this.y += 1; // Sinkt langsam
        }, 1000 / 30);
    }

    drawExplosions(ctx) {
        this.explosions.forEach(explosion => {
            explosion.draw(ctx);
        });
    }
}
