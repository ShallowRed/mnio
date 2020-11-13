const { connect, query,  } = require('../mysql');

module.exports = () => {
  connect();
  query("createGamesTableIfNotExist");
};
