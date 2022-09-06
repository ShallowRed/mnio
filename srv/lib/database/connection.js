import * as MySql from 'mysql';
import { promisify } from 'util';

import { db } from '#config';

import Debug from '#debug';
const debug = Debug('database |');

const { password, database, ...creds } = db;

export default {

	async makeSureDbExists() {

		const connection = MySql.createConnection({ password, ...creds });

		debug(`Making sure database '${database}' exists`);

		const result = await promisify(connection.query)
			.call(connection, `CREATE DATABASE IF NOT EXISTS ${database}`);

		// debug("Database created:", result);

		connection.end();
	},

	get pool() {

		if (!this._pool) {

			this._pool = MySql.createPool(db);

			debug("Mysql pool created");
		}

		return this._pool;
	},

	query(query, args) {

		// debug("Query:", query, args);

		return promisify(this.pool.query)
			.call(this.pool, query, args);
	}
}