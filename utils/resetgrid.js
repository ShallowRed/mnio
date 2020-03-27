const fs = require('fs');
var output = "output_1";
var outputn = 1;

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
