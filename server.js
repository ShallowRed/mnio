//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const router = express.Router();
const io = socketIO(server);

const Player = require(path.resolve(__dirname, 'controlers'));
const Database = require(path.resolve(__dirname, 'controlers/database'));
const Config = require(path.resolve(__dirname, 'controlers/config'));

app.set('port', Config.port);
server.listen(Config.port, function() {
  console.log('Starting server on port ' + Config.port);
});

app.use('/', require(path.resolve(__dirname, "controlers/routes")));
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));


////////////////////////////// INITIALIZE //////////////////////////////////////

const MNIO = {
  ColorList: new Array(Config.rows * Config.cols).fill(null),
  PositionList: [],
  PLAYERS: {}
}
Database.connect();
Database.init(MNIO.ColorList);
// Database.getgames();

//////////////////////////// ON PLAYER CONNECTION //////////////////////////////

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
// TODO: spectator mode based on admin mode

// TODO:  erase position from admin
});

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
