//var platforms;

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
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	preload: function() { // load assets
		game.load.tilemap('level1', 'assets/platform.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('gameTiles', 'assets/platform-pixel.png');
		
		game.load.image('pepe', 'assets/pepe.jpg');
		game.load.image('john', 'assets/john.png');
		game.load.spritesheet('dickass', 'assets/dickass-spritesheet.png', 100, 100);
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
        
        this.dickass = this.add.sprite(game.world.centerX - 700, 300, 'dickass');
        
        
		this.weapon = this.add.weapon(50, 'john');
		//this.bulletAngleVariance = 10;
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletAngleOffset = 90;
		this.weapon.fireRate = 500;
		this.weapon.bulletSpeed = 600;
		//this.weapon.trackSprite(this.dickass, 0, 0);

		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		
		
//		this.pepe = this.game.add.sprite(game.world.centerX, game.world.centerY - 200, 'pepe');

//		this.john = this.game.add.sprite(game.world.centerX-150, game.world.centerY - 200, 'john');

		//this.dickass = this.game.add.sprite(game.world.centerX-200 , game.world.centerY, 'dickass');
		
		this.dickass.faceLeft = function() {
			this.anchor.setTo(.5,.5);
			this.scale.x = -1;
            console.log('leftPressed');
		}
		this.dickass.faceRight = function() {
			this.anchor.setTo(.5,.5);
			this.scale.x = 1;
            console.log('rightPressed');
		}

		//game.physics.enable(this.dickass, Phaser.Physics.ARCADE);
		this.physics.arcade.enable(this.dickass);

	
		//mike doesn't like bounce that ass bounce bounce that ass
		this.dickass.body.bounce.y = 0.1;
		this.dickass.body.gravity.y = 1000;
		this.dickass.body.collideWorldBounds = true;
		
		this.game.camera.follow(this.dickass);
		
		
		//changed from game.input to this.input. not sure if that does anything
		cursors = this.input.keyboard.createCursorKeys();
	},

	update: function() {
		var v = 300; // movement speed
		var hitPlatform = game.physics.arcade.collide(this.dickass, this.collisionLayer);
        var facingRight = false;
        var facingLeft = false;
		//  Reset the players velocity (movement)
		this.dickass.body.velocity.x = 0;
		
		if (cursors.left.isDown) {
			//  Move to the left
			this.dickass.body.velocity.x = -250;
			this.dickass.faceLeft();
			this.dickass.frame = 1; // frame 1 is ROCKET SKATES LMFAO
            this.dickass.facingLeft = true;
            this.dickass.facingRight = false;
			
		} else if (cursors.right.isDown) {
			//  Move to the right
			this.dickass.body.velocity.x = 250;
			this.dickass.frame = 1;
			this.dickass.faceRight();
            this.dickass.facingRight = true;
            this.dickass.facingLeft = false;
		} else {
			//  Stand still
			this.dickass.animations.stop();
			this.dickass.frame = 0;
		}

		
		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && this.dickass.body.blocked.down && hitPlatform) {
			this.dickass.body.velocity.y = -600;
			//sounds.jumpsound.play();
		}
        
        /*if (fireButton.isDown && this.dickass.scale.x == 1)	{
            console.log('shoot right');
            this.weapon.fire(this.dickass, this.dickass.x, this.dickass.y);
			
        }*/
        
        if (fireButton.isDown)	{
            console.log('shoost');
            this.weapon.fire(this.dickass, this.dickass.x, this.dickass.y);
			
        }
        
        
        if (this.dickass.scale.x == -1) {
            this.weapon.bulletSpeed = -600;
        } else (this.weapon.bulletSpeed = 600);
       /* if (this.dickass.scale.x == 1) {
            
            console.log('dickass is facing right');
        }*/
	},
	
	render: function() {
		this.weapon.debug();
		
	}
}


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);

game.state.add('titleState', titleState, false);
game.state.start('titleState');

function startGame() {
	game.state.add('mainState', mainState, false);
	game.state.start('mainState');
	//sounds.music.play();
	sounds.music.volume = .75;
	sounds.jumpsound.volume = 0.5
}
