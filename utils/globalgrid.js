const rows = 20,
  cols = 20,
  vrows = 5,
  vcols = 5,
  lw = 15,
  limit = 4,
  celltimeout = 10;

const port = 82;

var colors = require(__dirname + '/colors'),
  fs = require('fs'),
  output = "output_1",
  outputn = 1;

function setup() {
  return {
    rows,
    cols,
    vrows,
    vcols,
    lw,
    limit,
    celltimeout,
    port
  }
}

function initgrid() {
  let gridstate = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = {
        id: i + "_" + j,
        x: i,
        y: j,
        class: "none",
        color: "none"
      };
      gridstate.push(cell);
    }
  }
  return gridstate;
}

// Constructor for new player
class Player {
  constructor(socket, playerpos, rdmrow, rdmcol, rdmcolor1, rdmcolor2, rdmcolor3) {
    this.playerpos = playerpos;
    this.x = rdmrow;
    this.y = rdmcol;
    this.color1 = rdmcolor1; /* Players start with 2 gold coins */
    this.color2 = rdmcolor2; /* Players start with 2 gold coins */
    this.color3 = rdmcolor3; /* Players start with 2 gold coins */
    this.owncells = [];
    this.allowedcells = [];
  }
}

// Check empty cells, set new player on random available one
function newrdm(socket, gridstate) {
  let check = checkempty(gridstate);
  let emptycells = check.emptycells;
  let rdmcolor1 = colors.randomcolor();
  let rdmcolor2 = colors.randomcolor();
  let rdmcolor3 = colors.randomcolor();
  let rdmpos = emptycells[Math.floor(Math.random() * emptycells.length)];
  let playerinfo = new Player(socket, rdmpos.id, rdmpos.x, rdmpos.y, rdmcolor1, rdmcolor2, rdmcolor3);
  gridstate = check.gridstate;
  return {
    playerinfo,
    gridstate
  }
}

//Check empty cells left, reset and write file if not
function checkempty(gridstate) {

  //Check for empty cells
  let emptycells = [];
  gridstate.forEach(function(cell) {
    if (cell.color == 'none') {
      emptycells.push(cell);
    }
  });

  //Reset the grid and save result in txt file if no empty cells left
  if (emptycells === undefined || emptycells.length == 0) {
    writeoutput(gridstate);
    gridstate = initgrid();
    gridstate.forEach(function(cell) {
      emptycells.push(cell)
    });
  }
  return {
    gridstate,
    emptycells
  }
}

//check for existing txt file and write a new one
function writeoutput(gridstate) {
  let path = 'outputs/' + output + ".txt";
  if (fs.existsSync(path)) {
    let base = output.split('_');
    ++outputn;
    output = base[0] + "_" + outputn;
    writeoutput(gridstate);
    return;
  } else {
    let data = JSON.stringify(gridstate);
    fs.writeFile('outputs/' + output + '.txt', data, function(err) {
      if (err) throw err;
    })
  }
}

module.exports = {
  newrdm,
  checkempty,
  writeoutput,
  setup,
  initgrid,
};
