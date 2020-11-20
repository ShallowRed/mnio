const Map = require('./Map');
const Game = require('./Game');
const getGameFromDatabase = require('../database/init/getLastGame');

module.exports = async io => {
  const mapState = await getGameFromDatabase();
  const map = new Map(mapState);
  const game = new Game(map, io);
  console.log("\n\r");
  console.log("Game is up and listening to socket connections\n\r");
};
