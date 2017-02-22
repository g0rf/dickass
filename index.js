/*to do

-get mike to make some friggin assets (rat, levels, enemies, jetpack)

/// ==-game over screen ----////
////=====-enemy reload timers-=====////
-pause button
-level 1 design
-p2 physics for better collisions and gravity

-new music
-boss 1
-second enemies
-different bullets
-score system
-item drops (coins, ammo, different guns, etc.)
-enemy health/bullet damage (can work on this with boss)
-mute button
======/////=-mouse select sfw/nsfw===/////

*/


//global variables
var cursors;

var sounds = {
	music: new Audio("assets/sounds/soulbossanova.mp3"),
	jumpsound: new Audio("assets/sounds/badpoosy.mp3")
};

var sfw = false;

var bulletTime = 0;
var fireRate = 0;
var enemyFireRate = 0;
var enemyBulletTime = 0;

var livingBaddies = [];

var playerLives = 3;

//idk if these are even being used lol
var totalEnemies = 0; 
var enemiesAlive = 0; 

var game = new Phaser.Game(1000, 800, Phaser.AUTO, 'content', null);

game.state.add('titleState', titleState, false);
game.state.start('titleState');

function startGame() {
	game.state.add('mainState', mainState, false);
	game.state.start('mainState');
	sounds.music.volume = .75;
	//sounds.music.play();
	sounds.jumpsound.volume = 0.5
}

function killBaddie(bullets, baddie) {
    baddie.kill();
    bullets.kill();
}

function killDickass(dickass, baddie) {
    dickass.kill();
    baddie.kill();
    gameOverScreen();
}

function dickassShot(dickass, baddieBullets) {
    console.log('shot');

    baddieBullets.kill();
	console.log(playerLives);
	playerLives -= 1;
	
	
	if (playerLives <= 0) {
		console.log('dead');
		dickass.kill();
	 	gameOverScreen();
	}
}

function gameOverScreen() {
	//sounds.music.pause();
	game.state.add('gameOverState', gameOverState, false);
	game.state.start('gameOverState');
	
	

}
