const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Routes = require("./routes");
const Config = require('./config');
// const { port } = require('./config');

const Game = require('./game');
const Network = require('./network');
// const initDatabase = require('./database/initDatabase');
const Database = require('./database');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use('/', Routes);

app.set('port', Config.port);

server.listen(Config.port, () => {
  console.log("-----------------------------------------");
  console.log(`App up and listening on port ${Config.port}`)
});

const initGame = async () => {
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log(Config);
  const database = await new Database(Config)
  const gameState = await database.initNGetGridState();
  const game = new Game(gameState);
  const network = new Network(game, database, io);
  console.log("Game is ready and listening to socket connections");
  console.log("-----------------------------------------");
};

initGame();
