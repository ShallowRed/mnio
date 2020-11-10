const Mysql = require('mysql');
const { promisify } = require('util');

const { db } = require('../config');
const { host, user, database } = db;
const queries = require('./queries');

const Database = Mysql.createConnection(db);

module.exports = {

  GAMEDATE: Math.floor(Date.now() / 1000),

  connect: () => {
    Database.connect(err => {
      if (!!err) throw err;
      console.log('Mysql connected :');
      console.table({ host, user, database })
    })
  },

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
