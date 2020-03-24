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
//app.use(cookieParser());
function mysession(req) {
  db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function(err, rows, fields) {
    clog("player returning on same session");
    socket.emit("logged_in", {
      user: rows[0].Username
    });
  });
}

////////////////INITIALISE/////////////////
gridstate = grid.initgrid();

////////////////ACTUAL CODE/////////////////
io.on('connection', function(socket) {
  var req = socket.request;

  // TODO downhere, retreive last position if same session
  // if (req.session.userID != null) {
  //   mysession(req);
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
          db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass], function(err, result) {
            if (!!err)
              throw err;

            console.log(result);
            socket.emit("logged_in", {
              user: user
            });
            startusergame(socket);
            req.session.userID = rows[0].id;
            req.session.save();
          });
        }

        // If player id is already in database
        else {
          console.log("Already in database");
          const dataUser = rows[0].Username,
            dataPass = rows[0].Password;
          if (dataPass == null || dataUser == null) {
            socket.emit("error");
          }
          if (user == dataUser && pass == dataPass) {
            socket.emit("logged_in", {
              user: user
            });
            startusergame(socket);
            req.session.userID = rows[0].id;
            req.session.save();
          } else {
            socket.emit("invalid");
          }
        }
      });
  });

  socket.on('askformove', function(direction) {
    moveplayer(direction, socket);
  });

  socket.on('newlocalcell', function(data) {
    newglobalcell(data[0], data[1], socket);
    addowncell(data[0], data[1], socket);
    setallowedcells(socket);
  });

  // todo here: erase position when player disconnect
  // socket.on('disconnect', function(socket) {
  //   clog(players[socket.id]);
  //   socket.broadcast.emit("clearpos", players[socket.id]);
  // });
});

////////////////MY FUNCTIONS/////////////////

function startusergame(socket) {

  //Create new player with random position and color
  let newrandom = grid.newrdm(socket, gridstate);
  gridstate = newrandom.gridstate;
  players[socket.id] = newrandom.playerinfo;
  clog("new player : " + players[socket.id].id);

  //Send player the data needed for initialization
  socket.emit('playerinit', {
    playerid: players[socket.id],
    gridstate: gridstate,
    positionlist: positionlist,
    rows: rows,
    cols: cols,
    vrows: vrows,
    vcols: vcols,
    lw: lw,
    celltimeout: celltimeout,
    color1: players[socket.id].color1,
    color2: players[socket.id].color2,
    color3: players[socket.id].color3
  });

  newplayerpos(socket, players[socket.id]);
}

function moveplayer(direction, socket) {

  let player = players[socket.id] || {};
  let lastplayerpos;
  let nextcell = {
    x: player.x,
    y: player.y
  };
  //find grid cell requested and move if available
  if (direction == "up") {
    if (player.x !== 0) {
      nextcell.x -= 1;
      if (isnextok(socket, nextcell) > 0) {
        //lastplayerpos = player;
        player.x -= 1;
        newplayerpos(socket, player);
      }
    }
  } else if (direction == "down") {
    if (player.x !== cols - 1) {
      nextcell.x += 1;
      if (isnextok(socket, nextcell) > 0) {
        //lastplayerpos = player;
        player.x += 1;
        newplayerpos(socket, player);
      }
    }
  } else if (direction == "left") {
    if (player.y !== 0) {
      nextcell.y -= 1;
      if (isnextok(socket, nextcell) > 0) {
        //lastplayerpos = player;
        player.y -= 1;
        newplayerpos(socket, player);
      }
    }
  } else if (direction == "right") {
    if (player.y !== rows - 1) {
      nextcell.y += 1;
      if (isnextok(socket, nextcell) > 0) {
        //lastplayerpos = player;
        player.y += 1;
        newplayerpos(socket, player);
      }
    }
  }
}

function isnextok(socket, nextcell) {
  let nextcelltry = gridstate.find(function(cell) {
    return cell.id == ("" + nextcell.x + "_" + nextcell.y + "");
  });
  if (nextcelltry.class == socket.id) {
    return 1;
  } else if (nextcelltry.class == "none") {
    let allowedcells = players[socket.id].allowedcells;
    if (allowedcells.includes(nextcelltry.id)) {
      return 2;
    } else {
      return 0
    }
  } else {
    return 2;
  }
}

function newplayerpos(socket, player) {
  socket.broadcast.emit("clearpos", player.playerpos);

  let index = positionlist.indexOf(player.playerpos);
  if (index > -1) {
    positionlist.splice(index, 1);
  }
  player.playerpos = player.x + "_" + player.y;
  positionlist.push(player.playerpos);

  socket.broadcast.emit("newglobalpos", player.playerpos);
  socket.emit("newplayerpos", player.playerpos);
  setallowedcells(socket);
}

function newglobalcell(playerpos, color, socket) {

  //Find matching cell on global grid and edit changes
  let globalcell = gridstate.find(function(cell) {
    return cell.id == playerpos;
  });
  globalcell.color = color;
  globalcell.class = "" + socket.id;

  //Tell everyone which new cell is coloured
  socket.broadcast.emit('newglobalcell', {
    id: globalcell.id,
    color: globalcell.color,
  });
}

function addowncell(playerpos, color, socket) {
  let owncells = players[socket.id].owncells;
  let newowncell = {
    id: playerpos,
    color: color
  }
  owncells.push(newowncell);
  //todo here : remove cell if already controlled, set new color
}

function setallowedcells(socket) {
  let allowedcells = players[socket.id].allowedcells;
  let owncells = players[socket.id].owncells;
  getneighbours(owncells, allowedcells);
  socket.emit('allowedcells', allowedcells);
}

function getneighbours(owncells, allowedcells) {
  let avcell = getaveragepos(owncells);
  owncells.forEach(function(cell) {
    let xx = parseInt(cell.id.split('_')[0]);
    let yy = parseInt(cell.id.split('_')[1]);
    let uy = yy + 1,
      dy = yy - 1,
      lx = xx + 1,
      rx = xx - 1;
    let neighbors = [
      xx + "_" + dy,
      xx + "_" + uy,
      rx + "_" + yy,
      lx + "_" + yy,
      rx + "_" + dy,
      lx + "_" + dy,
      rx + "_" + uy,
      lx + "_" + uy
    ];
    neighbors.forEach(function(cell) {
      if (allowedcells.includes(cell) == false &&
        Math.abs(xx - avcell.x) < limit &&
        Math.abs(yy - avcell.y) < limit) {
        allowedcells.push(cell);
      }
    });
    return allowedcells;
  });
};

function getaveragepos(owncells) {
  let xcount = 0;
  let ycount = 0;
  let length = 0;
  owncells.forEach(function(cell) {
    let xx = parseInt(cell.id.split('_')[0]);
    let yy = parseInt(cell.id.split('_')[1]);
    xcount = xcount + xx;
    ycount = ycount + yy;
    ++length;
  });
  let avcell = {
    x: Math.round(xcount / length),
    y: Math.round(ycount / length),
  }
  return avcell
};
