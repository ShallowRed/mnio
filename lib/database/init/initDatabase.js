const { query,  } = require('../mysql');

module.exports = () => {
  query("createGamesTableIfNotExist");
};
