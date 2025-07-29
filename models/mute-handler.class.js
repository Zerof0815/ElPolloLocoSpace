class MuteHandler {
  /**
   * Creates a new instance of MuteHandler.
   * @param {World} world - The current game world instance containing all relevant sounds.
   */
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

  /**
   * Updates internal sound references from the world object.
   * Call this if sounds are reinitialized (e.g., on world restart).
   */
  updateSoundReferences() {
    this.sounds = [
      this.world.backgroundMusic,
      this.world.bossRoar,
      this.world.bossMusic,
      this.world.looseSound,
      this.world.winSound,
    ];
  }

  /**
   * Mutes all tracked sounds by pausing and muting them.
   */
  muteAll() {
    this.sounds.forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.muted = true;
      }
    });
  }

  /**
   * Unmutes all tracked sounds and resumes the appropriate background music.
   */
  unmuteAll() {
    this.sounds.forEach((sound) => {
      if (sound) {
        sound.muted = false;
      }
    });
    this.resumeMusic();
  }

  /**
   * Resumes either the boss music or background music,
   * depending on the current game state.
   * Does nothing if the endboss has been defeated.
   */
  resumeMusic() {
    if (this.world.isEndbossDead) return;

    if (this.world.endboss?.isMoving) {
      if (this.world.bossMusic?.paused) this.world.bossMusic.play();
    } else {
      if (this.world.backgroundMusic?.paused) this.world.backgroundMusic.play();
    }
  }

  /**
   * Toggles the mute state globally.
   * Updates localStorage and UI sound icon accordingly.
   */
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

  /**
   * Applies the stored mute setting from localStorage.
   * Should be called during initialization to persist sound settings.
   */
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

  /**
   * Plays a given sound if not muted.
   * @param {HTMLAudioElement} sound - The sound to be played.
   */
  playSound(sound) {
    if (!this.world.isMuted && sound) {
      sound.play();
    }
  }

  /**
   * Stops a given sound by pausing it.
   * @param {HTMLAudioElement} sound - The sound to be stopped.
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
    }
  }
}
