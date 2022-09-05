import server from '#server/server';
import initDatabase from '#database/scripts/initDatabase';
import fetchGame from '#database/scripts/getLastGame';
import Game from '#game/Game';

export async function app() {

	await initDatabase();

	const mapState = await fetchGame();

	const io = server();

	new Game(mapState, io);
}