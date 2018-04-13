var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.menuState = function(){ 	
	var cursors;
	var starfield;
	var startLevelButton;
	var start;
	var backgroundMusic;
};
TheStarshipOfDoom.menuState.prototype = {
	
	preload: function(){
			 	
	},
  	create: function(){
		backgroundMusic = this.game.add.audio('backgroundMusic');
		backgroundMusic.play();
		//  The scrolling starfield background
		starfield = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

		//  The Title
		var title = 'The Starship of Doom';
		title = this.game.add.text(this.game.world.centerX, this.game.world.height / 3, title, { font: '48px Arial', fill: '#fff' });
		title.anchor.setTo(0.5, 0.5);
		
		//  Start
		startButton = this.game.add.button(this.game.world.centerX-32, this.game.world.centerY + 50, 'buttonPlay', this.actionOnClick, this, 2, 1, 0);
		startButton.onInputDown.add(this.onStartButtonDown, this);
		
		// And some controls to play the game with
		// startLevelButton = game.input.keyboard.addKey(Phaser.KeyCode.P);
	},
	
	update : function() {
		//  Scroll the background
		starfield.tilePosition.y += 2;
	},
	
	onStartButtonDown : function() {
		this.game.state.start('intermediateStateVar', true, false, 0, 0);
	}
}

