require('module-alias/register');

const server = require('@server/server');
const initDatabase = require('@database/scripts/initDatabase');
const fetchGame = require('@database/scripts/getLastGame');
const Game = require('@game/Game');

const app = async () => {

	await initDatabase();

	const mapState = await fetchGame();

	const io = server();

	new Game(mapState, io);
}

app();
