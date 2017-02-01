
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
	},

	create: function() { // add pepe as a sprite, with physics
		this.pepe = this.game.add.sprite(game.world.centerX, game.world.centerY, 'pepe');
		game.physics.enable(this.pepe, Phaser.Physics.ARCADE);
	},

	update: function() { // move pepe on keypress, stop him otherwise
		var v = 300; // movement speed

		if (this.upKey.isDown) {
			this.pepe.body.velocity.y = -v;
		} else if (this.downKey.isDown) {
			this.pepe.body.velocity.y = v;
		} else {
				this.pepe.body.velocity.y = 0;
		}


		if (this.leftKey.isDown) {
			this.pepe.body.velocity.x = -v;
		} else if (this.rightKey.isDown) {
			this.pepe.body.velocity.x = v;
		}
		else {
			this.pepe.body.velocity.x = 0;
		}
	}
}

// 500x500 screen, engine is Phaser.AUTO, id of the element to put this in
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'content', null);
game.state.add('mainState', mainState, false);
game.state.start('mainState');
