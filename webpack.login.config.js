const Config = require('./webpack.commons.js');

const login = Config({
  jsEntry: "./app/login/index.js",
  ejsEntry: "./app/login/index.ejs",
  name: "login",
  outputPath: "dist",
  outputName: "login.html",
  inject: true,
  isFavicon: true,
});

module.exports = login;
