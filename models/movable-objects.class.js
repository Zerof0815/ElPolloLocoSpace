class MovableObject {
    x = 50;
    y = 140;
    img;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log("move right");
    }

    moveLeft() {

    }
}