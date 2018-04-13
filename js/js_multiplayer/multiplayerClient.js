var TheGame = TheGame || {};

TheGame.MultiplayerServerReady = false;
TheGame.playerList = TheGame.playerList || {};
TheGame.myID = 0;
TheGame.secondPlayerLoaded = false;

//this function will handle client communication with the server
TheGame.eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function (proxy) {		
		TheGame.eurecaServer = proxy;
	});
	
	
	//methods defined under "exports" namespace become available in the server side
	
	eurecaClient.exports.setId = function(id) 
	{
		TheGame.myID = id;
		TheGame.eurecaServer.handshake();
		TheGame.MultiplayerServerReady = true;
	}	
	
	eurecaClient.exports.kill = function(id)
	{	
		if (TheGame.playerList[id]) {
			TheGame.playerList[id].kill();
			console.log('killing ', id, TheGame.playerList[id]);
		}
	}	
	
	eurecaClient.exports.spawnAnotherPlayer = function(id, x, y, ifSpeedPickup, ifSpreadPickup, ifShieldPickup)
	{
		if (id == TheGame.myID) return; //this is me
		
		//console.log('Spawning another player with name ' + ip);
		var plr = new TheGame.Player(TheGame.game, 2, x, y, ifSpeedPickup, ifSpreadPickup, ifShieldPickup);
		TheGame.secondPlayerID = id;
		TheGame.secondPlayerLoaded = true;
		TheGame.playerList[id] = plr;
	}
	
	eurecaClient.exports.updatePlayerState = function(id, state)
	{
		if (TheGame.playerList[id] && TheGame.myID  !== id)  {
			TheGame.playerList[id].updateFromServer(state.x, state.y, state.shoot);
		}
	}
	
	eurecaClient.exports.spawnNewEnemy = function(id, levelNo)
	{
		if (id == TheGame.myID) return; //this is me
		TheGame.enemy = new TheGame.Enemy(levelNo);
	}
	
	eurecaClient.exports.updateEnemyShoot = function(id, state)
	{
		if (TheGame.enemy && TheGame.myID  !== id)  {
			TheGame.enemy.updateFromServerShoot(state.x, state.y);
		}
	}
	
	eurecaClient.exports.updateEnemyState = function(id, state)
	{
		if (TheGame.enemy && TheGame.myID  !== id)  {
			TheGame.enemy.updateFromServer(state.x, state.y);
		}
	}
}
