import Tables from '#database/tables';
import Pokedex from '#database/pokedex';
import GAME_TABLES from '#game/tables-config';

import Map from '#game/Map';
import Players from '#game/Players';
import ClientGame from '#game/ClientGame';

import { rows, cols } from '#config';

import Debug from '#debug';
const debug = Debug('game     |');

// to end game: "UPDATE grids SET isOver = ? WHERE gridId = ?"
const gameDate = Math.floor(Date.now() / 1000);

export default class Game {

	constructor(io, sessionStore) {

		this.io = io;

		this.sessionStore = sessionStore;
	}

	async init() {

		this.tables = new Tables(GAME_TABLES);

		const { palettes, gridState, rows, cols } = await this.getGameData();

		this.palettes = palettes;

		this.map = new Map({ gridState, rows, cols });

		this.players = new Players();

		this.listenConnection();
	}

	listenConnection() {

		this.io.of('/login').on('connection', socket => {

			debug(`New connection on login page with socketId '${socket.id}'`);

			socket.on('play', () => {

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
		});

		this.io.of('/palette').on('connection', async socket => {

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
		});

		this.io.of('/game').on('connection', async socket => {

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
		});
	}

	async fetchPlayerData(userId) {

		const joined = await this.tables.get('gridPalettes')
			.join('palettes', { on: { 'paletteId': 'paletteId' } })
			.select('*', { where: { "userId": userId }, limit: 1 });

		const palette = Object.keys(joined)
			.filter(key => key.match(/color/))
			.map(key => `#${joined[key]}`);

		const ownCells = await this.tables.get('gridEvents')
			.select('cellid', { where: { "userId": userId } });

		return {
			palette,
			ownCells: ownCells?.map(({ cellid }) => cellid) ?? []
		};
	}

	async getGameData() {

		const gamesTable = await this.tables.create("grids");

		const lastGame = await gamesTable.select("*", { orderBy: 'gridId DESC', limit: 1 });

		const gameData = lastGame ?
			await this.fetchLastGame(lastGame) :
			await this.createNewGame();

		gameData.palettes = await this.getPalettes();

		return gameData;
	}

	async fetchLastGame(lastGame) {

		const { gridId, gridRows, gridCols } = lastGame;

		await this.createGameTables(gridId);

		const gridEvents = await this.tables.get("gridEvents").select("*");

		const gridState = this.parseGridState(gridEvents, gridRows, gridCols);

		this.tables.get('grids')
			.update({ "lastMod": gameDate }, { where: { "gridId": gridId } });

		return { gridState, gridId, rows: gridRows, cols: gridCols };
	}

	async createNewGame() {

		const gridId = await this.tables.get('grids').insert({
			gridRows: rows,
			gridCols: cols,
			lastMod: gameDate,
			palettesId: Pokedex.id,
			isOver: 0
		});

		await this.createGameTables(gridId);

		await this.fillPalettes(Pokedex);

		const gridState = this.getEmptyGridState({ rows, cols });

		return { gridState, gridId, rows, cols };
	}

	async createGameTables(gridId) {

		return Promise.all([
			this.tables.create("gridEvents", gridId),
			this.tables.create("gridPalettes", gridId),
			this.tables.create("gridUsers", gridId),
			this.tables.create("palettes", Pokedex.id)
		]);
	}

	async fillPalettes(Pokedex) {

		const table = this.tables.get("palettes", Pokedex.id);

		return Promise.all(
			Pokedex.palettes.map(async (palette) => {
				return table.insert({
					color1: palette[0],
					color2: palette[1],
					color3: palette[2],
					color4: palette[3],
					color5: palette[4]
				});
			})
		);
	}

	async getPalettes() {

		const palettes = await this.tables.get('palettes')
			.select("*");

		return palettes.map(({ paletteId, ...colors }) => {

			return {
				id: paletteId,
				colors: Object.values(colors).map(color => `#${color}`)
			};
		});
	}

	parseGridState(gridEvents, rows, cols) {

		const gridState = this.getEmptyGridState({ rows, cols });

		let i = 0;

		for (i; i < gridEvents.length; i++) {

			const { cellid, color } = gridEvents[i];

			gridState[cellid] = color;

		}

		return gridState;
	}

	getEmptyGridState({ rows, cols }) {

		return new Array(rows * cols).fill(null);
	}
}