import express from 'express';
import http from 'http';
import * as socketIo from 'socket.io';

import createRouter from "#server/router";
import Game from '#game/Game';
import connection from '#database/connection';

import createSessionStore from '#server/session-store';
import socketSessionStore from '#server/socket-session-store';

import { PORT, DB, COOKIE_SECRET, USE_MEMORY_STORE, DEFAULT_ROWS, DEFAULT_COLS } from '#config/app.config';

import TABLES_CONFIG from '#database/tables-config';
import Tables from '#database/tables';

import Debug from '#config/debug';
const debug = Debug('server   |');

const USERS_GRID_ID = 1;

export async function app() {

	await connection.makeSureDbExists(DB);

	const pool = new connection.Pool(DB);

	const tables = new Tables(TABLES_CONFIG, pool);

	const { sessionStore, socketSessionMiddleware } = createSessionStore(COOKIE_SECRET, DB, USE_MEMORY_STORE);

	const router = await createRouter(tables, sessionStore, USERS_GRID_ID);

	const app = express()
		.set('view engine', 'ejs')
		.set('views', 'views')
		.use(sessionStore)
		.use('/', router)

	const httpServer = http
		.createServer(app)
		.listen(PORT, () => debug(`Server listening on port ${PORT}`));

	const io = new socketIo.Server(httpServer);

	const game = new Game(io, tables, socketSessionStore, socketSessionMiddleware, { DEFAULT_ROWS, DEFAULT_COLS });

	game.init();
}