import { createConnection, createPool } from 'mysql';
import { promisify } from 'util';

import Debug from '#config/debug';
const debug = Debug('database |');

export default {

	async makeSureDbExists({ password, database, ...creds }) {

		const connection = createConnection({ password, ...creds });

		debug(`Making sure database '${database}' exists`);

		await promisifiedQuery(connection, `CREATE DATABASE IF NOT EXISTS ${database}`);

		connection.end();
	},

	Pool: class {

		constructor(DB) {

			this.pool = createPool(DB);

			debug("MySql pool created");
		}

		query(query, args) {

			return promisifiedQuery(this.pool, query, args);
		}
	}
}

function promisifiedQuery(connection, query, args) {

	// debug("Running query: \r\n ->", query);

	return promisify(connection.query)
		.call(connection, query, args);
}