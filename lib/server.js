const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Router = require("./router");
const { port } = require('./config');

module.exports = () => {

  const app = express();
  app.use('/', Router);
  app.set('port', port);

  const server = http.Server(app);
  const io = socketIo(server);

  server.listen(port, () => {
    console.log("-----------------------------------------");
    console.log("-----------------------------------------");
    console.log(`Listening on port ${port}`)
  });

  return io;
}
