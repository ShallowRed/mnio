/////////// DEPENDENCIES & VARIABLES //////////////////
function clog(e) {
  console.log(e)
}
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const session = require('express-session');
//const bodyParser = require('body-parser');
const app = express();
const server = http.Server(app);
const router = express.Router();
const io = socketIO(server);

const setparams = require(path.resolve(__dirname, 'utils/params'));
const trylogin = require(path.resolve(__dirname, 'utils/controlers/login'));
const setallowedcells = require(path.resolve(__dirname, 'utils/models/allowedcells'));
const isallowed = require(path.resolve(__dirname, 'utils/models/allowedmoves'));
const Player = require(path.resolve(__dirname, 'utils/players/newplayer'));

app.use('/', require(path.resolve(__dirname, "utils/controlers/routes"))); //Routes to folders
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

const setup = setparams(),
  port = setup.port,
  rows = setup.rows,
  cols = setup.cols,
  vrows = setup.vrows,
  vcols = setup.vcols,
  lw = setup.lw,
  limit = setup.limit,
  celltimeout = setup.celltimeout;

app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

//////////////// SESSION /////////////////

// var MySQLStore = require('express-mysql-session')(session);

// var sessionStore = new MySQLStore({
//   host: config.host,
//   port: 3306,
//   user: config.user,
//   password: config.password,
//   database: 'session_test'
// });

// var sessionMiddleware = session({
//   key: 'mniocookie',
//   secret: 'session_cookie_secret',
//   store: sessionStore,
//   resave: false,
//   saveUninitialized: false
// });
//
// io.use(function(socket, next) {
//   sessionMiddleware(socket.request, socket.request.res, next);
// });
//
// app.use(sessionMiddleware);

//io.on('connection', function(socket) {
// var req = socket.request;
// clog("req session ID is :" + req.sessionID);
// clog("socket id is :" + socket.id);
// req.session.save();

// TODO retreive last position if same session

// if (req.session.userID != null) {
//   clog("session userid is not null")
//   db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function(err, rows, fields) {
//     socket.emit("logged_in");
//   });
// } else {
//   clog("session userid is null")
// }
// }

////////////////INITIALIZE/////////////////

var colorlist = new Array(rows * cols).fill(null)
var positionlist = [];
var players = {};

io.on('connection', function(socket) {

  // TEST
  socket.emit("logged_in");
  startusergame(socket, "test");

  // PRODUCTION
  // socket.on("login", function(data) {
  // let login = trylogin(data.user, data.pass);
  //
  // if (login == 0) { // if player in db but wrong password
  //   socket.emit("alert", "Wrong password");
  //
  // } else if (login == 1) { // if player not in db
  //   socket.emit("logged_in");
  //   startusergame(socket, data.user);
  //   // req.session.userID = result.insertId;
  //   // req.session.save();
  //
  // } else { // if player in db and right password
  //   socket.emit("logged_in");
  //   startusergame(socket, data.user); // TODO retreive last position
  //   // req.session.userID = rows[0].id;
  //   // req.session.save();
  // };
  // });

  socket.on('ismoveok', function(direction) {
    let nextpos = isallowed(players[socket.id], direction, colorlist);
    if (nextpos) newplayerpos(socket, nextpos, players[socket.id].position);
  });

  socket.on('newlocalcell', function(cell) {
    newglobalcell(cell[0], cell[1], socket);
  });
  // TODO erase position when player disconnect
});

//////////////// FUNCTIONS /////////////////

function startusergame(socket, username) { // TODO split next/returning player
  let player = players[socket.id] = new Player(colorlist);
  player.name = username; // TODO: set username from db and set dbid
  socket.emit('initdata', {
    position: player.position,
    color1: player.color1,
    color2: player.color2,
    color3: player.color3,
    colorlist: colorlist,
    positionlist: positionlist,
    rows: rows,
    cols: cols,
    vrows: vrows,
    vcols: vcols,
    lw: lw,
    celltimeout: celltimeout
  });
  newplayerpos(socket, player.position, null);
}

function newplayerpos(socket, nextpos, lastpos) {

  // Set new position and inform everyone
  positionlist.push(nextpos);
  players[socket.id].position = nextpos;
  socket.broadcast.emit("newglobalpos", nextpos);
  console.log("Player " + players[socket.id].username + " is now on " + nextpos);

  // If it's not player's first one
  if (lastpos) {
    socket.emit("newplayerpos", nextpos);
    socket.broadcast.emit("clearpos", lastpos);
    positionlist.splice(positionlist.indexOf(lastpos), 1);
  }
}

function newglobalcell(position, color, socket) {

  // Store changes in colorlist and inform everyone about it
  colorlist[position] = color;
  socket.broadcast.emit('newglobalcell', {
    position: position,
    color: color,
  });

  // Update player's owncells and allowedcells
  let player = players[socket.id];
  if (player.owncells.includes(position)) { // if already controlled do nothing
    console.log("Player " +  player.username + " edited his own cell");
    return;

  } else { //if new possession edit
    player.owncells.push(position);
    let allowedcells = setallowedcells(player.owncells);
    player.allowedcells = allowedcells;
    socket.emit('allowedcells', allowedcells);
    console.log("Player " + player.username + " conquered a new cell : " + position);
  };
}
