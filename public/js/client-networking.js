var socket = io();

// Send a username and a password to server
document.getElementById('login').addEventListener('click', function() {
  socket.emit("login", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

// Receive data needed for initialization, start the game
socket.on('InitData', function(data) {
  GAME.init(data);
});

//Move player if new position has ben allowed on server side
socket.on("NewPlayerPos", function(position) {
  PLAYER.position = position;
  window.Translate.init();
});

// Set other's new position and clear last when they move
socket.on("NewPosition", function(position) {
  GAME.positions.push(position[1]);
  Cell.render.position(position[1]);
  if (!position[0]) return;
  GAME.positions.splice(GAME.positions.indexOf(position[0]), 1);
  Cell.clear(position[0], MAP.ctx3);
});

//Fill other's cells when they do so
socket.on('NewCell', function(cell) {
  GAME.colors[cell.position] = cell.color;
  Cell.render.color(cell.position, cell.color);
});

// Draw the cells where the player is allowed to move
socket.on('AllowedCells', function(cells) {
  cells.forEach(function(position) {
    if (!GAME.allowed.includes(position)) {
      GAME.allowed.push(position);
      Cell.render.allowed(position);
    };
  });
});

//Fill active player cell when he says so
function drawcell(position, color) {
  GAME.colors[position] = color;
  window.Fill.init(Cell.check(position), color);
  socket.emit("DrawCell", [position, color]);
}
// TODO: decide type of animation and duration

// Ask server for autorization when trying to move
function askformove(direction) {
  if (!GAME.flag) return
  PLAYER.lastdir = direction;
  socket.emit('MovePlayer', direction);
}

socket.on("message", function(data) {
  console.log(data);
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});
