//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Config = require('../config/mnio.config');
const Player = require('./models/player');
const User = require('./controlers/networking');
const Database = require('./controlers/database');
const pokedex = require('./models/pokedex');

app.use('/', require("./controlers/routes"));

app.set('port', Config.port);

server.listen(Config.port, () => console.log('Starting server on port ' + Config.port));

const MNIO = {
  ColorList: new Array(Config.rows * Config.cols).fill(null),
  PositionList: [],
  PLAYERS: {}
}

Database.init(MNIO.ColorList);

io.on('connection', socket => {

  socket.on("username", username => Database.log.user(username, socket));

  socket.on("password", data => Database.log.pass(data[0], data[1], socket, MNIO));

  socket.on("setInit", index => {
    const position = MNIO.PLAYERS[socket.id].position = randompos(MNIO.ColorList);
    MNIO.PLAYERS[socket.id].colors = pokedex[index];
    socket.emit("startPos", position);
  });

  socket.on('MovePlayer', direction => {
    socket.emit("moveCallback");
    User.update(direction, socket, MNIO);
  });

  socket.on('DrawCell', cell => {
    socket.emit("fillCallback");
    User.render(cell, socket, MNIO);
    Database.save.fill(cell[0], MNIO.PLAYERS[socket.id].dbid, cell[1].split('#')[1]);
  });

  socket.on('disconnect', () => {
    let player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    User.disconnect(socket, MNIO);
    if (!player.dbid || !player.colors) return;
    Database.save.player(player.dbid, player.colors);
  });

  socket.on("setflag", data => Database.save.flag(data));

});

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null).filter(e => e !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// TODO:  erase contribution less than n cells
// TODO:  erase position from admin
// TODO: allow several games at the same
// class mniogame {
//   constructor(){
//     this.Colorlist = new Array(Config.rows * Config.cols).fill(null);
//     this.PositionList = [];
//     this.PLAYERS = {}
//   }
// }
// setters:
//   push new player in Players
//   push position in PositionList
//   remove position from PositionList
//   push color in Colorlist
// var MNIO = new mniogame();
