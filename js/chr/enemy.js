// Constructor
function Enemy(game, x, y, key, frame, bFrame, type) {
	// Phaser.Sprite(game, x, y, key)
	// game.rnd.integerInRange(min, max) returns rand int between min, max
	let isHuman = false;
	if (key == 'bad') {
		key += game.rnd.integerInRange(0, 6);
		isHuman = true;
	}
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// anchor: Origin of the texture
	// 0.5 = center
	this.anchor.set(0.5);
	// Animation depending on key
	if (key == 'deer') {
		this.animations.add('walk', [0, 1], 2, true);
		this.animations.play('walk');
	}
	if (isHuman) {
		if (type == 'throw') {
			this.animations.add('throw', [5, 6, 7, 8, 9, 0], 15);
		}
		else {
			this.animations.add('walk', [1, 2, 3, 4, 3, 2], 5, true);
			this.animations.play('walk');
		}
	}
	// sfx
	// this.sfx = [];
	// this.sfx[13] = game.add.audio('enemydeath');
	// this.sfx[13].allowMultiple = true;
	// physics crap
	game.physics.p2.enable(this);
	this.body.fixedRotation = true;
	this.game.physics.p2.gravity.y = 300;
	this.body.collideWorldBounds = true;
	this.body.static = true;
	// needs enemy type
	this.type = type;
	this.friction = false;
	if (isHuman){
		this.body.clearShapes();
		this.body.addRectangle(30, 70);
	}

	//enemy bullets
	this.bulletE = game.add.group();
	this.bulletE.enableBody = true;
	this.bulletE.physicsBodyType = Phaser.Physics.P2JS;
	this.bulletE.createMultiple(50, bFrame);
	this.bulletE.forEach(function(bull) {bull.body.clearShapes(), bull.body.addCircle(5);});
	this.bulletE.checkWorldBounds = false;
	this.bulletE.outOfBoundsKill = true;

	// Timer events for groups
	timer = game.time.create(false);
	timer.loop(game.rnd.integerInRange(700,1300), this.fire, this);
	game.timer.loop(500, function() {
		this.bulletE.forEachAlive(function(bull) {
			bull.alpha -= 0.05;
			if (bull.alpha <= 0)
				bull.alive = false;
		}, this.bullets);
	}, this);
	timer.start();

	// Collision
	this.body.createBodyCallback(player, this.collideBody, this);
	this.bulletE.forEach(function(bull) {bull.body.createBodyCallback(player, function(){if(!player.isInvincible) this.pooModifier();}, this);}, this);

	// devMode settings
	this.body.debug = devMode;
}

// explicitly define prefab's prototype (Phaser.Sprite) and constructor
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// override Phaser.Sprite update
Enemy.prototype.update = function() {
	if (this.body.velocity.x != 0) {
		if (this.type == null)
			this.animations.play('walk');
		if (this.body.velocity.x < 0 && this.scale.x < 0)
			this.scale.x = 1;
		if (this.body.velocity.x > 0 && this.scale.x > 0)
			this.scale.x = -1;
	}
	/*
	if(this.body.velocity.x > 0){
		this.scale.setTo(-0.1, 0.1);
	}
	if(this.body.velocity.x < 0){
		this.scale.setTo(0.1, 0.1);
	}
	*/
	if(this.type == 'kamikaze_turkey'){
		this.boom();
	}
	if(this.type == 'deer'){
		this.charge();
	}
	if(this.type == 'hooman'){
		this.run();
	}

	if(this.friction == true){
		if (this.body.velocity.x > 0) {
			this.body.velocity.x -= 300;
			if (this.body.velocity.x < 0)
				this.body.velocity.x = 0;
		}
		else if (this.body.velocity.x > 0) {
			this.body.velocity.x += 300;
			if (this.body.velocity.x > 0)
				this.body.velocity.x = 0;
		}
	}else{}
}

Enemy.prototype.collideBody = function() {
	if (!player.isInvincible) {
	SFX[2].play();
	this.pooModifier();
	}
}

Enemy.prototype.pooModifier = function() {
		player.pooCount -= 1;
		if (devMode) console.log(player.pooCount);
		player.death();
		player.hit();
}

Enemy.prototype.fire = function() {
	if (this.alive){
		let star = this.bulletE.getFirstDead(false);
		star.alpha = 1;
		
		if(star){
			if(this.body.x > player.x){
				if(this.body.x < player.x + game.rnd.integerInRange(250,400)){
					star.reset(this.x + 10, this.y - 10);
					star.alpha = 1;
					star.body.velocity.x = game.rnd.integerInRange(-200, -100);
					star.body.velocity.y = game.rnd.integerInRange(-250, -100);	
					SFX[5].play();
				}
			}
			else {
				if(this.body.x > player.x - game.rnd.integerInRange(250, 400)){
					star.reset(this.x - 10, this.y - 10);
					star.body.velocity.x = game.rnd.integerInRange(100, 200);
					star.body.velocity.y = game.rnd.integerInRange(-250, -100);	
					SFX[5].play();			
				}
			}
		}
		if (player.x < this.x)
			this.scale.x = -1;
		else
			this.scale.x = 1;
		this.animations.play('throw');
	}
}

Enemy.prototype.death = function(player, bullet) {
	//SFX[13].play(); not playing? or too soft?
	// game.camera.shake(0.005, 400);
	// this.kill();
	bullet.kill();
	this.destroy();
}

Enemy.prototype.chasePlayer = function() {
	// When player is left
	if (player.body.x < this.body.x) {
		this.velocity.x = -50;
	}
	else if (player.body.x > this.body.x) {
		this.velocity.x = 50;
	}
}

Enemy.prototype.turkey = function(){
	let turk = game.add.audio('turkey', 0.1);
	turk.allowMultiple = false;
	turk.play();
}

Enemy.prototype.boom = function(){
	this.body.data.gravityScale = 0;
	this.body.velocity.x = -25;

	if(Math.abs(this.x - player.x) < 100){
		this.body.velocity.y = 1000;
		if(Math.abs(this.x - player.x) < 100 && Math.abs(player.y - this.y) > 75){
			this.body.velocity.y += 70;
		}
	}
}

Enemy.prototype.charge = function() {
	if(player.body.x > this.body.x){
		this.body.velocity.x = 200;
	}
	else{
		this.body.velocity.x = -200;
	}
}

Enemy.prototype.run = function(){
	if(this.body.x < 500){
		this.body.velocity.x = 200;	
	}
	else{
		this.body.velocity.x = -200;
	}
}
