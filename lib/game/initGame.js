const Game = require('./Game');
const Network = require('./Network');
const getGameFromDatabase = require('../database/init/getLastGame');

module.exports = async io => {
  const gameState = await getGameFromDatabase();
  const game = new Game(gameState);
  const network = new Network(game, io);
  console.log("Game is up and listening to socket connections");
  console.log("-----------------------------------------");
};
