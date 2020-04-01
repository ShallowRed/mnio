//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const router = express.Router();
const io = socketIO(server);

const GAME = require(path.resolve(__dirname, 'controlers'));
//const DATABASE = require(path.resolve(__dirname, 'controlers/database'));

const PARAMS = require(path.resolve(__dirname, 'models/parameters'));
const port = PARAMS.port;
const maxplayers = PARAMS.maxplayers;
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

// Create an array to store the palettes used by players after deconnection
var PaletteList = new Array(maxplayers);

// Create an array to store the ownings of each player after deconnection
var OwningList = new Array(maxplayers);

// Create an object to store active players data
var PLAYERS = {};

//////////////////////////// ON PLAYER CONNECTION //////////////////////////////

// TODO: clear dependencies in package.json
// TODO: clean database system
// TODO: allow several games at the same
// TODO: admin page

io.on('connection', function(socket) {

  //test
  GAME.startplayergame(150, "test", socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS);

  //prod
  // socket.on("login", function(data) {
  //   DATABASE.LogPlayer(data.user, data.pass, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS);
  // });

  socket.on('moveplayer', function(direction) {
    GAME.MovePlayer(direction, socket, ColorList, PositionList, PLAYERS);
  });

  socket.on('drawcell', function(cell) {
    GAME.DrawCell(cell, socket, ColorList, OwningList, PLAYERS);
  });

  socket.on('disconnect', function() {
    GAME.DisconnectPlayer(socket, OwningList, PaletteList, PositionList, PLAYERS);
  });

});
