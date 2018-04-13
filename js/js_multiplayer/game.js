var TheGame = TheGame || {};

TheGame.gameState = function(){ 
	//var enemy;
	
	var cursors;
	var explosions;
	var starfield;
	var initialScore;
	var score;
	var scoreString;
	var scoreText;
	
	var levelNo;
	
	var stateText;	
	var backButton;
	
	var W_Button;
	var S_Button;
	var A_Button;
	var D_Button;
	var SPACE_Button;
	
	var proceedToNext;
	
	var death;
};

TheGame.gameState.prototype = {
	init: function(inScore, inLevelNo, inIfSpeedPickup, inIfSpreadPickup, inIfShieldPickup){
		initialScore = inScore;
		score = inScore;
		levelNo = inLevelNo;
		ifSpeedPickup = inIfSpeedPickup;
		ifSpreadPickup = inIfSpreadPickup; 
		ifShieldPickup = inIfShieldPickup;
	},
	preload: function(){
		
	},
  	create: function(){
		scoreString = '';
		
		death = this.game.add.audio('death');
		
		//  The scrolling starfield background
		var backgroundName;
		if (levelNo == 1 || levelNo == 2){
			backgroundName = 'starfield';
		}
		else if (levelNo == 3 || levelNo == 4){
			backgroundName = 'starfield2';
		}
		else if (levelNo == 5 || levelNo == 6){
			backgroundName = 'starfield3';
		}
		else if (levelNo > 6){
			backgroundName = 'starfield4';
		}
		
		starfield = this.game.add.tileSprite(0, 0, 800, 600, backgroundName);
				
		//  The heroes!
		this.player = new TheGame.Player(this.game, 1, 400, 500, ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		TheGame.playerList[TheGame.myID] = this.player;
		 //spawn other players
		TheGame.eurecaServer.spawnOtherPlayers();
		
		// var keys = {
			// lvlNo: levelNo,
		// };
		//TheGame.eurecaServer.handleEnemyKeys(levelNo);
		TheGame.enemy = new TheGame.Enemy(levelNo);
		//TheGame.eurecaServer.spawnEnemy(levelNo);
	//	enemy = new TheGame.Enemy(this.game, levelNo);
				
		backButton = this.game.add.sprite(this.game.world.width - 30, this.game.world.height - 30, 'backButton');
		backButton.anchor.setTo(0.5, 0.5);
		backButton.scale.setTo(0.2, 0.2);
		
		//  The score
		scoreString = 'Score : ';
		scoreText = this.game.add.text(this.game.world.centerX, 30, scoreString + score, { font: '34px Arial', fill: '#fff' });
		scoreText.anchor.setTo(0.5,0.5);

		//  Text
		stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
		stateText.anchor.setTo(0.5, 0.5);
		stateText.visible = false;

		//  An explosion pool
		explosions = this.game.add.group();
		explosions.createMultiple(30, 'kaboom');
		explosions.forEach(this.setupInvader, this);

		//  And some controls to play the this.game with
		cursors = this.game.input.keyboard.createCursorKeys();
		pause_button = this.game.input.keyboard.addKey(Phaser.KeyCode.P);
		pause_button.onDown.add(this.togglePause, this);
		W_Button = this.game.input.keyboard.addKey(Phaser.KeyCode.W);
		S_Button = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
		A_Button = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
		D_Button = this.game.input.keyboard.addKey(Phaser.KeyCode.D);
		SPACE_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},
	
	togglePause : function(){
		this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
		if (this.game.physics.arcade.isPaused){
			stateText.text = " Game Paused! \n Press P to get back into the action.";
			stateText.visible = true;
			TheGame.enemy.pause(true);
		}
		else {
			stateText.visible = false;
			TheGame.enemy.pause(false);
		}
	},
	
	restart : function() {
		//  A new level starts
		//  And brings the aliens back from the dead :)
		TheGame.enemy.resetHealth(this.game, levelNo);
		score = initialScore;
		scoreText.text = scoreString + score;
		
		//revives the player
		this.player.resetHealth();
		if (TheGame.secondPlayerLoaded == true)
			TheGame.playerList[TheGame.secondPlayerID].resetHealth();
		
		//hides the text
		stateText.text="";
		stateText.visible = false;
	},
	
	setupInvader : function(invader) {
		invader.anchor.x = 0.5;
		invader.anchor.y = 0.5;
		invader.animations.add('kaboom');
	},
	
	update : function() {
		//  Scroll the background
		starfield.tilePosition.y += 2;
		
		if (this.game.input.mousePointer.isDown)
		{
			if (this.game.input.activePointer.x >= backButton.position.x - 10 && this.game.input.activePointer.x <= backButton.position.x + 10){
				if (this.game.input.activePointer.y >= backButton.position.y - 10 && this.game.input.activePointer.y <= backButton.position.y + 10){
					this.game.state.start('menuStateVar');
				}
			}
		}
		
		shootBullet = false;
		
		this.player.stopVelocity();
		
		if (A_Button.isDown)
		{
			this.player.moveLeft();
		}
		else if (D_Button.isDown)
		{
			this.player.moveRight();
		}
		
		if (W_Button.isDown)
		{
			this.player.moveUp();
		}
		else if (S_Button.isDown)
		{
			this.player.moveDown();
		}
				
		if (SPACE_Button.isDown)
		{
			shootBullet = true;
			this.player.fireBullet(this.game.time.now);
		}
		
		TheGame.enemy.updatePos();
		
		if (TheGame.secondPlayerLoaded) {
			//this.player = TheGame.playerList[TheGame.myID];
			var id = TheGame.secondPlayerID;
			if (this.player.getAlive() && TheGame.playerList[id].getAlive()){
				var random = this.game.rnd.integerInRange(0,1);
				if (random == 0){
					TheGame.enemy.update(this.player.getSprite(), this.game);
				}
				else{
					TheGame.enemy.update(TheGame.playerList[id].getSprite(), this.game);
				}
			}
			else if (this.player.getAlive()){
				TheGame.enemy.update(this.player.getSprite(), this.game);
			}
			else if (TheGame.playerList[id].getAlive()){
				TheGame.enemy.update(TheGame.playerList[id].getSprite(), this.game);
			}
		}
		else {
			if (this.player.getAlive()){
				TheGame.enemy.update(this.player.getSprite(), TheGame.game);
			}
		}
		
		if (this.player.getAlive())
		{
			this.player.update(shootBullet);

			//  Run collision
			this.game.physics.arcade.overlap(this.player.getBullets(), TheGame.enemy.getEnemy(), this.collisionHandler, null, this);
			this.game.physics.arcade.overlap(TheGame.enemy.getBullets(), this.player.getSprite(), this.enemyHitsPlayer, null, this);
			if (TheGame.secondPlayerLoaded) {
				var id = TheGame.secondPlayerID;
				this.game.physics.arcade.overlap(this.player.getSprite(), TheGame.playerList[id].getBullets(), this.onePlayerHitsAnother, null, this);
				this.game.physics.arcade.overlap(TheGame.playerList[id].getSprite(), this.player.getBullets(), this.onePlayerHitsAnother, null, this);
			}
		}
	},
	
	collisionHandler : function(bullet, alien) {

		//  When a bullet hits an alien we kill them both
		bullet.kill();
		// Check if died
		if (TheGame.enemy.gotHit(alien, this.player.getBulletDamage())){
			//  Increase the score
			score += 20;
			scoreText.text = scoreString + score;
		}
		
		if (TheGame.enemy.getEnemy().countLiving() < 1)
		{
			score += 1000;
			scoreText.text = scoreString + score;

		//	TheGame.enemy.killBullets();
			
			stateText.text = " Victory! \n Click to proceed.";
			stateText.visible = true;
			proceedToNext = true;
			this.game.input.onTap.addOnce(this.proceed,this);
		}
	},
	
	proceed : function(){
		if (proceedToNext == true){
			stateText.visible = false;
			this.game.state.start('intermediateStateVar', true, false, score, levelNo);
		}
		else {
			this.restart();
		}
	},
	
	enemyHitsPlayer : function(player,bullet) {
		
		bullet.kill();
		
		this.player.gotHit(TheGame.enemy.getBulletDamage());
		
		//  And create an explosion :)
		var explosion = explosions.getFirstExists(false);
		explosion.reset(player.body.x, player.body.y);
		explosion.play('kaboom', 30, false, true);
		
		// When the player dies
		if (this.player.getNumOfLives() < 1)
		{
			player.kill();
			TheGame.enemy.killBullets();

			stateText.text=" Game Over \n Click to restart";
			stateText.visible = true;
			
			proceedToNext = false;
			//the "click to restart" handler
			this.game.input.onTap.addOnce(this.proceed,this);
		}

	},
	
	onePlayerHitsAnother : function(player,bullet) {
		
		bullet.kill();
		
		var id = TheGame.secondPlayerID;
		if (player == TheGame.playerList[id].getSprite()){
			this.player.gotHit(TheGame.playerList[id].getBulletDamage());
		}
		else if (player == this.player.getSprite()){
			TheGame.playerList[id].gotHit(this.player.getBulletDamage());
		}
		
		
		//  And create an explosion :)
		var explosion = explosions.getFirstExists(false);
		explosion.reset(player.body.x, player.body.y);
		explosion.play('kaboom', 30, false, true);

		// When the player dies
		if (this.player.getNumOfLives() < 1 && TheGame.playerList[id].getNumOfLives() < 1)
		{
			player.kill();
			TheGame.enemy.killBullets();

			stateText.text=" Game Over \n Click to restart";
			stateText.visible = true;

			//the "click to restart" handler
			this.game.input.onTap.addOnce(this.restart,this);
		}
	},
}
