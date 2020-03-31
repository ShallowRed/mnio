// Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  initdata(data);
  setcanvassize();
  setplayerposinview(playerpos, false);
  drawgrid(playerpos);
  drawplayer(selectedcolor);
  flag = true;
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
  PositionList.push(position);
  drawposition(position, "grey");
});

//Clear other's last position when they moves
socket.on("clearpos", function(position) {
  PositionList.splice(PositionList.indexOf(position), 1);
  clearposition(position);
});

//Fill other's cells when they do so
socket.on('newglobalcell', function(globalcell) {
  ColorList[globalcell.position] = globalcell.color;
  drawcell(globalcell.position, globalcell.color);
});

// Draw the cells where the player is allowed to move
socket.on('allowedcells', function(allowedcells) {
  allowedcells.forEach(function(position) {
    if (!allowedlist.includes(position)) {
      allowedlist.push(position);
      drawallowed(position);
    };
  });
});

//Fill active player cell when he says so
function fillplayercell(position, color) {
  ColorList[position] = color;
  drawcell(position, color);
  socket.emit("drawcell", [position, color]);
}

// Ask server for autorization when trying to move
function askformove(direction) {
  lastdir = direction;
  socket.emit('moveplayer', direction);
}
