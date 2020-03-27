const convert = require(__dirname + '/helpers');

function randompos(colorlist) {
  let emptycells = [];
  let i = 0;
  colorlist.forEach(function(el) {
    if (el == null) {
      let index = convert.indextopos(i);
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

module.exports = randompos;
