class DrawableObject {
  imageCache = {};
  currentImage = 0;
  img;

  /**
   * Loads a single image and sets it as the object's current image.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the image cache using their paths as keys.
   * @param {string[]} arr - Array of image paths to be preloaded into cache.
   */
  loadImagesIntoCache(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}