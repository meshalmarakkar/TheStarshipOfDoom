var TheGame = TheGame || {};

TheGame.game = new Phaser.Game(800, 600, Phaser.AUTO, "TheGame");

TheGame.game.state.add("loadStateVar",TheGame.loadState);
TheGame.game.state.add("menuStateVar",TheGame.menuState);
TheGame.game.state.add("intermediateStateVar",TheGame.intermediateState);
TheGame.game.state.add("gameStateVar",TheGame.gameState);
TheGame.game.state.add("gameoverStateVar",TheGame.gameoverState);

TheGame.game.state.start("loadStateVar");


