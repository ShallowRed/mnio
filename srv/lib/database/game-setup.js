import connection from '#database/connection';
import { rows, cols } from '#config';
import Pokedex from '#database/pokedex';
import { Tables } from '#database/tables';

import Debug from '#debug';
const debug = Debug('database:game-setup');

// to end game: "UPDATE games SET flag = ? WHERE gameid = ?"
const gameDate = Math.floor(Date.now() / 1000);

export default async () => {

	await connection.makeSureDbExists();

	const gamesTable = await Tables.create("games");

	const lastGame = await gamesTable.getLastGame();

	const hasRunningGame = lastGame.length && !lastGame[0].flag;

	const gameData = hasRunningGame ?
		await fetchLastGame(lastGame[0]) :
		await createNewGame();

	return gameData;
};

async function fetchLastGame(lastGame) {

	const { gameid, gridrows, gridcols } = lastGame;

	await createGameTables(gameid);

	const gridEvents = await Tables.get("grid").select("*");

	const gridState = new Array(gridrows * gridcols).fill(null);

	for (const { cellid, color } of gridEvents) {

		gridState[cellid] = color;
	}

	Tables.get('games').updateGridId([gameDate, gameid]);

	return { gridState, gameid, rows: gridrows, cols: gridcols };
}

async function createNewGame() {

	const gameid = await Tables.get('games').insert({
		gridrows: rows,
		gridcols: cols,
		gridid: gameDate,
		pokedexid: Pokedex.id,
		flag: 0
	});

	await createGameTables(gameid);

	await fillPokedex(Pokedex);

	const gridState = new Array(rows * cols).fill(null);

	return { gridState, gameid, rows, cols };
}

async function createGameTables(gameid) {

	return Promise.all([
		Tables.create("game_?__grid", gameid),
		Tables.create("game_?__palettes", gameid),
		Tables.create("game_?__creds", gameid),
		Tables.create("pokedex_?", Pokedex.id)
	]);
}

async function fillPokedex(Pokedex) {

	const pokedexTable = Tables.get("pokedex", Pokedex.id);

	return Promise.all(
		Pokedex.palettes.map(async (palette) => {
			return pokedexTable.insert({
				color1: palette[0],
				color2: palette[1],
				color3: palette[2],
				color4: palette[3],
				color5: palette[4]
			});
		})
	);
}