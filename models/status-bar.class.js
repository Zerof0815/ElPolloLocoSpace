class StatusBar extends DrawableObject {
  x = 10;
  y = -10;
  height = 158 / 2.5;
  width = 595 / 2.5;
  percentage = 100;

  constructor() {
    super().loadImage(
      "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
    );
    this.loadImagesIntoCache(STATUS_BAR.HEALTH);
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