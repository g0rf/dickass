var platforms;
var music = new Audio("soulbossanova.mp3");
var mainState = function(game){};
mainState.prototype = {
	init: function() { // register keyboard inputs
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	},

	preload: function() { // load pepe
		game.load.image('pepe', 'assets/pepe.jpg');
        game.load.image('john', 'assets/john.png');
		game.load.image('dickass', 'assets/dickass.svg');
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
	

	},
	
	
	create: function() { // add pepe as a sprite, with physics
	
	
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
		game.add.sprite(0, 0, 'sky');
	
		platforms = game.add.group();
		
		platforms.enableBody = true;
	
		var ground = platforms.create(0, game.world.height - 64, 'ground');
	
		ground.scale.setTo(2, 2);
	
		ground.body.immovable = true;
		
		
		var ledge = platforms.create(450, 400, 'ground'); //right ledge
	
		ledge.body.immovable = true;
		
		ledge = platforms.create(-100, 250, 'ground'); //left ledge
	
		ledge.body.immovable = true;
		
		this.pepe = this.game.add.sprite(game.world.centerX, game.world.centerY - 200, 'pepe');
		game.physics.enable(this.pepe, Phaser.Physics.ARCADE);
        
        this.john = this.game.add.sprite(game.world.centerX-150, game.world.centerY - 200, 'john');
		game.physics.enable(this.john, Phaser.Physics.ARCADE);
		
		this.dickass = this.game.add.sprite(game.world.centerX, game.world.centerY, 'dickass');
		game.physics.enable(this.dickass, Phaser.Physics.ARCADE);
		
		this.dickass.scale.setTo(.8,.8);
		
		this.dickass.body.bounce.y = 0.5;
		this.dickass.body.gravity.y = 1000;
		this.dickass.body.collideWorldBounds = true;
		
		cursors = game.input.keyboard.createCursorKeys();
	},

	update: function() { // move pepe on keypress, stop him otherwise
		var v = 300; // movement speed
		
		var music = new Audio("soulbossanova.mp3");
		
		
		//music.play();
		
		var hitPlatform = game.physics.arcade.collide(this.dickass, platforms);
		
			 //  Reset the players velocity (movement)
		this.dickass.body.velocity.x = 0;

		if (cursors.left.isDown)
		{
			//  Move to the left
			this.dickass.body.velocity.x = -150;

			this.dickass.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			this.dickass.body.velocity.x = 150;

			this.dickass.animations.play('right');
		}
		else
		{
			//  Stand still
			this.dickass.animations.stop();

			this.dickass.frame = 4;
		}

		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && this.dickass.body.touching.down && hitPlatform)
		{
			this.dickass.body.velocity.y = -600;
		}
	}
}

// 500x500 screen, engine is Phaser.AUTO, id of the element to put this in
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);
game.state.add('mainState', mainState, false);
game.state.start('mainState');
music.play();