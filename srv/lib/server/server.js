import express from 'express';
import http from 'http';
import * as socketIo from 'socket.io';

import Router from "#server/router";
import { port, db, cookieSecret } from '#config';

import createSessionStore from '#server/session-store';

import Debug from '#debug';
const debug = Debug('server   |');

export default function ({ namespaces }) {

	debug(`Creating server`);

	const { sessionStore, sessionMiddleware } = createSessionStore(cookieSecret, db);

	const app = express()
		.use('/', Router)
		.use(sessionStore);

	const httpServer = http.createServer(app)
		.listen(port, () =>
			debug(`Server listening on port ${port}`)
		);

	const io = new socketIo.Server(httpServer);

	namespaces.forEach(namespace => {

		if (io._nsps.has(namespace)) return;

		debug(`Initializing socket.io namespace: ${namespace}`);

		io.of(namespace).use((socket, next) =>
			sessionMiddleware(socket.request, {}, next)
		);
	});

	return io;
}