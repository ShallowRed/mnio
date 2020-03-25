var socket = io();

var lgr = document.getElementById('Login_Register');
var logwindow1 = document.getElementById('n_log_in');
var logwindow2 = document.getElementById('log_in');

lgr.addEventListener('click', function() {
  socket.emit("login_register", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

socket.on("logged_in", function() {
  clog("logged in !");
  logwindow1.style.display = "none";
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});

//Receive player data
socket.on('initplayer', function(playerdata) {
  initplayer(playerdata);
});

//Receive data needed for initialization, start the game
socket.on('initdata', function(data) {
  setinitdata(data);
  hidevolet();
});

// Ask server for autorization when trying to move
function askformove(direction) {
  socket.emit('askformove', direction);
}

//Fill player cell
function fillplayercell(position, color) {
  fillcell2(position, color);
  editlocalgrid(position, color);
  socket.emit("newlocalcell", [position, color]);
}

//Move player
socket.on("newplayerpos", function(position) {
  playerpos = position;
  drawgrid(position);
});

//Clear position when other player moved
// (todo :or disconnected)
socket.on("clearpos", function(position) {
  removefromlist(position, localpositionlist);
  if (isinview(position)) {
    clearcell(position);
  };
});

//Fill others cell
socket.on("newglobalpos", function(position) {
  localpositionlist.push(position);
  if (isinview(position)) {
    drawplayerpos(position, "grey");
  };
});

//Fill cell from other player
socket.on('newglobalcell', function(globalcell) {
  editlocalgrid(globalcell.id, globalcell.color);
  if (isinview(globalcell.id)) {
    fillcell2(globalcell.id, gcell.color);
  };
});

socket.on('allowedcells', function(allowedcells) {
  allowedcells.forEach(function(position) {
    if (allowedlist.includes(position) == false) {
      allowedlist.push(position);
      drawallowed(position);
    }
  });
});
