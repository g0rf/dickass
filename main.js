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
var beach, beach2;
var bullets = [];
var piggyBullets = [];
var piggies = [];
var rat;

var spawnRate = 4000; // ms
var nextSpawn = new Date().getTime() + spawnRate;

function setup() {

  //Make the game scene and add it to the stage
  gameScene = new Container();
  stage.addChild(gameScene);

  beach = new Sprite(TextureCache["assets/bg1.png"]);
  beach2 = new Sprite(TextureCache["assets/bg1.png"]);
  beach2.x = WIDTH;
  gameScene.addChild(beach);
  gameScene.addChild(beach2);

  rat = new Rat(gameScene);
  piggies = [];
  piggies.push(new Piggy(gameScene, 700, 200));
  piggies.push(new Piggy(gameScene, 700, 300));
  piggies.push(new Piggy(gameScene, 700, 500));

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

  // destroy bullets on exit
  bullets.forEach(function(bullet, index) {
    bullet.x += bullet.vx;
    var hitWall = contain(bullet, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (hitWall) {
        bullets.splice(index, 1);
        bullet.destroy();
        return;
    }

    var hitPiggy = false;
    piggies.forEach(function(piggy, piggyIndex) {
      if (hitTestRectangle(bullet, piggy.sprite)) {
        bullets.splice(index, 1);
        piggies.splice(piggyIndex, 1);
        hitPiggy = true;
        piggy.kill();

        spawnRate = Math.max(spawnRate / 2, 100);
      }
    });
    if (hitPiggy) {
      bullet.destroy();
    }
  });

  piggyBullets.forEach(function(bullet, index) {
    bullet.x += bullet.vx;
    var hitWall = contain(bullet, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (hitWall) {
      piggyBullets.splice(index, 1);
      bullet.destroy();
      return;
    }

    if (hitTestRectangle(bullet, rat.sprite)) {
      piggyBullets.splice(index, 1);
      bullet.destroy();
      // player damage
    }
  });

  var now = new Date();
  if (now > nextSpawn) {
    piggies.push(new Piggy(gameScene, 700, 100 + randomInt(100, 400)));
    nextSpawn = now.getTime() + spawnRate;
  }

  // scroll bg
  beach.x -= 1;
  beach2.x -= 1;

  if (beach.x <= WIDTH * -1) {
    beach.x = 0;
    beach2.x = WIDTH;
  }
}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
