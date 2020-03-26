/////////// DEPENDENCIES & VARIABLES //////////////////
//Setup
function clog(e) {
  console.log(e)
}
const express = require('express'),
  http = require('http'),
  path = require('path'),
  socketIO = require('socket.io'),
  ejsLint = require('ejs-lint'),
  grid = require(__dirname + '/utils/globalgrid'),
  colors = require(__dirname + '/utils/colors'),
  mysql = require('mysql'),
  //cookieParser = require('cookie-parser'),
  session = require('express-session');

const app = express(),
  server = http.Server(app),
  io = socketIO(server);

const setup = grid.setup(),
  port = setup.port,
  rows = setup.rows,
  cols = setup.cols,
  vrows = setup.vrows,
  vcols = setup.vcols,
  lw = setup.lw,
  limit = setup.limit,
  celltimeout = setup.celltimeout;

var positionlist = [],
  players = {};

// Set port and start server.
app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

//Set view engine
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

//Routes to folders
var router = express.Router();
var routes = require(__dirname + '/utils/myroutes');
app.use('/', routes);
app.use('/semantic', express.static('public/semantic'));
app.use('/static', express.static('public/static'));
app.use('/img', express.static('public/img'));

var sessionMiddleware = session({
  secret: "keyboard cat"
});

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

////////////////DATABASE/////////////////
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
db.connect(function(error) {
  if (!!error)
    throw error;

  console.log('mysql connected to ' +
    config.host + ", user " +
    config.user + ", database " +
    config.base);
});

////////////////SESSION/////////////////
app.use(sessionMiddleware);

////////////////INITIALISE/////////////////
var colorlist = new Array(rows * cols).fill(null)

////////////////ACTUAL CODE/////////////////
io.on('connection', function(socket) {
  var req = socket.request;

  // TODO downhere, retreive last position
  // if same session

  // if (req.session.userID != null) {
  //   clog("session userid is not null")
  //   db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function(err, rows, fields) {
  //     socket.emit("logged_in");
  //   });
  // } else {
  //   clog("session userid is null")
  // }

  socket.on("login", function(data) {
    const user = data.user,
      pass = data.pass;
    db.query("SELECT * FROM users WHERE Username=?", [user],
      function(err, rows, fields) {

        // If player id is not in database
        if (rows.length == 0) {
          console.log("Not in database");
          db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass],
            function(err, result) {
              if (!!err)
                throw err;
              //console.log(result);
              socket.emit("logged_in");
              startusergame(socket);
              // req.session.userID = result.insertId;
              // req.session.save();
            });
        }

        // If player id is already in database
        else {
          clog(rows);
          console.log("Already in database");
          const dataUser = rows[0].Username,
            dataPass = rows[0].Password;
          if (pass !== dataPass) {
            socket.emit("alert", "Wrong password");
          } else {
            socket.emit("logged_in");
            startusergame(socket);
            // req.session.userID = rows[0].id;
            // req.session.save();
            //clog(req.session);
          }
        }
      });
  });

  socket.on('askformove', function(direction) {
    moveplayer(direction, socket);
  });

  socket.on('newlocalcell', function(data) {
    newglobalcell(data[0], data[1], socket);
  });

  // todo here: erase position when player disconnect
  // socket.on('disconnect', function(socket) {
  //   clog(players[socket.id]);
  //   socket.broadcast.emit("clearpos", players[socket.id]);
  // });

});

////////////////MY FUNCTIONS/////////////////

// Constructor for new player
class Player {
  constructor(colorlist) {
    this.position = grid.randompos(colorlist);
    this.color1 = colors.randomcolor()
    this.color2 = colors.randomcolor()
    this.color3 = colors.randomcolor()
    this.owncells = [];
    this.allowedcells = [];
  }
}

function startusergame(socket) {
  // TODO : split next player and returning player situations
  let player = players[socket.id] = new Player(colorlist);
  clog("new player :");
  //clog(player);
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

function moveplayer(direction, socket) {
  let player = players[socket.id];
  let playerx = grid.postocoord(player.position)[0];
  let playery = grid.postocoord(player.position)[1];

  //Evaluate which cell is wanted, cancel if outside the grid
  switch (direction) {
    case "up":
      if (playerx == 0) return;
      playerx--;
      break;
    case "down":
      if (playerx == cols - 1) return;
      playerx++;
      break;
    case "left":
      if (playery == 0) return;
      playery--;
      break;
    case "right":
      if (playery == rows - 1) return;
      playery++;
      break;
  }
  let nextpos = grid.coordtopos(playerx, playery);
  let nextposindex = grid.coordtoindex(playerx, playery);

  // Check if next move is possible (available + allowed) and move if ok
  if (player.owncells.includes(nextpos) ||
    (colorlist[nextposindex] == null && player.allowedcells.includes(nextpos))) {
    newplayerpos(socket, nextpos, player.position);
  };
}

function newplayerpos(socket, nextpos, lastpos) {

  // Erase last position
  if (lastpos !== null) {
    socket.broadcast.emit("clearpos", lastpos);
  }
  positionlist.splice(positionlist.indexOf(lastpos), 1);

  // Set new position
  positionlist.push(nextpos);
  players[socket.id].position = nextpos;
  socket.broadcast.emit("newglobalpos", nextpos);
  socket.emit("newplayerpos", nextpos);
}

function newglobalcell(position, color, socket) {

  //edit list of cells owned by player
  let owncells = players[socket.id].owncells;
  if (owncells.includes(position)) { // if already controlled do nothing
    return false;
  } else {  //if new possession edit allowed cells
    owncells.push(position);
    let allowedcells = grid.setallowedcells(owncells);
    players[socket.id].allowedcells = allowedcells;
    socket.emit('allowedcells', allowedcells);
  };

  //Find matching cell on global grid and edit changes
  let cellindex = grid.postoindex(position);
  colorlist[cellindex] = color;

  //Tell everyone which new cell is coloured
  socket.broadcast.emit('newglobalcell', {
    position: position,
    color: color,
  });
}
