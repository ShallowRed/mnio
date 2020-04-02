//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const router = express.Router();
const io = socketIO(server);

const Database = require(path.resolve(__dirname, 'controlers/database'));
const Action = require(path.resolve(__dirname, 'controlers/actions'));
const DisconnectPlayer = require(path.resolve(__dirname, 'controlers/disconnexion'));

const PARAMS = require(path.resolve(__dirname, 'models/parameters'));
const maxplayers = PARAMS.maxplayers;
const port = PARAMS.port;
const rows = PARAMS.rows;
const cols = PARAMS.cols;

app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

app.use('/', require(path.resolve(__dirname, "controlers/routes")));
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

////////////////////////////// INITIALIZE //////////////////////////////////////

// Create an array to store the color value of each cell in the grid
var ColorList = new Array(rows * cols).fill(null)

// Create an array to store the position of each active player on the grid
var PositionList = [];

// Create an object to store active players data
var PLAYERS = {};

//////////////////////////// ON PLAYER CONNECTION //////////////////////////////

// TODO: clear dependencies in package.json
// TODO: clean database system
// TODO: allow several games at the same
// TODO: admin page
// TODO: setup db on remote alpine

io.on('connection', function(socket) {

  //test
  // InitPlayer(150, "test", socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS);

  //prod
  socket.on("login", function(data) {
    Database.LogPlayer(data.user, data.pass, socket, ColorList, PositionList, PLAYERS);
  });

  socket.on('moveplayer', function(direction) {
    Action.MovePlayer(direction, socket, ColorList, PositionList, PLAYERS);
  });

  socket.on('drawcell', function(cell) {
    Action.DrawCell(cell, socket, ColorList, PLAYERS);
    Database.SaveFill(cell[0], PLAYERS[socket.id].dbid, cell[1].split('#')[1]);
  });

  socket.on('disconnect', function() {
    DisconnectPlayer(socket, PositionList, PLAYERS);
  });

});
