// TODO: decide rows and cols start on start
// TODO: decide maxplayers

const Config = {
  rows: 150,
  cols: 150,
  maxplayers: 100,
};

if (process.platform === "win32") {
  Config.port = 3000;
  Config.conf = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "base": "mniosql"
  };
} else {
  Config.port = 80;
  Config.conf = {
    "host": "mariadb",
    "user": "root",
    "password": "Lucastom2!",
    "base": "mniosql"
  };
}

module.exports = Config;
