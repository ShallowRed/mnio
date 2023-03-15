import express from 'express';
import http from 'http';
import serveStatic from 'serve-static';
import * as socketIo from 'socket.io';

// import ViteExpress from "vite-express";
import viteAssetMiddleware from "#server/vite-assets-middleware";

import Debug from '#config/debug';
const debug = Debug('server   |');

export default async function createServer(router, PORT, PATHS) {

  const app = express()
    .set('view engine', 'ejs')
    .set('views', PATHS.VIEWS)
    .use('/assets', viteAssetMiddleware())
    .use(serveStatic(PATHS.STATIC))
    .use('/', router)

  const httpServer = http
    .createServer(app)
    .listen(PORT, () => {
      debug(`Server listening on port ${PORT}`);
      debug(`http://localhost:${PORT}`);
    });

  // ViteExpress.config({ mode: "production" })

  return new socketIo.Server(httpServer);
}