var TheGame = TheGame || {};

TheGame.Enemy = function(levelNo, spriteScaleX, spriteScaleY) {

	this.livingEnemies = [];
	this.healthMap = new Map();
	this.firingTimer = 0;
	
	this.bullets = TheGame.game.add.group();
	this.bullets.enableBody = true;
	this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.bullets.createMultiple(30, 'enemyBullet');
	this.bullets.setAll('anchor.x', 0.5);
	this.bullets.setAll('anchor.y', 1);
	this.bullets.setAll('outOfBoundsKill', true);
	this.bullets.setAll('checkWorldBounds', true);
	
	// An explosion pool
	this.explosions = TheGame.game.add.group();
	this.explosions.createMultiple(30, 'kaboom');
	this.explosions.forEach(this.setupExplosion, this);
	
	this.spriteScaleX = spriteScaleX || 1.0;
	this.spriteScaleY = spriteScaleY || 1.0;
	
	if (levelNo == 2 || levelNo == 4){
		this.spriteScaleX = 1.5;
		this.spriteScaleY = 1.5;
	}
	
	this.aliens = TheGame.game.add.group();
	this.aliens.enableBody = true;
	this.aliens.physicsBodyType = Phaser.Physics.ARCADE;
	this.attributes = new TheGame.Attributes(TheGame.game, 400, 500, 3000, 2000);
		
	this.ifBossLevel = false;
	
	var tween;
	
	if (levelNo % 2 == 0){
		if (levelNo == 2)
			this.attributes.setIfSpeed(true); //if u die u dont reviive shield
		else if (levelNo == 4)
			this.attributes.setIfSpreadShot(true); //if u die u dont reviive shield
		else if (levelNo == 6)
			this.attributes.setIfShield(true, 1.0, 1.0); //if u die u dont reviive shield
		else {
			this.attributes.setIfSpeed(true); //if u die u dont reviive shield
			this.attributes.setIfSpreadShot(true); //if u die u dont reviive shield
			this.attributes.setIfShield(true, 1.5, 1.5); //if u die u dont reviive shield
		}
	
		this.createBoss(levelNo);
		this.ifBossLevel = true;
	}
	else {
		this.createAliens(levelNo);
	}
	
	return this;
}

TheGame.Enemy.prototype.setupExplosion = function(explosion) {
	explosion.anchor.x = 0.5;
	explosion.anchor.y = 0.5;
	explosion.animations.add('kaboom');
}

TheGame.Enemy.prototype.createBoss = function(levelNo){
	var name = 'Boss_' + (levelNo / 2); //since boss is every other level
	
	var alien = this.aliens.create(0, 0, name);
	alien.anchor.setTo(0.5, 0.5);
	alien.scale.setTo(this.spriteScaleX, this.spriteScaleY);
	this.healthMap.set(alien, 100);

	this.aliens.x = 100;
	this.aliens.y = 150;

	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
	var tween = TheGame.game.add.tween(this.aliens).to( { x: 700 }, this.attributes.getSpeed(), Phaser.Easing.Linear.None, true, 0, 1000, true);
}

TheGame.Enemy.prototype.update = function(playerSprite) {
	if (TheGame.game.time.now > this.firingTimer)
	{
		this.enemyFires(playerSprite.x, playerSprite.y);
		var keys = {
			x: playerSprite.x,
			y: playerSprite.y,
		};
		TheGame.eurecaServer.handleEnemyShoot(keys);
	}
}

TheGame.Enemy.prototype.updatePos = function() {	
	var keys = {
		x: this.aliens.x,
		y: this.aliens.y,
	};
	
	TheGame.eurecaServer.handleEnemyKeys(keys);
	this.attributes.updateShieldPos(this.aliens.x, this.aliens.y);
}

TheGame.Enemy.prototype.updateFromServerShoot = function (x, y) {
	this.enemyFires(x, y);
}

TheGame.Enemy.prototype.updateFromServer = function (x, y) {
	this.aliens.x = x;
	this.aliens.y = y;
}

TheGame.Enemy.prototype.createAliens = function(levelNo){
	for (var y = 0; y < 4; y++)
	{
		for (var x = 0; x < 10; x++)
		{
			var alien = this.aliens.create(x * 48, y * 50, 'invader');
			alien.anchor.setTo(0.5, 0.5);
			alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
			alien.play('fly');
			alien.body.moves = false;
			this.healthMap.set(alien, 10);
		}
	}

	this.aliens.x = 100;
	this.aliens.y = 50;

	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
	tween = TheGame.game.add.tween(this.aliens).to( { x: 200 }, this.attributes.getSpeed(), Phaser.Easing.Linear.None, true, 0, 1000, true);

	//  When the tween loops it calls descend
	tween.onLoop.add(this.descend, this);
}

TheGame.Enemy.prototype.enemyFires = function(in_x, in_y) {
	var playerSprite = {x:in_x, y:in_y};
	this.livingEnemies.length=0;
	
	for (var i = 0, len = this.aliens.children.length; i < len; i++) { 
		if (this.aliens.children[i].alive == true)
			this.livingEnemies.push(this.aliens.children[i]);
	}
	
	if (this.livingEnemies.length > 0) 
	{
		//  Grab the first bullet we can from the pool
		if (this.attributes.getIfSpreadShot()){
			bullet1 = this.bullets.getFirstExists(false);

			if (bullet1)
			{	
				bullet1.reset(this.livingEnemies[0].body.x, this.livingEnemies[0].body.y + 15);
				bullet1.body.velocity.y = 100;
				this.firingTimer = TheGame.game.time.now + 700;
			}
			
			bullet2 = this.bullets.getFirstExists(false);

			if (bullet2)
			{	
				bullet2.reset(this.livingEnemies[0].body.x + 50, this.livingEnemies[0].body.y + 15);
				bullet2.body.velocity.y = 100;
				this.firingTimer = TheGame.game.time.now + 700;
			}
			
			bullet3 = this.bullets.getFirstExists(false);

			if (bullet3)
			{	
				bullet3.reset(this.livingEnemies[0].body.x - 50, this.livingEnemies[0].body.y + 15);
				bullet3.body.velocity.y = 100;
				this.firingTimer = TheGame.game.time.now + 700;
			}
		}
		else{
			var bullet = this.bullets.getFirstExists(false);
			if (bullet)
			{
				var random = TheGame.game.rnd.integerInRange(0, this.livingEnemies.length-1);

				// randomly select one of them
				var shooter = this.livingEnemies[random];
				// And fire the bullet from this enemy
				bullet.reset(shooter.body.x, shooter.body.y);

				TheGame.game.physics.arcade.moveToObject(bullet,playerSprite,120);

				this.firingTimer = TheGame.game.time.now + 700;
			}
		}		
	}
}

TheGame.Enemy.prototype.descend = function(){
	this.aliens.y += 10;
}

TheGame.Enemy.prototype.gotHit = function(alien, damageTaken) {
	if (this.attributes.getIfShield()){
		this.attributes.shieldHit(damageTaken);
	}
	else {
		this.healthMap.set(alien, this.healthMap.get(alien) - 10);
	}

	if (this.healthMap.get(alien) <= 0){
		if (this.ifBossLevel){
			var explosion = this.explosions.getFirstExists(false);
			explosion.reset(alien.body.x, alien.body.y + 60);
			explosion.play('kaboom', 30, false, true);
			explosion = this.explosions.getFirstExists(false);
			explosion.reset(alien.body.x + 50, alien.body.y + 60);
			explosion.play('kaboom', 30, false, true);
			explosion = this.explosions.getFirstExists(false);
			explosion.reset(alien.body.x - 50, alien.body.y + 60);
			explosion.play('kaboom', 30, false, true);
		}
		else {
			var explosion = this.explosions.getFirstExists(false);
			explosion.reset(alien.body.x, alien.body.y);
			explosion.play('kaboom', 30, false, true);
		}
		alien.kill();
		return true;
	}
	return false;
}

TheGame.Enemy.prototype.resetHealth = function(levelNo) {
	this.aliens.removeAll();
	this.healthMap.clear();
	if (levelNo % 2 == 0){
		this.createBoss(levelNo);
	}
	else {
		this.createAliens(levelNo);
	}
}

TheGame.Enemy.prototype.killBullets = function(){
	this.bullets.callAll('kill');
}

TheGame.Enemy.prototype.pause = function(ifPause) {
	if (ifPause){
		tween.pause();
	}
	else{
		tween.resume();
	}
}

TheGame.Enemy.prototype.getBullets = function() {
	return this.bullets;
}

TheGame.Enemy.prototype.getBulletDamage = function() {
	return this.attributes.getBulletDamage();
}

TheGame.Enemy.prototype.getEnemy = function() {
	return this.aliens;
}

TheGame.Enemy.prototype.getLives = function() {
	return this.lives;
}

TheGame.Enemy.prototype.getAlive = function() {
	return this.EnemySprite.alive;
}
