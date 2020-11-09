const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Routes = require("./routes");
const { port } = require('./config');
const initDB = require('./database/initDatabase');
const { initGame } = require('./mnio');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use('/', Routes);

app.set('port', port);

server.listen(port, () => {
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log(`App up and listening on port ${port}`)
  console.log(".........................................");
});

initDB();
initGame(io);
