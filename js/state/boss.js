var play = function() {
	// Global state variables
	this.bullets, this.enemy;
	this.platform; this.en3;
	this.heller = null;
	this.ui;
}

play.prototype = {
	preload: function() {
		
	},
	create: function() {
		// Asset implementaion
		game.world.setBounds( 0, 0, 1000, 1200);
		console.log("play state to check implementation");
		
		var background = game.add.sprite(0, 0, 'porter');
		//background.scale.setTo(5,2);
		background.width = game.world.width;
		background.height = 800;

		//ground
		this.platform = game.add.group();
		this.platform.enableBody = true;
		let ground = this.platform.create(0, game.world.height -32, 'platform');
		ground.scale.setTo(2,1);
		ground.body.immovable = true;

		// the background wrap
		// var wrapGround = game.add.sprite(0, game.world.height - 300, 'heller');
		// wrapGround.scale.setTo(2,0.8);
		// wrapGround.width = game.width;
		this.heller = this.add.tileSprite(0, game.world.height - 500, game.world.width, game.height/2, 'heller');

		game.physics.startSystem(Phaser.Physics.ARCADE);

		// player
		player = new Player(game, 'player', null, 'poo');
		game.add.existing(player);

		//camera
		game.camera.follow(player);


		// enemy
		this.enemy = game.add.group();
		this.enemy.enableBody = true;
		let en = new Enemy(game, 'enemy', null, this.platform);
		game.add.existing(en);
		this.enemy.add(en);

		//test for 2nd enemy on screen
		let en2 = new Enemy(game, 'enemy', null);
		game.add.existing(en2);
		this.enemy.add(en2);

		//test for flying enemy
		this.en3 = new Enemy(game, 'enemy');
		game.add.existing(this.en3);
		this.en3.body.reset(30,400);

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(200, 'star');
		//bullets.setAll('checkWorldBounds', true);
		//bullets.callAll('events.onOutOfBounds.add', 'events.outOfBounds', resetstar);
		this.bullets.checkWorldBounds = true;
		this.bullets.outOfBoundsKill = true;
		//bullets.gravity = 300;

		//pooCount = 100;

		// Set camera to platformer follow up
		// lerp set for smooth camera movement
		// game.camera.follow('player', FOLLOW_PLATFORMER, 0.25, 0.25);

		// Fix UI to the camera
		this.ui = this.pooMeter(player.pooCount);
		this.ui.fixedToCamera = true;
	},
	pooMeter: function(pooNum) {
		let obj = null;

		// create primitive
		let g = game.add.graphics();
		g.beginFill(0x00FF00);
		g.drawRect(32, 32, pooNum * 10, 32);	// Starting point, width, height
		g.endFill();

		// transform primitive into sprite and destroy primitive
		obj = game.add.sprite(32, 32, g.generateTexture());
		//obj.anchor.set(0.5, 0.5);
		g.destroy();

		return obj;
	},
	update: function() {
		// Update function
		// player and enemies collision with platforms
		game.physics.arcade.collide(player, this.platform);
		game.physics.arcade.collide(this.enemy, this.platform, this.movToPl, null, this);

		if(player.body.velocity.x == 0){
			this.heller.tilePosition.x = this.heller.tilePosition.x;
		}else if(player.body.velocity.x > 0){
			this.heller.tilePosition.x -= 4;
		}else{
			this.heller.tilePosition.x += 4;
		}
		
		// enemy movement towards player
		// if(game.physics.arcade.collide(enemy, platform)){
		// 	game.physics.arcade.moveToObject(enemy, player);
		// }
		game.physics.arcade.moveToObject(this.en3, player);

		// UI update
		this.ui.destroy();
		this.ui = this.pooMeter(player.pooCount);

		//shooting
		/*
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			player.fire();
		}*/
	},
	movToPl: function(en, platform) {
		game.physics.arcade.moveToObject(en, player);
	}
	// Char control is implemented in player.js
}