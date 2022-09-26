import { getGameData } from '#scripts/get-game-data';

import GridCanvas from '#scripts/create-canvas';

const DATABASE_NAME = 'mnio_rooniax';
const GAME_ID = 1;

const NAME = `${DATABASE_NAME}-${GAME_ID}`;

const RESULT_OUTPUT_PATH = `data/${NAME}-result.png`;
const TIMELAPSE_OUTPUT_PATH = `data/${NAME}-timelapse.gif`;
// const TIMELAPSE_OUTPUT_DIR = `data/${NAME}-timelapse`;

export async function app() {

	const gameData = await getGameData(DATABASE_NAME, GAME_ID);

	const canvas = new GridCanvas(gameData, { cellSize: 3 });

	canvas.renderTimelapse(TIMELAPSE_OUTPUT_PATH);

	// canvas.renderResult(RESULT_OUTPUT_PATH);
}

app();