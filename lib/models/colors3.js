const pokedex = require('./pokedex');
const palettes = pokedex.map(e => e.palette);
let fs = require('fs');

fs.writeFile(__dirname + '/mn2.js', JSON.stringify(palettes), function(err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

function randompalette() {
  let rdmpalette = palettes[Math.floor(Math.random() * palettes.length)];
  return rdmpalette;
}

module.exports = randompalette;
