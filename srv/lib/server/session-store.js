import expressSession from 'express-session';

import MySql from 'mysql';
import mySQLStore from 'express-mysql-session';

import Debug from '#config/debug';
const debug = Debug('server   |');

export default function (COOKIE_SECRET, DB, USE_MEMORY_STORE) {

	debug(`Creating session store with ${USE_MEMORY_STORE ? 'memory' : 'MySQL'}`);

	const sessionStore = USE_MEMORY_STORE ?
		new expressSession.MemoryStore() :
		new (mySQLStore(expressSession))({}, MySql.createPool(DB));

	return expressSession({
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		secret: COOKIE_SECRET,
		name: 'connect.sid'
	});
}