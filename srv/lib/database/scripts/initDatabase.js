const { makeSureDbExists, pool } = require('@database/connection');
const { db } = require('@config');

const debug = require('@debug')('database');

module.exports = async () => {

	await makeSureDbExists();

	debug("Mysql connected", pool.creds);

	debug("Make sure games table exists");
	
	pool.query("createGamesTableIfNotExist");

	// TODO: should create each pokedex if not exists
};
