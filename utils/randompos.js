const convert = require(__dirname + '/helpers');

function randompos(colorlist) {
  let emptycells = [];

  let len = colorlist.length;
  for (i = 0; i < len; i++) {
    if (colorlist[i] == null) {
      emptycells.push(i);
    };
  };

  if (emptycells.length == 0) {
    resetall(colorlist);
  }

  let rdmindex = emptycells[Math.floor(Math.random() * emptycells.length)];
  return rdmindex;
}

module.exports = randompos;
