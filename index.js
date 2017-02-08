
var cursors;
var sounds = {
	music: new Audio("assets/sounds/soulbossanova.mp3"),
	jumpsound: new Audio("assets/sounds/badpoosy.mp3")
};

var mainState = function(game){};
var titleState = function(game){};

titleState.prototype = {
	init: function() {
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	},

	preload: function () {
		game.load.image('sky', 'assets/sky.png');
	},

	create: function () {
		game.add.sprite(0, 0, 'sky');
		var titleScreen = game.add.text(230, 80, 'The Adventures of Dickass', { font: '25px Arial', fill: '#ffffff '});

		var howToStart = game.add.text(titleScreen.width, 120, 'Press up to start party', { font: '15px Arial', fill: '#ffffff' });
		cursors = game.input.keyboard.createCursorKeys();
	},

	update: function () {
		if (cursors.up.isDown) {
			startGame();
		}
	}
}

/**
 * Create a new Dickass
 * Adds sprite to the game in idle state
 */
function Dickass(game) {
	// create a new sprite at center
	var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'dickass');
	game.physics.arcade.enable(sprite);

	//mike doesn't like bounce that ass bounce bounce that ass
	sprite.body.bounce.y = 0.1;
	sprite.body.gravity.y = 1000;
	sprite.body.collideWorldBounds = true;
	game.camera.follow(sprite);

	this.sprite = sprite; // make the sprite object public

	// Add our overlay spritesheet as a child, so it always moves with dickass
	// Frame 0 is empty, so it shows nothing by default
	var overlaySprite = game.make.sprite(25, -20, 'dickassOverlay');
	sprite.addChild(overlaySprite);

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
	}
	var showRocketSkates = function() {
		sprite.addChild
	}

	// Start off facing right. Call it here on creation, to avoid a weird jump thing that happens
	faceRight();

	// Main update function. Called in gameState update().
	this.update = function() {
		//  Reset the players velocity (movement)
		sprite.body.velocity.x = 0;

		if (cursors.left.isDown) {
			//  Move to the left
			sprite.body.velocity.x = -150;
			faceLeft();
			rocketOverlaySprite.frame = 1; // frame 1 is ROCKET SKATES LMFAO

		} else if (cursors.right.isDown) {
			//  Move to the right
			sprite.body.velocity.x = 150;
			rocketOverlaySprite.frame = 1;
			faceRight();
		} else {
			//  Stand still
			rocketOverlaySprite.frame = 0;
		}

		//  Allow the player to jump if they are standing on top of anything
		if (cursors.up.isDown && sprite.body.blocked.down) {
			sprite.body.velocity.y = -600;
			sounds.jumpsound.play();
		}

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
}

mainState.prototype = {
	init: function() { // register keyboard inputs
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	},

	preload: function() { // load assets
		game.load.tilemap('level1', 'assets/platform.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('gameTiles', 'assets/platform-pixel.png');

		game.load.image('pepe', 'assets/pepe.jpg');
		game.load.image('john', 'assets/john.png');
		game.load.spritesheet('dickass', 'assets/dickass-spritesheet-dark-border.png', 100, 100);
		// game.load.spritesheet('dickassOverlay', 'assets/dickass-overlay.png', 100, 100);
		game.load.spritesheet('dickassOverlay', 'assets/smaller-overlay.png', 50, 50);
		game.load.spritesheet('dickassRocketOverlay', 'assets/dickass-rocket-overlay.png', 100, 100);
		game.load.image('arnold', 'assets/arnold.png');
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform-pixel.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = "#4488AA";

		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('platform', 'gameTiles');

		this.backgroundlayer = this.map.createLayer('background');
		this.collisionLayer = this.map.createLayer('collision');
		this.map.setCollisionBetween(1, 100000, true, 'collision');
		this.backgroundlayer.resizeWorld();

		// Decorative images
		this.pepe = this.game.add.sprite(game.world.centerX, game.world.centerY - 200, 'pepe');
		this.john = this.game.add.sprite(game.world.centerX-150, game.world.centerY - 200, 'john');

		// Create arnold with gravity and collision
		this.arnold = game.add.sprite(game.world.centerX-200, game.world.centerY, 'arnold');
    this.game.physics.arcade.enable(this.arnold);
		this.arnold.body.gravity.y = 1000;

		// Create dickass
		this.dickass = new Dickass(game);

		cursors = game.input.keyboard.createCursorKeys();
	},

	update: function() {
		var v = 300; // movement speed
		game.physics.arcade.collide(this.dickass.sprite, this.collisionLayer);
		game.physics.arcade.collide(this.arnold, this.collisionLayer);
		game.physics.arcade.collide(this.dickass.sprite, this.arnold);

		this.dickass.update();
	}
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);

game.state.add('titleState', titleState, false);
game.state.start('titleState');

function startGame() {
	game.state.add('mainState', mainState, false);
	game.state.start('mainState');
	sounds.music.play();
	sounds.music.volume = .75;
	sounds.jumpsound.volume = 0.5
}
