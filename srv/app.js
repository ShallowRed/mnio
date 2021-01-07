const server = require('./lib/server/server');
const initDatabase = require('./lib/database/scripts/initDatabase');
const fetchGame = require('./lib/database/scripts/getLastGame');
const Game = require('./lib/game/Game');

const app = async () => {
  console.log("\n\r-----------------------------------------\n\r");

  initDatabase();

  const mapState = await fetchGame();

  new Game(mapState, server());

  console.log("\n\r");
  console.log("Game is up !\n\r");
}

app();
