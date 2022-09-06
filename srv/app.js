import server from '#server/server';
import Game from '#game/Game';
import socketSessionStore from '#server/socket-session-store';
import connection from '#database/connection';

export async function app() {

	await connection.makeSureDbExists();

	const io = server({ namespaces: ["/login", "/palette", "/game"] });

	const game = new Game(io, socketSessionStore);

	game.init();
}