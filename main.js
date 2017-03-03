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
	"assets/egg.png",
	"assets/heart.png"
  ])
  .load(init);

//Define variables that might be used in more
//than one function
var state, message, gameScene, gameOverScene, id;
var beach, beach2;
var bullets;
var piggyBullets;
var piggies;
var rat;
var score, scoreMsg;
var healthPack;

var spawnRate = 4000; // after 4 secs spawn a piggy
var nextSpawn = new Date().getTime() + spawnRate;

var space = keyboard(32),
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

var fpsDisplay; // a Text object displayed in bottom right to show FPS

/** First-time setup */
function init() {
  playSetup();

  //Start the game loop
  gameLoop();

  //Create the `gameOver` scene
  gameOverScene = new Container();
  gameOverScene.visible = false;
  stage.addChild(gameOverScene);

  //Create the text sprite and add it to the `gameOver` scene
  message = new Text('',
      {font: "64px Futura", fill: "white"}
  );
  message.x = 120;
  message.y = stage.height / 2 - 32;
  gameOverScene.addChild(message);
}

/** Setup of normal play state */
function playSetup() {
  // arrays to remember alive bullets, piggy bullets, and piggies
  bullets = [];
  piggyBullets = [];
  piggies = [];
  score = 0;

  //Make the game scene and add it to the stage
  gameScene = new Container();
  stage.addChild(gameScene);

  // set up two backgrounds for scrolling
  beach = new Sprite(TextureCache["assets/bg1.png"]);
  beach2 = new Sprite(TextureCache["assets/bg1.png"]);
  beach2.x = WIDTH;
  gameScene.addChild(beach);
  gameScene.addChild(beach2);

  // create a rat and piggys
  rat = new Rat(gameScene);
  piggies.push(new Piggy(gameScene, 900, 200));
  piggies.push(new Piggy(gameScene, 900, 300));
  piggies.push(new Piggy(gameScene, 900, 500));

  // set up the fps display at bototm left
  fpsDisplay = new Text(
      '0 FPS',
      {font: '16px Futura', fill: 'green'}
  );
  fpsDisplay.x = 10;
  fpsDisplay.y = HEIGHT - 20;
  gameScene.addChild(fpsDisplay);


  scoreMsg = new Text(
      `Score: 0`,
      {font: "12px Futura", fill: "white"}
  );
  scoreMsg.x = WIDTH - 100;
  scoreMsg.y = 10;
  gameScene.addChild(scoreMsg);

  //Set the game state
  state = play;
}


// set up vars to lock FPS at 60
// otherwise the game runs over 2x as fast on my 144hz monitor
var fps = 60;
var lastDraw = Date.now();
var interval = 1000 / fps;

function gameLoop() {

  // call function every time the browser window is going to draw
  requestAnimationFrame(gameLoop);

  var now = Date.now();
  var delta = now - lastDraw;

  // check is enough time has elapsed for us to render again
  if (delta > interval) {
    lastDraw = now - (delta % interval);

    //Update the current game state
    state();

    //Render the stage
    renderer.render(stage);
  }
}

var frames = 0;
var secondTick = new Date();

/** Called for every frame when we're in play state */
function play() {
  rat.update();

  piggies.forEach(function(piggy) {
      piggy.update();
  });

  bullets.forEach(function(bullet, index) {
    bullet.x += bullet.vx;
    // if bullet hits a wall, destroy it
    var hitWall = contain(bullet, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (hitWall) {
        bullets.splice(index, 1);
        bullet.destroy();
        return;
    }

    // if bullet hits a piggy, destroy them both
    var hitPiggy = false;
    piggies.forEach(function(piggy, piggyIndex) {
      if (hitTestRectangle(bullet, piggy.sprite)) {
        bullets.splice(index, 1);
        piggies.splice(piggyIndex, 1);
        hitPiggy = true;
        piggy.kill();
        score += 100;

        spawnRate = Math.max(spawnRate / 2, 1000);
      }
    });
    if (hitPiggy) {
      bullet.destroy();
    }
  });

  piggyBullets.forEach(function(bullet, index) {
    bullet.x += bullet.vx;
    // if piggy bullet hits wall destroy it
    var hitWall = contain(bullet, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (hitWall) {
      piggyBullets.splice(index, 1);
      bullet.destroy();
      return;
    }

    // if it hits rat then destroy it
    if (hitTestRectangle(bullet, rat.sprite)) {
      piggyBullets.splice(index, 1);
      bullet.destroy();
      rat.hit();
    }
  });

  // if piggy collide with rat then game over
  piggies.forEach(function(piggy, index) {
    if (hitTestRectangle(piggy.sprite, rat.sprite)) {
      end();
    }
  });

  // spawn a piggy if it's time to do so
  var now = new Date();
  if (now > nextSpawn) {
    piggies.push(new Piggy(gameScene, 900, randomInt(10, 550)));
    nextSpawn = now.getTime() + spawnRate;
  }

  // scroll bg
  beach.x -= 1;
  beach2.x -= 1;

  if (beach.x <= WIDTH * -1) {
    beach.x = 0;
    beach2.x = WIDTH;
  }

  if (rat.health <= 0) {
      end();
  }

  // show FPS
  frames++;
  if ((now.getTime() - secondTick.getTime()) >= 1000) {
    fpsDisplay.text = `${frames} FPS`;
    frames = 0;
    secondTick = now;
  }

  // show score
  scoreMsg.text = `Score: ${score}`;
}

/** Listen for spacebar, restart on press */
function gameOver() {
  if (down.isDown) {
    gameScene.destroy({ children: true });
    playSetup();
  }
}

/** Show game over text and swich to gameOver loop */
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;

  message.text = `u suk\nscore: ${score}\npress down to try again`,
  state = gameOver;
}
