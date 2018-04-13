var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.intermediateState = function(){ 
	var playerLV1;
	var playerLV2;
	var playerLV3;
	var playerLV4;
	var arrow;

	var cursors;
	var starfield;
	
	var score;
	var levelNo;
	
	var storyTextString;
	var beginTextString;
	var scoreString;
	
	var upgrage1_button;
	var upgrage2_button;
	var upgrage3_button;
	var upgrage4_button;
	
	var ifSpeedPickup;
	var ifSpreadPickup;
	var ifShieldPickup;
	
	var continue_button;
};

TheStarshipOfDoom.intermediateState.prototype = {
	init:function(inScore, inLevelNo){
		score = inScore;
		levelNo = inLevelNo + 1;
		
		if (levelNo == 1){
			storyTextString = "A strange anomoly has been detected in the Alpha Carina System.\n" + 
					"Two reconnaissance officers have been sent to investigate...\n" +
					"but it seems they aren't the only ones interested...\n";

		}
		else if (levelNo == 2){
			storyTextString = "Seems like a faction the federation disbanded...\n" + 
					"but how are they back together...\n" +
					"It seems they don't want to cooperate. We need to end this!\n";
			
		}
		else if (levelNo == 3){
			storyTextString = "It seems that wasn't the only faction. More detected ahead.\n" + 
					"We better salvage what we can... Advanced mobility system acquired!\n" +
					"Press 1 to equip it...\n" +
					"OR\n" + 
					"Press 0 to detach all upgrades...\n";
		}
		else if (levelNo == 4){
			storyTextString = "The mothership is up ahead... are both factions working together?...\n" + 
					"And why are they here?...\n";
		}
		else if (levelNo == 5){
			storyTextString = "There seems to be more factions ahead!\n" + 
					"Salvage provided an upgrade for the gun... Spread shot!\n" +
					"Press 1 to attach speed enhancement.\n" +
					"OR\n" + 
					"Press 2 to attach spread shot." +
					"OR\n" + 
					"Press 0 to detach all upgrades...\n";
		}
		else if (levelNo == 6){
			storyTextString = "The defenders! Another disbanded faction.\n" + 
					"Why are they working together and who joined them...\n" +
					"Can only find out after taking the leader out...\n";
		}
		else if (levelNo == 7){
			storyTextString = "The herd has been extermely thinned! Must be close to the end...\n" + 
					"This shield upgrade could be helpful...\n" +
					"Press 1 to attach speed enhancement.\n" +
					"OR\n" + 
					"Press 2 to attach spread shot." +
					"OR\n" + 
					"Press 3 to attach shield shot." +
					"OR\n" + 
					"Press 0 to detach all upgrades...\n";
		}
		else if (levelNo == 8){
			storyTextString = "That's a large mothership...\n" + 
					"It must be the leader! We can't let them get to the anomaly...\n" +
					"Whatever it is... Lets do this!\n";
		}
		else if (levelNo == 9){
			storyTextString = "Threat eliminated! Wait, a transmission from base...\n" + 
					"The other pilot is a double agent! I need to eliminate him!\n" +
					"Whatever his reason was... it needs to end here!\n" +
					"Press C for homing missiles!\n";
		}
		else{
			this.game.state.start('gameoverStateVar', true, false, score);
		}
			
		beginTextString = "Press 'C' to begin...";

		scoreString = 'Score : ' + score;
		
	},
	preload: function(){
		
	},
  	create: function(){
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
		//  The scrolling starfield background
		starfield = this.game.add.tileSprite(0, 0, 800, 600, backgroundName);
				
		//  The heroes!
		playerLV1 = this.game.add.sprite(100, 500, 'playerLV1');
		playerLV1.anchor.setTo(0.5,0.5);
		playerLV1.scale.setTo(0.5,0.5);
		arrow = this.game.add.sprite(50, 500, 'arrow');
		arrow.anchor.setTo(0.5,0.5);
		arrow.scale.setTo(0.125,0.125);
		playerLV2 = this.game.add.sprite(300, 500, 'playerLV2');
		playerLV2.anchor.setTo(0.5,0.5);
		playerLV2.scale.setTo(0.5,0.5);
		playerLV3 = this.game.add.sprite(500, 500, 'playerLV3');
		playerLV3.anchor.setTo(0.5,0.5);
		playerLV3.scale.setTo(0.5,0.5);
		playerLV4 = this.game.add.sprite(700, 500, 'playerLV4');
		playerLV4.anchor.setTo(0.5,0.5);
		playerLV4.scale.setTo(0.5,0.5);
		
		if (levelNo > 6){
			playerLV2.alpha = 1.0;
			playerLV3.alpha = 1.0;
			playerLV4.alpha = 1.0;
		}
		else if (levelNo > 4){
			playerLV2.alpha = 1.0;
			playerLV3.alpha = 1.0;
			playerLV4.alpha = 0.3;
		}
		else if (levelNo > 2){
			playerLV2.alpha = 1.0;
			playerLV3.alpha = 0.3;
			playerLV4.alpha = 0.3;
		}
		else{
			playerLV2.alpha = 0.3;
			playerLV3.alpha = 0.3;
			playerLV4.alpha = 0.3;
		}

		storyText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, storyTextString, { font: '20px Arial', fill: '#fff' });
		storyText.anchor.setTo(0.5,0.5);
		
		beginText = this.game.add.text(this.game.world.centerX, 400, beginTextString, { font: '20px Arial', fill: '#fff' });
		beginText.anchor.setTo(0.5,0.5);
		
		scoreText = this.game.add.text(this.game.world.centerX, 30, scoreString, { font: '20px Arial', fill: '#fff' });
		scoreText.anchor.setTo(0.5,0.5);
		
		ifSpeedPickup = false;
		ifSpreadPickup = false;
		ifShieldPickup = false;
	
	
		this.clickedTime = 0
		//  And some controls to play the this.game with
		continue_button = this.game.input.keyboard.addKey(Phaser.KeyCode.C);
		upgrage1_button = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		upgrage2_button = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		upgrage3_button = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
		upgrage0_button = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
	},
	
	resetUpdrages : function() {
		ifSpeedPickup = false;
		ifSpreadPickup = false;
		ifShieldPickup = false;
	},
	
	update : function() {
		//  Scroll the background
		starfield.tilePosition.y += 2;
		var currentTime = this.game.time.now;
		if (currentTime > this.clickedTime){
			if (upgrage0_button.isDown){
				this.resetUpdrages();
				this.clickedTime = currentTime + 200;
			}
			if (levelNo > 2){
				if (upgrage1_button.isDown){
					this.resetUpdrages();
					ifSpeedPickup = true;
					this.clickedTime = currentTime + 200;
				}
			}
			if (levelNo > 4){
				if (upgrage2_button.isDown){
					this.resetUpdrages();
					ifSpreadPickup = true;
					this.clickedTime = currentTime + 200;
				}
			}
			if (levelNo > 6){
				if (upgrage3_button.isDown){
					this.resetUpdrages();
					ifShieldPickup = true;
					this.clickedTime = currentTime + 200;
				}
			}
		}
		
		if (ifShieldPickup == true)
			arrow.x = 650;
		else if (ifSpreadPickup == true)
			arrow.x = 450;
		else if (ifSpeedPickup == true)
			arrow.x = 250;
		else
			arrow.x = 50;
		
		if (continue_button.isDown){
			this.game.state.start('gameStateVar', true, false, score, levelNo, ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		}		
	},
}
