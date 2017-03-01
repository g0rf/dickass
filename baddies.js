var space = keyboard(32),
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
// var bullets = [];

var PIGGY_FIRE_RATE = 800;

class Piggy {
  constructor(parent, x, y) { // parent: parent container
    // create a new sprite at center
    this.sprite = new Sprite(TextureCache['assets/piggy.png']);
    this.sprite.anchor.set(.5, .5);
    this.sprite.scale.x = -1;

    parent.addChild(this.sprite);
    this.sprite.vx = -1;
    this.sprite.vy = 0;

    this.sprite.x = x;
    this.sprite.y = y;

    this.parent = parent;

    this._nextFireTime = new Date().getTime() + PIGGY_FIRE_RATE;
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
    // bulletSprite.vx = 2 * multiplier;
    this.parent.addChild(bulletSprite);

    // add the sprite to global bullets array so it can be collided
    bullets.push(bulletSprite);
  };

  // Update function for Rat
  update() {
    this.sprite.x += this.sprite.vx;
    this.sprite.y += this.sprite.vy;

    var now = new Date();

    if (now > this._nextFireTime)  {
      this.fire();
      this._nextFireTime = now.getTime() + PIGGY_FIRE_RATE;
    }
  }
}
