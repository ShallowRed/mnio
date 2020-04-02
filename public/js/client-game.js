var socket = io();

////////////////////////////////////////// LOBBY

// Send a username and a password to server
document.getElementById('login').addEventListener('click', function() {
  socket.emit("login", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

////////////////////////////////////////// GAME INIT

// Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  InitData(data);
  SetCanvasSize();
  SetPlayerInView(PLAYERPOS, false);
  DrawCanvas(PLAYERPOS);
  DrawPlayer(selectedcolor);
  flag = true;
  hidevolet();
});

////////////////////////////////////////// IN-GAME EVENT RECEPTION

//Move player if new position has ben allowed on server side
socket.on("newplayerpos", function(position) {
  PLAYERPOS = position;
  flag = false;
  MoveCanvas(lastdir, PLAYERPOS);
  SetPlayerInView(PLAYERPOS, true);
  setTimeout(function() { // TODO: replace with requestanimationframe
    DrawCanvas(PLAYERPOS);
    flag = true;
  }, trd*1000)
});

// Set other's new position when they move
socket.on("NewPosition", function(position) {
  PositionList.push(position);
  drawposition(position, "grey");
});

//Clear other's last position when they moves
socket.on("ClearPosition", function(position) {
  PositionList.splice(PositionList.indexOf(position), 1);
  clearposition(position);
});

//Fill other's cells when they do so
socket.on('NewCell', function(cell) {
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

////////////////////////////////////////// IN-GAME EVENT EMISSION

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

////////////////////////////////////////// UTILS

socket.on("message", function(data) {
  console.log(data);
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});
