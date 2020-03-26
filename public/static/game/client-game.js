// Receive player data
socket.on('initplayer', function(playerdata) {
  initplayer(playerdata);
});

// Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  setinitdata(data);
  clog(data.gridstate);
  clog(data.positionlist);
  hidevolet();
});

// Ask server for autorization when trying to move
function askformove(direction) {
  socket.emit('askformove', direction);
}

//Move player if new position has ben allowed on server side
socket.on("newplayerpos", function(position) {
  playerpos = position;
  drawgrid(position);
});

//Clear other's last position when they moves
// (todo :clear when they disconnect)
socket.on("clearpos", function(position) {
  removefromlist(position, localpositionlist);
  if (isinview(position)) {
    clearplayerpos(position);
  };
});

// Set other's new position when they move
socket.on("newglobalpos", function(position) {
  localpositionlist.push(position);
  if (isinview(position)) {
    drawplayerpos(position, "grey");
  };
});

//Fill other's cells when they do so
socket.on('newglobalcell', function(globalcell) {
  editlocalgrid(globalcell.id, globalcell.color);
  if (isinview(globalcell.id)) {
    fillcell2(globalcell.id, globalcell.color);
  };
});

// Draw the cells where the player is allowed to move
socket.on('allowedcells', function(allowedcells) {
  allowedcells.forEach(function(position) {
    if (allowedlist.includes(position) == false) {
      allowedlist.push(position);
      drawallowed(position);
    }
  });
});

//Fill active player cell when he says so
function fillplayercell(position, color) {
  fillcell2(position, color);
  editlocalgrid(position, color);
  socket.emit("newlocalcell", [position, color]);
}
