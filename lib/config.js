const rows = 100;
const cols = 100;
// TODO: decide start rows and cols

const maxplayers = 100;
// TODO: decide maxplayers


///// LOCAL
const config1 = {
  rows: rows,
  cols: cols,
  maxplayers: maxplayers,
  port: 82,
  conf: {
    "host": "localhost",
    "user": "root",
    "password": "",
    "base": "mniosql"
  }
};

///// REMOTE
const config2 = {
  rows: rows,
  cols: cols,
  maxplayers: maxplayers,
  port: 80,
  conf: {
    "host": "mariadb",
    "user": "root",
    "password": "Lucastom2!",
    "base": "mniosql"
  }
};

module.exports = config1;
