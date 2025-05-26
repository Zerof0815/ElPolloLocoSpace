class Character extends MovableObject {

    x = 50;
    y = 140;
    height = 150;
    width = 100;

  constructor() {
    super().loadImage("../assets/img/2_character_pepe/3_jump/J-34.png");
  }

  jump() {}
}