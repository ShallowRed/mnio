import { createConnection, createPool } from 'mysql';
import { promisify } from 'util';

import { db } from '#config';
const { host, user, database } = db;

import QUERIES from '#database/queries';

import Debug from '#debug';
const debug = Debug('database:connection');

export async function makeSureDbExists() {

	const connection = createConnection({
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

	constructor() {

		this.connection = createPool(db);
	}

	query(query, args) {

		return promisify(this.connection.query)
			.call(this.connection, QUERIES[query], args);
	}
}


export const pool = {

	creds: { host, user, database },

	GameDate: Math.floor(Date.now() / 1000),

	query(query, args) {

		this._pool ??= new Pool();

		return this._pool.query(query, args);
	}
}