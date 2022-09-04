const Mysql = require('mysql');
const { promisify } = require('util');

const { db } = require('@config');
const { host, user, database } = db;

const QUERIES = require('@database/queries');

const debug = require('@debug')('database:connection');

async function makeSureDbExists() {

	const connection = Mysql.createConnection({
		host: host,
		user: user,
		password: db.password
	});

	debug(`Make sure database '${db.database}' exists`);

	await promisify(connection.query)
		.call(connection, `CREATE DATABASE IF NOT EXISTS ${db.database}`);

	connection.end();
}

class Pool {

	creds = { host, user, database };

	GameDate = Math.floor(Date.now() / 1000);

	constructor() {

		this.connection = Mysql.createPool(db);
	}

	query(query, args) {

		return promisify(this.connection.query)
			.call(this.connection, QUERIES[query], args);
	}
}

module.exports = {

	makeSureDbExists,

	get pool() {

		this._pool ??= new Pool();

		return this._pool;
	}
}