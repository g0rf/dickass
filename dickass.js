class Dickass {
  constructor() {
    // create a new sprite at center
    var sprite = game.add.sprite(game.world.centerX - 700, 450, 'dickass');
    game.physics.arcade.enable(sprite);

    //mike doesn't like bounce that ass bounce bounce that ass
    sprite.body.bounce.y = 0.1;
    //sprite.body.gravity.y = 1000;
    sprite.body.collideWorldBounds = true;
    game.camera.follow(sprite);

    this.sprite = sprite; // make the sprite object public
    // Create dickass' weapon and bullets
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(10, 'bullet');

    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    // Add our overlay spritesheet as a child, so it always moves with dickass
    // Frame 0 is empty, so it shows nothing by default
    if (sfw == false) {
      var overlaySprite = game.make.sprite(25, -20, 'dickassOverlay');
      sprite.addChild(overlaySprite);
    }

    this.rocketOverlaySprite = game.make.sprite(-50, -50, 'dickassRocketOverlay');
    sprite.addChild(this.rocketOverlaySprite);

    // Start off facing right. Call it here on creation, to avoid a weird jump thing that happens
    this.faceRight();
    this._fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);;
  }

  faceLeft() {
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.scale.x =  -1;
  }
  faceRight() {
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.scale.x = 1;
  };

  fire() {
    var sprite = this.sprite;
    var multiplier = 1;
      if (this.sprite.scale.x !== 1) { // if scale.x is not 1, then he's facing left
      multiplier = -1;
    }

    //  Grab the first bullet we can from the pool
    if (game.time.now > bulletTime && this.bullets.countDead() > 0) {
      bulletTime = game.time.now + 200;
      var bullet = this.bullets.getFirstExists(false);

      bullet.reset(sprite.x, sprite.y);
      bullet.body.velocity.x = 600 * multiplier;
    }
  };

  // Main update function. Called in gameState update().
  // Update function for Dickass
  update() {
    var sprite = this.sprite;
    sprite.body.gravity.y = 10000;
    //  Reset the players velocity (movement)
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    // Movement Stuff
    if (cursors.left.isDown) {
      //  Move to the left
      sprite.body.velocity.x = -150;
      this.faceLeft();
      //rocketOverlaySprite.frame = 1; // frame 1 is ROCKET SKATES LMFAO

    } else if (cursors.right.isDown) {
      //  Move to the right
      sprite.body.velocity.x = 150;
      //rocketOverlaySprite.frame = 1;
      this.faceRight();
    }

    var inAir = true;
    //check to see if rat man is in the air
    if(sprite.body.blocked.down) {
        inAir = false;
    } else {
        inAir = true;
    }


    //if up is pressed and rat is on the ground, jump and give a boost in acceleration
    if (cursors.up.isDown && inAir == false) {
      console.log('ayy');
      sprite.body.velocity.y = -4000;
      sprite.body.acceleration.y += -3000;
    } else if(cursors.up.isDown && inAir == true) {
      //otherwise it just uses the jetpack
      sprite.body.acceleration.y += -250;
      sprite.body.velocity.y = -200;
      this.rocketOverlaySprite.frame = 1;
    } else if (cursors.down.isDown) {
      // Move down
      sprite.body.acceleration.y +=300;
    } else {
      sprite.body.velocity.y = 0;
      this.rocketOverlaySprite.frame = 0;
      if (sprite.body.acceleration.y < 0) {
        sprite.body.acceleration.y += 250;
      }
    }

    if(sprite.body.blocked.up) {
        sprite.body.acceleration.y = 0;
    }

    // Weapon switch stuff
    if (sfw == false) {
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

    if (this._fireButton.isDown)  {
      this.fire();
    }
  }

  render() {
    //mike pls don't delete I just comment these out so they don't show up pls don't delete tho lol
    //game.debug.spriteInfo(sprite, 32, 32);
    //game.debug.text(this.bullets, 32, 16);
  }
}
