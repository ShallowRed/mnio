const rows = 5,
  cols = 5,
  vrows = 2,
  vcols = 2,
  lw = 40,
  limit = 10,
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

function coordtopos(coordx, coordy) {
  let position = "" + coordx + "_" + coordy + ""
  return position;
}

function postocoord(position) {
  let coordx = parseInt(position.split('_')[0]);
  let coordy = parseInt(position.split('_')[1]);
  return [coordx, coordy];
}

function postoindex(position) {
  let xpos = postocoord(position)[0];
  let ypos = postocoord(position)[1];
  let index = rows * xpos + ypos;
  return index;
}

function indextopos(index) {
  let position = (index - (index % rows)) / cols + "_" + (index % rows);
  return position;
}

function coordtoindex(xpos, ypos) {
  let index = rows * xpos + ypos;
  return index;
}

function randompos(colorlist) {
  let emptycells = [];
  let i = 0;
  colorlist.forEach(function(el) {
    if (el == null) {
      let index = indextopos(i);
      emptycells.push(index);
    };
    i++;
  })
  if (emptycells.length == 0) {
    resetall(colorlist);
  }
  let rdmcell = emptycells[Math.floor(Math.random() * emptycells.length)];
  return rdmcell;
}

function setallowedcells(owncells) {
  //set increasing limit
  //limit = function(owncells.length);

  let allowedcells = [];
  let neighbors = [];
  let xcount = 0;
  let ycount = 0;
  let length = 0;

  owncells.forEach(function(cell) {
    let xpos = postocoord(cell)[0];
    let ypos = postocoord(cell)[1];

    xcount = xcount + xpos;
    ycount = ycount + ypos;
    ++length;

    let upcell = ypos + 1;
    let downcell = ypos - 1;
    let leftcell = xpos + 1;
    let rightcell = xpos - 1;

    let sidecells = [
      coordtopos(xpos, downcell),
      coordtopos(xpos, upcell),
      coordtopos(rightcell, ypos),
      coordtopos(leftcell, ypos)
    ];

    sidecells.forEach(function(cell) {
      if (!neighbors.includes(cell)) {
        neighbors.push(cell);
      };
    });
  });

  let averagepos = [Math.round(xcount / length), Math.round(ycount / length)];
  neighbors.forEach(function(cell) {
    let distfromavx = Math.abs(postocoord(cell)[0] - averagepos[0]);
    let distfromavy = Math.abs(postocoord(cell)[1] - averagepos[1]);
    if (distfromavx >= limit || distfromavy >= limit || allowedcells.includes(cell)) {
      return;
    } else {
      allowedcells.push(cell);
    }
  });
  return allowedcells;
};

function resetall(colorlist) {
  writeoutput(colorlist);
  // todo : reset everything
  //colorlist = new Array(rows * cols).fill(null)
}

function writeoutput(colorlist) {
  let path = 'outputs/' + output + ".txt";
  if (fs.existsSync(path)) {
    let base = output.split('_');
    ++outputn;
    output = base[0] + "_" + outputn;
    writeoutput(colorlist);
    return;
  } else {
    let data = JSON.stringify(colorlist);
    fs.writeFile('outputs/' + output + '.txt', data, function(err) {
      if (err) throw err;
    })
  }
}

module.exports = {
  setup,
  randompos,
  coordtopos,
  coordtoindex,
  postoindex,
  postocoord,
  setallowedcells,
  writeoutput,
  resetall
};
