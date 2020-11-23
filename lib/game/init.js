const Game = require('./Game');
const getGameFromDatabase = require('../database/init/getLastGame');

module.exports = async io => {
  const mapState = await getGameFromDatabase();
  const game = new Game(mapState, io);
  console.log("\n\r");
  console.log("Game is up and listening to socket connections\n\r");
};
