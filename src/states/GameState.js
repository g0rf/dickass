// import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {

	init() {
		const game = this.game;
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	}

	preload() {
		this.game.load.image('pepe', '/pepe.jpg');
	}

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		this.pepe = this.game.add.sprite(center.x, center.y, 'pepe');
		this.game.physics.enable(this.pepe, Phaser.Physics.ARCADE);
	}

	update() {
		const v = 300; // movement speed

		if (!this.pepe.body) {
			return;
		}

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

export default GameState;
