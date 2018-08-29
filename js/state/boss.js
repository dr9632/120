var boss = function() {
	// Global state variables
	this.bullets, this.enemy, this.boss;
	this.platform;

	this.ui, this.full_width, this.cropRect;
	this.bossHealthUI, this.full_widthBH, this.cropRect_BH;

	this.collidePlayer, this.collidePlat, this.collideEnemy, this.collideBoss;
	this.collidePB, this.collideBB;
}

boss.prototype = {
	preload: function() {
		
	},
	create: function() {
		if (!BGM[2].isPlaying) BGM[2].play();
		
		// Game world setting
		game.world.setBounds(0, 0, 800, 600);
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.setImpactEvents(true);

		// Setting up collision groups
		this.collidePlayer = game.physics.p2.createCollisionGroup();
		this.collidePlat = game.physics.p2.createCollisionGroup();
		this.collidePB = game.physics.p2.createCollisionGroup();
		this.collideBB = game.physics.p2.createCollisionGroup();
		this.collideBoss = game.physics.p2.createCollisionGroup();
		this.collideEnemy = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup([this.collidePlayer, this.collidePlat, this.collideBoss,
			this.collideEnemy, this.collidePB, this.collideBB]);
		
		var background = game.add.sprite(-500, 0, 'bookstore');
		

		// ground
		//this.platform = game.add.group();
		//this.platform.physicsBodyType = Phaser.Physics.P2JS;
		//this.platform.enableBody = true;
		// this.platform.collideWorldBounds = true;

		//let ground = this.platform.create(10, 550, 'sidewalk');
		//ground.body.clearShapes();
		//ground.body.addRectangle(500, 42);
		//ground.body.setCollisionGroup(this.collidePlat);
		//ground.body.collides([this.collidePlayer, this.collideBB, this.collideBoss, this.collidePB]);
		//ground.scale.y = 0.5;	
		//ground.scale.x = 0.5;
		//ground.body.kinematic = true;

		
		// the background wrap
		// var wrapGround = game.add.sprite(0, game.world.height - 300, 'heller');
		// wrapGround.scale.setTo(2,0.8);
		// wrapGround.width = game.width;
		// this.heller = this.add.tileSprite(0, game.world.height - 500, game.world.width, game.height/2, 'heller');
		
		// Player
		let temp_poo = 0;
		if (player) temp_poo = player.pooCount;
		player = new P2layer(game, 100, 100, 'player', null, 'poo');
		if (temp_poo != 0) player.pooCount = temp_poo;	// Rollover from prev stage
		game.add.existing(player);
		player.body.setCollisionGroup(this.collidePlayer);
		player.body.collides([this.collidePlat, this.collideBB, this.collideBoss]);
		player.bullets.forEach(function(bull) {
			bull.body.setCollisionGroup(this.collidePB);
			bull.body.collides([this.collidePlat, this.collideBoss]);
			bull.body.createGroupCallback(this.collidePlat, function(bull, plat){
				if (bull.velocity.x != 0){
					player.groundSplat(bull.x, bull.y);
				}
			});
		}, this);

		//camera
		// game.camera.follow(player);

		//boss
		this.boss = new Boss(game, 410, 500, 'boss', 'eyes', 'lax');
		game.add.existing(this.boss);
		console.log(this.boss);
		this.boss.body.setCollisionGroup(this.collideBoss);
		this.boss.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		this.boss.body.createGroupCallback(this.collidePB, function(boss, bull) {
			console.log(boss);
			boss.health--;
			console.log(boss.health);
			bull.sprite.kill();
		}, this);
		this.boss.bulletB.forEach(function(bull) {
			bull.body.setCollisionGroup(this.collideBB);
			bull.body.collides([this.collidePlayer, this.collidePlat], function(bull) {this.kill();}, bull);
		}, this);
		game.camera.follow(this.boss);
		
		

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.p2;
		//this.bullets.createMultiple(200, 'star');
		//bullets.setAll('checkWorldBounds', true);
		//bullets.callAll('events.onOutOfBounds.add', 'events.outOfBounds', resetstar);
		this.bullets.checkWorldBounds = true;
		this.bullets.outOfBoundsKill = true;
		//bullets.gravity = 300;

		//enemies bullets
		this.bulletE = game.add.group();
		this.bulletE.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.p2;
		this.bullets.createMultiple(200, 'star');
		this.bullets.checkWorldBounds = true;
		this.bullets.outOfBoundsKill = true;

		// Set camera to platformer follow up
		// lerp set for smooth camera movement
		// game.camera.follow('player', FOLLOW_PLATFORMER, 0.25, 0.25);

		// Fix UI to the camera
		this.ui = barUI();
		this.full_width = this.ui.width;
		this.cropRect = new Phaser.Rectangle(0, 0, player.pooCount/MAXPOO * this.ui.width, this.ui.height);
		this.ui.crop(this.cropRect);
	},
	// bossHealth: funtion(bosshp){
	// 	let obje = null;
	// 	//boss health bar
	// 	let b = game.add.graphics();
	// 	b.beginFill(0x492008);
	// 	b.drawRect(32, 32, pooNum * 5, 32);	// Starting point, width, height
	// 	b.endFill();

	// 	obj = game.add.sprite(700, 500, g.generateTexture());
	// 	obj.fixedToCamera = true;
	// 	obj.cameraOffset.setTo(32, 16);
	// 	g.destroy();

	// 	return obje;
	// },
	update: function() {
		// Update function
		// if(this.boss.x > 800){
		// 	bossmouth.body.velocity.x -= 500;
		// 	console.log(bossmouth.body.velocity.x);
		// }
		if(this.boss.health == 6 && this.boss.type == 'eyes'){
			this.changeBoss();
		}
		// UI update
		if (player.pooCount >= 0) {
			this.cropRect.width = player.pooCount/MAXPOO * this.full_width;
			this.ui.updateCrop();
		}
	},

	changeBoss: function(){
		console.log('asfad');
		let boss1 = new Boss(game, boss.x, boss.y, 'boss', 'mouth', 'lax');
		game.add.existing(boss1);
		bossl.health = 100;
		boss1.body.setCollisionGroup(this.collideBoss);
		boss1.body.collides([this.collidePlat, this.collidePlayer]);
		game.camera.follow(boss1);
		this.boss.destroy();
		this.boss = bossl;
	}

	// Char control is implemented in player.js
}