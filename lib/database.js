const Mysql = require('mysql');
const { promisify } = require('util');

const initDb = require('./database/init')
const logPlayer = require('./database/logPlayer')
const saveInDb = require('./database/save');

module.exports = class Database {

  constructor({ host, user, database, password }) {
    this.GAMEDATE = Math.floor(Date.now() / 1000);
    this.connection = Mysql.createConnection({ host, user, database, password });
    this.connection.connect(err => {
      if (!!err) throw err;
      console.log('Mysql connected :');
      console.table({ host, user, database })
      return;
    })
  }

  async initNGetGridState() {
    return await initDb.bind(this);
  }

  query(query, args, callback) {
    this.connection.query(queries[query], args, (err, res) => {
      if (!!err) throw err;
      if (!!callback) callback(res);
    })
  }

  sQuery(query, args) {
    return promisify(this.connection.query)
      .call(this.connection, queries[query], args);
  }

  async isUserNameInDb(args) {
    return await logPlayer.isUserNameInDb.bind(this, ...args);
  }

  async saveNewPlayer(args) {
    return await logPlayer.saveNewPlayer.bind(this, ...args);
  }

  async getPlayerDeeds(args) {
    return await logPlayer.getPlayerDeeds.bind(this, ...args);
  }

  saveFill(args) {
    saveInDb.fill.bind(this, ...args);
  }

  savePlayer(args) {
    saveInDb.player.bind(this, ...args);
  }

}
