import express from 'express';
import http from 'http';
import * as socketIo from 'socket.io';

import Router from "#server/router";

import Debug from '#debug';
const debug = Debug('server   |');

export default function (PORT, sessionStore) {

	debug(`Creating server`);

	const app = express()
		.use('/', Router)
		.use(sessionStore);

	const httpServer = http.createServer(app)
		.listen(PORT, () =>
			debug(`Server listening on port ${PORT}`)
		);

	return new socketIo.Server(httpServer);
}