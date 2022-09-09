import express from 'express';
import http from 'http';
import serveStatic from 'serve-static';
import * as socketIo from 'socket.io';

import { resolve } from 'path';

const PUBLIC_FOLDER_PATH = '../dist';

import Debug from '#config/debug';
const debug = Debug('server   |');

export default function createServer (PORT, router) {

	const app = express()
		.set('view engine', 'ejs')
		.set('views', 'views')
		.use('/assets', serveStatic(resolve(PUBLIC_FOLDER_PATH), { index: false }))
		.use('/', router)

	const httpServer = http
		.createServer(app)
		.listen(PORT, () => {
			debug(`Server listening on port ${PORT}`);
		});

	return new socketIo.Server(httpServer);
}