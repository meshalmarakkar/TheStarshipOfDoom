var TheGame = TheGame || {};

TheGame.Attributes = function(game, initialX, initialY, initialSpeed, increasedSpeed) {
	this.hasSpeed = false;
	this.hasSpreadShot = false;
	this.hasShield = false;
	
	this.initialSpeed = initialSpeed;
	this.increasedSpeed = increasedSpeed;
	
	this.speed = initialSpeed;
	this.bulletDamage = 10;
	
	this.shield = game.add.sprite(initialX, initialY, 'shield');
	this.shield.anchor.setTo(0.5, 0.5);
	this.shield.scale.setTo(0.2, 0.2);
	this.shieldCapacityNum = 10;
	this.shieldCapacity = this.shieldCapacityNum;
	game.physics.enable(this.shield, Phaser.Physics.ARCADE);
	this.shield.kill() //don't need it always. revive when required.
 
	return this;
}

TheGame.Attributes.prototype.updateShieldPos = function(posX, posY) {
	this.shield.body.x = posX;
	this.shield.body.y = posY;
}

TheGame.Attributes.prototype.setIfSpeed = function(ifSpeed) {
	if (ifSpeed == true){
		this.speed = this.increasedSpeed;
	}
	else{
		this.speed = this.initialSpeed;
	}
	this.hasSpeed = ifSpeed;
}

TheGame.Attributes.prototype.setIfSpreadShot = function(ifSpreadShot) {
	if (ifSpreadShot == true){
		this.bulletDamage = 5;
	}
	else{
		this.bulletDamage = 10;
	}
	this.hasSpreadShot = ifSpreadShot;
}

TheGame.Attributes.prototype.setIfShield = function(ifShield, shieldSizeX, shieldSizeY) {
	if (ifShield == true){
		this.shield.revive();
		this.shieldCapacity = this.shieldCapacityNum;
		this.shield.scale.setTo(shieldSizeX, shieldSizeY);
	}
	else{
		this.shield.kill();
	}
	this.hasShield = ifShield;
}

TheGame.Attributes.prototype.getSpeed = function() {
	return this.speed;
}

TheGame.Attributes.prototype.getBulletDamage = function() {
	return this.bulletDamage;
}

TheGame.Attributes.prototype.shieldHit = function(damageTaken) {
	this.shieldCapacity -= damageTaken;
	if (this.shieldCapacity <= 0){
		this.setIfShield(false);
	}
}

TheGame.Attributes.prototype.getIfSpeed = function() {
	return this.hasSpeed;
}

TheGame.Attributes.prototype.getIfSpreadShot = function() {
	return this.hasSpreadShot;
}

TheGame.Attributes.prototype.getIfShield = function() {
	return this.hasShield;
}
