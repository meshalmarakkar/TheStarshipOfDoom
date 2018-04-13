var TheStarshipOfDoom = TheStarshipOfDoom || {};

TheStarshipOfDoom.game = new Phaser.Game(800, 600, Phaser.AUTO, "TheStarshipOfDoom");

TheStarshipOfDoom.game.state.add("loadStateVar",TheStarshipOfDoom.loadState);
TheStarshipOfDoom.game.state.add("menuStateVar",TheStarshipOfDoom.menuState);
TheStarshipOfDoom.game.state.add("intermediateStateVar",TheStarshipOfDoom.intermediateState);
TheStarshipOfDoom.game.state.add("gameStateVar",TheStarshipOfDoom.gameState);
TheStarshipOfDoom.game.state.add("gameoverStateVar",TheStarshipOfDoom.gameoverState);

TheStarshipOfDoom.game.state.start("loadStateVar");


