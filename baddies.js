function Baddie(game) {
 	//made a bad boy
	//var respawnReady = true;
	var spawnTimer = 0;
//	this.maxBaddies = 20;
	//var spawnCounter = 0;
	
    

	
	var self = this;
	this.baddies = game.add.group(); 
	self.baddies.enableBody = true; 

    
    
	for (var i = 0; i < 5; i++)  {		
			this.baddie = this.baddies.create(game.world.centerX + 500, i * Math.floor((Math.random() * 850) + 1), 'baddie');
			this.baddie.body.velocity.x = -50; 
			//self.spawnCounter++;
			//console.log(this.spawnCounter);
            self.baddie.scale.x = -1;
		}
	
	function spawnEnemies() {
		self.baddie = self.baddies.create(game.world.centerX + 500, Math.floor((Math.random() * 850) + 1), 'baddie');
		self.baddie.body.velocity.x = -50;
        self.baddie.scale.x = -1;
		
	}
	
	this.physicsBodyType = Phaser.Physics.ARCADE; 
	
	//bad boy bullets
	this.baddieBullets = game.add.group();
	this.baddieBullets.enableBody = true;
	this.baddieBullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.baddieBullets.createMultiple (5, 'john');
	this.baddieBullets.setAll('outOfBoundsKill', true);
	this.baddieBullets.setAll('checkWorldBounds', true);
	
	/*not sure thy this is written like:
	>>  this.update = function() {...} <<  rather than >> this.update: function() {...} <<
	possibly bc it isn't a state?*/
		 
	this.update = function () {
		if (game.time.now > fireRate) {
			//bulletTime = game.time.now + fireRate;
			this.baddieFire();	
			
		}

		if (game.time.now > spawnTimer) {
			spawnEnemies();
			spawnTimer = game.time.now + 3000;
		}
		
//		if(this.spawnCounter < this.maxBaddies) {
//			baddies.create();
//		}
	};
	
	this.baddieFire = function() {
		
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
	}; //end baddieFire function
	
	
}
	
