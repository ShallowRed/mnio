//////////////////////////// DEPENDENCIES & VARIABLES //////////////////////////
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Config = require('../config/mnio.config');
const Routes = require("./routes");
const pokedex = require('../config/pokedex.min');

// const cookieParser = require('cookie-parser');
// const session = require('express-session');
//
// var sessionMiddleware = session({
//   secret: "keyboard cat"
// });
//
// io.use((socket, next) =>
//   sessionMiddleware(socket.request, socket.request.res, next));
// app.use(sessionMiddleware);
// app.use(cookieParser());


const Database = {
  init: require('./database/init'),
  log: require('./database/log'),
  save: require('./database/save')
}

const Player = {
  fill: require('./player/fill'),
  move: require('./player/move'),
  disconnect: require('./player/disconnect')
}

app.use('/', Routes);

app.set('port', Config.port);

server.listen(Config.port, () => console.log('Starting server on port ' + Config.port));

const MNIO = {
  ColorList: new Array(Config.rows * Config.cols).fill(null),
  PositionList: [],
  PLAYERS: {}
}

Database.init(MNIO.ColorList);

io.on('connection', socket => {

  // var req = socket.request;
  //
  // if (req.session.userID != null) {
  //   console.log(req.session.userID);
  //   const data = req.session.userID;
  //   Database.log.pass(data[0], data[1], socket, MNIO)
  //   // db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function(err, rows, fields){
  //   // socket.emit("logged_in", {user: rows[0].Username});
  // } else console.log("sessionID null");

  socket.on("username", username =>
    Database.log.user(username, socket));

  socket.on("password", data => {
    // req.session.userID = data;
    // req.session.save();
    Database.log.pass(data[0], data[1], socket, MNIO)
  });

  socket.on("setInit", index => {
    const player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    player.position = randompos(MNIO.ColorList);
    if (player.position == "end") {
      socket.emit("alert", "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !");
      return;
    }
    player.colors = pokedex[index];
    socket.emit("startPos", player.position);
    socket.broadcast.emit("NewPosition", [null, player.position]);
    MNIO.PositionList.push(player.position);
  });

  socket.on('MovePlayer', direction => {
    Player.move(direction, socket, MNIO);
  });

  socket.on('fill', cell => {
    const player = MNIO.PLAYERS[socket.id];
    Player.fill(cell.position, cell.color, socket, MNIO);
    Database.save.fill(cell.position, player.name, player.dbid, cell.color);
  });

  socket.on('disconnect', () => {
    const player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    Player.disconnect(player, socket, MNIO.PositionList);
    if (!player.dbid || !player.colors) return;
    Database.save.player(player.dbid, player.colors);
  });

  socket.on("setflag", data => Database.save.flag(data));

});

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null).filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// TODO:  erase contribution less than n cells
// TODO:  erase position from admin
// TODO: allow several games at the same

const actions = {

  username: username =>
    Database.log.user(username, socket),

  password: data =>
    Database.log.pass(data[0], data[1], socket, MNIO),

  setInit: index => {
    const player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    player.position = randompos(MNIO.ColorList);
    player.colors = pokedex[index];
    socket.emit("startPos", player.position);
    socket.broadcast.emit("NewPosition", [null, player.position]);
    MNIO.PositionList.push(player.position);
  },

  MovePlayer: direction =>
    Player.move(direction, socket, MNIO),

  fill: cell => {
    const player = MNIO.PLAYERS[socket.id];
    Player.fill(cell.position, cell.color, socket, MNIO);
    Database.save.fill(cell.position, player.name, player.dbid, cell.color);
  },

  disconnect: () => {
    const player = MNIO.PLAYERS[socket.id];
    if (!player) return;
    Player.disconnect(player.position, socket, MNIO.PositionList);
    if (!player.dbid || !player.colors) return;
    Database.save.player(player.dbid, player.colors);
  }
}
