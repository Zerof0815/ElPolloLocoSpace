class Character extends MovableObject {
  x = 50;
  y = 200;
  height = 125;
  width = 250;
  world;
  speed = 10;
  lastShotTime = 0;
  shootCooldown = 500;
  collisionCooldown = false;
  angle = 0;
  targetAngle = 0;
  smoothingFactor = 0.2;
  isDead = false;
  maxLifes = 5;
  characterLifes = 5;
  objectCollisionOffset = {
    left: 10,
    right: 100,
    top: 45,
    bottom: 35,
  };
  shootingAudio;
  damageAudio;
  userHasInteracted = false;

  /**
   * Creates a new Character instance and initializes its animations and audio.
   *
   * @constructor
   */
  constructor() {
    super().loadImage("assets/img/2_character_pepe/3_jump/J-34.png");
    this.moveCharacter();
    this.loadImagesIntoCache(PEPE_ANIMATION.HURT);
    this.shootingAudio = new Audio("assets/audio/shootAudio.mp3");
    this.damageAudio = new Audio("assets/audio/bottleBreak.mp3");
  }

  /**
   * Starts the main movement loop that updates vertical and horizontal position,
   * and smooths the character's angle.
   */
  moveCharacter() {
    setInterval(() => {
      if (this.isDead) return;

      this.yMovement();

      this.angle += (this.targetAngle - this.angle) * this.smoothingFactor;

      this.xMovement();
    }, 1000 / 30);
  }

  /**
   * Handles vertical movement based on keyboard input and updates target angle.
   */
  yMovement() {
    if (this.world.keyboard.UP && this.y > 0) {
      this.y -= this.speed;
      this.targetAngle = -0.3;
    } else if (
      this.world.keyboard.DOWN &&
      this.y + this.height < this.world.canvas.height
    ) {
      this.y += this.speed;
      this.targetAngle = 0.3;
    } else {
      this.targetAngle = 0;
    }
  }

  /**
   * Handles horizontal movement based on keyboard input.
   */
  xMovement() {
    if (
      this.world.keyboard.RIGHT &&
      this.x + this.width < this.world.canvas.width
    ) {
      this.x += this.speed;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.x -= this.speed;
    }
  }

  /**
   * Handles collision logic, reducing health and triggering damage animations.
   * @param {Object} world - The current game world context.
   * @returns {boolean} Whether a collision was processed.
   */
  handleCollision(world) {
    if (this.collisionCooldown || world.isEndbossDead) {
      return false;
    }

    this.collisionCooldown = true;
    this.characterGetsHit();
    this.characterLifes--;

    this.updateHealthBar(world);
    this.checkDeath(world);

    this.resetCollisionCooldown();

    return true;
  }

  /**
   * Updates the health bar percentage according to remaining lives.
   * @param {Object} world - The current game world context.
   */
  updateHealthBar(world) {
    const percentLife = (this.characterLifes / this.maxLifes) * 100;
    world.healthBar.setPercentage(percentLife);
  }

  /**
   * Checks if the character is dead, and if so, plays death sounds and animation.
   * @param {Object} world - The current game world context.
   */
  checkDeath(world) {
    if (this.characterLifes <= 0 && !this.isDead) {
      world.endAudio(world.backgroundMusic);
      setTimeout(() => {
        world.playAudio(world.looseSound);
      }, 2000);
      this.triggerDeath();
    }
  }

  /**
   * Resets the collision cooldown after 1 second.
   */
  resetCollisionCooldown() {
    setTimeout(() => {
      this.collisionCooldown = false;
    }, 1000);
  }

  /**
   * Starts an interval that checks for shooting input and creates bottles if allowed.
   */
  shoot() {
    setInterval(() => {
      if (this.isDead) return;

      const now = Date.now();
      if (
        this.world?.keyboard?.SPACE &&
        now - this.lastShotTime >= this.shootCooldown
      ) {
        this.shootSound();
        this.lastShotTime = now;
        const bottle = this.createBottle();

        this.deleteBottle(bottle);
      }
    }, 1000 / 30);
  }

  /**
   * Creates and returns a new Bottle object at the character's shooting position.
   * @returns {Bottle} The newly created bottle object.
   */
  createBottle() {
    const bottle = new Bottle(this.x + this.width, this.y + this.height / 2);
    this.world.bottles.push(bottle);
    return bottle;
  }

  /**
   * Removes a bottle object from the world after a timeout.
   * @param {Bottle} bottle - The bottle to remove.
   */
  deleteBottle(bottle) {
    setTimeout(() => {
      const index = world.bottles.indexOf(bottle);
      if (index > -1) {
        this.world.bottles.splice(index, 1);
      }
    }, 1800);
  }

  /**
   * Triggers the death animation and final image of the character.
   */
  triggerDeath() {
    this.isDead = true;

    const deathImg = new Image();
    deathImg.src = "assets/img/2_character_pepe/5_dead/D-51.png";
    this.img = deathImg;

    setTimeout(() => {
      this.animateDeathFall();
    }, 2000);
  }

  /**
   * Animates the character falling off-screen after death with gravity and rotation.
   */
  animateDeathFall() {
    let velocityY = -5;
    let gravity = 0.2;

    const deathFallInterval = setInterval(() => {
      this.y += velocityY;
      this.angle += 0.1;
      velocityY += gravity;

      if (this.y > this.world.canvas.height + 200) {
        clearInterval(deathFallInterval);
      }
    }, 1000 / 30);
  }

  /**
   * Plays damage sound and triggers the hurt animation unless nearly dead or game is won.
   */
  characterGetsHit() {
    this.damageSound();
    if (this.characterLifes <= 1 || this.world.gameWon) return;

    let frameIndex = 0;
    const totalFrames = PEPE_ANIMATION.HURT.length * 3;

    this.characterDamageAnimation(frameIndex, totalFrames);
  }

  /**
   * Animates the character's hurt state using the hurt image sequence.
   * @param {number} frameIndex - Starting frame index.
   * @param {number} totalFrames - Total number of animation frames to play.
   */
  characterDamageAnimation(frameIndex, totalFrames) {
    const hurtInterval = setInterval(() => {
      let currentFrame = frameIndex % PEPE_ANIMATION.HURT.length;
      let path = PEPE_ANIMATION.HURT[currentFrame];
      this.img = this.imageCache[path];

      frameIndex++;

      if (frameIndex >= totalFrames) {
        clearInterval(hurtInterval);
        this.loadImage("assets/img/2_character_pepe/3_jump/J-34.png");
      }
    }, 100);
  }

  /**
   * Plays the shooting sound effect if sound is not muted.
   */
  shootSound() {
    if (this.world.isMuted) return;
    const bottleShoot = this.shootingAudio.cloneNode();
    bottleShoot.volume = 0.1;
    bottleShoot.play();
  }

  /**
   * Plays the damage sound effect if sound is not muted,
   */
  damageSound() {
    if (this.world.isMuted) return;
    const gettingHit = this.damageAudio.cloneNode();
    gettingHit.volume = 0.2;
    gettingHit.play();
  }
}