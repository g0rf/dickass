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
       
        this.pepes = game.add.group();
        this.pepes.enableBody = true;
        for (var i = 0; i < 5; i++)  {
            this.pepe = this.pepes.create(game.world.centerX, i*150, 'pepe');
            this.pepe.body.gravity.x = -6;
        }
        
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'john');
        this.bullets.fireRate = 500;
        this.bullets.bulletSpeed = 600;

		this.weapon = this.add.weapon(50, 'john');
        this.weapon.enableBody = true;
    
		this.bulletAngleVariance = 10;
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletAngleOffset = 90;
		this.weapon.fireRate = 500;
		this.weapon.bulletSpeed = 600;

		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		
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
        game.physics.arcade.overlap(this.dickass, this.pepes, killPepe, null, this);
        game.physics.arcade.overlap(this.bullets, this.pepes, killPepe, null, this);
		//  Reset the players velocity (movement)
		this.dickass.body.velocity.x = 0;
		
		if (cursors.left.isDown) {
			//  Move to the left
			this.dickass.body.velocity.x = -250;
			this.dickass.faceLeft();
			this.dickass.frame = 1; // frame 1 is ROCKET SKATES LMFAO
			
		} else if (cursors.right.isDown) {
			//  Move to the right
			this.dickass.body.velocity.x = 250;
			this.dickass.frame = 1;
			this.dickass.faceRight();

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

        if (fireButton.isDown)	{
        	var multiplier = 1;
        	if (this.dickass.scale.x !== 1) { // if scale.x is not 1, then he's facing left
              multiplier = -1;
			}

            //  Grab the first bullet we can from the pool
            var bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.dickass.x, this.dickass.y);
                bullet.body.velocity.x = 600 * multiplier;
                // bulletTime = game.time.now + 200;
            }
        }
	},
}


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);

game.state.add('titleState', titleState, false);
game.state.start('titleState');

function startGame() {
	game.state.add('mainState', mainState, false);
	game.state.start('mainState');
	sounds.music.volume = .75;
	sounds.jumpsound.volume = 0.5
}

function killPepe(bullets, pepe) {
    pepe.kill();
    bullets.kill();
}