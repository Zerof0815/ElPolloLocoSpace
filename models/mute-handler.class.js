class MuteHandler {
  constructor(world) {
    this.world = world;
    this.sounds = [
      world.backgroundMusic,
      world.bossRoar,
      world.bossMusic,
      world.looseSound,
      world.winSound,
    ];
  }

  updateSoundReferences() {
    this.sounds = [
      this.world.backgroundMusic,
      this.world.bossRoar,
      this.world.bossMusic,
      this.world.looseSound,
      this.world.winSound,
    ];
  }

  muteAll() {
    this.sounds.forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.muted = true;
      }
    });
  }

  unmuteAll() {
    this.sounds.forEach((sound) => {
      if (sound) {
        sound.muted = false;
      }
    });
    this.resumeMusic();
  }

  resumeMusic() {
    if (this.world.isEndbossDead) return;

    if (this.world.endboss?.isMoving) {
      if (this.world.bossMusic?.paused) this.world.bossMusic.play();
    } else {
      if (this.world.backgroundMusic?.paused) this.world.backgroundMusic.play();
    }
  }

  toggleMute() {
    this.world.isMuted = !this.world.isMuted;
    localStorage.setItem("isMuted", this.world.isMuted);

    if (this.world.isMuted) {
      this.muteAll();
      this.world.soundButton.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAll();
      this.world.soundButton.loadImage(GAME_BUTTONS.SOUND);
    }
  }

  applyStoredMute() {
    const savedMute = localStorage.getItem("isMuted");
    this.world.isMuted = savedMute === "true";

    if (this.world.isMuted) {
      this.muteAll();
      this.world.soundButton?.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAll();
      this.world.soundButton?.loadImage(GAME_BUTTONS.SOUND);
    }
  }

  playSound(sound) {
    if (!this.world.isMuted && sound) {
      sound.play();
    }
  }

  stopSound(sound) {
    if (sound) {
      sound.pause();
    }
  }
}
