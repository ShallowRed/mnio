const { query, creds } = require('../mysql');

module.exports = () => {
  query("createGamesTableIfNotExist");
  console.log('Mysql connected : ');
  console.log(creds);
};
