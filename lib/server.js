const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const Router = require("./router");
const { port } = require('./config');

const initSession = require('./session');

module.exports = () => {
  const app = express();
  app.set('port', port);

  const server = http.Server(app);
  const io = socketIo(server);

  initSession(app, io);

  app.use('/', Router);

  server.listen(port, () => {
    console.log("-----------------------------------------");
    console.log("-----------------------------------------");
    console.log(`Listening on port ${port}`)
  });

  io.on('connection', function(socket) {

    // console.log("socket.request.session.username :",
      // socket.request.session.username);
    console.log("socket.request.sessionId :",
      socket.request.sessionId);
  });

  return io;
}
