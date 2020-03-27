const mysql = require('mysql');

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

function loguserin(user, pass, socket) {

  db.query("SELECT * FROM users WHERE Username=?", [user], function(err, rows, fields) {

    if (rows.length == 0) { // If player not in database
      db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass],
        function(err, result) {
          if (!!err)
            throw err;
          //console.log(result);
          console.log("New user created with n° " + result.insertId + " (" + user + ")");
          return 1;
        });

    } else if (pass !== rows[0].Password) { // If player already in database but wrong password
      return 0;

    } else { // If player already in database and right password
      console.log("Player n° " + rows[0].id + " (" + rows[0].Username + ") is back");
      return 2;
    }
  });
}

module.exports = loguserin;
