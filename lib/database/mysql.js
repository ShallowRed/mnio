// const debug = require('debug')('mnio');
const debug = console.log;
const Mysql = require('mysql');
const { promisify } = require('util');

const { db } = require('../config');
const { host, user, database } = db;
const queries = require('./queries');

const Database = Mysql.createPool(db);
console.log("-----------------------------------------");
console.log("-----------------------------------------");
console.log("-----------------------------------------");
console.log('Mysql connected : ')
debug('Mysql connected : ');

module.exports = {

  connection: Database,

  GameDate: Math.floor(Date.now() / 1000),

  query: (query, args, callback) => {
    Database.query(queries[query], args, (err, res) => {
      if (!!err) throw err;
      if (!!callback) callback(res);
    });
  },

  sQuery: (query, args) => {
    return promisify(Database.query)
      .call(Database, queries[query], args);
  }
};
