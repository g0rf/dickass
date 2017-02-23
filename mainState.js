var mainState = function(game){};


mainState.prototype = {

	init: function() { // register keyboard inputs
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	preload: function() { // load assets
		game.load.tilemap('level1', 'assets/beach.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('gameTiles', 'assets/platform2.png');
    game.load.image('background', 'assets/bg1.png');

        if (sfw == true) {
            game.load.image('dickass', 'assets/rat100.png');
			game.load.image('baddie', 'assets/piggy.png');
            game.load.spritesheet('dickassRocketOverlay', 'assets/dickass-rocket-overlay.png', 100, 100);

        }   else {
            game.load.spritesheet('dickass', 'assets/dickass-spritesheet-dark-border.png', 100, 100);
			game.load.spritesheet('dickassOverlay', 'assets/smaller-overlay.png', 50, 50);
            game.load.spritesheet('dickassOverlay', 'assets/smaller-overlay.png', 50, 50);
            game.load.spritesheet('dickassRocketOverlay', 'assets/dickass-rocket-overlay.png', 100, 100);
			game.load.image('baddie', 'assets/pepe.jpg');
            game.load.image('arnold', 'assets/arnold.png');
        }

		//game.load.image('baddie', 'assets/pepe.jpg');
		game.load.image('bullet', 'assets/bullet.png');

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform-pixel.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// game.stage.backgroundColor = "#4488AA";
		//livesText = game.add.text(game.world.center-250, game.world.centerY-250, 'Lives = ' + playerLives, { font: '25px Arial', fill: '#ffffff'});
    game.add.tileSprite(0, 0, 2000, 800, 'background');

		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('platform', 'gameTiles');

		// this.backgroundlayer = this.map.createLayer('background');
		this.collisionLayer = this.map.createLayer('collision');
		this.map.setCollisionBetween(1, 100000, true, 'collision');
		// this.backgroundlayer.resizeWorld();

        //game.world.width = (this.game.width * 2);
        //game.world.height = (this.game.height * 2);

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
}
