var space = keyboard(32),
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
// var bullets = [];

var FIRE_RATE = 200; // in ms
var GRAVITY = 0.1;
var JETPACK_ACCEL = 0.5;
var JETPACK_MAX = 6; // top speed

class Rat {
  constructor(parent) { // parent: parent container
    // create a new sprite at center
    this.sprite = new Sprite(TextureCache['assets/rat100.png']);
      this.sprite.anchor.set(.5,.5);
    parent.addChild(this.sprite);
    this.sprite.vx = 0;
    this.sprite.vy = 0;

    this.sprite.x = 100;
    this.sprite.y = 100;

    // Add our overlay spritesheet as a child, so it always moves with dickass
    // Frame 0 is empty, so it shows nothing by default

    // Start off facing right. Call it here on creation, to avoid a weird jump thing that happens
    // this.faceRight();

    // this._fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);;
    this.parent = parent;

    this._nextFireTime = new Date();
  }

  faceLeft() {
    this.sprite.scale.x =  -1;
  }
  faceRight() {
    this.sprite.scale.x = 1;
  };

  /** Fire a bullet */
  fire() {
    var now = new Date();
    if (now < this._nextFireTime) { // not ready to fire yet
      return;
    }

    var bulletSprite = new Sprite(TextureCache['assets/bullet.png']);
    var multiplier = 1;
    if (this.sprite.scale.x !== 1) { // if scale.x is not 1, then he's facing left
      multiplier = -1;
    }
    bulletSprite.x = this.sprite.x + (multiplier * 5);
    bulletSprite.y = this.sprite.y - 5;
    bulletSprite.vx = multiplier * 10;
    this.parent.addChild(bulletSprite);

    // add the sprite to global bullets array so it can be collided
    bullets.push(bulletSprite);

    this._nextFireTime = now.getTime() + FIRE_RATE;
  };

  // Update function for Rat
  update() {
    //  Reset the players horiz velocity (movement)
    var sprite = this.sprite;
    sprite.vx = 0;
    sprite.vy += GRAVITY; // accelerate a bit for gravity

    // Movement Stuff
    if (left.isDown) {
      //  Move to the left
      sprite.vx = -5;
      this.faceLeft();

    } else if (right.isDown) {
      //  Move to the right
      sprite.vx = 5;
      this.faceRight();
    }

    if (up.isDown) {
      sprite.vy = Math.max(sprite.vy - JETPACK_ACCEL, -1 * JETPACK_MAX);
    }

    sprite.x += sprite.vx;
    sprite.y += sprite.vy;

    var collideDirection = contain(this.sprite, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    if (collideDirection === 'top' || collideDirection === 'bottom') {
      sprite.vy = 0.1; // reset to gravity
    }

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
