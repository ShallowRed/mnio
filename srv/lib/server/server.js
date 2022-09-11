import express from 'express';
import http from 'http';
import serveStatic from 'serve-static';
import * as socketIo from 'socket.io';

import Debug from '#config/debug';
const debug = Debug('server   |');

export default function createServer (router, PORT, PATHS) {

	const app = express()
		.set('view engine', 'ejs')
		.set('views', PATHS.VIEWS)
		.use('/assets', serveStatic(PATHS.PUBLIC_ASSETS, { index: false }))
		.use('/', router)

	const httpServer = http
		.createServer(app)
		.listen(PORT, () => {
			debug(`Server listening on port ${PORT}`);
		});

	return new socketIo.Server(httpServer);
}