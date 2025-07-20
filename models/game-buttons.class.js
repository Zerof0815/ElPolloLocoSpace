class GameButton extends DrawableObject {
  x;
  y;
  height = 35;
  width = 35;
  muteImg;
  onClick;

  constructor(x, y, img, onClick) {
    super();
    this.loadImage(img);
    this.muteImg = GAME_BUTTONS.NO_SOUND;
    this.x = x;
    this.y = y;
    this.onClick = onClick;
  }

  contains(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }

  handleClick(mouseX, mouseY) {
    if (this.contains(mouseX, mouseY)) {
      if (this.onClick) this.onClick();
    }
  }

  isHovered(mouseX, mouseY) {
    return this.contains(mouseX, mouseY);
  }
}