// Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  InitData(data);
  SetCanvasSize();
  DrawCanvas(PLAYERPOS);
  SetPlayerInView(PLAYERPOS, false);
  DrawPlayer(selectedcolor);
  flag = true;
  hidevolet();
});

//Move player if new position has ben allowed on server side
socket.on("newplayerpos", function(position) {
  PLAYERPOS = position;
  flag = false;
  MoveCanvas(lastdir, PLAYERPOS);
  SetPlayerInView(PLAYERPOS, true);
  setTimeout(function() {
    DrawCanvas(PLAYERPOS);
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
socket.on('newglobalcell', function(cell) {
  ColorList[cell.position] = cell.color;
  drawcell(cell.position, cell.color);
});

// Draw the cells where the player is allowed to move
socket.on('allowedcells', function(cells) {
  cells.forEach(function(position) {
    if (!AllowedList.includes(position)) {
      AllowedList.push(position);
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
