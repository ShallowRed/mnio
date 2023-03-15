import expressSession from 'express-session';
import MySQLStore from 'express-mysql-session';

import Debug from '#config/debug';
const debug = Debug('server   |');

const SESSION_STORE_OPTIONS = {
	resave: false,
	saveUninitialized: false,
	name: 'connect.sid'
};

export default function createSessionMiddleware(connection, COOKIE_SECRET, USE_MEMORY_STORE) {

	debug(`Creating session store with ${USE_MEMORY_STORE ? 'memory' : 'MySQL'}`);

	return expressSession({
		store: createSessionStore(connection, USE_MEMORY_STORE),
		secret: COOKIE_SECRET,
		...SESSION_STORE_OPTIONS
	});
}

function createSessionStore(connection, USE_MEMORY_STORE) {

	if (USE_MEMORY_STORE) {

		return new expressSession.MemoryStore();

	} else {

		const SessionStore = MySQLStore(expressSession);

		return new SessionStore({}, connection.pool);
	}
}
