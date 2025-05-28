let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas);

    console.log("My character is", world.character);
    console.log("My chicken object", world.enemies);
    

    // character.onload = function () {
    //   const width = 50;
    //   const height = 100;
    //   const x = 20;
    //   const y = 20;

    //   ctx.translate(x + height, y);
    //   ctx.rotate((90 * Math.PI) / 180);
    //   ctx.drawImage(character, 200, 0, width, height);
    //   ctx.setTransform(1, 0, 0, 1, 0, 0);
    // };
}