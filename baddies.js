var space = keyboard(32),
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
// var bullets = [];

class Rat {
  constructor(parent) { // parent: parent container
    // create a new sprite at center
    this.sprite = new Sprite(TextureCache['assets/pig.png']);
    parent.addChild(this.sprite);
    this.sprite.vx = 0;
    this.sprite.vy = 0;

    this.sprite.x = 100;
    this.sprite.y = 100;

    // Add our overlay spritesheet as a child, so it always moves with dickass
    // Frame 0 is empty, so it shows nothing by default

    // Start off facing right. Call it here on creation, to avoid a weird jump thing that happens
    this.faceRight();

    // this._fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);;
    this.parent = parent;
  }

  faceLeft() {
    this.sprite.anchor.set(.5,.5);
    this.sprite.scale.x =  -1;
  }
  faceRight() {
    this.sprite.anchor.set(.5,.5);
    this.sprite.scale.x = 1;
  };

  /** Fire a bullet */
  fire() {
    var bulletSprite = new Sprite(TextureCache['assets/egg.png']);
    var multiplier = 1;
    if (this.sprite.scale.x !== 1) { // if scale.x is not 1, then he's facing left
      multiplier = -1;
    }
    bulletSprite.x = this.sprite.x; // + (multiplier * 5);
    bulletSprite.y = this.sprite.y;
    bulletSprite.vx = 2;
    console.log(bulletSprite.x);
    console.log(bulletSprite.y);
    // bulletSprite.vx = 2 * multiplier;
    this.parent.addChild(bulletSprite);

    // add the sprite to global bullets array so it can be collided
    bullets.push(bulletSprite);
  };

  // Update function for Rat
  update() {
    //  Reset the players horiz velocity (movement)
    var sprite = this.sprite;
    sprite.vx = 0;
    sprite.vy += 0.1; // gravity;


    // Movement Stuff
    if (left.isDown) {
      //  Move to the left
      sprite.vx = -5;
      this.faceLeft();
      //rocketOverlaySprite.frame = 1; // frame 1 is ROCKET SKATES LMFAO

    } else if (right.isDown) {
      //  Move to the right
      sprite.vx = 5;
      //rocketOverlaySprite.frame = 1;
      this.faceRight();
    }

    if (up.isDown) {
      sprite.vy = Math.max(sprite.vy - .5, -15);
    }

    sprite.x += sprite.vx;
    sprite.y += sprite.vy;

    var collideDirection = contain(this.sprite, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (collideDirection === 'top' || collideDirection === 'bottom') {
      sprite.vy = 0.1; // reset to gravity
    }

    // var inAir = true;
    // //check to see if rat man is in the air
    // if(sprite.body.blocked.down) {
    //     inAir = false;
    // } else {
    //     inAir = true;
    // }


    //if up is pressed and rat is on the ground, jump and give a boost in acceleration
    // if (cursors.up.isDown && inAir == false) {
    //   console.log('ayy');
    //   sprite.body.velocity.y = -4000;
    //   sprite.body.acceleration.y += -3000;
    // } else if(cursors.up.isDown && inAir == true) {
    //   //otherwise it just uses the jetpack
    //   sprite.body.acceleration.y += -250;
    //   sprite.body.velocity.y = -200;
    //   this.rocketOverlaySprite.frame = 1;
    // } else if (cursors.down.isDown) {
    //   // Move down
    //   sprite.body.acceleration.y +=300;
    // } else {
    //   sprite.body.velocity.y = 0;
    //   this.rocketOverlaySprite.frame = 0;
    //   if (sprite.body.acceleration.y < 0) {
    //     sprite.body.acceleration.y += 250;
    //   }
    // }

    // if(sprite.body.blocked.up) {
    //     sprite.body.acceleration.y = 0;
    // }

    if (space.isDown)  {
      this.fire();
    }
  }

  _debug(txt) {
    if (!this.message) {
      this.message = new Text(
        txt,
        {font: "12px Futura", fill: "white"}
      );
      this.message.x = 50;
      this.message.y = 50;
      this.parent.addChild(this.message);
    } else {
      this.message.text = txt;
    }

  }
}
