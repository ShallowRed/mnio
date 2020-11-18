const Config = require('./webpack.global.js');

const gameConfig = Config({
  jsEntry: "./app/game/index.js",
  ejsEntry: "./app/game/game.ejs",
  name: "game",
  outputPath: "dist/game",
  outputName: "game.html",
  inject: true,
});

module.exports = gameConfig;
