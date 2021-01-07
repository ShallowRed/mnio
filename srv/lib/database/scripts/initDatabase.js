const { query, sQuery, creds } = require('../mysql');

module.exports = () => {
  query("createGamesTableIfNotExist");
  console.log('Mysql connected : ');
  console.log(creds);
  // TODO: should create each pokedex if not exists 
};
