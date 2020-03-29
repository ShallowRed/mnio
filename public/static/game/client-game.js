// Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  initdata(data);
  setcanvassize();
  setplayerposinview(playerpos, false);
  drawgrid(playerpos);
  drawplayer(selectedcolor);
  hidevolet();
});

//Move player if new position has ben allowed on server side
socket.on("newplayerpos", function(position) {
  playerpos = position;
  flag = false;
  translatecanvas(lastdir, playerpos);
  setplayerposinview(playerpos, true);
  setTimeout(function() {
    drawgrid(playerpos);
    flag = true;
  }, trd*1000)
});

// Set other's new position when they move
socket.on("newglobalpos", function(position) {
  positionlist.push(position);
  clog(position);
  drawposition(position, "grey");
});

//Clear other's last position when they moves
socket.on("clearpos", function(position) {
  positionlist.splice(positionlist.indexOf(position), 1);
  clearposition(position);
});

//Fill other's cells when they do so
socket.on('newglobalcell', function(globalcell) {
  colorlist[globalcell.position] = globalcell.color;
  drawcell(globalcell.position, globalcell.color);
});

// Draw the cells where the player is allowed to move
socket.on('allowedcells', function(allowedcells) {
  allowedcells.forEach(function(position) {
    if (!allowedlist.includes(position)) {
      allowedlist.push(position);
      drawallowedcells(position);
    };
  });
});

//Fill active player cell when he says so
function fillplayercell(position, color) {
  colorlist[position] = color;
  drawcell(position, color);
  socket.emit("newlocalcell", [position, color]);
}

var lastdir;
// Ask server for autorization when trying to move
function askformove(direction) {
  lastdir = direction;
  socket.emit('ismoveok', direction);
}
