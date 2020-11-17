import '../layouts/global.css';

import './lobby.css';
import './login.css';
import './login.css';

import io from 'socket.io-client';

import showInstallOptions from './installation';
import Login from './login';

showInstallOptions();

const socket = io();

Login.init(socket);

socket.on('loginSuccess', isPlayerNew => {
  console.log("Login sucess");
  // Login.end();
  //
  // isPlayerNew && PaletteSelection.init(socket);
  //
  // socket.on("initGame", data => {
  //   Tutoriel[isPlayerNew ? "init" : "end"]();
  //   new Game(data, socket);
  // });

});
