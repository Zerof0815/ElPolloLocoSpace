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
    characterCollisionOffset = {
      left: 10,
      right: 80,
      top: 25,
      bottom: 20
    };

  constructor() {
    super().loadImage("../assets/img/2_character_pepe/3_jump/J-34-turned.png");
    this.moveCharacter();
  }

  moveCharacter() {
    setInterval(() => {
      if (this.world.keyboard.UP && this.y > 0) {
        this.y -= this.speed;
        this.targetAngle = -0.3;
      } else if (this.world.keyboard.DOWN && this.y + this.height < this.world.canvas.height) {
        this.y += this.speed;
        this.targetAngle = 0.3;
      } else {
        this.targetAngle = 0;
      }

      this.angle += (this.targetAngle - this.angle) * this.smoothingFactor;

      if (this.world.keyboard.RIGHT && this.x + this.width < this.world.canvas.width / 1.75) {
        this.x += this.speed;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
      }
    }, 1000/30);
  }

  shoot() {
    setInterval(() => {
      const now = Date.now();
      if (this.world?.keyboard?.CLICK && now - this.lastShotTime >= this.shootCooldown) {
        console.log("Auto Shooting!");
        this.lastShotTime = now;
        //Create projectile here
      }
    }, 1000 / 30);
  }
}