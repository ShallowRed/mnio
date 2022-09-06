import expressSession from 'express-session';
import cookieParser from 'cookie-parser';

import MySql from 'mysql';
import mySQLStore from 'express-mysql-session';

import Debug from '#debug';
const debug = Debug('server   |');

const EXPRESS_SID_KEY = 'connect.sid';

export default function createSessionStore(COOKIE_SECRET, DB, USE_MEMORY_STORE) {

	debug(`Creating session store with ${USE_MEMORY_STORE ? 'memory' : 'MySQL'}`);

	const sessionStore = USE_MEMORY_STORE ?
		new expressSession.MemoryStore() :
		new (mySQLStore(expressSession))({}, MySql.createPool(DB));

	const parseCookie = cookieParser(COOKIE_SECRET);

	return {

		sessionStore: expressSession({
			store: sessionStore,
			resave: false,
			saveUninitialized: true,
			secret: COOKIE_SECRET,
			name: EXPRESS_SID_KEY
		}),

		sessionMiddleware: function (req, _, next) {

			if (!req.headers.cookie) return next(new Error('No cookie transmitted'));

			parseCookie(req, _, parseError => {

				if (parseError) return next(new Error('Error parsing cookies'));

				const sessionIdCookie = getSessionIdCookie(req);

				sessionStore.load(sessionIdCookie, (error, session) => {

					if (error) {

						return next(error);

					} else if (!session) {

						return next(new Error('Session load failed'));
					}

					req.session = session;

					req.sessionId = sessionIdCookie;

					return next();
				});
			});
		}
	}
}

function getSessionIdCookie(request) {

	return (
		request.secureCookies?.[EXPRESS_SID_KEY] ||
		request.signedCookies?.[EXPRESS_SID_KEY] ||
		request.cookies?.[EXPRESS_SID_KEY]
	);
}