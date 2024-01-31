import Debug from '#config/debug';
const debug = Debug('database |');

export default class Tables {

	collection = {};

	constructor(connection, blueprints) {
		this.connection = connection;
		this.blueprints = blueprints;
	}

	async create(key, id, ...args) {
		const name = this.blueprints[key]['name'].replace(/\?/g, id);
		const columns = this.blueprints[key]['columns'];
		const table = new Table(this, key, name, columns, ...args);
		await table.create();
		this.collection[key] = table;
		return table;
	}

	get(key) {
		return this.collection[key];
	}
}

class Table {
	constructor(tables, key, name, columns, ...args) {
		this.tables = tables;

		this.connection = tables.connection;

		this.key = key;

		this.name = name;

		this.columns = columns;

		this.args = args;

		return this;
	}

	async create() {

		const columns = Object.keys(this.columns)
			.map(key => `${key} ${this.columns[key]}`)
			.join(", ");

		const query = `CREATE TABLE IF NOT EXISTS ${this.name} (${columns})`;

		debug(`Making sure table ${this.key} exists`);

		await this.connection.query(query, this.args);

		return this;
	}

	async insert(entries) {

		const keys = Object.keys(entries)
			.map(key => '`' + key + '`')
			.join(", ");

		const values = Object.values(entries)
			.map(value => `'${value}'`)
			.join(", ");

		const query = `INSERT INTO ${this.name} (${keys}) VALUES(${values})`;

		const results = await this.connection.query(query);

		return results.insertId;
	}

	async select(columns, { where, orderBy, limit, join } = {}) {

		let query = `SELECT ${columns} FROM ${this.name}`;

		if (join) {

			query += ` JOIN ${join}`;
		}

		if (where) {

			const entries = Object.entries(where)
				.map(([key, value]) => `${key} = '${value}'`)
				.join(" AND ");

			query += ` WHERE ${entries}`;
		}

		if (orderBy) {

			query += ` ORDER BY ${orderBy}`;
		}

		if (limit) {

			query += ` LIMIT ${limit}`;

		}

		const results = await this.connection.query(query);

		if (limit === 1) {
			if (results.length) {
				if (columns === "*") {
					return results[0];
				} else {
					return results[0][columns];
				}
			}

		} else {
			if (columns === "*") {
				return results;
			} else {
				return results?.map(result => result[columns]) ?? [];
			}
		}
	}

	update(entries, { where } = {}) {

		const keys = Object.keys(entries)
			.map(key => `${key} = '${entries[key]}'`)
			.join(", ");

		let query = `UPDATE ${this.name} SET ${keys}`;

		if (where) {

			const entries = Object.entries(where)
				.map(([key, value]) => `${key} = '${value}'`)
				.join(" AND ");

			query += ` WHERE ${entries}`;
			return this.connection.query(query);

		} else {

			throw new Error("No where clause provided");

		}
	}

	join(joinedTableKey, { on } = {}) {

		const joinedTable = this.tables.get(joinedTableKey);

		const entries = Object.entries(on)
			.map(([thisColumn, joinedTableColumn]) =>
				`${this.name}.${thisColumn} = ${joinedTable.name}.${joinedTableColumn}`
			)
			.join(" AND ");

		const join = on && `${joinedTable.name} on ${entries}`;

		return {

			select: (columns, { ...args }) => {

				return this.select(columns, { join, ...args });
			}
		}
	}
}