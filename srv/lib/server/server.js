const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Router = require("@server/router");
const { port, db, cookieSecret } = require('@config');

const debug = require('@debug')('server');

// const initSession = require('@server/session');

const createSessionStore = require('@server/session-store');

module.exports = () => {

	debug(`Creating server`);

	const session = createSessionStore(cookieSecret, db);

	const app = express()
		.use(session.store);

	const httpServer = http
		.createServer(app)
		.listen(port, () =>
			debug(`Server listening on port ${port}`)
		);

	const io = new socketIo.Server(httpServer);

	io.use((socket, next) => {
		return session.middleware(socket.request, {}, next)
	});

	io.session = session.socket;

	io.initNamespace = function (name) {

		if (this._nsps.has(name)) return;

		debug(`Initializing socket.io namespace: ${name}`);

		this.of(name)
			.use((socket, next) =>
				session.middleware(socket.request, {}, next)
			);

		this.of(name).session = session.socket;

	};

	app.use('/', Router);

	return io;
}
