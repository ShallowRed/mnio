import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import Router from "#server/router";
import { port, db, cookieSecret } from '#config';

import Debug from '#debug';
const debug = Debug('server');

// const initSession = require('#server/session');

import createSessionStore from '#server/session-store';

export default () => {

	debug(`Creating server`);

	const session = createSessionStore(cookieSecret, db);

	const app = express()
		.use(session.store);

	const httpServer = createServer(app)
		.listen(port, () =>
			debug(`Server listening on port ${port}`)
		);

	const io = new Server(httpServer);

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
