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

  constructor() {
    super().loadImage("assets/img/2_character_pepe/3_jump/J-34.png");
    this.moveCharacter();
    this.loadImagesIntoCache(PEPE_ANIMATION.HURT);
    this.shootingAudio = new Audio("assets/audio/shootAudio.mp3");
    this.damageAudio = new Audio("assets/audio/bottleBreak.mp3")
  }

  moveCharacter() {
    setInterval(() => {
      if (this.isDead) return;

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

      this.angle += (this.targetAngle - this.angle) * this.smoothingFactor;

      if (
        this.world.keyboard.RIGHT &&
        this.x + this.width < this.world.canvas.width / 1.75
      ) {
        this.x += this.speed;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
      }
    }, 1000 / 30);
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

        const bottle = new Bottle(
          this.x + this.width,
          this.y + this.height / 2
        );
        this.world.bottles.push(bottle);

        setTimeout(() => {
          const index = world.bottles.indexOf(bottle);
          if (index > -1) {
            this.world.bottles.splice(index, 1);
          }
        }, 1800);
      }
    }, 1000 / 30);
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
    if (this.characterLifes <= 1) return;

    let frameIndex = 0;
    const totalFrames = PEPE_ANIMATION.HURT.length * 3;

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
    const bottleShoot = this.shootingAudio.cloneNode();
    bottleShoot.volume = 0.1;
    bottleShoot.play()
  }

  damageSound() {
    const gettingHit = this.damageAudio.cloneNode();
    gettingHit.volume = 0.2;
    gettingHit.play()
  }
}