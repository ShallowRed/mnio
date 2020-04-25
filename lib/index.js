//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////
const app = require('express')();
const server = require('http').Server(app);
const Config = require('./config');
const Game = require('./game');
const Player = require('./models/player');
const User = require('./controlers/networking');
const Database = require('./controlers/database');

app.use('/', require("./controlers/routes"));

app.set('port', Config.port);

server.listen(Config.port, () => console.log('Starting server on port ' + Config.port));

// INITIALIZE
// const MNIO = new Game();

const MNIO = {
  ColorList: new Array(Config.rows * Config.cols).fill(null),
  PositionList: [],
  PLAYERS: {}
}

Database.connect();
Database.init(MNIO.ColorList);

// ON PLAYER CONNECTION

require('socket.io')(server).on('connection', socket => {

  socket.on("login", data => Database.log(data.user, data.pass, socket, MNIO));

  socket.on('MovePlayer', direction => User.update(direction, socket, MNIO));

  socket.on('DrawCell', cell => {
    User.render(cell, socket, MNIO);
    Database.SaveFill(cell[0], MNIO.PLAYERS[socket.id].dbid, cell[1].split('#')[1]);
  });

  socket.on('disconnect', () => {
    if (!MNIO.PLAYERS[socket.id]) return;
    User.disconnect(socket, MNIO);
    Database.SavePlayer(MNIO.PLAYERS[socket.id].dbid, MNIO.PLAYERS[socket.id].colors);
    // TODO:  erase contribution less than n cells
  });

  socket.on("getcurrent", () => socket.emit("current", {
    ColorList: MNIO.ColorList,
    rows: Config.rows,
    cols: Config.cols
  }));

  socket.on("getgames", () => Database.getgames(socket));

  socket.on("gettable", data => Database.gettable(socket, data));

  socket.on("setflag", data => Database.setflag(data));

});

// TODO: spectator mode based on admin mode
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
