//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////

function clog(e) {
  console.log(e)
}

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const router = express.Router();
const io = socketIO(server);

const GAME = require(path.resolve(__dirname, 'controlers'));

const PARAMS = require(path.resolve(__dirname, 'models/parameters'));
//const port = PARAMS.port;
const port = process.env.PORT || 80;
const rows = PARAMS.rows;
const cols = PARAMS.cols;

app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

app.use('/', require(path.resolve(__dirname, "controlers/routes")));
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

var maxplayers = 100;

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

io.on('connection', function(socket) {

  socket.on("login", function(data) {
    GAME.startplayergame(150, data.user, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS);
  });

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
