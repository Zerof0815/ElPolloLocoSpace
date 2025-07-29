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

  /**
   * Creates the Endboss enemy with its animations and audio.
   *
   * @constructor
   * @param {string} imagePath - Path to the initial image.
   * @param {number} height - Height of the endboss.
   * @param {number} width - Width of the endboss.
   * @param {number} speed - Movement speed of the endboss.
   * @param {string[]} walkingImages - Array of images for walking animation.
   */
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

  /**
   * Starts an animation cycling through the given array of images.
   * @param {string[]} imageArray - Array of image keys to animate.
   * @param {number} intervalTime - Time in milliseconds between frames.
   * @param {boolean} [loop=true] - Whether the animation should loop.
   * @param {Function|null} [onComplete=null] - Callback function to call when animation finishes if not looping.
   */
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

  /**
   * Handles the end of an animation sequence.
   * Resets or clears the animation interval based on looping.
   * @param {boolean} loop - Whether the animation should loop.
   * @param {Function|null} onComplete - Callback to call if animation ends.
   */
  handleAnimationEnd(loop, onComplete) {
    if (loop) {
      this.currentImage = 0;
    } else {
      clearInterval(this.animationInterval);
      if (onComplete) onComplete();
    }
  }

  /**
   * Starts the attack behavior including attack animation and spawning spit chickens.
   */
  startAttack() {
    this.isAttackAble = true;
    this.startAnimation(ENDBOSS.ATTACK, 200, true, null);
    this.attackInterval = setInterval(() => {
      if (this.world.character.isDead) {
        clearInterval(this.attackInterval);
        return;
      }
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

  /**
   * Moves the endboss horizontally towards a target x-coordinate.
   * @param {number} targetX - The x-coordinate to move towards.
   */
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

  /**
   * Delays for a short time, then starts the alert animation followed by an attack.
   */
  fightAnimationTimeout() {
    setTimeout(() => {
      this.startAnimation(ENDBOSS.ALERT, 150, false, () => {
        this.startAttack();
      });
    }, 3000);
  }

  /**
   * Starts the movement towards the fight position and walking animation.
   */
  startMoving() {
    this.isMoving = true;
    this.moveToTargetX(460);
    this.startAnimation(ENDBOSS.WALK, 200, true);
  }

  /**
   * Initiates the death sequence including death movement and explosion effects.
   */
  deathAnimation() {
    if (this.isDead) return;
    this.isDead = true;

    clearInterval(this.attackInterval);

    this.startDeathMovement();
    this.startExplosionLoop();
  }

  /**
   * Starts a repeated explosion effect with sound for the death animation.
   */
  startExplosionLoop() {
    this.explosionInterval = setInterval(() => {
      this.explosionSound();
      this.spawnExplosion();
    }, 400);

    setTimeout(() => {
      clearInterval(this.explosionInterval);
    }, 15000);
  }

  /**
   * Spawns a single explosion at a random position within the endboss's hitbox.
   */
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

  /**
   * Calculates the effective hitbox width excluding collision offsets.
   * @returns {number} Hitbox width.
   */
  setHitboxWidth() {
    return (
      this.width -
      this.objectCollisionOffset.left -
      this.objectCollisionOffset.right
    );
  }

  /**
   * Calculates the effective hitbox height excluding collision offsets.
   * @returns {number} Hitbox height.
   */
  setHitboxHeight() {
    return (
      this.height -
      this.objectCollisionOffset.top -
      this.objectCollisionOffset.bottom
    );
  }

  /**
   * Removes a given explosion from the explosions array after a delay.
   * @param {Explosion} explosion - The explosion object to remove.
   */
  removeExplosions(explosion) {
    setTimeout(() => {
      const index = this.explosions.indexOf(explosion);
      if (index > -1) {
        this.explosions.splice(index, 1);
      }
    }, 400);
  }

  /**
   * Starts vertical movement downward as part of the death animation.
   */
  startDeathMovement() {
    this.deathMoveInterval = setInterval(() => {
      this.y += 1;
    }, 1000 / 30);
  }

  /**
   * Draws all active explosions on the provided canvas rendering context.
   * @param {CanvasRenderingContext2D} ctx - The drawing context.
   */
  drawExplosions(ctx) {
    this.explosions.forEach((explosion) => {
      explosion.draw(ctx);
    });
  }

  /**
   * Spit chicken enemy.
   */
  spawnSpitChicken() {
    this.spawnBossChicken();
  }

  /**
   * Plays the explosion sound effect if sound is not muted.
   */
  explosionSound() {
    if (this.world.isMuted) return;
    const boom = this.explosionAudio.cloneNode();
    boom.volume = 0.1;
    boom.play();
  }

  /**
   * Plays the shooting sound effect if sound is not muted.
   */
  shootSound() {
    if (this.world.isMuted) return;
    this.shootAudio.play();
  }

  /**
   * Spawns multiple spit chickens in a spread pattern from the mouth position.
   */
  spawnBossChicken() {
    const mouthPos = this.calculateMouthPosition();
    const targetPos = this.getCharacterCenter();

    const baseAngle = this.calculateAngle(mouthPos, targetPos);
    const angles = this.calculateSpreadAngles(baseAngle);

    angles.forEach((angle) => this.spawnAndScheduleChicken(mouthPos, angle));
  }

  /**
   * Calculates the position of the endboss's mouth for spawning spit chickens.
   * @returns {{x: number, y: number}} Coordinates of the mouth position.
   */
  calculateMouthPosition() {
    return {
      x: this.x + this.width / 2 - 280,
      y: this.y + this.height / 2 - 130,
    };
  }

  /**
   * Gets the center position of the player character.
   * @returns {{x: number, y: number}} Coordinates of the character center.
   */
  getCharacterCenter() {
    const char = this.world.character;
    return {
      x: char.x + char.width / 2,
      y: char.y + char.height / 2,
    };
  }

  /**
   * Calculates the angle in radians from one point to another.
   * @param {{x: number, y: number}} from - Starting position.
   * @param {{x: number, y: number}} to - Target position.
   * @returns {number} Angle in radians.
   */
  calculateAngle(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.atan2(dy, dx);
  }

  /**
   * Calculates three angles for spit chicken spread attack based on a base angle.
   * @param {number} baseAngle - The central angle in radians.
   * @returns {number[]} Array of angles for spread.
   */
  calculateSpreadAngles(baseAngle) {
    const spread = Math.PI / 12;
    return [baseAngle, baseAngle - spread, baseAngle + spread];
  }

  /**
   * Spawns a spit chicken at a position with a given angle and schedules its removal.
   * @param {{x: number, y: number}} position - Spawn coordinates.
   * @param {number} angle - Angle to shoot the chicken.
   */
  spawnAndScheduleChicken(position, angle) {
    const chicken = new SpitChicken(position.x, position.y, angle);
    this.world.enemies.push(chicken);

    setTimeout(() => {
      const index = this.world.enemies.indexOf(chicken);
      if (index > -1) {
        this.world.enemies.splice(index, 1);
      }
    }, 15000);
  }
}
