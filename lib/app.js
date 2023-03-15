
import connection from '#database/connection';
import Tables from '#database/tables';
import TABLES_BUEPRINTS from '#config/tables-blueprints';
import Pokedex from '#config/pokedex';

import createServer from "#server/server";
import createRouter from "#server/router";
import createSessionMiddleware from '#server/session-store';

import GameDataFetcher from '#game/game-data-fetcher';
import Game from '#game/game';

import { PORT, DB, COOKIE_SECRET, USE_MEMORY_STORE, DEFAULT_ROWS, DEFAULT_COLS } from '#config/app.config';

export async function app(PATHS) {

	await connection.makeSureDbExists(DB);

	const pool = new connection.Pool(DB);

	const tables = new Tables(pool, TABLES_BUEPRINTS);

	const gameData = await new GameDataFetcher(tables, Pokedex, DEFAULT_ROWS, DEFAULT_COLS).fetch();

	const sessionMiddleware = createSessionMiddleware(pool, COOKIE_SECRET, USE_MEMORY_STORE);

	const router = await createRouter(tables, sessionMiddleware);

	const io = await createServer(router, PORT, PATHS);

	const game = new Game(io, tables, { DEFAULT_ROWS, DEFAULT_COLS });

	for (const namespace in game.clientConnections) {

		io.of(namespace).use((socket, next) => {
			sessionMiddleware(socket.request, {}, next);
		})
	}

	game.init(gameData);
}