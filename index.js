var platforms;

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

mainState.prototype = {
	init: function() { // register keyboard inputs
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	},

	preload: function() { // load assets
		game.load.image('pepe', 'assets/pepe.jpg');
		game.load.image('john', 'assets/john.png');
		game.load.spritesheet('dickass', 'assets/dickass-spritesheet.png', 100, 100);
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform-pixel.png');
	},

	create: function() {

		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0, 0, 'sky');

		// Ground stuff
		platforms = game.add.group();
		platforms.enableBody = true;

		var ground = platforms.create(0, game.world.height - 32, 'ground');
		ground.body.immovable = true;

		var ground2 = platforms.create(396, game.world.height - 32, 'ground');
		ground2.body.immovable = true;
		var ground3 = platforms.create(396*2, game.world.height - 32, 'ground');
		ground3.body.immovable = true;

		// Hovering platforms stuff
		var ledge = platforms.create(450, 400, 'ground'); //right ledge
		ledge.body.immovable = true;
		var ledge2 = platforms.create(-100, 250, 'ground'); //left ledge
		ledge.body.immovable = true;

		this.pepe = this.game.add.sprite(game.world.centerX, game.world.centerY - 200, 'pepe');

		this.john = this.game.add.sprite(game.world.centerX-150, game.world.centerY - 200, 'john');

		this.dickass = this.game.add.sprite(game.world.centerX, game.world.centerY, 'dickass');
		this.dickass.faceLeft = function() {
			this.anchor.setTo(.5,.5);
			this.scale.x = -1;
		}
		this.dickass.faceRight = function() {
			this.anchor.setTo(.5,.5);
			this.scale.x = 1;
		}

		game.physics.enable(this.dickass, Phaser.Physics.ARCADE);

		// this.dickass.scale.setTo(.8,.8);

		//mike doesn't like bounce that ass bounce bounce that ass
		//this.dickass.body.bounce.y = 0.5;
		this.dickass.body.gravity.y = 1000;
		this.dickass.body.collideWorldBounds = true;

		cursors = game.input.keyboard.createCursorKeys();
	},

	update: function() {
		var v = 300; // movement speed
		var hitPlatform = game.physics.arcade.collide(this.dickass, platforms);

		//  Reset the players velocity (movement)
		this.dickass.body.velocity.x = 0;

		if (cursors.left.isDown) {
			//  Move to the left
			this.dickass.body.velocity.x = -150;
			this.dickass.faceLeft();
			this.dickass.frame = 1; // frame 1 is ROCKET SKATES LMFAO
		} else if (cursors.right.isDown) {
			//  Move to the right
			this.dickass.body.velocity.x = 150;
			// this.dickass.animations.play('right');
			this.dickass.frame = 1;
			this.dickass.faceRight();
		} else {
			//  Stand still
			this.dickass.animations.stop();
			this.dickass.frame = 0;
		}

		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && this.dickass.body.touching.down && hitPlatform) {
			this.dickass.body.velocity.y = -600;
			sounds.jumpsound.play();
		}
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
