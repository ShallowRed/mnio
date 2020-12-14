// const debug = require('debug')('mnio');
const debug = console.log;
const Mysql = require('mysql');
const { promisify } = require('util');

const { db } = require('../config');
const { host, user, database } = db;
const queries = require('./queries');

const pool = Mysql.createPool(db);

module.exports = {

  connection: pool,

  creds: { host, user, database },

  GameDate: Math.floor(Date.now() / 1000),

  query: (query, args, callback) => {
    pool.query(queries[query], args, (err, res) => {
      if (!!err) throw err;
      if (!!callback) callback(res);
    });
  },

  sQuery: (query, args) => {
    return promisify(pool.query)
      .call(pool, queries[query], args);
  }
};
