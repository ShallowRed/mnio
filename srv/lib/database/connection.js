import * as MySql from 'mysql';
import { promisify } from 'util';

import Debug from '#config/debug';
const debug = Debug('database |');

export default {

	async makeSureDbExists({ password, database, ...creds }) {

		const connection = MySql.createConnection({ password, ...creds });

		debug(`Making sure database '${database}' exists`);

		await promisify(connection.query)
			.call(connection, `CREATE DATABASE IF NOT EXISTS ${database}`);

		connection.end();
	},

	Pool: class {

		constructor(DB) {

			this.pool = MySql.createPool(DB);

			debug("MySql pool created");
		}

		query(query, args) {

			// debug("Query:", query, args);

			return promisify(this.pool.query)
				.call(this.pool, query, args);
		}
	}
}