const Config = require('./webpack.global.js');

const gameConfig = Config({
  name: "game",
  outputPath: "dist",
  htmlOutputFileName: "index.html",
  inject: true,
  isFavicon: true
});

module.exports = gameConfig;
