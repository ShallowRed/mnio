import express from 'express';
import http from 'http';
import serveStatic from 'serve-static';
import * as socketIo from 'socket.io';

import { resolve } from 'path';

import connection from '#database/connection';
import TABLES_BUEPRINTS from '#config/tables-blueprints';
import Tables from '#database/tables';
import Pokedex from '#config/pokedex';

import createRouter from "#server/router";
import createSessionStore from '#server/session-store';

import GameStarter from '#game/game-setup';
import Game from '#game/game';
import clientConnections from '#game/client-connections';

import { PORT, DB, COOKIE_SECRET, USE_MEMORY_STORE, DEFAULT_ROWS, DEFAULT_COLS } from '#config/app.config';

import Debug from '#config/debug';
const debug = Debug('server   |');

const PUBLIC_FOLDER_PATH = '../dist';

export async function app() {

	await connection.makeSureDbExists(DB);

	const pool = new connection.Pool(DB);

	const tables = new Tables(pool, TABLES_BUEPRINTS);

	const gameStarter = new GameStarter(tables, Pokedex, DEFAULT_ROWS, DEFAULT_COLS);

	const gameData = await gameStarter.getGameData();

	const sessionMiddleware = createSessionStore(COOKIE_SECRET, DB, USE_MEMORY_STORE);

	const router = await createRouter(tables, sessionMiddleware);

	const app = express()
		.set('view engine', 'ejs')
		.set('views', 'views')
		.use('/assets', serveStatic(resolve(PUBLIC_FOLDER_PATH), { index: false }))
		.use('/', router)

	const httpServer = http
		.createServer(app)
		.listen(PORT, () => debug(`Server listening on port ${PORT}`));

	const io = new socketIo.Server(httpServer);

	const game = new Game(io, tables, { DEFAULT_ROWS, DEFAULT_COLS });

	for (const namespace in clientConnections) {

		io.of(namespace)
			.use((socket, next) => {
				sessionMiddleware(socket.request, {}, next);
			})
	}

	game.init(gameData);
}