const Config = require('./webpack.global.js');

const gameConfig = Config({
  jsEntry: "game/index.js",
  ejsEntry: "game/index.ejs",
  outputPath: "dist",
  htmlOutputFileName: "index.html",
  inject: true,
  isFavicon: true
});

module.exports = gameConfig;
