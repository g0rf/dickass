function Boss(game) {
	
	var bossHealth = 5;
	
	this.boss = game.add.sprite();
	this.boss.enableBody = true;
		
	this.physicsBodyType = Phaser.Physics.ARCADE;
	
	this.bossBullets = game.add.group();
	this.bossBullets.enableBody = true;
	this.bossBullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.bossBullets.createMultiple (5, 'bullet');
	this.bossBullets.setAll('outOfBoundsKill', true);
	this.bossBullets.setAll('checkWorldBounds', true);
	
	
	this.bossFire = function() {

	    if (game.time.now > enemyBulletTime) {
            enemyBulletTime = game.time.now + enemyFireRate;
			this.bossBullet = this.bossBullets.getFirstExists(false);
			bossBullet.reset(boss.x, boss.y);
			bossBullet.body.velocity. x = -600;
        }
		
		
	} //end bossFire function
		
	
	this.update = function () {
		
		this.bossFire();
	}
}