import Map from '#game/Map';
import database from '#database/client-events';
import PlayersFactory from '#game/Players';
import ClientGame from '#game/ClientGame';

import Debug from '#debug';
const debug = Debug('game:game');

export default class Game {

	constructor(mapState, io, sessionStore) {

		this.io = io;

		this.sessionStore = sessionStore;

		this.map = new Map(mapState);

		this.players = new PlayersFactory(this.map);

		this.listenConnection();
	}

	listenConnection() {

		this.io.of('/login').on('connection', socket => {

			debug("New connection on login page");

			socket.on('play', () => {

				if (socket.request?.session?.isLogged) {

					debug("Player on page login already logged in session store, redirecting to game");

					socket.emit('redirect', '/game');

				} else {

					debug("Player on page login not logged in session store, waiting for username");

					socket.on("username", async userName => {

						debug("Player sent username");

						const userNameData = await database.checkUsername(userName);

						if (userNameData.exists) {

							debug("Username already in db, asking for corresponding password");

						} else {

							debug("Username not in db, asking for password creation");
						}

						socket.emit("askPass", !userNameData.exists);

						socket.on("password", async password => {

							debug("Player on page login sent password");

							if (
								userNameData.exists &&
								userNameData.password !== password
							) {

								debug("Player sent wrong password for existing username");

								socket.emit("wrongPass");

							} else {

								if (userNameData.exists) {

									debug("Player sent correct password for existing username");

									const { playerid } = userNameData;
									const { palette, ownCells } = await database.getPlayerData(playerid);

									this.players.createExisting(socket, { playerid, palette, ownCells });

									socket.emit("redirect", "/game");

								} else if (this.map.emptyCells.length) {

									debug("Player sent password for new username, saving creds in players collection");

									this.players.set(socket, { userName, password });

									socket.emit("redirect", "/palette");

								} else {

									debug("No more empty cells, end of game");

									socket.emit("alert", "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !");
								}
							}
						});
					});
				}
			});
		});

		this.io.of('/palette').on('connection', async socket => {

			debug("New connection on palette page");

			if (socket.request?.session?.isLogged) {

				debug("Player on page palette already logged in session store, redirecting to game");

				socket.emit('redirect', '/game');

			} else {

				debug("Player on page palette not logged in session store");

				if (!this.players.get(socket)) {

					debug("Player on page palette credentials not stored in players, redirecting to login");

					socket.emit('redirect', '/');

				} else {

					debug("Player on page palette credentials stored in session store, waiting for palette choice");

					const palettes = await database.getGamePalettes();

					socket.emit("chosePalette", palettes);

					socket.on("paletteSelected", async paletteid => {

						debug("Player selected palette:", paletteid);

						this.players.createNew(socket, { paletteid });
					});
				}
			}
		});

		this.io.of('/game').on('connection', async socket => {

			debug("New connection on game page");

			let player = this.players.get(socket);

			if (player) {

				debug("Player already in game players collection");

				if (!socket.request.session.isLogged) {

					debug("Player session not stored, saving");

					this.sessionStore.save(socket, {
						isLogged: true,
						playerid: player.playerid,
						position: player.position
					});
				}
			}

			else if (!player) {

				debug("Player not in game players collection");

				if (socket.request.session.isLogged) {

					debug("Player session stored, retrieving");

					const { playerid, position } = socket.request.session;

					const { palette, ownCells } = await database.getPlayerData(playerid);

					player = this.players.createExisting(socket, { playerid, position, palette, ownCells });
				}
			}

			if (player) {

				debug("Starting client game");

				new ClientGame(socket, player, this.map, database);

			} else {

				debug("Player not found, redirecting to login page");

				if (socket.request.session) {

					debug("Destroying session data");

					this.sessionStore.remove(socket);
				}

				socket.emit('redirect', '/');
			}
		});
	}
}