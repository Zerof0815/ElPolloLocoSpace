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

  constructor() {
    super().loadImage("assets/img/2_character_pepe/3_jump/J-34.png");
    this.moveCharacter();
    this.loadImagesIntoCache(PEPE_ANIMATION.HURT);
    this.shootingAudio = new Audio("assets/audio/shootAudio.mp3");
    this.damageAudio = new Audio("assets/audio/bottleBreak.mp3");
  }

  moveCharacter() {
    setInterval(() => {
      if (this.isDead) return;

      this.yMovement();

      this.angle += (this.targetAngle - this.angle) * this.smoothingFactor;

      this.xMovement();
    }, 1000 / 30);
  }

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

  createBottle() {
    const bottle = new Bottle(
          this.x + this.width,
          this.y + this.height / 2
        );
    this.world.bottles.push(bottle);
    return bottle;
  }

  deleteBottle(bottle) {
    setTimeout(() => {
      const index = world.bottles.indexOf(bottle);
      if (index > -1) {
        this.world.bottles.splice(index, 1);
      }
    }, 1800);
  }

  triggerDeath() {
    this.isDead = true;

    const deathImg = new Image();
    deathImg.src = "assets/img/2_character_pepe/5_dead/D-51.png";
    this.img = deathImg;

    setTimeout(() => {
      this.animateDeathFall();
    }, 2000);
  }

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

  characterGetsHit() {
    this.damageSound();
    if (this.characterLifes <= 1 || this.world.gameWon) return;

    let frameIndex = 0;
    const totalFrames = PEPE_ANIMATION.HURT.length * 3;

    this.characterDamageAnimation(frameIndex, totalFrames)
  }

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

  shootSound() {
    if (this.world.isMuted) return;
    const bottleShoot = this.shootingAudio.cloneNode();
    bottleShoot.volume = 0.1;
    bottleShoot.play();
  }

  async damageSound() {
    if (this.world.isMuted) return;
    await this.waitForUserInteraction();
    const gettingHit = this.damageAudio.cloneNode();
    gettingHit.volume = 0.2;
    gettingHit.play();
  }

  waitForUserInteraction() {
    return new Promise((resolve) => {
      if (this.userHasInteracted) return resolve();

      const handler = () => {
        this.userHasInteracted = true;
        document.removeEventListener("keydown", handler);
        document.removeEventListener("click", handler);
        document.removeEventListener("touchstart", handler);
        resolve();
      };

      document.addEventListener("keydown", handler);
      document.addEventListener("click", handler);
      document.addEventListener("touchstart", handler);
    });
  }
}