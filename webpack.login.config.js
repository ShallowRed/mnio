const Config = require('./webpack.global.js');

const galleryConfig = Config({
  jsEntry: "./app/login/index.js",
  ejsEntry: "./app/login/index.ejs",
  name: "gallery",
  outputPath: "dist/login",
  outputName: "login.html",
  inject: true,
});

module.exports = galleryConfig;
