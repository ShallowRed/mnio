const Map = require('./Map');
const {GameDatabase} = require('../database/ClientConnector');
const PlayersFactory = require('./Player');
const ClientLoginConnector = require('./ClientLogin');
const ClientGameConnector = require('./ClientGame');

module.exports = class Game {

	constructor(mapState, io) {

		this.map = new Map(mapState);

		this.database = new GameDatabase(this.map.gameid);

		this.ClientLogin = new ClientLoginConnector(this.database);
		
		this.playersFactory = new PlayersFactory(this.database, this.map);
		
		this.ClientGame = new ClientGameConnector(this.database, this.map);

		this.Players = {};

		this.loginPage = io.of('/login');
		this.palettePage = io.of('/palette');
		this.gamePage = io.of('/game');

		this.listenConnection();
	}

	listenConnection() {

		this.loginPage.on('connection', socket =>
			this.listenLogin(socket)
		);

		this.palettePage.on('connection', socket =>
			this.listenPaletteSelection(socket)
		);

		this.gamePage.on('connection', socket =>
			this.startClientGame(socket)
		);
	}

	listenLogin(socket) {

		socket.on('play', () => {

			if (socket.request?.session?.isLogged) {

				socket.emit('redirect', '/game');

			} else {

				this.ClientLogin.init(socket, data => {

					return this.loginSuccess(data)
				});
			}
		})
	}

	async loginSuccess({ socket, userInDb, userName, password }) {

		if (userInDb.exists) {

			const player = await this.playersFactory.createExisting(userInDb.creds);

			this.setSession(socket, player);

		} else if (this.map.emptyCells.length) {

			this.setSession(socket, { userName, password });

		} else {

			alertEnd(socket);
		}
	}

	listenPaletteSelection(socket) {

		if (socket.request?.session?.isLogged) {

			socket.emit('redirect', '/game');

		} else {

			socket.on("paletteSelected", async index => {

				const credentials = this.getSession(socket);

				const player = await this.playersFactory.createNew(index, credentials);

				this.setSession(socket, player);
			});
		}
	}

	async startClientGame(socket) {

		let player = this.getSession(socket);

		if (player && !socket.request?.session?.isLogged) {

			console.log("Player first log");

			this.saveClientSession(socket, player);
		}

		else if (!player && socket.request?.session?.isLogged) {

			player = await this.sessionFromDb(socket);
		}

		if (player) {

			this.ClientGame.init(socket, player);

		} else {

			this.deleteClientSession(socket);
		}
	}

	setSession(socket, data) {
		this.Players[socket.request.sessionId] = data;
	}

	getSession(socket) {
		return this.Players[socket.request.sessionId];
	}

	deleteSession(socket) {
		if (this.Players[socket.request.sessionId]) {
			delete this.Players[socket.request.sessionId];
		}
	}

	saveClientSession(socket, player) {
		
		if (socket.request?.session) {
			console.log("Saving playerid in session");
			socket.request.session.isLogged = true;
			socket.request.session.playerid = player.playerid;
			socket.request.session.position = player.position;
			socket.request.session.save();
		} else {
			console.log("Session not found");
		}
	}

	async sessionFromDb(socket) {

		console.log("Player logged in but not in memory, fetching from db");

		const { playerid, position } = socket.request.session;

		const player = await this.playersFactory.createExisting({ playerid, position });

		this.setSession(socket, player);
		
		return player;
	}

	deleteClientSession(socket) {

		console.log('Unable to retrieve player, redirecting to login');

		if (socket.request?.session) {
			socket.request.session.isLogged = false;
			socket.request.session.save();
		}

		socket.emit('redirect', '/');
	}
}

// this can be put client side
const alertEnd = socket => {
	socket.emit("alert",
		"Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
	);
};
