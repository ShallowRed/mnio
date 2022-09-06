import server from '#server/server';
import getGridState from '#database/game-setup';
import Game from '#game/Game';
import socketSessionStore from '#server/socket-session-store';

export async function app() {

	const mapState = await getGridState();

	const io = server({ namespaces: ["/login", "/palette", "/game"] });

	new Game(mapState, io, socketSessionStore);
}