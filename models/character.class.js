class Character extends MovableObject {

    x = 50;
    y = 200;
    height = 75;
    width = 150;

  constructor() {
    super().loadImage("../assets/img/2_character_pepe/3_jump/J-34-turned.png");
  }

  shoot() {}
}