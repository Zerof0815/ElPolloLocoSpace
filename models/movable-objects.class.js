class MovableObject {
  x;
  y;
  img;
  height;
  width;
  imageCache = {};
  currentImage = 0;
  speed;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImagesIntoCache(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 30);
  }

  isColliding(movableObject) {
    let offset = this.characterCollisionOffset || {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    return (
      this.x + this.width - offset.right > movableObject.x &&
      this.y + this.height - offset.bottom > movableObject.y &&
      this.x + offset.left < movableObject.x + movableObject.width &&
      this.y + offset.top < movableObject.y + movableObject.height
    );
  }
}