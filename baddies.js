class Baddie {
  constructor() {

     // made a bad boy
    // var respawnReady = true;
    this._spawnTimer = 0;
    // this.maxBaddies = 20;
     //var spawnCounter = 0;
    this.baddies = game.add.group();
    this.baddies.enableBody = true;


    this.physicsBodyType = Phaser.Physics.ARCADE;

    //bad boy bullets
    this.baddieBullets = game.add.group();
    this.baddieBullets.enableBody = true;
    this.baddieBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.baddieBullets.createMultiple (5, 'bullet');
    this.baddieBullets.setAll('outOfBoundsKill', true);
    this.baddieBullets.setAll('checkWorldBounds', true);

    for (var i = 0; i < 5; i++)  {
      this.baddie = this.baddies.create(game.world.centerX + 500, i * Math.floor((Math.random() * 850) + 1), 'baddie');
      this.baddie.body.velocity.x = -50;
      //this.spawnCounter++;
      //console.log(this.spawnCounter);
      this.baddie.scale.x = -1;
    }
  }

  /** Underscore notates that this is only really meant to be used in this class */
  _spawnEnemies() {
    this.baddie = this.baddies.create(game.world.centerX + 500, Math.floor((Math.random() * 850) + 1), 'baddie');
    this.baddie.body.velocity.x = -50;
    this.baddie.scale.x = -1;
  }

  update() {
    if (game.time.now > fireRate) {
      //bulletTime = game.time.now + fireRate;
      this.baddieFire();

    }

    if (game.time.now > this._spawnTimer && killCount < 10) {
      this._spawnEnemies();
      this._spawnTimer = game.time.now + 3000;
    }
  }

  baddieFire() {
    this.baddieBullet = this.baddieBullets.getFirstExists(false);

    livingBaddies.length=0;

    this.baddies.forEachAlive(function(baddies){
      livingBaddies.push(baddies);
    });

    if (game.time.now > enemyBulletTime) {
      enemyBulletTime = game.time.now + enemyFireRate;
    }

    if (this.baddieBullet && livingBaddies.length > 0) {
      var random = game.rnd.integerInRange(0, livingBaddies.length-1);
      //randomly select a baddie
      var shooter = livingBaddies[random];
      //and fire a bullet from said baddie
      this.baddieBullet.reset(shooter.body.x, shooter.body.y, -150);
      //this.baddieBullet.velocity.x - 50;
      game.physics.arcade.moveToXY(this.baddieBullet, 0, shooter.body.y, 250);
      //game.physics.arcade.moveToObject(this.baddieBullet, 0, 120);
      enemyFireRate = game.time.now + 2000;
    }
  } //end baddieFire function
}
