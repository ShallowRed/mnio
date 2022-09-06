import ClientGame from '#game/client-game';

import Debug from '#debug';
const debug = Debug('game     |');

export default {

	'/login': function (socket) {

		debug(`New connection on login page with socketId '${socket.id}'`);

		socket.on('play', () => {

			console.log("-----------------------------------------");

			if (this.sessionStore.get(socket, 'isLogged')) {

				debug(`User on page login with socketId '${socket.id}' already logged in session store with userId ${this.sessionStore.get(socket, 'userId')}, redirecting to game`);

				socket.emit('redirect', '/game');

			} else {

				debug(`User on page login with socketId '${socket.id}' is not logged in session store`);

				socket.on("username", async userName => {

					debug(`User on page login with socketId '${socket.id}' sent username '${userName}'`);

					const userData = await this.tables.get('gridUsers')
						.select("*", { where: { "userName": userName }, limit: 1 });

					if (userData) {

						debug(`Username '${userName}' exists in database, asking user on page login with socketId '${socket.id}' for matching password`);

					} else {

						debug(`Username '${userName}' does not exist in database, asking user on page login with socketId '${socket.id}' for password creation`);
					}

					socket.emit("askPass", !Boolean(userData));

					socket.on("password", async password => {

						debug(`Username '${userName}' sent password`);

						if (
							userData &&
							userData.password !== password
						) {

							debug(`User on page login with socketId '${socket.id}' sent a password does not match with username '${userName}' in database`);

							socket.emit("wrongPass");

						} else {

							if (userData) {

								debug(`User on page login with socketId '${socket.id}' sent a password that matches with username '${userName}' in database`);

								const { userId } = userData;
								const { palette, ownCells } = await this.fetchPlayerData(userId);
								const position = ownCells[0];

								this.players.create(socket, { userId, palette, position, ownCells }, this.map);

								debug(`Redirecting user on page login with socketId '${socket.id}' and username '${userName}' to /game`);

								socket.emit("redirect", "/game");

							} else if (this.map.emptyCells.length) {

								debug(`User on page login with socketId '${socket.id}' with username '${userName}' sent its password, saving credentials in game players collection`);

								this.players.set(socket, { userName, password });

								debug(`Redirecting user on page login with socketId '${socket.id}' and username '${userName}' to /palette`);

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
	},

	'/palette': async function (socket) {

		debug(`New connection on palette page with socketId '${socket.id}'`);

		if (this.sessionStore.get(socket, 'isLogged')) {

			debug(`User on page palette with socketId '${socket.id}' already logged in session store with userId ${this.sessionStore.get(socket, 'userId')}, redirecting to game`);

			socket.emit('redirect', '/game');

		} else {

			debug(`User on page palette with socketId '${socket.id}' not logged in session store`);

			if (!this.players.get(socket)) {

				debug(`User on page palette with socketId '${socket.id}' has no credentials in game players collection, redirecting to /login`);

				socket.emit('redirect', '/');

			} else {

				debug(`User on page palette with socketId '${socket.id}' has credentials in game players collection, waiting for palette choice`);

				socket.emit("chosePalette", this.palettes);

				socket.on("paletteSelected", async paletteId => {

					const creds = this.players.get(socket);

					debug(`User with socketId '${socket.id}' and userName ${creds.userName} chose palette with id ${paletteId}, saving credentials and paletteId in database`);

					const userId = await this.tables.get("gridUsers").insert({
						userName: creds.userName,
						password: creds.password
					});

					await this.tables.get("gridPalettes").insert({ userId, paletteId });

					const palette = this.palettes
						.find(palette => palette.id === paletteId)
						.colors;

					const position = this.map.getRandomPosition();

					this.players.create(socket, { userId, palette, position, ownCells: [] }, this.map);

					debug(`Redirecting user with socketId '${socket.id}' and userName ${creds.userName} to /game`);

					socket.emit("redirect", "/game");
				});
			}
		}
	},

	'/game': async function (socket) {

		debug(`New connection on game page with socketId '${socket.id}'`);

		let player = this.players.get(socket);

		if (player) {

			debug(`User on page game with socketId '${socket.id}' already in game players collection`);

			if (!this.sessionStore.get(socket, "isLogged")) {

				debug(`User on page game with socketId '${socket.id}' not logged in session store, logging in`);

				this.sessionStore.save(socket, {
					isLogged: true,
					userId: player.userId,
					position: player.position
				});
			}
		}

		else if (!player) {

			debug(`User on page game with socketId '${socket.id}' not in game players collection`);

			if (this.sessionStore.get(socket, "isLogged")) {

				debug(`User on page game with socketId '${socket.id}' logged in session store, retrieving credentials from database`);

				const userId = this.sessionStore.get(socket, "userId");

				const position = this.sessionStore.get(socket, "position") ?? ownCells[0];

				const { palette, ownCells } = await this.fetchPlayerData(userId);

				player = this.players.create(socket, { userId, palette, position, ownCells }, this.map);
			}
		}

		if (player) {

			debug(`User on page game with socketId '${socket.id}' and userId ${player.userId} is logged in, starting its game`);

			new ClientGame(socket, player, this.map, this.tables);

		} else {

			this.sessionStore.remove(socket);

			debug(`User on page game with socketId '${socket.id}' not logged in, redirecting to /login`);

			socket.emit('redirect', '/');
		}
	}
}