const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Config = require('./config');
const Routes = require("./routes");

const Database = {
  init: require('./database/init'),
  log: require('./database/log'),
  save: require('./database/save')
}

const Player = {
  initGame: require('./player/init'),
  fill: require('./player/fill'),
  move: require('./player/move'),
  disconnect: require('./player/disconnect')
}

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use('/', Routes);

app.set('port', Config.port);

server.listen(Config.port, () =>
  console.log('Starting server on port ' + Config.port)
);

const MNIO = {
  ColorList: new Array(Config.rows * Config.cols).fill(null),
  PositionList: new Array(),
  PLAYERS: new Object()
}

Database.init(MNIO.ColorList);

io.on('connection', socket => {

  socket.on("username", username =>
    Database.log.user(username, socket));

  socket.on("password", data =>
    Database.log.pass(data[0], data[1], socket, MNIO)
  );

  socket.on("paletteSelected", index =>
    Player.initGame(index, socket, MNIO)
  );

  socket.on('move', direction =>
    Player.move(direction, socket, MNIO)
  );

  socket.on('fill', cell => {
    console.log("fill: " + cell.color);
    const player = MNIO.PLAYERS[socket.id];
    Player.fill(cell.position, cell.color, socket, MNIO);
    Database.save.fill(cell.position, player.name, player.dbid, cell.color);
  });

  socket.on('disconnect', () => {
    const player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    Player.disconnect(player, socket, MNIO.PositionList);
    if (!player.dbid || !player.colors) return;
    Database.save.player(player.dbid, player.colors);
  });
 
  socket.on("setflag", data =>
    Database.save.flag(data)
  );

});
