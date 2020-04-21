//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Player = require('./networking');
const Database = require('./database');
const Config = require('./config');

app.use('/', require("./routes"));

app.set('port', Config.port);

server.listen(Config.port, function() {
  console.log('Starting server on port ' + Config.port);
});

// const path = require('path');
// const router = require('express').Router();
// app.set('view engine', 'ejs');
// app.set("views", path.resolve(__dirname, "dist"));
// app.set("views", path.resolve(__dirname, "src"));

// INITIALIZE

const MNIO = {
  ColorList: new Array(Config.rows * Config.cols).fill(null),
  PositionList: [],
  PLAYERS: {}
}
Database.connect();
Database.init(MNIO.ColorList);
// Database.getgames();

// ON PLAYER CONNECTION

io.on('connection', function(socket) {

  socket.on("login", function(data) {
    Database.log(data.user, data.pass, socket, MNIO);
  });

  // GAME.InitPlayer("test", 150, null, [], [], socket, MNIO);

  socket.on('MovePlayer', function(direction) {
    Player.update(direction, socket, MNIO);
  });

  socket.on('DrawCell', function(cell) {
    Player.render(cell, socket, MNIO);
    Database.SaveFill(cell[0], MNIO.PLAYERS[socket.id].dbid, cell[1].split('#')[1]);
  });

  socket.on('disconnect', function() {
    if (!MNIO.PLAYERS[socket.id]) return;
    Player.disconnect(socket, MNIO);
    Database.SavePlayer(MNIO.PLAYERS[socket.id].dbid, MNIO.PLAYERS[socket.id].colors);
    // TODO:  erase contribution less than n cells
  });

  socket.on("getcurrent", function() {
    socket.emit("current", {
      ColorList: MNIO.ColorList,
      rows: Config.rows,
      cols: Config.cols
    });
  })

  socket.on("getgames", function() {
    Database.getgames(socket);
  })

  socket.on("gettable", function(data) {
    Database.gettable(socket, data);
  })

  socket.on("setflag", function(data) {
    Database.setflag(data);
  })

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
