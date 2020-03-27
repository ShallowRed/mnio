/////////// DEPENDENCIES & VARIABLES //////////////////
function clog(e) {
  console.log(e)
}
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const ejsLint = require('ejs-lint');
const session = require('express-session');
//const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const server = http.Server(app);
const io = socketIO(server);

const routes = require(path.resolve(__dirname, "utils/routes"));
const setparams = require(path.resolve(__dirname, 'utils/params'));
const trylogin = require(path.resolve(__dirname, 'utils/login'));
const convert = require(path.resolve(__dirname, 'utils/helpers'));
const setallowedcells = require(path.resolve(__dirname, 'utils/allowedcells'));
const isallowed = require(path.resolve(__dirname, 'utils/allowmove'));
const Player = require(path.resolve(__dirname, 'utils/newplayer'));

const setup = setparams(),
  port = setup.port,
  rows = setup.rows,
  cols = setup.cols,
  vrows = setup.vrows,
  vcols = setup.vcols,
  lw = setup.lw,
  limit = setup.limit,
  celltimeout = setup.celltimeout;

// Set port and start server.
app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

//Set view engine
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

//Routes to folders
app.use('/', routes);
app.use('/semantic', express.static('public/semantic'));
app.use('/static', express.static('public/static'));
app.use('/img', express.static('public/img'));

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

var positionlist = [];
var players = {};
var colorlist = new Array(rows * cols).fill(null)

io.on('connection', function(socket) {

  socket.on("login", function(data) {
    let login = trylogin(data.user, data.pass);

    if (login == 0) { // if player in db but wrong password
      socket.emit("alert", "Wrong password");

    } else if (login == 1) { // if player not in db
      socket.emit("logged_in");
      startusergame(socket, data.user);
      // req.session.userID = result.insertId;
      // req.session.save();

    } else { // if player in db and right password
      socket.emit("logged_in");
      startusergame(socket, data.user); // TODO retreive last position
      // req.session.userID = rows[0].id;
      // req.session.save();
    };
  });

  socket.on('askformove', function(direction) {
    let player = players[socket.id];
    let nextpos = isallowed(player, direction, colorlist);
    if (nextpos !== false) {
      newplayerpos(socket, nextpos, player.position);
    };
  });

  socket.on('newlocalcell', function(data) {
    newglobalcell(data[0], data[1], socket);
  });

  // TODO erase position when player disconnect
  // socket.on('disconnect', function(socket) {
  // });
});

//////////////// FUNCTIONS /////////////////

function startusergame(socket, username) {   // TODO split next/returning player
  let player = players[socket.id] = new Player(colorlist);
  clog(username);
  players[socket.id].name = username;
  clog(players);
  socket.emit('initplayer', {
    position: player.position,
    color1: player.color1,
    color2: player.color2,
    color3: player.color3,
  });
  socket.emit('initdata', {
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

 // Erase last position if it's not player's first one
  if (lastpos !== null) {
    socket.broadcast.emit("clearpos", lastpos);
  }
  positionlist.splice(positionlist.indexOf(lastpos), 1);

  // Set new position
  positionlist.push(nextpos);
  players[socket.id].position = nextpos;
  socket.broadcast.emit("newglobalpos", nextpos);
  socket.emit("newplayerpos", nextpos);

  let name = players[socket.id].username; //////////////////////////////
  clog("Player " + name + " is now on " + nextpos);
  clog(players);
}

function newglobalcell(position, color, socket) {
  //Find matching cell on global grid and edit changes
  colorlist[convert.postoindex(position)] = color;

  //Tell everyone which new cell is coloured
  socket.broadcast.emit('newglobalcell', {
    position: position,
    color: color,
  });

  //edit list of cells owned by player
  let owncells = players[socket.id].owncells;
  if (owncells.includes(position)) { // if already controlled do nothing
    let name = players[socket.id].username;  //////////////////////////////
    clog("Player " + name + " edited his own cell");
    clog(players);
    return;
  } else { //if new possession edit allowed cells
    owncells.push(position);
    let allowedcells = setallowedcells(owncells);
    players[socket.id].allowedcells = allowedcells;
    socket.emit('allowedcells', allowedcells);

    let name = players[socket.id].username;  //////////////////////////////
    clog("Player " + name + " conquered a new cell : " + position);
    clog("Player " + name + ' has new owned cells list : ' + owncells);
    clog("Player " + name + ' has new allowed cells list : ' + allowedcells);
    clog(players);
  };
}
