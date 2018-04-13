var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.Attributes = function(game, initialX, initialY, initialSpeed, increasedSpeed) {
	this.hasSpeed = false;
	this.hasSpreadShot = false;
	this.hasShield = false;
	
	this.initialSpeed = initialSpeed;
	this.increasedSpeed = increasedSpeed;
	
	this.speed = initialSpeed;
	this.bulletDamage = 10;
	this.rateOfFire = 200;
	
	this.shield = game.add.sprite(initialX, initialY, 'shield');
	this.shield.anchor.setTo(0.5, 0.5);
	this.shield.scale.setTo(0.2, 0.2);
	this.shieldCapacityNum = 50;
	this.shieldCapacity = this.shieldCapacityNum;
	game.physics.enable(this.shield, Phaser.Physics.ARCADE);
	this.shield.kill() //don't need it always. revive when required.
 
	return this;
}

TheStarshipOfDoom.Attributes.prototype.updateShieldPos = function(posX, posY) {
	this.shield.body.x = posX;
	this.shield.body.y = posY;
}

TheStarshipOfDoom.Attributes.prototype.setIfSpeed = function(ifSpeed) {
	if (ifSpeed == true){
		this.speed = this.increasedSpeed;
	}
	else{
		this.speed = this.initialSpeed;
	}
	this.hasSpeed = ifSpeed;
}

TheStarshipOfDoom.Attributes.prototype.setIfSpreadShot = function(ifSpreadShot) {
	if (ifSpreadShot == true){
		this.bulletDamage = 5;
		this.rateOfFire = 600;
	}
	else{
		this.bulletDamage = 10;
		this.rateOfFire = 300;
	}
	this.hasSpreadShot = ifSpreadShot;
}

TheStarshipOfDoom.Attributes.prototype.setIfShield = function(ifShield, shieldSizeX, shieldSizeY) {
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

TheStarshipOfDoom.Attributes.prototype.getSpeed = function() {
	return this.speed;
}

TheStarshipOfDoom.Attributes.prototype.getRateOfFire = function() {
	return this.rateOfFire;
}

TheStarshipOfDoom.Attributes.prototype.getBulletDamage = function() {
	return this.bulletDamage;
}

TheStarshipOfDoom.Attributes.prototype.shieldHit = function(damageTaken) {
	this.shieldCapacity -= damageTaken;
	if (this.shieldCapacity <= 0){
		this.setIfShield(false);
	}
}

TheStarshipOfDoom.Attributes.prototype.getIfSpeed = function() {
	return this.hasSpeed;
}

TheStarshipOfDoom.Attributes.prototype.getIfSpreadShot = function() {
	return this.hasSpreadShot;
}

TheStarshipOfDoom.Attributes.prototype.getIfShield = function() {
	return this.hasShield;
}
