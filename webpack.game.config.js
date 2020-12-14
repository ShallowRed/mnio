const Config = require('./webpack.commons.js');

const gameConfig = Config({
  jsEntry: "./src/game/index.js",
  ejsEntry: "./src/game/game.ejs",
  name: "game",
  outputPath: "srv/dist/game",
  outputName: "game.html",
  inject: true,
});

module.exports = gameConfig;
