import server from '#server/server';
import Game from '#game/Game';
import connection from '#database/connection';

import createSessionStore from '#server/session-store';
import socketSessionStore from '#server/socket-session-store';

import { PORT, DB, COOKIE_SECRET, USE_MEMORY_STORE, DEFAULT_ROWS, DEFAULT_COLS } from '#config';

export async function app() {

	await connection.makeSureDbExists(DB);

	const { sessionStore, sessionMiddleware } = createSessionStore(COOKIE_SECRET, DB, USE_MEMORY_STORE);

	const socketSessionMiddleware = (socket, next) =>
		sessionMiddleware(socket.request, {}, next);

	const io = server(PORT, sessionStore);

	const game = new Game(io, socketSessionStore, socketSessionMiddleware, { DEFAULT_ROWS, DEFAULT_COLS });

	game.init(DB);
}