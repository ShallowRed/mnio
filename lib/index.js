const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const events = require('./events');

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

server.listen(Config.port, () => {
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log('App up and listening on port ' + Config.port)
  console.log(".........................................");
});

const MNIO = {
  PositionList: new Array(),
  PLAYERS: new Object()
};

events.once('initGridState', (grid) => {
  console.log("Grid ready, listening to socket connections");
  Object.assign(MNIO, grid)
  io.on('connection', openSocketConnection);
});

events.on('newPosition', ([lastPos, newPos]) => {
  lastPos && MNIO.PositionList.splice(MNIO.PositionList.indexOf(lastPos), 1);
  newPos && MNIO.PositionList.push(newPos);
});

events.on('setNewPlayer', ([socket, palette]) => {
  const player = MNIO.PLAYERS[socket.id];
  player.position = randompos(MNIO.ColorList);
  player.colors = palette;
  events.emit('initNewPlayer', [socket, player])
});

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null).filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

Database.init(Config);

const openSocketConnection = socket => {

  socket.on("username", username =>
    Database.log.user(username, socket));

  socket.on("password", data =>
    Database.log.pass(data[0], data[1], socket, MNIO)
  );

  socket.on("paletteSelected", index =>
    Player.initGame(index, socket)
  );

  socket.on('move', direction =>
    Player.move(direction, socket, MNIO)
  );

  socket.on('fill', ({color, position}) => {
    console.log("fill: " + color);
    const player = MNIO.PLAYERS[socket.id];
    Player.fill(position, color, socket, MNIO);
    Database.save.fill(position, player.name, player.dbid, color, MNIO.gameid);
  });

  socket.on('disconnect', () => {
    const player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    Player.disconnect(player, socket, MNIO.PositionList);
    if (!player.dbid || !player.colors) return;
    Database.save.player(player.dbid, player.colors, MNIO.gameid);
  });

  socket.on("setflag", data =>
    Database.save.flag(data)
  );
};
