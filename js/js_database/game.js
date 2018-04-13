var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.gameState = function(){ 
	var player1;
	var player2;
	var enemy;
	
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
	
	var proceedToNext;

	var death;
};

TheStarshipOfDoom.gameState.prototype = {
	init: function(inScore, inLevelNo, inIfSpeedPickup, inIfSpreadPickup, inIfShieldPickup){
		initialScore = inScore;
		score = inScore;
		levelNo = inLevelNo;
		ifSpeedPickup = inIfSpeedPickup;
		ifSpreadPickup = inIfSpreadPickup; 
		ifShieldPickup = inIfShieldPickup;
		if (levelNo == 9 )
			TheStarshipOfDoom.playerVsplayer = true;
		else
			TheStarshipOfDoom.playerVsplayer = false;
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
		player1 = new TheStarshipOfDoom.Player(this.game, 'You', 1, 400, 500, ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		player2 = new TheStarshipOfDoom.Player(this.game, 'Another', 2, 300, 500, ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		enemy = new TheStarshipOfDoom.Enemy(this.game, levelNo);
				
		backButton = this.game.add.sprite(this.game.world.width - 30, this.game.world.height - 30, 'backButton');
		backButton.anchor.setTo(0.5, 0.5);
		backButton.scale.setTo(0.2, 0.2);
		
		//  The score
		scoreString = 'Score : ';
		scoreText = this.game.add.text(this.game.world.centerX, 30, scoreString + score, { font: '34px Arial', fill: '#fff' });
		scoreText.anchor.setTo(0.5,0.5);

		//  Text
		stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '48px Arial', fill: '#fff' });
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
	},
	
	togglePause : function(){
		this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
		if (this.game.physics.arcade.isPaused){
			stateText.text = " Game Paused! \n Press P to get back into the action.";
			stateText.visible = true;
			enemy.pause(true);
		}
		else {
			stateText.visible = false;
			enemy.pause(false);
		}
	},
	
	restart : function() {
		//  A new level starts
		//  And brings the aliens back from the dead :)
		enemy.resetHealth(this.game, levelNo);
		score = initialScore;
		scoreText.text = scoreString + score;
		
		//revives the player
		player1.resetHealth(ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		player2.resetHealth(ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		//hides the text
		stateText.visible = false;
	},
	
	update : function() {
		if (this.game.physics.arcade.isPaused == false)
		{
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
			
			if (player1.getAlive())
			{
				player1.update(this.game, player2.getSprite().x, player2.getSprite().y);
				//enemy.update(player1.getSprite(), this.game);

				//  Run collision
				this.game.physics.arcade.overlap(player1.getBullets(), enemy.getEnemy(), this.collisionHandler, null, this);
				if (enemy.getIfDefencePresent())
					this.game.physics.arcade.overlap(player1.getBullets(), enemy.getEnemyDefence(), this.collisionHandler, null, this);
				this.game.physics.arcade.overlap(enemy.getBullets(), player1.getSprite(), this.enemyHitsPlayer, null, this);
				this.game.physics.arcade.overlap(player1.getSprite(), player2.getBullets(), this.onePlayerHitsAnother, null, this);
			}
			
			if (player2.getAlive())
			{
				player2.update(this.game, player1.getSprite().x, player1.getSprite().y);
				//enemy.update(player2.getSprite(), this.game);

				//  Run collision
				this.game.physics.arcade.overlap(player2.getBullets(), enemy.getEnemy(), this.collisionHandler, null, this);
				if (enemy.getIfDefencePresent())
					this.game.physics.arcade.overlap(player2.getBullets(), enemy.getEnemyDefence(), this.collisionHandler, null, this);
				this.game.physics.arcade.overlap(enemy.getBullets(), player2.getSprite(), this.enemyHitsPlayer, null, this);
				this.game.physics.arcade.overlap(player2.getSprite(), player1.getBullets(), this.onePlayerHitsAnother, null, this);
			}
			
			if (player1.getAlive() && player2.getAlive()){
				var random = this.game.rnd.integerInRange(0,1);
				if (random == 0)
					enemy.update(player1.getSprite(), this.game);
				else
					enemy.update(player2.getSprite(), this.game);
			}
			else if (player1.getAlive()){
				enemy.update(player1.getSprite(), this.game);
			}
			else if (player2.getAlive()){
				enemy.update(player2.getSprite(), this.game);
			}
		}
	},
	
	setupInvader : function(invader) {

		invader.anchor.x = 0.5;
		invader.anchor.y = 0.5;
		invader.animations.add('kaboom');

	},
	
	collisionHandler : function(bullet, alien) {

		//  When a bullet hits an alien we kill them both
		bullet.kill();
		death.play();
		// Check if died
		if (enemy.gotHit(alien, player1.getBulletDamage())){
			//  Increase the score
			score += 20;
			scoreText.text = scoreString + score;
		}
		
		if (enemy.getEnemy().countLiving() < 1)
		{
			score += 1000;
			scoreText.text = scoreString + score;

		//	enemy.killBullets();
			
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
		
		if (player == player1.getSprite()){
			player1.gotHit(enemy.getBulletDamage());
			if (player1.getNumOfLives() < 1){
				player.kill();
			}
		}
		else if (player == player2.getSprite()){
			player2.gotHit(enemy.getBulletDamage());
			if (player2.getNumOfLives() < 1){
				player.kill();
			}
		}
			
		//  And create an explosion :)
		var explosion = explosions.getFirstExists(false);
		explosion.reset(player.body.x, player.body.y);
		explosion.play('kaboom', 30, false, true);
		
		// When the player dies
		if (player1.getNumOfLives() < 1 && player2.getNumOfLives() < 1)
		{
			enemy.killBullets();

			stateText.text=" Game Over \n Click to restart";
			stateText.visible = true;
			
			proceedToNext = false;
			//the "click to restart" handler
			this.game.input.onTap.addOnce(this.proceed,this);
		}

	},
	
	onePlayerHitsAnother : function(player,bullet) {
		
		bullet.kill();
		
		var num_lives = 0;
		
		if (player == player1.getSprite()){
			player1.gotHit(player2.getBulletDamage());
			num_lives = player1.getNumOfLives();
		}
		else if (player == player2.getSprite()){
			player2.gotHit(player1.getBulletDamage());
			num_lives = player2.getNumOfLives();
		}

		//  And create an explosion :)
		var explosion = explosions.getFirstExists(false);
		explosion.reset(player.body.x, player.body.y);
		explosion.play('kaboom', 30, false, true);

		// When the player dies
		if (num_lives < 1)
		{
			player.kill();
			enemy.killBullets();

			stateText.text=" Game Over \n Click to restart";
			stateText.visible = true;

			//the "click to restart" handler
			this.game.input.onTap.addOnce(this.restart,this);
		}
	},
}
