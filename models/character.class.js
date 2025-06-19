class Character extends MovableObject {
  x = 50;
  y = 200;
  height = 100;
  width = 200;
  world;
  speed = 10;
  lastShotTime = 0;
  shootCooldown = 500;
  angle = 0;
  targetAngle = 0;
  smoothingFactor = 0.2;
  isDead = false;
  characterLifes = 3;
  characterCollisionOffset = {
    left: 10,
    right: 80,
    top: 35,
    bottom: 25,
  };

  constructor() {
    super().loadImage("../assets/img/2_character_pepe/3_jump/J-34.png");
    this.moveCharacter();
    this.loadImagesIntoCache(PEPE_ANIMATION.HURT);
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
        this.world?.keyboard?.CLICK &&
        now - this.lastShotTime >= this.shootCooldown
      ) {
        console.log("Auto Shooting!");
        this.lastShotTime = now;
        //Create projectile here
      }
    }, 1000 / 30);
  }

  triggerDeath() {
    this.isDead = true;

    const deathImg = new Image();
    deathImg.src = "../assets/img/2_character_pepe/5_dead/D-51.png";
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
    if (this.characterLifes <= 1) return;

    let frameIndex = 0;
    const hurtInterval = setInterval(() => {
      let path = PEPE_ANIMATION.HURT[frameIndex];
      this.img = this.imageCache[path];
      
      if (frameIndex >= PEPE_ANIMATION.HURT.length) {
        clearInterval(hurtInterval);
        this.loadImage("../assets/img/2_character_pepe/3_jump/J-34.png");
      }

      frameIndex++;
    }, 100);
  }
}