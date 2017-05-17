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
	//use this to make it work on hogkisser.com
//    "ratbastard/assets/bg1.png",
//    "ratbastard/assets/rat100.png",
//    "ratbastard/assets/piggy.png",
//    "ratbastard/assets/bullet.png",
//	  "ratbastard/assets/egg.png",
//	  "ratbastard/assets/heart.png",
//	  "ratbastard/assets/cheese.png",
//    "ratbastard/assets/cheeseman.png",
//	  "ratbastard/assets/hud.png"
	
	"assets/bg1.png",
    "assets/rat100.png",
    "assets/piggy.png",
    "assets/bullet.png",
	"assets/egg.png",
	"assets/heart.png",
	"assets/cheese.png",
    "assets/cheeseman.png",
	"assets/hud.png",
	"assets/titleScreenBG.jpg"
  ])
  .load(init);

//Define variables that might be used in more
//than one function
var state, message, gameScene, gameOverScene, id;
var titleScreen;
var beach, beach2;
var hud;
var bullets;
var piggyBullets;
var piggies;
var rat;
var score, scoreMsg;
var hearts;
var currency;
var currencyAmt, currencyMsg;
currencyAmt = 0;

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
//    playSetup();
  titleScreenSetup();
  //Start the game loop
  gameLoop();
}

function titleScreenSetup() {
	titleScreen = new Container();
	stage.addChild(titleScreen);
	
	
	titleBackground = new Sprite(TextureCache["assets/titleScreenBG.jpg"]);
	titleScreen.addChild(titleBackground);
	titleBackground.scale.x = 0.3;
	titleBackground.scale.y = 0.4;
	
	title = new Text(
      'RAT BASTARD',
      {font: '60px Courier', fill: 'white'}
    );
	titleScreen.addChild(title);
	title.x = 20;
	title.y = 20;
	
	
	var playButton = new Text('play', {font: '40px Arial', fill: 'white'});
	titleScreen.addChild(playButton);
	playButton.x = 30;
	playButton.y = 100;
	playButton.interactive = true;
	playButton.buttonMode = true;
	playButton.on('click', playSetup);
	
	
	state = title;
	
}


/** Setup of normal play state */
function playSetup() {
 
  titleScreen.visible = false;
  // arrays to remember alive bullets, piggy bullets, and piggies
  bullets = [];
  piggyBullets = [];
  piggies = [];
  hearts = [];
  currency = [];
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
	
  // HUD
  hud = new Sprite(TextureCache["assets/hud.png"]);
  hud.x = 0;
  hud.y = 0;
  gameScene.addChild(hud);
	
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
  fpsDisplay.y = 10;
  gameScene.addChild(fpsDisplay);


  scoreMsg = new Text(
      `Score: 0`,
      {font: "16px Futura", fill: "green"}
  );
  scoreMsg.x = WIDTH - 100;
  scoreMsg.y = HEIGHT - 20;
  gameScene.addChild(scoreMsg);

  currencyMsg = new Text( 
      `Currency: 0`, 
      {font: "16px Futura", fill: "green"}
  );
  currencyMsg.x = WIDTH/2;
  currencyMsg.y = HEIGHT - 20;
  gameScene.addChild(currencyMsg);
    
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
    state;

    //Render the stage
    renderer.render(stage);
  }
}

function title() {
	title.text = `Rat Bastard`;
	
	if(1 === 1) {
		console.log('hello');	
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
  
  //make the hearts move
  hearts.forEach(function(heart, index) {
      heart.x += heart.vx;
	  if(hitTestRectangle(heart, rat.sprite)) {
		  hearts.splice(index, 1);
		  heart.destroy();
		  rat.health += 10;
	  }
      
      var hitWall = contain(heart, { x:0, y:0, width: WIDTH, height: HEIGHT });
      if (hitWall) {
          hearts.splice(index, 1);
          heart.destroy();
      }
  });
	
  currency.forEach(function(cheese, index) {
	  cheese.x += cheese.vx;
	  if(hitTestRectangle(cheese, rat.sprite)) {
          currency.splice(index, 1);
          cheese.destroy();
          currencyAmt++;
      }
  })
 
  // if piggy collide with rat then game over
  var hitPiggy = false;
  piggies.forEach(function(piggy, index) {
    if (hitTestRectangle(piggy.sprite, rat.sprite)) {
      hitPiggy = true;
    }
  });
  if (hitPiggy) {
    end();
    return;
  }

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
    
  //show currency
  currencyMsg.text = `Cheese: ${currencyAmt}`;
}

/** Show game over text and swich to gameOver loop */


function end() {
  console.log('end  called');
  gameScene.visible = false;

  //Create the `gameOver` scene
  gameOverScene = new Container();
  stage.addChild(gameOverScene);

  //Create the text sprite and add it to the `gameOver` scene
  message = new Text(
      `u suk\nscore: ${score}\ncurrency: ${currencyAmt}\npress down to try again`,
      { font: "64px Futura", fill: "white" }
  );

  message.x = 100;
  message.y = stage.height / 2;
  gameOverScene.addChild(message);

  setTimeout(displayCheeseMan, 1000);
  setTimeout(displayCheeseManMsg, 1400);

  state = gameOver;
}

/* can't figure out how to make dude have a delay before showing up after game is restarted... clearInterval didn't work*/
var cheeseMan;
//document.addEventListener("click", openShop);

function displayCheeseMan() {
    cheeseMan = new Sprite(TextureCache['assets/cheeseman.png']);
    gameOverScene.addChild(cheeseMan);
    cheeseMan.x = 550;
    cheeseMan.y = 70;
//    document.addEventListener("click", openShop);
    cheeseMan.interactive = true;
    cheeseMan.buttonMode = true;
    cheeseMan.on('click', openShop);
}

function displayCheeseManMsg() {
    var cheeseManMsg = new Text('Got any cheese?', {font: "18px Futura", fill:"white"});
    gameOverScene.addChild(cheeseManMsg);
    cheeseManMsg.x = 480;
    cheeseManMsg.y = 60;
    
    var shopMsg = new Text('Click on mr. cheeseman to go to the shop!', {font: "14px Futura", fill:"white"});
    gameOverScene.addChild(shopMsg);
    shopMsg.x = 500;
    shopMsg.y = 400;                                                             
}
/** Listen for spacebar, restart on press */



function gameOver() {
  if (down.isDown) {
    gameScene.destroy({ children: true });
    gameOverScene.destroy({ children: true });
    playSetup();
  }
}

function openShop() {
    console.log("fuk");
    gameScene.destroy({ children: true });
    gameOverScene.destroy({ children: true });
    
    shopScene = new Container();
    stage.addChild(shopScene);
    
    var shopSign = new Text('YE OLDE SHOPPE', {font: "60px Comic Sans MS", fill:"white"});
    shopScene.addChild(shopSign);
    shopSign.x = 200;
    shopSign.y = 100;
    
    cheeseMan = new Sprite(TextureCache['assets/cheeseman.png']);
    shopScene.addChild(cheeseMan);
    cheeseMan.x = 200;
    cheeseMan.y = 200;
    
    var waddaya = new Text('waaddaya buyin?', {font: "20px Copperplate Gothic Light", fill:"white"});
    shopScene.addChild(waddaya);
    waddaya.x = 250;
    waddaya.y = 300;
}

