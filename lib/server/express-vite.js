import express from "express";
import path from "path";
import * as Vite from "vite";

import Debug from '#config/debug';
const debug = Debug('server   |');

const { NODE_ENV } = process.env;

const Config = {
  mode: (NODE_ENV === "production" ? "production" : "development"),
  vitePort: 5173,
};

function getViteHost() {
  return `http://localhost:${Config.vitePort}`;
}

function isStaticFilePath(path) {
  return path.match(/\.\w+$/);
}


export default async function bindVite(app) {

  debug(`Running in ${Config.mode} mode`);

  if (Config.mode === "production") {

    const config = await Vite.resolveConfig({}, "build");

    const distPath = path.resolve(config.root, config.build.outDir);

    app.use(express.static(distPath));

    debug(`Serving static files from ${distPath}`);

  } else {

    app.use((req, res, next) => {

      if (isStaticFilePath(req.path)) {

        const url = `${getViteHost()}${req.path}`;

        fetch(url)
          .then((response) => {
            if (!response.ok) {
              return next();
            }

            res.redirect(response.url);
          });

      } else {
        next();
      }
    });
  }

  const layer = app._router.stack.pop();

  app._router.stack = [
    ...app._router.stack.slice(0, 2),
    layer,
    ...app._router.stack.slice(2),
  ];
}