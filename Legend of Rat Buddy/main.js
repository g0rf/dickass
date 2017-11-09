//bring Phaser to life by creating an instance of a Phaser.Game object and assigning it to a local variable called 'game'. Calling it 'game' is a common practice, but not a requirement, and this is what you will find in the Phaser examples.
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
//Phaser.AUTO will try and use WebGL, but if that isn't available it will default to Canvas
//The fourth parameter is an empty string, this is the id of the DOM element in which you would like to insert the canvas element that Phaser creates. As we've left it blank it will simply be appended to the body. The final parameter is an object containing four references to Phasers essential functions. Note that this object isn't required - Phaser supports a full State system allowing you to break your code into much cleaner single objects. But for a simple Getting Started guide such as this we'll use this approach as it allows for faster prototyping.


function preload() {
    //game.load.image('staticRat', 'assets/rat.png', 96, 92);
    //game.load.spritesheet('rat', 'assets/ratSpritesheet.png', 96, 92);
    
    game.time.advancedTiming = true; //this is needed to show fps debug
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/ratSpriteSheet.png', 96, 92);
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('hobgoblin', 'assets/baddie.png', 32, 31);
    
}

var platforms;
var collectibles;
var goblins;
var sword;
var playerHealth = 5;
var invul = false;
//var attackTimer;


function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors2 = game.input.keyboard.addKeys({'space': Phaser.Keyboard.SPACEBAR});
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    var sky = game.add.sprite(0, 0, 'sky');
    sky.scale.setTo(4,4);
    
    //platform group contains the gorund and 2 ledges we can jump on
    platforms = game.add.group();
    collectibles = game.add.group();
    goblins = game.add.group();
    attacks = game.add.group();
    //enable physcics for this group
    platforms.enableBody = true;
    collectibles.enableBody = true;
    goblins.enableBody = true;
    attacks.enableBody = true;
    var ground = platforms.create(0, game.world.height * 3 - 64, 'ground');
    ground.scale.setTo(4, 4);
    ground.body.immovable = true;
   
    
    var ceiling = platforms.create(0, 0, 'ground');
    ceiling.scale.setTo(2,1);
    ceiling.body.immovable = true;  
   
    var diamond = collectibles.create(200, 200, 'diamond');
    diamond.body.immovable = true;
    
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    
    ledge = platforms.create(0, game.world.height, 'ground');
    ledge.body.immovable = true;
    
    ledge = platforms.create(252, game.world.height * 1.4, 'ground');
    ledge.body.immovable = true;
    
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    
    
    for (var i = 0; i < 2; i++) {
        var hobgoblin = goblins.create(game.rnd.between (200, 400), game.world.height-50, 'hobgoblin', game.rnd.between(0,3));
        hobgoblin.name = 'hobgoblin' + i;
        hobgoblin.body.immovable = true;
    }
    
    for (var i = 0; i < 10; i++) {
        var sword = attacks.create(0, 0, 'star');
        sword.name = 'star' + i;
        sword.exists = false;
        sword.visible = false;
    }
    
    

    //hobgoblin.scale.setTo(2,2);
    
    //var platforms.body.immovable = true;
    //THIS DOESN'T WORK. WHY?
    
    
    hobgoblin.physicsBodyType = Phaser.Physics.ARCADE;
    attacks.physicsBodyType = Phaser.Physics.ARCADE;
    
   
    
    
    player = game.add.sprite(32, game.world.height - 200, 'dude');
    game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    player.scale.setTo(.75, .75);
    player.anchor.setTo(0.5, 0.5);
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
   
    game.world.setBounds(0, 0, 1600, 1800);
    player.body.collideWorldBounds = true;
    //defines which frames are being used and the fps
    player.animations.add('thrust', [1, 2, 3], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    game.camera.follow(player);
    nextAttack = game.time.now + 500;
    invulTimer = game.time.now;
}

function update() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    var hitCollectible = game.physics.arcade.collide(player, collectibles, pickUp);
    var hitEnemy = game.physics.arcade.collide(player, goblins, enemyCollision);
    var attackEnemy = game.physics.arcade.overlap(sword, goblins, hurtEnemy, null, this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    
    var playerSpeed = 200;
    //player.body.velocity.y = 0;

    
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = playerSpeed * -1;
        //console.log("left pressed");
        //player.animations.play('thrust');
        player.scale.x = -.75;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = playerSpeed;
        //console.log("right pressed");
        player.scale.x = .75;
        //player.animations.play('thrust');
    }
    
    if(cursors.up.isDown) {
        player.animations.play('thrust');
        player.body.velocity.y += -10;
        
        //console.log("up pressed");
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 0;
    }
    
    if(cursors.down.isDown) {
        //console.log("down pressed");
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -150;
    }
    
    if(cursors2.space.isDown) {
        //console.log("space pressed");
        attack();   
    }
   
    
    if(invulTimer < game.time.now) {
        invul = false;
    } else {
        console.log("god mode");
    }
    
    
    
}

function attack() {
    //console.log("attack");
    if(nextAttack > game.time.now){
        console.log("attack not ready");
    }
    else {
        
        sword = attacks.getFirstExists(false);
        
        if(player.scale.x > 0){
            if (sword) {
                sword.reset(player.x + 6, player.y - 8);
                sword.body.velocity.x = 350;
                nextAttack = game.time.now + 400;
                sword.body.velocity.y = -25;
                game.time.events.add(300, destroy, sword);
            }
        }
        if(player.scale.x < 0){
            if(sword) {
                sword.reset(player.x - 6, player.y - 8);
                sword.body.velocity.x = -350;
                sword.body.velocity.y = -25;
                nextAttack = game.time.now + 400;
                game.time.events.add(300, destroy, sword);
            }
            
//            melee = game.add.sprite(player.x - 50, player.y - 10, 'star');
//            game.time.events.add(200, melee.destroy, this.melee);
//            nextAttack = game.time.now + 300;
        }
       
    }
    
}

function pickUp(player, item) {
    item.kill();
    var text= game.add.text(player.x, player.y, "u win", {font:"65px Arial", fill:"#ff044", align:"center"});
}

function enemyCollision(player, hobgoblin) {
    if(invul === false) {
        playerHealth = playerHealth - 1;
        invul = true;
        invulTimer = game.time.now + 500;
        console.log(playerHealth);
    }
}

function hurtEnemy(sword, hobgoblin) {
    console.log("hurt enemy");
    sword.kill();
    hobgoblin.kill();
}

function destroy() {
    sword.kill();
}

function render() {
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}