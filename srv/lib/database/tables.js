import Debug from '#debug';
const debug = Debug('database |');

export default class Tables {

	collection = {};

	constructor(tablesConfig, connection) {

		this.connection = connection;

		this.tablesConfig = tablesConfig;
	}

	async create(key, id) {

		const name = this.tablesConfig[key]['name'].replace(/\?/g, id);

		const columns = this.tablesConfig[key]['columns'];

		const table = new Table(this, this.connection, key, id, name, columns);

		await table.create();

		this.collection[key] = table;

		return table;
	}

	get(key) {

		return this.collection[key];
	}
}

class Table {

	constructor(tables, connection, key, id, name, columns) {

		this.tables = tables;

		this.connection = connection;

		this.key = key;

		this.id = id;

		this.name = name;

		this.columns = columns;

		return this;
	}

	async create() {

		const columns = Object.keys(this.columns)
			.map(key => `${key} ${this.columns[key]}`)
			.join(", ");

		const query = `CREATE TABLE IF NOT EXISTS ${this.name} (${columns})`;

		debug(`Making sure table ${this.key} exists`);

		await this.connection.query(query);

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

				return results[0];
			}

		} else {

			return results;
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