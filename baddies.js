
// var bullets = [];

var PIGGY_FIRE_RATE = 2000;

class Piggy {
  constructor(parent, x, y) { // parent: parent container
    // create a new sprite at center
    this.sprite = new Sprite(TextureCache['assets/piggy.png']);
    this.sprite.anchor.set(.5, .5);
    this.sprite.scale.x = -1;

    parent.addChild(this.sprite);
    this.sprite.vx = -1.5;
    this.sprite.vy = 0;

    this.sprite.x = x;
    this.sprite.y = y;

    this.parent = parent;

    this._nextFireTime = new Date().getTime() + PIGGY_FIRE_RATE + randomInt(100, 1000);
  };

  /** Fire a bullet */
  fire() {
    var bulletSprite = new Sprite(TextureCache['assets/egg.png']);
    var multiplier = 1;
    if (this.sprite.scale.x !== 1) { // if scale.x is not 1, then he's facing left
      multiplier = -1;
    }
    bulletSprite.x = this.sprite.x + (multiplier * 120);
    bulletSprite.y = this.sprite.y - 20;
    bulletSprite.vx = multiplier * 6;
    this.parent.addChild(bulletSprite);

    // add the sprite to global bullets array so it can be collided
    piggyBullets.push(bulletSprite);
  }

  kill() {
      
      var heart = new Sprite(TextureCache['assets/heart.png']);
	  var cheese = new Sprite(TextureCache['assets/cheese.png']);
	  heart.x = this.sprite.x;
	  heart.y = this.sprite.y;
      heart.vx = -5;
	  cheese.x = this.sprite.x;
	  cheese.y = this.sprite.y;
	  cheese.vx = -3;
	  this.sprite.destroy();
      
	  
	  this.parent.addChild(cheese);
	  currency.push(cheese);
      //rolls a random number between 0 and 100. if the number is over 70, a heart spawns on piggy death
      var heartSpawner = randomInt(0, 100);
      if (heartSpawner > 70){
          this.parent.addChild(heart);
          hearts.push(heart);
          
      }
	  
      console.log(heartSpawner);
  }

  update() {
    this.sprite.x += this.sprite.vx;
    this.sprite.y += this.sprite.vy;
    
    

    // var collideDirection = contain(this.sprite, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    // if (collideDirection === 'left' || collideDirection === 'right') {
    //   this.sprite.vx *= -1;
    // }

    var now = new Date();

    if (now > this._nextFireTime)  {
      this.fire();
      this._nextFireTime = now.getTime() + PIGGY_FIRE_RATE + randomInt(300, 1000);
    }
  }
}
