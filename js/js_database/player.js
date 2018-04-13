var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.Player = function(game, name, playerNo, initialX, initialY, ifSpeedPickup, ifSpreadPickup, ifShieldPickup) {


  /**
  * @name TheStarshipOfDoom.Avatar#name
  * @property {string} name - the name associated with this avatar. Matches the text above head
  * @default
  */  
	this.name = name || 'Player name';

	this.initialX = initialX || 400;

	this.initialY = initialY || 500;
	
	this.shieldSizeX = 0.2;
	this.shieldSizeY = 0.2;
	
	playerNo = playerNo || 1;
	
	upgrageLV_name = 'playerLV1';
	
	if (ifSpeedPickup){
		upgrageLV_name = 'playerLV2';
	}
	if (ifSpreadPickup) {
		upgrageLV_name = 'playerLV3';
	}
	if (ifShieldPickup) {
		upgrageLV_name = 'playerLV4';
	}
	
	this.shoot = game.add.audio('shoot');

  /**
  * @name PhaserMMORPG.Avatar#mainSprite
  * @property {Phaser.Sprite} mainSprite - the name that will be visible above 
  */  
  	this.playerSprite = game.add.sprite(initialX, initialY, upgrageLV_name);
	this.playerSprite.scale.setTo(0.5,0.5);
	this.playerSprite.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.playerSprite, Phaser.Physics.ARCADE);
	
	this.attributes = new TheStarshipOfDoom.Attributes(game, 400, 500, 150, 400);
	this.attributes.setIfSpeed(ifSpeedPickup); //if u die u dont reviive shield
	this.attributes.setIfSpreadShot(ifSpreadPickup); //if u die u dont reviive shield
	this.attributes.setIfShield(ifShieldPickup, this.shieldSizeX, this.shieldSizeY); //if u die u dont reviive shield
	
	this.lives = game.add.group();
	
	if (playerNo == 1){
		game.add.text(game.world.width - 120, 10, 'P2 Lives:', { font: '28px Arial', fill: '#fff' });
	}
	else{
		game.add.text(10, 10, 'P1 Lives:', { font: '28px Arial', fill: '#fff' });
	}
	
	for (var i = 0; i < 3; i++) 
	{
		if (playerNo == 1)
		{
			var p1_ship = this.lives.create(30 + (30 * i), 60, upgrageLV_name);
			p1_ship.scale.setTo(0.3,0.3);
			p1_ship.anchor.setTo(0.5, 0.5);
			p1_ship.angle = 90;
			p1_ship.alpha = 0.8;
		}
		else
		{
			var p2_ship = this.lives.create(game.world.width - 100 + (30 * i), 60, upgrageLV_name);
			p2_ship.scale.setTo(0.3,0.3);
			p2_ship.anchor.setTo(0.5, 0.5);
			p2_ship.angle = 90;
			p2_ship.alpha = 0.8;
		}
	}
	
	this.bullets = game.add.group();
	this.bullets.enableBody = true;
	this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.bullets.createMultiple(30, 'bullet');
	this.bullets.setAll('anchor.x', 0.5);
	this.bullets.setAll('anchor.y', 1);
	this.bullets.setAll('outOfBoundsKill', true);
	this.bullets.setAll('checkWorldBounds', true);
	
	this.bulletTime = 0;
	
	if (playerNo == 1)
	{
		this.Up_Button = game.input.keyboard.addKey(Phaser.KeyCode.W);
		this.Down_Button = game.input.keyboard.addKey(Phaser.KeyCode.S);
		this.Left_Button = game.input.keyboard.addKey(Phaser.KeyCode.A);
		this.Right_Button = game.input.keyboard.addKey(Phaser.KeyCode.D);
		this.Fire_Button = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.FriendlyFire_Button = game.input.keyboard.addKey(Phaser.Keyboard.C);
	}
	else{
		this.Up_Button = game.input.keyboard.addKey(Phaser.KeyCode.I);
		this.Down_Button = game.input.keyboard.addKey(Phaser.KeyCode.K);
		this.Left_Button = game.input.keyboard.addKey(Phaser.KeyCode.J);
		this.Right_Button = game.input.keyboard.addKey(Phaser.KeyCode.L);
		this.Fire_Button = game.input.keyboard.addKey(Phaser.KeyCode.N);
		this.FriendlyFire_Button = game.input.keyboard.addKey(Phaser.Keyboard.H);
	}
	
	return this;
}

TheStarshipOfDoom.Player.prototype.update = function(game, player2X, player2Y) {
	if (this.playerSprite.alive)
	{
		//  Reset the player, then check for movement keys
		this.playerSprite.body.velocity.setTo(0, 0);

		
		if (this.Left_Button.isDown)
		{
			if (!(this.playerSprite.x < 0)){
				this.playerSprite.body.velocity.x = -this.attributes.getSpeed();
			}
		}
		else if (this.Right_Button.isDown)
		{
			if (!(this.playerSprite.x > TheStarshipOfDoom.gameWidth)){
				this.playerSprite.body.velocity.x = this.attributes.getSpeed();
			}
		}
		
		if (this.Up_Button.isDown)
		{
			if (!(this.playerSprite.y < 0)){
				this.playerSprite.body.velocity.y = -this.attributes.getSpeed();
			}
		}
		else if (this.Down_Button.isDown)
		{
			if (!(this.playerSprite.y > TheStarshipOfDoom.gameHeight)){
				this.playerSprite.body.velocity.y = this.attributes.getSpeed();
			}
		}
		
		this.attributes.updateShieldPos(this.playerSprite.body.x, this.playerSprite.body.y);
		
		if (this.Fire_Button.isDown)
		{
			this.fireBullet(game.time.now);
		}
		
		if (TheStarshipOfDoom.playerVsplayer){
			if (this.FriendlyFire_Button.isDown)
			{
				this.friendlyFire(game.time.now, player2X, player2Y);
			}
		}
	}
}

TheStarshipOfDoom.Player.prototype.fireBullet = function(currentTime) {
	//  To avoid them being allowed to fire too fast we set a time limit
	if (currentTime > this.bulletTime)
	{
		this.shoot.play();
		if (this.attributes.getIfSpreadShot()){
			//  Grab the first bullet we can from the pool
			bullet1 = this.bullets.getFirstExists(false);
			if (bullet1)
			{
				// And fire it
				bullet1.reset(this.playerSprite.x, this.playerSprite.y + 15);
				bullet1.body.velocity.y = -400;
				this.bulletTime = currentTime + this.attributes.getRateOfFire();
			}
			bullet2 = this.bullets.getFirstExists(false);
			if(bullet2)
			{	
				bullet2.reset(this.playerSprite.x, this.playerSprite.y + 15);
				bullet2.body.velocity.y = -400;
				bullet2.body.velocity.x = -50;
				this.bulletTime = currentTime + this.attributes.getRateOfFire();
			}
			bullet3 = this.bullets.getFirstExists(false);
			if(bullet3)
			{	
				bullet3.reset(this.playerSprite.x, this.playerSprite.y + 15);
				bullet3.body.velocity.y = -400;
				bullet3.body.velocity.x = 50;
				this.bulletTime = currentTime + this.attributes.getRateOfFire();
			}
		}
		else {
			//  Grab the first bullet we can from the pool
			bullet = this.bullets.getFirstExists(false);

			if (bullet)
			{
				bullet.reset(this.playerSprite.x, this.playerSprite.y - 5);
				bullet.body.velocity.y = -400;
				this.bulletTime = currentTime + this.attributes.getRateOfFire();
			}
		}
	}
}

TheStarshipOfDoom.Player.prototype.friendlyFire = function(currentTime, player2X, player2Y) {
	//  To avoid them being allowed to fire too fast we set a time limit
	if (currentTime > this.bulletTime)
	{
		this.shoot.play();
		//  Grab the first bullet we can from the pool
		bullet = this.bullets.getFirstExists(false);

		if (bullet)
		{
			var target = { x:player2X, y:player2Y};
			bullet.reset(this.playerSprite.x, this.playerSprite.y - 5);
			TheStarshipOfDoom.game.physics.arcade.moveToObject(bullet,target,120);
			this.bulletTime = currentTime + 600;
		}
	}
}

TheStarshipOfDoom.Player.prototype.gotHit = function(damageTaken) {
	if(this.attributes.getIfShield())
	{
		this.attributes.shieldHit(damageTaken);
	}
	else {
		live = this.lives.getFirstAlive();

		if (live)
		{
			live.kill();
		}	
	}
}

TheStarshipOfDoom.Player.prototype.resetHealth = function(ifSpeedPickup, ifSpreadPickup, ifShieldPickup) {
	this.lives.callAll('revive');
	this.playerSprite.revive();
	this.playerSprite.x = this.initialX;
	this.playerSprite.y = this.initialY;
	this.attributes.setIfSpeed(ifSpeedPickup); //if u die u dont reviive shield
	this.attributes.setIfSpreadShot(ifSpreadPickup); //if u die u dont reviive shield
	this.attributes.setIfShield(ifShieldPickup, this.shieldSizeX, this.shieldSizeY); //if u die u dont reviive shield
}

TheStarshipOfDoom.Player.prototype.getBullets = function() {
	return this.bullets;
}

TheStarshipOfDoom.Player.prototype.getSprite = function() {
	return this.playerSprite;
}

TheStarshipOfDoom.Player.prototype.getNumOfLives = function() {
	return this.lives.countLiving();
}

TheStarshipOfDoom.Player.prototype.getAlive = function() {
	return this.playerSprite.alive;
}

TheStarshipOfDoom.Player.prototype.getBulletDamage = function() {
	return this.attributes.getBulletDamage();
}