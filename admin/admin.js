var socket = io();
var displayflag = 0;
var getgamesflag = false;
/////////// CANVAS

const MYCANVAS = {
  init: function() {
    // this.CellSize, Grows, Gcols, ColorList;
    this.canvas = document.getElementById('admincanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  },

  render: function() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w > h) h = w = Math.round(h * 0.85);
    else w = h = Math.round(w * 0.85);
    this.canvas.width = w;
    this.canvas.height = h;
    this.CellSize = Math.round(w / this.rows);
    h = w = this.CellSize * this.rows;
    this.canvas.style.margin = (window.innerHeight - h) / 2 + "px " + (window.innerWidth - w) / 2 + "px";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw all colored cells
    let len = this.ColorList.length;
    for (i = 0; i < len; i++)
      if (this.ColorList[i] !== null) this.fillcell(i, this.ColorList[i]);
  },

  fillcell: function(position, color) {
    let coordx = (position - (position % this.rows)) / this.cols;
    let coordy = (position % this.cols);
    this.ctx.clearRect(this.CellSize * coordy, this.CellSize * coordx, this.CellSize, this.CellSize);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.CellSize * coordy, this.CellSize * coordx, this.CellSize, this.CellSize)
  }
}

var displaycanvas = document.getElementById('displaycanvas');
var getgames = document.getElementById('getgames');

MYCANVAS.init();

/////////// UI

const gamelist = document.getElementById("games");
var Games = [];
var gamedom;

displaycanvas.addEventListener("click", function() {
  if (!displayflag) {
    socket.emit("admin");
    MYCANVAS.canvas.hidden = false;
    displayflag = 2;
  } else if (displayflag == 2) {
    MYCANVAS.canvas.hidden = true;
    displayflag = 1;
  } else {
    MYCANVAS.canvas.hidden = false;
    displayflag = 2;
  };
});

getgames.addEventListener("click", function() {
  if (getgamesflag) return;
  socket.emit("getgames");
  getgamesflag = true;
})

socket.on('games', function(data) {
  data.forEach(function(game) {
    Games.push(game);
    let li = document.createElement('li');
    gamelist.appendChild(li);
    li.innerHTML += "game n°" + game[0] + ", rows: " + game[1] + ", cols: " + game[2];
    li.id = "game_" + game[0];
    li.className = "game";
    if (!game[3]) li.style.background = 'lightpink';
    else li.style.background = 'lightgreen';
  });
  gamedom = document.querySelectorAll(".game");
  gamedom.forEach(function(game) {
    game.addEventListener('click', function(event) {
      socket.emit('gettable', game.id.split("_")[1]);
    })
  });
});

socket.on('table', function(data) {
  console.log(data);
});

// Receive data needed for initialization, start the game
socket.on('initadmin', function(data) {
  MYCANVAS.ColorList = data.ColorList;
  MYCANVAS.rows = data.rows;
  MYCANVAS.cols = data.cols;
  MYCANVAS.render();
});

//Fill other's cells when they do so
socket.on('NewCell', function(cell) {
  console.log(cell);
  MYCANVAS.ColorList[cell.position] = cell.color;
  MYCANVAS.fillcell(cell.position, cell.color);
});

//resize grid and cell on window sizing
window.addEventListener('resize', function() {
  DrawCanvas();
}, true);

socket.on("message", function(data) {
  console.log(data);
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});
