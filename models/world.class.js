class World {
  canvas;
  character = new Character();
  background = level1.background;
  enemies = [];
  asteroids = [];
  planets = [];
  endboss = new Endboss(ENDBOSS.WALK[0], 500, 582, 3, ENDBOSS.WALK);
  healthBar = new StatusBar(10, -10, 158 / 2.5, 595 / 2.5, STATUS_BAR.HEALTH);
  bossHealthBar = new StatusBar(
    210,
    400,
    158 / 2,
    595 / 2,
    STATUS_BAR.BOSS_HEALTH
  );
  chickenCounter = new Counter(550, 7, 50, 50, STATUS_BAR.CHICKEN_COUNTER);
  winnerScreen = new EndGameScreen(canvas.width, canvas.height, END_SCREEN.WIN);
  looserScreen = new EndGameScreen(
    canvas.width,
    canvas.height,
    END_SCREEN.GAME_OVER
  );
  homeButton = GameButton.createHomeButton();
  restartButton = GameButton.createRestartButton(this);
  soundButton = GameButton.createSoundButton(this);
  bottles = [];
  chickenScore = 0;
  ctx;
  keyboard;
  isPlayerDead = false;
  isEndbossDead = false;
  isMuted = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.checkLocalStorageIfMuted();
    this.endboss.world = this;
    this.draw();
    this.character.world = this;
    this.character.shoot();
    this.spawnManager = new SpawnManager();
    this.startSpawning();
    this.checkCollisions();
    this.checkChickenScoreForEndboss();
    this.loadAudio();
    if (!this.isMuted) this.startBackgroundMusic();
    this.buttonController = new ButtonController(
      this.canvas,
      [this.homeButton, this.restartButton, this.soundButton],
      this
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fromArrayAddToMap(this.background);
    this.drawCollideables();
    this.endboss.drawExplosions(this.ctx);
    this.drawUI();
    this.drawbuttons();

    //constantly execute draw()
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  loadAudio() {
    this.backgroundMusic = new Audio("assets/audio/backgroundAudio.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.1;
    this.bossRoar = new Audio("assets/audio/bossRoar.mp3");
    this.bossRoar.volume = 0.1;
    this.bossMusic = new Audio("assets/audio/bossFight.mp3");
    this.bossMusic.loop = true;
    this.bossMusic.volume = 0.1;
    this.looseSound = new Audio("assets/audio/loose.mp3");
    this.winSound = new Audio("assets/audio/winning.mp3");
    this.winSound.volume = 0.1;
  }

  drawbuttons() {
    this.addToMap(this.homeButton);
    this.addToMap(this.restartButton);
    this.addToMap(this.soundButton);
  }

  drawCollideables() {
    this.fromArrayAddToMap(this.planets);
    this.fromArrayAddToMap(this.enemies);
    this.addToMap(this.character);
    this.addToMap(this.endboss);
    this.fromArrayAddToMap(this.asteroids);
    this.fromArrayAddToMap(this.bottles);
  }

  drawUI() {
    this.addToMap(this.healthBar);
    if (this.endboss.isMoving) this.addToMap(this.bossHealthBar);
    this.chickenCounter.drawIcon(this.ctx);
    if (this.isEndbossDead) this.addToMap(this.winnerScreen);
    if (this.character.characterLifes <= 0) this.addToMap(this.looserScreen);
  }

  addToMap(movableObject) {
    this.ctx.save();

    let centerX = movableObject.x + movableObject.width / 2;
    let centerY = movableObject.y + movableObject.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(movableObject.angle || 0);

    this.ctx.drawImage(...this.movableObjectData(movableObject));

    this.ctx.restore();
  }

  movableObjectData(movableObject) {
    return [
      movableObject.img,
      -movableObject.width / 2,
      -movableObject.height / 2,
      movableObject.width,
      movableObject.height,
    ];
  }

  fromArrayAddToMap(movableObjectInArray) {
    movableObjectInArray.forEach((object) => {
      if (object.update) {
        object.update();
      }
      this.addToMap(object);
    });
  }

  checkObjectCollisions(objectArray) {
    return objectArray.filter((object) => {
      if (object.isDead) return true;

      if (this.character.isColliding(object)) {
        return !this.character.handleCollision(this);
      }

      return true;
    });
  }

  checkCollisions() {
    setInterval(() => {
      if (this.character.isDead) return;
      this.enemies = this.checkObjectCollisions(this.enemies);
    }, 1000 / 30);

    setInterval(() => {
      if (this.character.isDead) return;
      this.asteroids = this.checkObjectCollisions(this.asteroids);
    }, 1000 / 30);

    setInterval(() => {
      if (this.character.isDead) return;
      this.checkBottleHits();
    }, 1000 / 30);
  }

  handleBottleChickenHit(bottle, enemy) {
    this.handleChickenHit(enemy);
    this.handleBottleBreak(bottle);
  }

  handleChickenHit(enemy) {
    if (enemy.chickenLifes > 0 || enemy.isDead) return;

    enemy.isDead = true;
    enemy.deathAnimation();
    this.updateChickenScore();
    this.removeEnemyAfterDelay(enemy);
  }

  updateChickenScore() {
    if (this.chickenScore <= 9) {
      this.chickenScore++;
      this.chickenCounter.increment();
    }
  }

  removeEnemyAfterDelay(enemy) {
    setTimeout(() => {
      const index = this.enemies.indexOf(enemy);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }, 1000);
  }

  handleBottleBreak(bottle) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex < 0) return;

    if (!this.isMuted) bottle.breakSound();

    bottle.breakAnimation(() => {
      this.bottles.splice(bottleIndex, 1);
    });
  }

  handleBottleAsteroidHit(bottle, asteroid) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex > -1) {
      if (!this.isMuted) bottle.breakSound();
      bottle.breakAnimation(() => {
        this.bottles.splice(bottleIndex, 1);
      });
    }
  }

  handleBottleBossHit(bottle) {
    this.handleBossHit();
    this.handleBossBottleBreak(bottle);
  }

  handleBossHit() {
    if (this.endboss.isDead || !this.endboss.isAttackAble) return;

    this.endboss.endbossLifes--;
    this.updateBossHealthBar();

    if (this.endboss.endbossLifes <= 0) {
      this.handleBossDeath();
    }
  }

  updateBossHealthBar() {
    const percentLife =
      (this.endboss.endbossLifes / this.endboss.endbossMaxLifes) * 100;
    this.bossHealthBar.setPercentage(percentLife);
  }

  handleBossDeath() {
    this.endAudio(this.bossMusic);
    this.playAudio(this.winSound);
    this.endboss.deathAnimation();
    this.isEndbossDead = true;
  }

  handleBossBottleBreak(bottle) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex < 0) return;

    bottle.breakAnimation(() => {
      if (!this.isMuted) bottle.breakSound();
      this.bottles.splice(bottleIndex, 1);
    });
  }

  checkBottleHits() {
    this.bottles.forEach((bottle) => {
      this.checkBottleEnemyHits(bottle);
      this.checkBottleAsteroidHits(bottle);
      this.checkBottleBossHit(bottle);
    });
  }

  checkBottleEnemyHits(bottle) {
    this.enemies.forEach((enemy) => {
      const validHit =
        !bottle.isBreaking &&
        bottle.isColliding(enemy) &&
        enemy.chickenLifes >= 1;

      if (validHit) {
        enemy.chickenLifes--;
        this.handleBottleChickenHit(bottle, enemy);
      }
    });
  }

  checkBottleAsteroidHits(bottle) {
    this.asteroids.forEach((asteroid) => {
      if (!bottle.isBreaking && bottle.isColliding(asteroid)) {
        this.handleBottleAsteroidHit(bottle, asteroid);
      }
    });
  }

  checkBottleBossHit(bottle) {
    if (!bottle.isBreaking && bottle.isColliding(this.endboss)) {
      this.handleBottleBossHit(bottle);
    }
  }

  startSpawning() {
    this.spawnManager.spawnChicken(this);
    this.spawnManager.spawnRock(this);
    this.spawnManager.spawnPlanet(this);
  }

  checkChickenScoreForEndboss() {
    setInterval(() => {
      if (this.chickenScore >= 10 && !this.endboss.isMoving) {
        this.endAudio(this.backgroundMusic);
        this.playAudio(this.bossRoar);
        if (!this.isMuted) this.startBossMusic();
        this.endboss.startMoving();
      }
    }, 500);
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  startBackgroundMusic() {
    this.backgroundMusic.play();
  }

  endAudio(sound) {
    sound.pause();
  }

  playAudio(sound) {
    if (this.isMuted) return;
    sound.play();
  }

  startBossMusic() {
    setTimeout(() => {
      this.bossMusic.play();
    }, 3000);
  }

  isGameMuted() {
    if (this.isMuted) {
      this.muteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.SOUND);
    }
  }

  muteAllSounds() {
    const sounds = [
      this.backgroundMusic,
      this.bossRoar,
      this.bossMusic,
      this.looseSound,
      this.winSound,
    ];

    sounds.forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.muted = true;
      }
    });
  }

  unmuteAllSounds() {
    const sounds = [
      this.backgroundMusic,
      this.bossRoar,
      this.bossMusic,
      this.looseSound,
      this.winSound,
    ];

    sounds.forEach((sound) => {
      if (sound) {
        sound.muted = false;
      }
    });

    this.musicHandler();
  }

  musicHandler() {
    if (this.isEndbossDead) {
      return;
    } else if (this.endboss?.isMoving) {
      if (this.bossMusic && this.bossMusic.paused) {
        this.bossMusic.play();
      }
    } else {
      if (this.backgroundMusic && this.backgroundMusic.paused) {
        this.backgroundMusic.play();
      }
    }
  }

  checkLocalStorageIfMuted() {
    const savedMute = localStorage.getItem("isMuted");
    this.isMuted = savedMute === "true";

    if (this.isMuted) {
      this.muteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.SOUND);
    }
  }
}