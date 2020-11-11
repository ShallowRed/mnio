const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Routes = require("./routes");
const { port, db } = require('./config');

const Game = require('./Game');
const Network = require('./network/Network');
const Database = {
  init: require('./database/init/initDatabase'),
  getGame: require('./database/init/getGame')
};

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use('/', Routes);

app.set('port', port);

server.listen(port, () => {
  console.log("-----------------------------------------");
  console.log(`App up and listening on port ${port}`)
});

const initGame = async () => {
  const gameState = await Database.getGame();
  const game = new Game(gameState);
  const network = new Network(game, io);
  network.openSocketConnection();
  console.log("Game is ready and listening to socket connections");
  console.log("-----------------------------------------");
};

Database.init();
initGame();
