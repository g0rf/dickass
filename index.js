/*to do

-get mike to make some friggin assets (rat, levels, enemies, jetpack)

/// ==-game over screen ----////
////=====-enemy reload timers-=====////
-pause button
-level 1 design
-p2 physics for better collisions and gravity

-new music
-boss 1
-second enemies
-different bullets
-score system
-item drops (coins, ammo, different guns, etc.)
-enemy health/bullet damage (can work on this with boss)
-mute button
======/////=-mouse select sfw/nsfw===/////

*/


//global variables

var cursors;

var sounds = {
	music: new Audio("assets/sounds/soulbossanova.mp3"),
	jumpsound: new Audio("assets/sounds/badpoosy.mp3")
};


var mainState = function(game){};
var titleState = function(game){};
var gameOverState = function(game){};
var sfw = false;

var bulletTime = 0;
var fireRate = 0;
var enemyFireRate = 0;
var enemyBulletTime = 0;

var livingBaddies = [];

var playerLives = 3;

//idk if these are even being used lol
var totalEnemies = 0; 
var enemiesAlive = 0; 


titleState.prototype = {
	init: function() {
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		game.input.mouse.capture = true;
	},

	preload: function () {
		game.load.image('sky', 'assets/sky.png');
		game.load.image('pepe', 'assets/pepe.jpg');
		game.load.image('piggy', 'assets/piggy.png')
	},

	create: function () {
		game.add.sprite(0, 0, 'sky');
		
		var nsfwButton = game.add.sprite(game.world.centerX - 150, game.world.centerY, 'pepe');
		var sfwButton = game.add.sprite(game.world.centerX + 50, game.world.centerY + 25, 'piggy');
		
		var titleScreen = game.add.text(230, 80, 'The Adventures of Rat Bastard', { font: '25px Arial', fill: '#ffffff'});

		var howToStart = game.add.text(titleScreen.width, 120, 'Press up to start party', { font: '15px Arial', fill: '#ffffff'}); 
						 game.add.text(titleScreen.width, 150, 'Press down if u normal', { font: '15px Arial', fill: '#ffffff'});
		
        nsfwButton.inputEnabled = true;
		sfwButton.inputEnabled = true;
		
		var pepeTouched = false;
		
		//pepe button
		nsfwButton.events.onInputUp.add(function () 
		{
			console.log('pepe touched');
			startGame();
			
			
		});
		
		
		//piggy button
		sfwButton.events.onInputUp.add(function () {
			console.log('piggy touched');
			sfw = true;
			startGame();
	
		});
		
		cursors = game.input.keyboard.createCursorKeys();
	},

	update: function () {
		console.log(sfw);
		
		if (cursors.up.isDown) {
            startGame();
		}
        
        if (cursors.down.isDown) {
            console.log('true');
            sfw = true;
            startGame();
        }

		
	},
	
	render: function () {
		game.debug.text('piss' + game.input.activePointer.leftButton.isDown, 25, 25);
		game.debug.text('shit' + game.input.activePointer.rightButton.isDown, 25, 45);
		//game.debug.pointer(game.input.activePointer);
		
//		  cu*rentTilePosition = ((layer.getTileY(game.input.activePointer.worldY)+1)*6)-(6-(layer.getTileX(game.input.activePointer.worldX)+1));
	}
};

/**
 * Create a new Dickass
 * Adds sprite to the game in idle state
 */
function Dickass(game) {
	// create a new sprite at center
	var sprite = game.add.sprite(game.world.centerX - 700, 450, 'dickass');
	game.physics.arcade.enable(sprite);

	//mike doesn't like bounce that ass bounce bounce that ass
	sprite.body.bounce.y = 0.1;
	//sprite.body.gravity.y = 1000;
	sprite.body.collideWorldBounds = true;
	game.camera.follow(sprite);

	this.sprite = sprite; // make the sprite object public

	// Create dickass' weapon and bullets
	// Create dickass' weapon and bullets
	this.bullets = game.add.group();
	this.bullets.enableBody = true;
	this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

	this.bullets.createMultiple(10, 'bullet');

    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
	//moving these to global variables so baddies can access them
	/*this.bulletTime = 0;
    this.fireRate = 50;*/

    
	var fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

	// Add our overlay spritesheet as a child, so it always moves with dickass
	// Frame 0 is empty, so it shows nothing by default
	if (sfw == false) {
		var overlaySprite = game.make.sprite(25, -20, 'dickassOverlay');
		sprite.addChild(overlaySprite);
	}
		
	var rocketOverlaySprite = game.make.sprite(-50, -50, 'dickassRocketOverlay');
	sprite.addChild(rocketOverlaySprite);

	// Helper functions
	var faceLeft = function() {
	  sprite.anchor.setTo(.5,.5);
	  sprite.scale.x = -1;
	}
	var faceRight = function() {
		sprite.anchor.setTo(.5,.5);
		sprite.scale.x = 1;
	};

	this.fire = function() {

		var multiplier = 1;
        if (sprite.scale.x !== 1) { // if scale.x is not 1, then he's facing left
				multiplier = -1;
		}

        //  Grab the first bullet we can from the pool
        
        
        if (game.time.now > bulletTime && this.bullets.countDead() > 0) {
            bulletTime = game.time.now + 200;
        
            var bullet = this.bullets.getFirstExists(false);
         
            bullet.reset(sprite.x, sprite.y);

            bullet.body.velocity.x = 600 * multiplier;

        }
	};

	// Start off facing right. Call it here on creation, to avoid a weird jump thing that happens
	faceRight();

	// Main update function. Called in gameState update().
	// Update function for Dickass
	this.update = function() {
		console.log(sprite.body.acceleration.y);
    	sprite.body.gravity.y = 10000;    
		//  Reset the players velocity (movement)
		sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
		// Movement Stuff
		if (cursors.left.isDown) {
			//  Move to the left
			sprite.body.velocity.x = -150;
			faceLeft();
			//rocketOverlaySprite.frame = 1; // frame 1 is ROCKET SKATES LMFAO

		} else if (cursors.right.isDown) {
			//  Move to the right
			sprite.body.velocity.x = 150;
			//rocketOverlaySprite.frame = 1;
			faceRight();
		} else {
			//  Stand still
			//rocketOverlaySprite.frame = 0;
		}
        
		if (cursors.up.isDown && sprite.body.blocked.down) {
			sprite.body.velocity.y = -4000;
			sprite.body.acceleration.y += -3000;
		
		
		}   else if(cursors.up.isDown) {
            // Move up
			//jump!
//			if(sprite.body.blocked.down) {
//            	sprite.body.velocity.y = -4000;
//				sprite.body.acceleration.y += 10;
//			}
			
			sprite.body.acceleration.y += -250;
			sprite.body.velocity.y = -50;
			
            rocketOverlaySprite.frame = 1; // frame 1 is ROCKET SKATES LMFAO

        } else if (cursors.down.isDown) {
            // Move down
            sprite.body.velocity.y = 150;
        } else {
            sprite.body.velocity.y = 0;
            rocketOverlaySprite.frame = 0;
			if (sprite.body.acceleration.y < 0) {
				sprite.body.acceleration.y += 250;
			}

        }
		//  Allow the player to jump if they are standing on top of anything
		/*if (cursors.up.isDown && sprite.body.blocked.down) {
			sprite.body.velocity.y = -600;
			sounds.jumpsound.play();*/
		

		// Weapon switch stuff
		if (sfw == false) {
			if (game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
				// unarmed overlay
				sprite.frame = 0;
				overlaySprite.frame = 0;
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.TWO)) {
				// draw pistol overlay
				sprite.frame = 1;
				overlaySprite.frame = 1;
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.THREE)) {
				// draw pistol overlay
				sprite.frame = 1;
				overlaySprite.frame = 2;
			}
		}
		
		if (fireButton.isDown)	{
            this.fire();
        }

    },
        
    this.render = function() {
        //mike pls don't delete I just comment these out so they don't show up pls don't delete tho lol
		//game.debug.spriteInfo(sprite, 32, 32);
        //game.debug.text(this.bullets, 32, 16);

    }
}

function Baddie(game) {
 	//made a bad boy
	//var respawnReady = true;
	var spawnTimer = 0;
//	this.maxBaddies = 20;
	//var spawnCounter = 0;
	

	
	var self=this;
	this.baddies = game.add.group(); 
	self.baddies.enableBody = true; 

	
	for (var i = 0; i < 5; i++)  {		
			this.baddie = this.baddies.create(game.world.centerX, i * Math.floor((Math.random() * 150) + 1), 'baddie');
			this.baddie.body.velocity.x = -50; 
			//self.spawnCounter++;
			//console.log(this.spawnCounter);
		}
	
	function spawnEnemies() {
		self.baddie = self.baddies.create(game.world.centerX, Math.floor((Math.random() * 150) + 1), 'baddie');
		self.baddie.body.velocity.x = -50;
		
	}
	
	this.physicsBodyType = Phaser.Physics.ARCADE; 
	
	//bad boy bullets
	this.baddieBullets = game.add.group();
	this.baddieBullets.enableBody = true;
	this.baddieBullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.baddieBullets.createMultiple (5, 'john');
	this.baddieBullets.setAll('outOfBoundsKill', true);
	this.baddieBullets.setAll('checkWorldBounds', true);
	
	/*not sure thy this is written like:
	>>  this.update = function() {...} <<  rather than >> this.update: function() {...} <<
	possibly bc it isn't a state?*/
		 
	this.update = function () {
		if (game.time.now > fireRate) {
			//bulletTime = game.time.now + fireRate;
			this.baddieFire();	
			
		}

		if (game.time.now > spawnTimer) {
			spawnEnemies();
			spawnTimer = game.time.now + 5000;
		}
		
//		if(this.spawnCounter < this.maxBaddies) {
//			baddies.create();
//		}
	};
	
	this.baddieFire = function() {
		
		this.baddieBullet = this.baddieBullets.getFirstExists(false);
		
		livingBaddies.length=0;
		
		this.baddies.forEachAlive(function(baddies){
			livingBaddies.push(baddies);
		});
			
		
	    if (game.time.now > enemyBulletTime) {
            enemyBulletTime = game.time.now + enemyFireRate;  
		
        }
	
		if (this.baddieBullet && livingBaddies.length > 0) {
			
			var random = game.rnd.integerInRange(0, livingBaddies.length-1);
			//randomly select a baddie
			var shooter = livingBaddies[random];
			//and fire a bullet from said baddie
			this.baddieBullet.reset(shooter.body.x, shooter.body.y, -150);
			//this.baddieBullet.velocity.x - 50;
			game.physics.arcade.moveToXY(this.baddieBullet, 0, shooter.body.y, 250);
			//game.physics.arcade.moveToObject(this.baddieBullet, 0, 120);
			enemyFireRate = game.time.now + 2000;
		}	
	}; //end baddieFire function
	
	
}
	
mainState.prototype = {

	init: function() { // register keyboard inputs
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	preload: function() { // load assets
		game.load.tilemap('level1', 'assets/platform.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('gameTiles', 'assets/platform-pixel.png');

        
//        game.load.image('dickass', 'assets/john.png');
//        game.load.image('dickass', 'assets/dickass/dickass-spritesheet-dark-border.png', 100, 100);
      
        if (sfw == true) {
            game.load.image('dickass', 'assets/piggy.png');
			game.load.image('baddie', 'assets/mrchef.png');
            game.load.spritesheet('dickassRocketOverlay', 'assets/dickass-rocket-overlay.png', 100, 100);
			game.load.image('bullet', 'assets/egg.png');
			
        }   else {
            game.load.spritesheet('dickass', 'assets/dickass-spritesheet-dark-border.png', 100, 100);
			game.load.spritesheet('dickassOverlay', 'assets/smaller-overlay.png', 50, 50);
            game.load.spritesheet('dickassOverlay', 'assets/smaller-overlay.png', 50, 50);
            game.load.spritesheet('dickassRocketOverlay', 'assets/dickass-rocket-overlay.png', 100, 100);
			game.load.image('baddie', 'assets/pepe.jpg');
            game.load.image('arnold', 'assets/arnold.png');
        }

		//game.load.image('baddie', 'assets/pepe.jpg');
		game.load.image('john', 'assets/john.png');
      
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform-pixel.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = "#4488AA";
		//livesText = game.add.text(game.world.center-250, game.world.centerY-250, 'Lives = ' + playerLives, { font: '25px Arial', fill: '#ffffff'});

		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('platform', 'gameTiles');

		this.backgroundlayer = this.map.createLayer('background');
		this.collisionLayer = this.map.createLayer('collision');
		this.map.setCollisionBetween(1, 100000, true, 'collision');
		this.backgroundlayer.resizeWorld();


        if(sfw == false) {
            console.log('arnold added');
            this.arnold = game.add.sprite(game.world.centerX - 200, 400, 'arnold');
            game.physics.arcade.enable(this.arnold);
            this.arnold.body.gravity.y = 1000;
        }

		// Create dickass
		this.dickass = new Dickass(game);
        this.baddies = new Baddie(game);
		//changed from game.input to this.input. not sure if that does anything
		cursors = this.input.keyboard.createCursorKeys();
	},

	update: function() {
		var v = 300; // movement speed

		// collision stuff

		game.physics.arcade.collide(this.dickass.sprite, this.collisionLayer);
        game.physics.arcade.overlap(this.dickass.bullets, this.baddies.baddies, killBaddie, null, this);
        game.physics.arcade.overlap(this.dickass.sprite, this.baddies.baddies, killDickass, null, this);
        game.physics.arcade.overlap(this.dickass.sprite, this.baddies.baddieBullets, dickassShot, null, this);
		game.physics.arcade.collide(this.arnold, this.collisionLayer);

        game.physics.arcade.collide(this.dickass.sprite, this.arnold);

		this.dickass.update();
        this.baddies.update();
	},   
    
    render: function() {
        //this.dickass.render();
		game.debug.text('Lives:' + playerLives, 32, 32);
    }
};


gameOverState.prototype = {
	init: function() {
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	preload: function () {
		game.load.image('sky', 'assets/sky.png');
	},

	create: function () {
		game.add.sprite(0, 0, 'sky');
		var shitScreen = game.add.text(100, 80, 'That ball didnt have a chance comin off yo hands playa', { font: '25px Arial', fill: '#ffffff'});
		var playAgain = game.add.text(shitScreen.x, 100, 'press space to play again', { font: '25px Arial', fill: '#ffffff'});
		playerLives = 3;

		cursors = game.input.keyboard.createCursorKeys();
		
	},

	update: function () {
	  
        if (spaceKey.isDown) {
            console.log(true);
            sfw = true;
            startGame();
			
            
        }
	}
};


var game = new Phaser.Game(800, 640, Phaser.AUTO, 'content', null);

game.state.add('titleState', titleState, false);
game.state.start('titleState');
game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
game.scale.setUserScale(2, 2);

function startGame() {
	game.state.add('mainState', mainState, false);
	game.state.start('mainState');
	sounds.music.volume = .75;
	//sounds.music.play();
	sounds.jumpsound.volume = 0.5
}

function killBaddie(bullets, baddie) {
    baddie.kill();
    bullets.kill();
}

function killDickass(dickass, baddie) {
    dickass.kill();
    baddie.kill();
}

function dickassShot(dickass, baddieBullets) {
    console.log('shot');

    baddieBullets.kill();
	console.log(playerLives);
	playerLives -= 1;
	//livesText.text = 'Lives =' + playerLives;
	
	//change the input key for start stop so shit doesn't auto restart if you're holding down 
	//the down or up key
	//y spacebar no friggin work huh??
	if (playerLives <= 0) {
		console.log('dead');
		dickass.kill();
	 	gameOverScreen();
	}
}

function gameOverScreen() {
	//sounds.music.pause();
	game.state.add('gameOverState', gameOverState, false);
	game.state.start('gameOverState');
	
	

}
