//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

var WIDTH = 800;
var HEIGHT = 600;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(WIDTH, HEIGHT);
document.body.appendChild(renderer.view);

loader
  .add([
    "assets/bg1.png",
    "assets/rat100.png",
    "assets/piggy.png",
    "assets/bullet.png",
    "assets/egg.png"
  ])
  .load(setup);

//Define variables that might be used in more
//than one function
var state, explorer, treasure, blobs, chimes, exit, player, dungeon,
    door, healthBar, message, gameScene, gameOverScene, enemies, id;
var bullets = [];
var piggies = [];
var rat;

function setup() {

  //Make the game scene and add it to the stage
  gameScene = new Container();
  stage.addChild(gameScene);

  var beach = new Sprite(TextureCache["assets/bg1.png"]);
  gameScene.addChild(beach);

  rat = new Rat(gameScene);
  piggies = [];
  piggies.push(new Piggy(gameScene, 600, 200));

  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();
}

function gameLoop(){

  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  //Update the current game state
  state();

  //Render the stage
  renderer.render(stage);
}

function play() {
  rat.update();
  piggies.forEach(function(piggy) {
      piggy.update();
  });
  bullets.forEach(function(bullet, index) {
    bullet.x += bullet.vx;
    var hit = contain(bullet, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (hit) {
        bullets.splice(index, 1);
        bullet.destroy();
    }
  });
}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
