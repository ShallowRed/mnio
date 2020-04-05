var socket = io();
var CellSize, Grows, Gcols, ColorList;
var canvas = document.getElementById('admincanvas');
var displaycanvas = document.getElementById('displaycanvas');
var askfordb = document.getElementById('askfordb');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var displayflag = 0;

displaycanvas.addEventListener("click", function() {
  if (!displayflag) {
    socket.emit("admin");
    canvas.hidden = false;
    displayflag = 2;
  } else if (displayflag == 2) {
    canvas.hidden = true;
    displayflag = 1;
  } else {
    canvas.hidden = false;
    displayflag = 2;
  };
});

askfordb.addEventListener("click", function() {
  socket.emit("askfordb");
})

// Receive data needed for initialization, start the game
socket.on('initadmin', function(data) {
  console.log(data);
  ColorList = data.ColorList;
  Grows = data.rows;
  Gcols = data.cols;
  DrawCanvas();
});

//Fill other's cells when they do so
socket.on('NewCell', function(cell) {
  console.log(cell);
  ColorList[cell.position] = cell.color;
  fillcell(cell.position, cell.color);
});

function DrawCanvas() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) h = w = Math.round(h * 0.85);
  else w = h = Math.round(w * 0.85);
  canvas.width = w;
  canvas.height = h;

  CellSize = Math.round(w / Grows);
  console.log(CellSize);
  h = w = CellSize * Grows;
  canvas.style.margin = (window.innerHeight - h) / 2 + "px " + (window.innerWidth - w) / 2 + "px";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw all colored cells
  let len = ColorList.length;
  for (i = 0; i < len; i++)
    if (ColorList[i] !== null) fillcell(i, ColorList[i]);
};

function fillcell(position, color) {
  let cell = indextocoord(position);
  ctx.clearRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize);
  ctx.fillStyle = color;
  ctx.fillRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize)
}

function indextocoord(index) {
  let coordx = (index - (index % Grows)) / Gcols;
  let coordy = (index % Gcols);
  return [coordx, coordy];
}

function coordtoindex(coord) {
  let index = Grows * coord[0] + coord[1];
  return index;
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

//resize grid and cell on window sizing
window.addEventListener('resize', function() {
  DrawCanvas();
}, true);
