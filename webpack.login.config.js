const Config = require('./webpack.commons.js');

const login = Config({
  jsEntry: "./src/login/index.js",
  ejsEntry: "./src/login/index.ejs",
  name: "login",
  outputPath: "dist/login",
  outputName: "login.html",
  inject: true,
  isFavicon: true,
});

module.exports = login;
