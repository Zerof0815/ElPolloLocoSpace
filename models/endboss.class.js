class Endboss extends MovableObject {
  x = 1000;
  y = 0;
  height;
  width;
  speed;
  currentImage = 0;
  endbossLifes = 5;
  endbossMaxLifes = 5;
  imageCache = {};
  animationInterval;
  movementInterval;
  isDead = false;
  isMoving = false;
  hasSpit = false;
  isAttackAble = false;
  explosions = [];
  objectCollisionOffset = {
    left: 80,
    right: 350,
    top: 105,
    bottom: 135,
  };
  explosionAudio;
  shootAudio;

  constructor(imagePath, height, width, speed, walkingImages) {
    super().loadImage(imagePath);
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.IMAGES_WALKING = walkingImages;
    this.explosionAudio = new Audio("assets/audio/explosion.mp3");
    this.shootAudio = new Audio("assets/audio/bossShoot.mp3");

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
        this.handleAnimationEnd(loop, onComplete);
      }
    }, intervalTime);
  }

  handleAnimationEnd(loop, onComplete) {
    if (loop) {
      this.currentImage = 0;
    } else {
      clearInterval(this.animationInterval);
      if (onComplete) onComplete();
    }
  }

  startAttack() {
    this.isAttackAble = true;
    this.startAnimation(ENDBOSS.ATTACK, 200, true, null);
    this.attackInterval = setInterval(() => {
      if (this.currentImage === 6 && !this.hasSpit) {
        this.shootSound();
        this.spawnSpitChicken();
        this.hasSpit = true;
      }
      if (this.currentImage === 0) {
        this.hasSpit = false;
      }
    }, 1000 / 30);
  }

  moveToTargetX(targetX) {
    this.movementInterval = setInterval(() => {
      if (this.x > targetX) {
        this.x -= this.speed;
      } else {
        clearInterval(this.movementInterval);
        this.x = targetX;
        clearInterval(this.animationInterval);

        this.fightAnimationTimeout();
      }
    }, 1000 / 30);
  }

  fightAnimationTimeout() {
    setTimeout(() => {
      this.startAnimation(ENDBOSS.ALERT, 150, false, () => {
        this.startAttack();
      });
    }, 3000);
  }

  startMoving() {
    this.isMoving = true;
    this.moveToTargetX(460);
    this.startAnimation(ENDBOSS.WALK, 200, true);
  }

  deathAnimation() {
    if (this.isDead) return;
    this.isDead = true;

    clearInterval(this.attackInterval);

    this.startDeathMovement();
    this.startExplosionLoop();
  }

  startExplosionLoop() {
    this.explosionInterval = setInterval(() => {
      this.explosionSound();
      this.spawnExplosion();
    }, 400);

    setTimeout(() => {
      clearInterval(this.explosionInterval);
    }, 15000);
  }

  spawnExplosion() {
    const hitboxWidth = this.setHitboxWidth();
    const hitboxHeight = this.setHitboxHeight();

    const randomX =
      this.x + this.objectCollisionOffset.left + Math.random() * hitboxWidth;
    const randomY =
      this.y + this.objectCollisionOffset.top + Math.random() * hitboxHeight;

    const explosion = new Explosion(randomX, randomY);
    this.explosions.push(explosion);

    this.removeExplosions(explosion);
  }

  setHitboxWidth() {
    return this.width -
    this.objectCollisionOffset.left -
    this.objectCollisionOffset.right;
  }

  setHitboxHeight() {
    return this.height -
    this.objectCollisionOffset.top -
    this.objectCollisionOffset.bottom;
  }

  removeExplosions(explosion) {
    setTimeout(() => {
      const index = this.explosions.indexOf(explosion);
      if (index > -1) {
        this.explosions.splice(index, 1);
      }
    }, 400);
  }

  startDeathMovement() {
    this.deathMoveInterval = setInterval(() => {
      this.y += 1;
    }, 1000 / 30);
  }

  drawExplosions(ctx) {
    this.explosions.forEach((explosion) => {
      explosion.draw(ctx);
    });
  }

  spawnSpitChicken() {
    if (!this.world) return;

    const mouthX = this.x + this.width / 2;
    const mouthY = this.y + this.height / 2;

    this.world.spawnBossChicken(mouthX, mouthY);
  }

  explosionSound() {
    if (this.world.isMuted) return;
    const boom = this.explosionAudio.cloneNode();
    boom.volume = 0.1;
    boom.play();
  }

  shootSound() {
    if (this.world.isMuted) return;
    this.shootAudio.play();
  }
}
