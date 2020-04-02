const convert = require('../models/converters');

function randompos(ColorList) {
  let emptycells = [];

  let len = ColorList.length;
  for (i = 0; i < len; i++) {
    if (ColorList[i] == null) {
      emptycells.push(i);
    };
  };

  if (emptycells.length == 0) {
    resetall(ColorList);
  }

  let rdmindex = emptycells[Math.floor(Math.random() * emptycells.length)];
  return rdmindex;
}

module.exports = randompos;
