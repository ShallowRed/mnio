const Config = require('./webpack.global.js');

const gameConfig = Config({
  jsEntry: "./app/game/index.js",
  ejsEntry: "./app/game/index.ejs",
  name: "game",
  outputPath: "dist",
  outputName: "index.html",
  inject: true,
  isFavicon: true
});

module.exports = gameConfig;
