var play = function() {
	// Global state variables
	this.bullets, this.enemy;
	this.platform; this.en3;
	this.obstacle;
	this.heller = null;
	this.ui, this.music;
	this.toil; this.toiletCount;

	this.collidePlayer, this.collideEmeny, this.collidePlat;
	this.collidePB, this.collideEB;
}

play.prototype = {
	preload: function() {
		
	},
	create: function() {
		if (!this.music || this.music.isPlaying === false) {
			this.music = game.add.audio('stage1bgm', 0.5, true);
			this.music.play();
		}
		// Setting up game world
		game.world.setBounds(0, 0, 8000, 800);
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.setImpactEvents(true);
		
		// Asset implementaion
		var background = game.add.sprite(0, 0, 'porter');
		game.add.tileSprite(1800, 0, 7000, 800, 'heller');
		var background2 = game.add.sprite(7000, 0, 'nerdhill');

		// Setting up collision groups
		this.collidePlayer = game.physics.p2.createCollisionGroup();
		this.collideEnemy = game.physics.p2.createCollisionGroup();
		this.collidePlat = game.physics.p2.createCollisionGroup();
		this.collidePB = game.physics.p2.createCollisionGroup();
		this.collideEB = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup([this.collidePlayer, this.collideEnemy, this.collidePlat, 
			this.collidePB, this.collideEB]);

		//ground
		this.platform = game.add.group();
		this.platform.physicsBodyType = Phaser.Physics.P2JS;
		this.platform.enableBody = true;

		let ground = this.platform.create(4000, game.world.height, 'platform');
		ground.scale.setTo(game.world.width, 1 );
		ground.body.clearShapes();
		ground.body.addRectangle(10000, 25);
		ground.body.kinematic = true;
		ground.body.debug = true;
		ground.body.setCollisionGroup(this.collidePlat);
		
		//platforms in order, left to right
		
		let platforms = this.platform.create(800, 682, 'bus');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.addRectangle(394, 176);

		platforms = this.platform.create(1240, 722, 'rcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(1940, 682, 'wcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = 30;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		//double verticle bus
		platforms = this.platform.create(2250, 512, 'busObs');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.loadPolygon('physicsbox', 'busObs');

		platforms = this.platform.create(2580, 702, 'ycar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = -20;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(3260, 712, 'rcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = 12;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(3520, 622, 'bus');
		platforms.body.kinematic = true;
		platforms.body.clearShapes();
		platforms.body.addRectangle(394, 176);
		platforms.body.debug = true;
		platforms.body.angle = 16;
		platforms.angle = 180;

		//stack of car and bus
		platforms = this.platform.create(4600, 537, 'carObs');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.loadPolygon('physicsbox', 'carObs');

		//more cars and buses
		platforms = this.platform.create(5440, 728, 'wcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = 180;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(5990, 713, 'rcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = 15;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(6240, 722, 'ycar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = -10;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(6740, 722, 'wcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = 5;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		platforms = this.platform.create(7340, 668, 'rcar');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.angle = 90;
		platforms.body.loadPolygon('physicsbox', 'yellowCar');

		//double verticle bus
		platforms = this.platform.create(7600, 512, 'busObs');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.loadPolygon('physicsbox', 'busObs');

		//crashed cars and bus in buildings
		platforms = this.platform.create(1450, 320, 'wreckC');
		platforms.body.kinematic = true;
		platforms.body.debug = true;
		platforms.body.clearShapes();
		platforms.body.loadPolygon('physicsbox', 'wreckedcar');


		platforms = this.platform.create(6730, 400, 'wreckB');
		platforms.body.kinematic = true;
		platforms.body.clearShapes();
		platforms.body.addRectangle(160, 276);
		platforms.body.angle = 80;
		platforms.body.debug = true;

		this.platform.forEach(function(plat) {
			plat.body.setCollisionGroup(this.collidePlat);
			plat.body.collides([this.collidePlayer, this.collideEnemy, this.collidePB, this.collideEB]);
		}, this);

		//toilets, player must collide with all before moving on
		this.toil = game.add.group();
		this.toil.physicsBodyType = Phaser.Physics.P2JS;
		this.toil.enableBody = true;

		let toilets = new Toilet(game, 815, 559, 'toilet');
		game.add.existing(toilets);
		this.toil.add(toilets);
		toilets.body.kinematic = true;
		toilets.body.debug = true;

		toilets = new Toilet(game, 1472, 224, 'toilet');
		game.add.existing(toilets);
		this.toil.add(toilets);
		toilets.body.kinematic = true;
		toilets.body.debug = true;

		toilets = new Toilet(game, 3087, 756, 'toilet');
		game.add.existing(toilets);
		this.toil.add(toilets);
		toilets.body.kinematic = true;
		toilets.body.debug = true;

		toilets = new Toilet(game, 6129, 680, 'toilet');
		game.add.existing(toilets);
		this.toil.add(toilets);
		toilets.body.kinematic = true;
		toilets.body.debug = true;

		toilets = new Toilet(game, 6767, 275, 'toilet');
		game.add.existing(toilets);
		this.toil.add(toilets);
		toilets.body.kinematic = true;
		toilets.body.angle = -10;
		toilets.body.debug = true;

		// player
		player = new P2layer(game, 'player', null, 'poo');
		game.add.existing(player);
		player.body.setCollisionGroup(this.collidePlayer);
		player.body.collides([this.collidePlat, this.collideEnemy, this.collideEB]);
		player.bullets.forEach(function(bull) {
			bull.body.setCollisionGroup(this.collidePB);
			bull.body.collides([this.collidePlat, this.collideEnemy]);
			bull.body.createGroupCallback(this.collidePlat, function(bull, plat){
				if (bull.velocity != 0)
					player.groundSplat(bull.x, bull.y);
			});
		}, this);

		// enemy
		this.enemy = game.add.group();
		this.enemy.enableBody = true;
		this.enemy.physicsBodyType = Phaser.Physics.P2JS;
		
		//hardcoding enemy placement from left to right
		let en = new Enemy(game, 696, 540, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;
		
		en = new Enemy(game, 960, 540, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 1273, 615, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 1467, 214, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 1450, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 1864, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 2111, 223, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 2373, 205, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 2717, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 3263, 608, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 4308, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 4472, 270, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 4775, 264, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 4944, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 5600, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 5278, 746, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);

		en = new Enemy(game, 6290, 605, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 6678, 267, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 6841, 267, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 7354, 498, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 7492, 221, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 7598, 214, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;

		en = new Enemy(game, 7743, 205, 'deer', null, 'pepto');
		game.add.existing(en);
		this.enemy.add(en);
		en.body.setCollisionGroup(this.collideEnemy);
		en.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
		en.body.createGroupCallback(this.collidePB, function(en, bull) {
		en.sprite.kill();
		bull.sprite.kill();
		}, en);
		en.bulletE.forEach(function(bull) {
		bull.body.setCollisionGroup(this.collideEB);
		bull.body.collides([this.collidePlayer, this.collidePlat], function() {bull.kill();},this);
		}, this);
		en.body.immovable = true;
		//test for 2nd enemy on screen
		// en = new Enemy(game, 30, 1000, 'enemy');
		// game.add.existing(en);
		// this.enemy.add(en);

		//test for flying enemy
		for(var i = 0; i < 7; ++i){
			enfl = new Enemy(game, game.rnd.integerInRange(100,600),
			 100, 'enemy', null, null, 'kamikaze_turkey');
			game.add.existing(enfl);
			this.enemy.add(enfl);
			enfl.body.setCollisionGroup(this.collideEnemy);
			enfl.body.collides([this.collidePlat, this.collidePlayer, this.collidePB]);
			enfl.body.createGroupCallback(this.collidePlat, function() {this.kill();}, enfl);
		}

		//sign for end of level
		game.add.sprite(7000, 500, 'sign');
		//sign.body.immovable = true;
		//sign.scale.setTo(1,1);
		// Need to fix sign in the air (no collision) <- can we just make it as a part of bg?

		// Set camera to platformer follow up
		// lerp set for smooth camera movement
		game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.25, 0.25);

		// Fix UI to the camera
		pooMeter(MAXPOO, 0x000000);
		this.ui = pooMeter(player.pooCount, 0x492008);
		let t_ui = game.add.sprite(game.width - 128, 8, 'toilet');
		t_ui.scale.setTo(0.75);
		t_ui.fixedToCamera = true;
		t_ui.cameraOffset.setTo(game.width - 128, 8);
		let style = {
			font: 'Press Start 2P',
			fill: '#fff',
			fontSize: 32,
			strokeThickness: 5
		};
		this.toiletCounter = game.add.text(game.width - 78, 16, this.toil.total, style);
		this.toiletCounter.fixedToCamera = true;
		this.toiletCounter.cameraOffset.setTo(game.width - 78, 16);
		
	},
	update: function() {
		// Update function
		
		// enemy movement towards player
		// if(game.physics.arcade.collide(enemy, platform)){
		// 	game.physics.arcade.moveToObject(enemy, player);
		// }
		//game.physics.arcade.moveToObject(this.en3, player);

		// UI update
		if (this.ui)
			this.ui.destroy();
		this.ui = pooMeter(player.pooCount, 0x492008);
		this.toiletCounter.text = this.toil.total;
		
		//for end of level
		if(player.x +50 > game.world.width){
			game.state.start('play2');
			this.music.stop();
		}

	},
	movToPl: function(en, platform) {
		game.physics.arcade.moveToObject(en, player);
	}
	// Char control is implemented in player.js
}