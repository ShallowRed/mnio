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

var gridstate = [],
  positionlist = [],
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
gridstate = grid.initgrid();
var colorlist = new Array(rows*cols);

////////////////ACTUAL CODE/////////////////
io.on('connection', function(socket) {
  var req = socket.request;

  // TODO downhere, retreive last position
  // if same session

  // clog(req.session);
  // if (req.session.userID != null) {
  //   clog("session userid is not null")
  //   db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function(err, rows, fields) {
  //     socket.emit("logged_in");
  //   });
  // } else {
  //   clog("session userid is null")
  // }

  socket.on("login_register", function(data) {
    clog(data);
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

function startusergame(socket) {

  // todo : split next player and returning player situations

  //Create new player with random position and color
  let newrandom = grid.newrdm(socket, gridstate);
  gridstate = newrandom.gridstate;
  players[socket.id] = newrandom.playerinfo;
  // clog(players[socket.id]);
  clog("new player :");
  clog(players[socket.id]);

  //Send player the data needed for initialization
  socket.emit('initplayer', players[socket.id]);
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

  newplayerpos(socket, players[socket.id].playerpos, 0);
}

function moveplayer(direction, socket) {

  let playerpos = players[socket.id].playerpos;
  let playerx = parseInt(playerpos.split('_')[0]);
  let playery = parseInt(playerpos.split('_')[1]);

  //stop the function if next move is outside the grid
  if ((direction == "up" && playerx == 0) ||
  (direction == "down" && playerx == cols - 1) ||
  (direction == "left" && playery == 0) ||
  (direction == "right" && playery == rows - 1)) {
    return;
  }

  //Evaluate which cell is wanted, check if available, move if so
  let nextpos = getnextpos(playerpos, direction);
  if (isnextok(socket, nextpos)) {
    newplayerpos(socket, nextpos, playerpos);
  }
}

function getnextpos(playerpos, direction) {

  let next = {
    x: parseInt(playerpos.split('_')[0]),
    y: parseInt(playerpos.split('_')[1]),
  };

  if (direction == "up") {
    next.x -= 1;
  } else if (direction == "down") {
    next.x += 1;
  } else if (direction == "left") {
    next.y -= 1;
  } else if (direction == "right") {
    next.y += 1;
  }
  let nextpos = "" + next.x + "_" + next.y + ""
  return nextpos
}

function isnextok(socket, nextpos) {

  let nextcelltry = gridstate.find(function(cell) {
    return cell.id == nextpos;
  });
  // TODO: check with owncells and not gridstate
  if (nextcelltry.class == socket.id) {
    return true;
  } else if (nextcelltry.class !== "none") {
    return false;
  } else {
    let allowedcells = players[socket.id].allowedcells;
    if (allowedcells.includes(nextcelltry.id)) {
      return true;
    } else {
      return false;
    }
  }

}

function newplayerpos(socket, nextpos, playerpos) {
  // Erase last position
  if (playerpos !== 0) {
    socket.broadcast.emit("clearpos", playerpos);
  }
  let index = positionlist.indexOf(playerpos);
  if (index > -1) {
    positionlist.splice(index, 1);
  }

  // Set new position
  players[socket.id].playerpos = nextpos;
  positionlist.push(nextpos);
  socket.broadcast.emit("newglobalpos", nextpos);
  socket.emit("newplayerpos", nextpos);
}

function newglobalcell(playerpos, color, socket) {

  //edit changes for local player
  let owncells = players[socket.id].owncells;
  owncells.push(playerpos);
  let allowedcells = setallowedcells(socket);
  players[socket.id].allowedcells = allowedcells;
  socket.emit('allowedcells', allowedcells);
  //todo here : remove cell if already controlled, set new color

  //Find matching cell on global grid and edit changes
  let globalcell = gridstate.find(function(cell) {
    return cell.id == playerpos;
  });
  globalcell.color = color;
  globalcell.class = "" + socket.id;

  // TODO: new method
  let xpos = parseInt(playerpos.split('_')[0]);
  let ypos = parseInt(playerpos.split('_')[1]);
  colorlist[rows*xpos+ypos] = color;


  //Tell everyone which new cell is coloured
  socket.broadcast.emit('newglobalcell', {
    id: globalcell.id,
    color: globalcell.color,
  });
}

function setallowedcells(socket) {

  let owncells = players[socket.id].owncells;
  let avcell = getaveragepos(owncells);
  let allowedcells = [];

  //set increasing limit
  //limit = function(owncells.length);

  owncells.forEach(function(cell) {
    let xx = parseInt(cell.split('_')[0]);
    let yy = parseInt(cell.split('_')[1]);
    let uy = yy + 1,
      dy = yy - 1,
      lx = xx + 1,
      rx = xx - 1;
    let neighbors = [
      xx + "_" + dy,
      xx + "_" + uy,
      rx + "_" + yy,
      lx + "_" + yy,
      // allow corners would be: rx + "_" + dy, lx + "_" + dy, rx + "_" + uy, lx + "_" + uy
    ];
    neighbors.forEach(function(cell) {
      if (allowedcells.includes(cell) == false &&
        Math.abs(xx - avcell.x) < limit &&
        Math.abs(yy - avcell.y) < limit) {
        allowedcells.push(cell);
      }
    });
  });

  return allowedcells;
};

function getaveragepos(owncells) {
  let xcount = 0;
  let ycount = 0;
  let length = 0;
  owncells.forEach(function(cell) {
    let xx = parseInt(cell.split('_')[0]);
    let yy = parseInt(cell.split('_')[1]);
    xcount = xcount + xx;
    ycount = ycount + yy;
    ++length;
  });
  let avcell = {
    x: Math.round(xcount / length),
    y: Math.round(ycount / length),
  }
  return avcell;
};
