class StatusBar extends DrawableObject {
  x;
  y;
  height;
  width;
  percentage = 100;

  constructor(x, y, height, width) {
    super().loadImagesIntoCache(STATUS_BAR.HEALTH);
    this.loadImagesIntoCache([STATUS_BAR.CHICKEN_COUNTER])
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let index = Math.floor(this.percentage / 20);
    index = Math.min(index, STATUS_BAR.HEALTH.length - 1);
    const path = STATUS_BAR.HEALTH[index];
    this.img = this.imageCache[path];
  }
}