const Config = require('./webpack.global.js');

const gameConfig = Config({
  jsEntry: "./app/gamedev/gamedev.js",
  ejsEntry: "./app/gamedev/gamedev.ejs",
  name: "gamedev",
  outputPath: "dist/gamedev",
  outputName: "gamedev.html",
  inject: true,
});

module.exports = gameConfig;
