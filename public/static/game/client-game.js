// Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  console.log(data);
  initdata(data);
  setcanvassize();
  drawgrid(playerpos);
  hidevolet();
  let vpos = indextocoord(playerpos);
  let ppos = [vpos[0]-1, vpos[1]-1];
  drawposition(coordtoindex(ppos), selectedcolor, ctx4);
});

//Move player if new position has ben allowed on server side
socket.on("newplayerpos", function(position) {
  clearposition(playerpos);
  playerpos = position;
  transcanvas(lastdir);
  setTimeout(function() {
    drawgrid(position);
  }, 500)
});

// Set other's new position when they move
socket.on("newglobalpos", function(position) {
  positionlist.push(position);
  drawposition(position, "grey", ctx3);
});

//Clear other's last position when they moves
// TODO clear when player is disconnected)
socket.on("clearpos", function(position) {
  positionlist.splice(positionlist.indexOf(position), 1);
  clearposition(position);
});

//Fill other's cells when they do so
socket.on('newglobalcell', function(globalcell) {
  colorlist[globalcell.position] = globalcell.color;
  fillcell2(globalcell.position, globalcell.color);
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
  colorlist[position] = color;
  fillcell2(position, color);
  socket.emit("newlocalcell", [position, color]);
}
var lastdir;
// Ask server for autorization when trying to move
function askformove(direction) {
  lastdir = direction;
  socket.emit('ismoveok', direction);
}
