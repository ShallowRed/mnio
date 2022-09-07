import express from 'express';
import http from 'http';
import * as socketIo from 'socket.io';

import Router from "#server/router";


export default function (PORT, tables, sessionStore) {

	debug(`Creating server`);

	const router = Router(sessionStore, tables);

	const app = express()
		.use('/', router)
		.use(sessionStore);

	app.set('view engine', 'ejs');

	const httpServer = http.createServer(app)
		.listen(PORT, () =>
			debug(`Server listening on port ${PORT}`)
		);

	const io = new socketIo.Server(httpServer);
}