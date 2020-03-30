//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////

function clog(e) {
  console.log(e)
}

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const mysql = require('mysql');

const app = express();
const server = http.Server(app);
const router = express.Router();
const io = socketIO(server);

const GAME = require(path.resolve(__dirname, 'controlers'));

const PARAMS = require(path.resolve(__dirname, 'models/parameters'));
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

const IsUserinDB = "SELECT * FROM users WHERE Username=?";
const AddUsertoDB = "INSERT INTO users(`Username`, `Password`) VALUES(?, ?)";

const config = {
  "host": "localhost",
  "user": "root",
  "password": "",
  "base": "mniosql"
};

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.base
});

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

// Connect to mySQL database
db.connect(function(error) {
  if (!!error)
    throw error;
  console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
});

//////////////////////////// ON PLAYER CONNECTION //////////////////////////////

io.on('connection', function(socket) {

  socket.on("login", function(data) {
    let user = data.user;
    db.query(IsUserinDB, [user], function(err, rows, fields) {

      // If user is not in database, create a new id and start the game
      if (!rows.length) db.query(AddUsertoDB, [user, data.pass], function(err, result) {
        if (!!err) throw err;
        GAME.startplayergame(result.insertId, user, socket, OwningList, PaletteList, ColorList, PositionList); // req.session.userID = result.insertId; req.session.save();
      });

      // If user is in database, start the game if password is right
      else if (data.pass == rows[0].Password) GAME.startplayergame(rows[0].id, user, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS);
      else socket.emit("alert", "Wrong password");
    });
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
