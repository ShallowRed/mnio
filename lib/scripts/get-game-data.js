import connection from '#database/connection';
import Tables from '#database/tables';
import TABLES_BUEPRINTS from '#config/tables-blueprints';

import { DB } from '#config/app.config';

const { host, user, password } = DB;

export async function getGameData(DATABASE_NAME, GAME_ID) {

	const pool = new connection.Pool({ host, user, password, database: DATABASE_NAME });

	const tables = new Tables(pool, TABLES_BUEPRINTS);

	const gamesTable = await tables.create('grids');

	const gameData = await gamesTable.select("*", { where: { "gridId": GAME_ID }, limit: 1 });

	const { gridRows, gridCols } = gameData;

	const gridState = new Array(gridRows * gridCols).fill(null);

	const eventsTable = await tables.create('gridEvents', GAME_ID);

	const events = await eventsTable.select('*');

	for (const { cellid, color } of events) {

		gridState[cellid] = `#${color}`;
	}

	if (!gridState[0]) {
		gridState[0] = `#${events[0].color}`;
	}

	return {
		events,
		gridState,
		rows: gridRows,
		cols: gridCols
	}
}