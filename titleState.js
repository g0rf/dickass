var titleState = function(game){};

titleState.prototype = {
  init: function() {
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    game.input.mouse.capture = true;
  },

  preload: function () {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('pepe', 'assets/pepe.jpg');
    game.load.image('rat', 'assets/rat.png')
  },

  create: function () {
    game.add.sprite(0, 0, 'sky');


    var nsfwButton = game.add.sprite(game.world.centerX/2, game.world.centerY, 'pepe');
    var sfwButton = game.add.sprite(game.world.centerX + 50, game.world.centerY + 25, 'rat');

    var titleScreen = game.add.text(game.world.centerX-150, 80, 'The Adventures of Rat Bastard', { font: '25px Arial', fill: '#ffffff'});

    var howToStart = game.add.text(titleScreen.width + 50, 120, 'Press up to start party', { font: '15px Arial', fill: '#ffffff'});
             game.add.text(titleScreen.width + 50, 150, 'Press down if u normal', { font: '15px Arial', fill: '#ffffff'});

        nsfwButton.inputEnabled = true;
    sfwButton.inputEnabled = true;

    var pepeTouched = false;

    //pepe button
    nsfwButton.events.onInputUp.add(function () {
      startGame();
    });


    //rat button
    sfwButton.events.onInputUp.add(function () {
      sfw = true;
      startGame();
    });

    cursors = game.input.keyboard.createCursorKeys();
  },

  update: function () {

    if (cursors.up.isDown) {
      startGame();
    }

    if (cursors.down.isDown) {
      sfw = true;
      startGame();
    }
  },

  render: function () {
    //game.debug.text('piss' + game.input.activePointer.leftButton.isDown, 25, 25);
    //game.debug.text('shit' + game.input.activePointer.rightButton.isDown, 25, 45);
    //game.debug.pointer(game.input.activePointer);

//      cu*rentTilePosition = ((layer.getTileY(game.input.activePointer.worldY)+1)*6)-(6-(layer.getTileX(game.input.activePointer.worldX)+1));
  }
}
