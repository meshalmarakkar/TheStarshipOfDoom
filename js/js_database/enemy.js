var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.Enemy = function(game, levelNo, spriteScaleX, spriteScaleY) {

	this.livingEnemies = [];
	this.healthMap = new Map();
	this.firingTimer = 0;
	
	this.bullets = game.add.group();
	this.bullets.enableBody = true;
	this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.bullets.createMultiple(30, 'enemyBullet');
	this.bullets.setAll('anchor.x', 0.5);
	this.bullets.setAll('anchor.y', 1);
	this.bullets.setAll('outOfBoundsKill', true);
	this.bullets.setAll('checkWorldBounds', true);
	
	// An explosion pool
	this.explosions = game.add.group();
	this.explosions.createMultiple(30, 'kaboom');
	this.explosions.forEach(this.setupExplosion, this);
	
	this.spriteScaleX = spriteScaleX || 1.0;
	this.spriteScaleY = spriteScaleY || 1.0;
	
	if (levelNo == 2 || levelNo == 4){
		this.spriteScaleX = 1.5;
		this.spriteScaleY = 1.5;
	}
	
	var tween;
	this.defencePresent = false;
	var tweenDefence;
	
	this.aliens = game.add.group();
	this.aliens.enableBody = true;
	this.aliens.physicsBodyType = Phaser.Physics.ARCADE;
	this.attributes = new TheStarshipOfDoom.Attributes(game, 400, 500, 3000, 2000);
		
	this.ifBossLevel = false;
	
	if (levelNo % 2 == 0){
		this.createBoss(game, levelNo);
		this.ifBossLevel = true;
	}
	else {
		if (levelNo > 4){
			this.createAliensSpeed(game, levelNo);
		}
		else {
			this.createAliens(game, levelNo);
		}
		if (levelNo > 2){
			this.defencePresent = true;
			this.aliensDefence = game.add.group();
			this.aliensDefence.enableBody = true;
			this.aliensDefence.physicsBodyType = Phaser.Physics.ARCADE;
			this.createAliensDefence(game, levelNo);
		}
	}
	
	return this;
}

TheStarshipOfDoom.Enemy.prototype.setupExplosion = function(explosion) {
	explosion.anchor.x = 0.5;
	explosion.anchor.y = 0.5;
	explosion.animations.add('kaboom');
}

TheStarshipOfDoom.Enemy.prototype.createBoss = function(game, levelNo){
	var name = 'Boss_' + (levelNo / 2); //since boss is every other level
	
	if (levelNo == 2)
		this.attributes.setIfSpeed(true);
	else if (levelNo == 4)
		this.attributes.setIfSpreadShot(true);
	else if (levelNo == 6)
		this.attributes.setIfShield(true, 1.0, 1.0); 
	else {
		this.attributes.setIfSpeed(true); 
		this.attributes.setIfSpreadShot(true); 
		this.attributes.setIfShield(true, 1.5, 1.5); 
	}
	
	var alien = this.aliens.create(0, 0, name);
	alien.anchor.setTo(0.5, 0.5);
	alien.scale.setTo(this.spriteScaleX, this.spriteScaleY);
	this.healthMap.set(alien, 100);

	this.aliens.x = 100;
	this.aliens.y = 150;

	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
	var tween = game.add.tween(this.aliens).to( { x: 700 }, this.attributes.getSpeed(), Phaser.Easing.Linear.None, true, 0, 1000, true);
}

TheStarshipOfDoom.Enemy.prototype.update = function(playerSprite, game) {
	if (game.time.now > this.firingTimer)
	{
		this.enemyFires(playerSprite, game);
	}
	this.attributes.updateShieldPos(this.aliens.children[0].body.x, this.aliens.children[0].body.y);
}

TheStarshipOfDoom.Enemy.prototype.createAliens = function(game, levelNo){
	var health = 10;
	if (levelNo > 6)
		health = 30;
	else if (levelNo > 4)
		health = 20;
	
	for (var y = 0; y < 4; y++)
	{
		for (var x = 0; x < 10; x++)
		{
			var alien = this.aliens.create(x * 48, y * 50, 'invader');
			alien.anchor.setTo(0.5, 0.5);
			alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
			alien.play('fly');
			alien.body.moves = false;
			this.healthMap.set(alien, health);
		}
	}

	this.aliens.x = 100;
	this.aliens.y = 50;

	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
	tween = game.add.tween(this.aliens).to( { x: 200 }, this.attributes.getSpeed(), Phaser.Easing.Linear.None, true, 0, 1000, true);

	//  When the tween loops it calls descend
	tween.onLoop.add(this.descend, this);
}

TheStarshipOfDoom.Enemy.prototype.createAliensSpeed = function(game, levelNo){
	var health = 10;
	if (levelNo > 6)
		health = 30;
	else if (levelNo > 4)
		health = 20;

	for (var y = 0; y < 4; y++)
	{
		for (var x = 0; x < 10; x++)
		{
			var alien = this.aliens.create(x * 48, y * 50, 'invaderSpeed');
			alien.anchor.setTo(0.5, 0.5);
			alien.body.moves = false;
			this.healthMap.set(alien, health);
		}
	}

	this.aliens.x = 100;
	this.aliens.y = 50;

	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
	tween = game.add.tween(this.aliens).to( { x: 200 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

	//  When the tween loops it calls descend
	tween.onLoop.add(this.descend, this);
}

TheStarshipOfDoom.Enemy.prototype.createAliensDefence = function(game, levelNo){
	var health = 20;
	if (levelNo > 6)
		health = 40;
	else if (levelNo > 4)
		health = 30;
	for (var y = 4; y < 6; y++)
		{
			for (var x = 0; x < 12; x++)
			{
				var alien = this.aliensDefence.create(x * 48, y * 50, 'invaderDefence');
				alien.anchor.setTo(0.5, 0.5);
				alien.body.moves = false;
				this.healthMap.set(alien, health);
			}
		}

	this.aliensDefence.x = 100;
	this.aliensDefence.y = 50;

	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
	tweenDefence = game.add.tween(this.aliensDefence).to( { x: 100 }, this.attributes.getSpeed(), Phaser.Easing.Linear.None, true, 0, 1000, true);

	//  When the tween loops it calls descend
	tweenDefence.onLoop.add(this.descend, this);
}

TheStarshipOfDoom.Enemy.prototype.enemyFires = function(playerSprite, game) {

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
				this.firingTimer = game.time.now + 700;
			}
			
			bullet2 = this.bullets.getFirstExists(false);

			if (bullet2)
			{	
				bullet2.reset(this.livingEnemies[0].body.x + 50, this.livingEnemies[0].body.y + 15);
				bullet2.body.velocity.y = 100;
				this.firingTimer = game.time.now + 700;
			}
			
			bullet3 = this.bullets.getFirstExists(false);

			if (bullet3)
			{	
				bullet3.reset(this.livingEnemies[0].body.x - 50, this.livingEnemies[0].body.y + 15);
				bullet3.body.velocity.y = 100;
				this.firingTimer = game.time.now + 700;
			}
		}
		else{
			var bullet = this.bullets.getFirstExists(false);
			if (bullet)
			{
				var random = game.rnd.integerInRange(0, this.livingEnemies.length-1);

				// randomly select one of them
				var shooter = this.livingEnemies[random];
				// And fire the bullet from this enemy
				bullet.reset(shooter.body.x, shooter.body.y);

				game.physics.arcade.moveToObject(bullet,playerSprite,120);

				this.firingTimer = game.time.now + 1000;
			}
		}		
	}
}

TheStarshipOfDoom.Enemy.prototype.descend = function(){
	this.aliens.y += 10;
}

TheStarshipOfDoom.Enemy.prototype.gotHit = function(alien, damageTaken) {
	if (this.attributes.getIfShield()){
		this.attributes.shieldHit(damageTaken);
	}
	else {
		this.healthMap.set(alien, this.healthMap.get(alien) - 10);
	}

	if (this.healthMap.get(alien) <= 0){
		alien.kill();
		if (this.ifBossLevel){
			var explosion = explosions.getFirstExists(false);
			explosion.reset(alien.body.x, alien.body.y + 60);
			explosion.play('kaboom', 30, false, true);
			explosion = explosions.getFirstExists(false);
			explosion.reset(alien.body.x + 50, alien.body.y + 60);
			explosion.play('kaboom', 30, false, true);
			explosion = explosions.getFirstExists(false);
			explosion.reset(alien.body.x - 50, alien.body.y + 60);
			explosion.play('kaboom', 30, false, true);
		}
		else {
			var explosion = this.explosions.getFirstExists(false);
			explosion.reset(alien.body.x, alien.body.y);
			explosion.play('kaboom', 30, false, true);
		}
		return true;
	}
	return false;
}

TheStarshipOfDoom.Enemy.prototype.resetHealth = function(game, levelNo) {
	this.aliens.removeAll();
	if (this.defencePresent)
		this.aliensDefence.removeAll();
	this.healthMap.clear();
	if (levelNo % 2 == 0){
		this.createBoss(game, levelNo);
	}
	else {
		this.createAliens(game, levelNo);
		if (levelNo > 2){
			this.createAliensDefence(game, levelNo);
		}
	}
}

TheStarshipOfDoom.Enemy.prototype.killBullets = function(){
	this.bullets.callAll('kill');
}

TheStarshipOfDoom.Enemy.prototype.pause = function(ifPause) {
	if (ifPause){
		tween.pause();
		if (this.defencePresent)
			tweenDefence.pause();
	}
	else{
		tween.resume();
		if (this.defencePresent)
			tweenDefence.resume();
	}
}

TheStarshipOfDoom.Enemy.prototype.getBullets = function() {
	return this.bullets;
}

TheStarshipOfDoom.Enemy.prototype.getBulletDamage = function() {
	return this.attributes.getBulletDamage();
}

TheStarshipOfDoom.Enemy.prototype.getEnemy = function() {
	return this.aliens;
}

TheStarshipOfDoom.Enemy.prototype.getEnemyDefence = function() {
	return this.aliensDefence;
}

TheStarshipOfDoom.Enemy.prototype.getIfDefencePresent = function() {
	return this.defencePresent;
}

TheStarshipOfDoom.Enemy.prototype.getLives = function() {
	return this.lives;
}

TheStarshipOfDoom.Enemy.prototype.getAlive = function() {
	return this.EnemySprite.alive;
}
