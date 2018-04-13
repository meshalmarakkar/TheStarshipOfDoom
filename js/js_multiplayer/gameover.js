var TheGame = TheGame || {};

TheGame.gameoverState = function(){ 	
	var player1;
	var player2;
	
	var starfield;
	
	var score;
	var scoreText;
	
	var backButton;
	var saveButton;
};
TheGame.gameoverState.prototype = {
	init: function(gameScore){
		score = gameScore;
	},
	
	preload: function(){
		
	},
  	create: function(){		
		//  The scrolling starfield background
		starfield = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

		//  The heroes!
		player1 = this.game.add.sprite(400, 500, 'ship');
		player1.anchor.setTo(0.5, 0.5);
		
		player2 = this.game.add.sprite(300, 500, 'ship');
		player2.anchor.setTo(0.5, 0.5);

		backButton = this.game.add.button(this.game.world.width - 30, this.game.world.height - 30, 'backButton', this.actionOnClick, this, 2, 1, 0);
		backButton.anchor.setTo(0.5, 0.5);
		backButton.scale.setTo(0.2, 0.2);
		backButton.onInputDown.add(this.onBackButtonDown, this);
		
		saveButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonSprite', this.actionOnClick, this, 2, 1, 0);
		saveButton.onInputDown.add(this.onSaveButtonDown, this);
		
		//  The score
		scoreString = 'Score : ';
		scoreText = this.game.add.text(this.game.world.centerX, 30, scoreString + score, { font: '34px Arial', fill: '#fff' });
		scoreText.anchor.setTo(0.5,0.5);
	
		//  Text
		stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
		stateText.anchor.setTo(0.5, 0.5);
		stateText.visible = false;

	},
	
	onSaveButtonDown : function(){
		//console.log("in ondown");

		var person = prompt("Please enter your username", "Harry Potter");
		
		if (person != null) {
		
			var obj = {
				'user': person,
				'thescore': score
			};
		
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'savescore.php');
			xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
			jsonData = JSON.stringify(obj);
			
			xhr.onreadystatechange = function() {
				if (xhr.status === 200) {
					alert(xhr.responseText);
				}
			};
			xhr.send('json=' + jsonData);
			
		}
	},
	
	onBackButtonDown : function(){
		this.game.state.start('menuStateVar');
	},
		
	update : function() {
		//  Scroll the background
		starfield.tilePosition.y += 2;
	},
}
