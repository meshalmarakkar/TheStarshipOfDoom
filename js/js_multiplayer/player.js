var TheGame = TheGame || {};

TheGame.Player = function(game, playerNo, initialX, initialY, ifSpeedPickup, ifSpreadPickup, ifShieldPickup) {


  /**
  * @name TheGame.Avatar#name
  * @property {string} name - the name associated with this avatar. Matches the text above head
  * @default
  */  
	this.initialX = initialX || 400;

	this.initialY = initialY || 500;
	
	shieldSizeX = 0.2;
	shieldSizeY = 0.2;
		
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

  /**
  * @name PhaserMMORPG.Avatar#mainSprite
  * @property {Phaser.Sprite} mainSprite - the name that will be visible above 
  */  
  	this.playerSprite = game.add.sprite(initialX, initialY, upgrageLV_name);
	this.playerSprite.scale.setTo(0.5,0.5);
	this.playerSprite.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.playerSprite, Phaser.Physics.ARCADE);
	
	this.attributes = new TheGame.Attributes(game, 400, 500, 150, 400);
	this.attributes.setIfSpeed(ifSpeedPickup); //if u die u dont reviive shield
	this.attributes.setIfSpreadShot(ifSpreadPickup); //if u die u dont reviive shield
	this.attributes.setIfShield(ifShieldPickup, this.shieldSizeX, this.shieldSizeY); //if u die u dont reviive shield
	this.updateUpdgrade(ifSpeedPickup, ifSpreadPickup , ifShieldPickup);
	
	this.lives = game.add.group();
	
	if (playerNo == 2){
		game.add.text(game.world.width - 120, 10, 'P2 Lives:', { font: '28px Arial', fill: '#fff' });
	}
	else{
		game.add.text(10, 10, 'P1 Lives:', { font: '28px Arial', fill: '#fff' });
	}
	
	for (var i = 0; i < 3; i++) 
	{
		if (playerNo == 2)
		{
			var p2_ship = this.lives.create(game.world.width - 100 + (30 * i), 60, upgrageLV_name);
			p2_ship.anchor.setTo(0.5, 0.5);
			p2_ship.scale.setTo(0.25,0.25);
			p2_ship.angle = 90;
			p2_ship.alpha = 0.4;
		}
		else
		{
			var p1_ship = this.lives.create(30 + (30 * i), 60, upgrageLV_name);
			p1_ship.anchor.setTo(0.5, 0.5);
			p1_ship.scale.setTo(0.25,0.25);
			p1_ship.angle = 90;
			p1_ship.alpha = 0.4;
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
	

	
	return this;
}

TheGame.Player.prototype.update = function(shootBullet) {
	this.attributes.updateShieldPos(this.playerSprite.x, this.playerSprite.y);
		var keys = {
			x: this.playerSprite.x,
			y: this.playerSprite.y,
			shoot: shootBullet,
		};
	
	TheGame.eurecaServer.handlePlayerKeys(keys);
}

TheGame.Player.prototype.updateUpdgrade = function(inIfSpeed, inIfSpread, inIfShield) {
	 var keys = {
      ifSpeed: inIfSpeed,
      ifSpread: inIfSpread,
	  ifShield: inIfShield,
	};
	
	TheGame.eurecaServer.handlePlayerKeys(keys);
}

TheGame.Player.prototype.updateFromServer = function (x, y, shoot) {
	this.playerSprite.x = x;
	this.playerSprite.y = y;
			
	if (shoot)
	{
		this.fireBullet(TheGame.game.time.now);
	}
}

TheGame.Player.prototype.setXY = function (x, y) {
  this.playerSprite.x = x;
  this.playerSprite.y = y;
}

TheGame.Player.prototype.kill = function () {
  this.playerSprite.kill();
}

TheGame.Player.prototype.stopVelocity = function() {
	this.playerSprite.body.velocity.setTo(0, 0);
}

TheGame.Player.prototype.moveLeft = function() {
	if (!(this.playerSprite.x < 0)){
		this.playerSprite.body.velocity.x = -this.attributes.getSpeed();
	}
}

TheGame.Player.prototype.moveRight = function() {
	if (!(this.playerSprite.x > TheGame.gameWidth)){
		this.playerSprite.body.velocity.x = this.attributes.getSpeed();
	}
}

TheGame.Player.prototype.moveUp = function() {
	if (!(this.playerSprite.y < 0)){
		this.playerSprite.body.velocity.y = -this.attributes.getSpeed();
	}
}

TheGame.Player.prototype.moveDown = function() {
	if (!(this.playerSprite.y > TheGame.gameHeight)){
		this.playerSprite.body.velocity.y = this.attributes.getSpeed();
	}
}

TheGame.Player.prototype.fireBullet = function(currentTime) {
	//  To avoid them being allowed to fire too fast we set a time limit
	if (currentTime > this.bulletTime)
	{
		if (this.attributes.getIfSpreadShot()){
			//  Grab the first bullet we can from the pool
			bullet1 = this.bullets.getFirstExists(false);
			if (bullet1)
			{
				// And fire it
				bullet1.reset(this.playerSprite.x, this.playerSprite.y + 15);
				bullet1.body.velocity.y = -400;
				this.bulletTime = currentTime + 200;
			}
			bullet2 = this.bullets.getFirstExists(false);
			if(bullet2)
			{	
				bullet2.reset(this.playerSprite.x, this.playerSprite.y + 15);
				bullet2.body.velocity.y = -400;
				bullet2.body.velocity.x = -50;
				this.bulletTime = currentTime + 200;
			}
			bullet3 = this.bullets.getFirstExists(false);
			if(bullet3)
			{	
				bullet3.reset(this.playerSprite.x, this.playerSprite.y + 15);
				bullet3.body.velocity.y = -400;
				bullet3.body.velocity.x = 50;
				this.bulletTime = currentTime + 200;
			}
		}
		else {
			//  Grab the first bullet we can from the pool
			bullet = this.bullets.getFirstExists(false);

			if (bullet)
			{
				bullet.reset(this.playerSprite.x, this.playerSprite.y - 5);
				bullet.body.velocity.y = -400;
				this.bulletTime = currentTime + 200;
			}
		}
	}
}

TheGame.Player.prototype.gotHit = function(damageTaken) {
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

TheGame.Player.prototype.resetHealth = function() {
	this.lives.callAll('revive');
	this.playerSprite.revive();
	this.playerSprite.x = this.initialX;
	this.playerSprite.y = this.initialY;
}

TheGame.Player.prototype.getBullets = function() {
	return this.bullets;
}

TheGame.Player.prototype.getSprite = function() {
	return this.playerSprite;
}

TheGame.Player.prototype.getNumOfLives = function() {
	return this.lives.countLiving();
}

TheGame.Player.prototype.getAlive = function() {
	return this.playerSprite.alive;
}

TheGame.Player.prototype.getBulletDamage = function() {
	return this.attributes.getBulletDamage();
}