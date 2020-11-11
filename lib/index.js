const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Routes = require("./routes");
const { port, db } = require('./config');
const initDatabase = require('./database/init/initDatabase');
const initGame = require('./service/');

const app = express();
app.use('/', Routes);
app.set('port', port);

const server = http.Server(app);
const io = socketIo(server);

server.listen(port, () => {
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log(`Listening on port ${port}`)
});

initDatabase();

initGame(io);
