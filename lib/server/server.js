import express from 'express';
import http from 'http';
import serveStatic from 'serve-static';
import * as socketIo from 'socket.io';

// import ViteExpress from "vite-express";

import Debug from '#config/debug';
const debug = Debug('server   |');

export default function createServer(router, PORT, PATHS) {

  const app = express()
    .set('view engine', 'ejs')
    .set('views', PATHS.VIEWS)
    .use('/assets', serveStatic(PATHS.PUBLIC_ASSETS + '/assets'))
    .use('/', router)

  const httpServer = http
    .createServer(app)
    .listen(PORT, () => {
      debug(`Server listening on port ${PORT}`);
    });

  // ViteExpress.config({ mode: "production" })
  // ViteExpress.bind(app, httpServer);

  return new socketIo.Server(httpServer);
}