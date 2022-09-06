import connection from '#database/connection';
import GAME_TABLES from '#database/game-tables';

import Debug from '#debug';
const debug = Debug('database:tables');

export const Tables = {

	collection: {},

	async create(name, id) {

		const table = new Table(name, id);

		await table.create();

		this.collection[table.key] = table;

		return table;
	},

	get(key) {

		return this.collection[key];
	}
}

export class Table {

	constructor(name, id) {

		this.name = name;

		this.id = id;

		this.columns = GAME_TABLES[name].columns;

		this.key = GAME_TABLES[name].key;

		this.bindMethods(GAME_TABLES[name]?.methods);

		return this;
	}

	async create() {

		const columns = Object.keys(this.columns)
			.map(key => `${key} ${this.columns[key]}`)
			.join(", ");

		const query = `CREATE TABLE IF NOT EXISTS ${this.name} (${columns})`;
		
		const result = await connection.query(query, this.id);

		debug(`Making sure table ${this.name} exists`);
		// debug("Table created:", result);

		return this;
	}

	async insert(entries) {

		const keys = Object.keys(entries).map(key => '`' + key + '`').join(", ");
		const values = Object.values(entries).map(value => `'${value}'`).join(", ");

		const query = `INSERT INTO ${this.name} (${keys}) VALUES(${values})`;

		const result = await connection.query(query, this.id);

		// debug(`Inserted into table ${this.name}`);

		return result.insertId;
	}

	select(columns, { where } = {}) {

		let query = `SELECT ${columns} FROM ${this.name}`;

		if (where) {

			const [key, value] = Object.entries(where)[0];

			query += ` WHERE ${key} = '${value}'`;
		}

		return connection.query(query, this.id);
	}

	bindMethods(methods) {

		if (!methods) return;

		Object.entries(methods).forEach(([name, query]) => {

			this[name] = (...args) => {
				return connection.query(query, ...args);
			};
		});
	}
}