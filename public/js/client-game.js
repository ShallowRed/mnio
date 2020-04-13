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
socket.on('InitData', function(data) {
  GAME.init(data);
});

////////////////////////////////////////// IN-GAME EVENT RECEPTION

//Move player if new position has ben allowed on server side
socket.on("NewPlayerPos", function(position) {
  PLAYER.position = position;
  window.Translate.init();
});

// Set other's new position when they move
socket.on("NewPosition", function(position) {
  GAME.positions.push(position);
  Cell.position(position, "grey");
});

//Clear other's last position when they moves
socket.on("ClearPosition", function(position) {
  GAME.positions.splice(GAME.positions.indexOf(position), 1);
  Cell.clear(position, MAP.ctx3);
});

//Clear other's last position when they moves
// socket.on("ClearCells", function(ColorList) {
//   ColorList.forEach(function(position) {
//     GAME.colors.splice(GAME.colors.indexOf(position), 1);
//     Cell.clear(position, MAP.ctx2);
//   });
// });

//Fill other's cells when they do so
socket.on('NewCell', function(cell) {
  GAME.colors[cell.position] = cell.color;
  Cell.render(cell.position, cell.color);
});

// Draw the cells where the player is allowed to move
socket.on('AllowedCells', function(cells) {
  cells.forEach(function(position) {
    if (!GAME.allowed.includes(position)) {
      GAME.allowed.push(position);
      Cell.allow(position);
    };
  });
});

////////////////////////////////////////// IN-GAME EVENT EMISSION

//Fill active player cell when he says so
function drawcell(position, color) {
  GAME.colors[position] = color;
  window.Fill.init(Cell.check(position), color);
  socket.emit("DrawCell", [position, color]);
}

// Ask server for autorization when trying to move
function askformove(direction) {
  PLAYER.lastdir = direction;
  socket.emit('MovePlayer', direction);
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
