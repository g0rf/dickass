var gameOverState = function(game){};


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
}