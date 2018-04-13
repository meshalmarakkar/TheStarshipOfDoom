var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.loadState = function(){ 	
	TheStarshipOfDoom.gameWidth = 800;
	TheStarshipOfDoom.gameHeight = 600;
};
TheStarshipOfDoom.loadState.prototype = {
	
	preload: function(){
		
		//game loading text
		var text = "Loading...";
		var style = { font: "13px Open Sans", fill: "#aaa", align: "center" };
		this.loadingTextNode = this.game.add.text(this.game.width/2, this.game.height/2 + 30, text, style);
		this.loadingTextNode.anchor.set(0.5);
	
		//Backgrounds
		this.game.load.image('starfield', 'assets/starfield.png');
		this.game.load.image('starfield2', 'assets/starfield2.png');
		this.game.load.image('starfield3', 'assets/starfield3.png');
		this.game.load.image('starfield4', 'assets/starfield4.png');
		
		//Enemies
		this.game.load.image('bullet', 'assets/bullet.png');
		this.game.load.image('enemyBullet', 'assets/enemy-bullet.png');
		this.game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
		this.game.load.spritesheet('invaderDefence', 'assets/invader132x32x4.png', 32, 32);
		this.game.load.spritesheet('invaderSpeed', 'assets/invader2.png', 32, 32);
		this.game.load.image('Boss_1', 'assets/Xion3.png');
		this.game.load.image('Boss_2', 'assets/Xion2.png');
		this.game.load.image('Boss_3', 'assets/Boss_1.png');
		this.game.load.image('Boss_4', 'assets/Boss_Combined.png');
		
		//Players
		this.game.load.image('ship', 'assets/player.png');
		this.game.load.image('playerLV1', 'assets/playerLV1.png');
		this.game.load.image('playerLV2', 'assets/playerLV2.png');
		this.game.load.image('playerLV3', 'assets/playerLV3.png');
		this.game.load.image('playerLV4', 'assets/playerLV4.png');
		
		//Effects
		this.game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
		this.game.load.image('shield', 'assets/Shield.png');
		
		//Menu assets
		this.game.load.image('arrow', 'assets/arrow.png');
		this.game.load.image('backButton', 'assets/backButton.png');
		this.game.load.image('buttonSave', 'assets/button_save.png');
		this.game.load.image('buttonPlay', 'assets/button_play.png');
			
		//Audio assets
		this.game.load.audio('shoot', 'assets/audio/blaster.mp3');
		this.game.load.audio('backgroundMusic', 'assets/audio/music.ogg', );
		this.game.load.audio('death', 'assets/audio/alien_death1.wav', );
	},

  	create: function(){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);		
		this.game.state.start("menuStateVar");
	},
	
	update: function () {

	},	
}

