const socketIO = require('socket.io');
const mysql = require('mysql');

const GAME = require(__dirname);

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

// Connect to mySQL database
db.connect(function(error) {
  if (!!error)
    throw error;
  console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
});

function LogPlayer(user, pass, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS) {

  db.query(IsUserinDB, [user], function(err, rows, fields) {

    // If user is not in database, create a new id and start the game
    if (!rows.length) db.query(AddUsertoDB, [user, pass], function(err, result) {
      if (!!err) throw err;
      GAME.startplayergame(result.insertId, user, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS); // req.session.userID = result.insertId; req.session.save();
    });

    // If user is in database, start the game if password is right
    else if (pass == rows[0].Password) GAME.startplayergame(rows[0].id, user, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS);
    else socket.emit("alert", "Wrong password");
  });

}

module.exports = {
  LogPlayer
}
