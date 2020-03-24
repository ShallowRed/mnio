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

socket.on("logged_in", function(name) {
  clog("logged in !");
  logwindow1.style.display = "none";
});

socket.on("invalid", function() {
  alert("Username / Password Invalid, Please try again!");
});

socket.on("error", function() {
  alert("Error: Please try again!");
});

//Receive data needed for initialization, start the game
socket.on('playerinit', function(data) {
  setinitdata(data);
  hidevolet();
});

// Ask server for autorization when trying to move
function askformove(direction) {
  socket.emit('askformove', direction);
}

//Fill player cell
function fillplayercell(player, color) {
  fillcell2(player, color);
  editlocalgrid(player.playerpos, color);
  socket.emit("newlocalcell", [player.playerpos, color]);
}

//Move player
socket.on("newplayerpos", function(position) {
  let playerpos = setposfromid(position);
  setplayerpos(playerpos);
  drawgrid();
  drawallpositions(localpositionlist);
  setposinview(playerpos);
  drawplayerpos(playerpos, selectedcolor);
});

//Clear position when other player moved
// (todo :or disconnected)
socket.on("clearpos", function(globalpos) {
  removefromlist(globalpos, localpositionlist);
  let gpos = setposfromid(globalpos);
  setposinview(gpos);
  viewgridstate.forEach(function(cell) {
    if (cell.vid == gpos.vid) {
      clearcell(gpos);
    }
  });
});

//Fill others cell
socket.on("newglobalpos", function(globalpos) {
  localpositionlist.push(globalpos);
  let gpos = setposfromid(globalpos);
  setposinview(gpos);
  viewgridstate.forEach(function(cell) {
    if (cell.vid == gpos.vid) {
      drawplayerpos(gpos, "grey");
    }
  });
});

//Fill cell from other player
socket.on('newglobalcell', function(globalcell) {
  let gcell = setposfromid(globalcell.id);
  gcell.color = globalcell.color
  editlocalgrid(gcell.id, gcell.color);
  setposinview(gcell);
  viewgridstate.forEach(function(cell) {
    if (cell.vid == gcell.vid) {
      fillcell2(gcell, gcell.color);
    }
  });
});

socket.on('allowedcells', function(allowedcells) {
  clog(allowedcells);
  // allowedcells.forEach(function(cell) {
  //   let acells = setposfromid(cell);
  //   setposinview(acells);
  //   fillcell(acells, "red");
  //   });
  });
