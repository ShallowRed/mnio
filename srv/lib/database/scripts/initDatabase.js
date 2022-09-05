import { makeSureDbExists, pool } from '#database/connection';
import { db } from '#config';

import Debug from '#debug';
const debug = Debug('database');

export default async () => {

	await makeSureDbExists();

	debug("Mysql connected", pool.creds);

	debug("Make sure games table exists");
	
	pool.query("createGamesTableIfNotExist");

	// TODO: should create each pokedex if not exists
};
