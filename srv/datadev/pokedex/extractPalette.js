const fs = require('fs');
const path = require('path');

const pokedex = require('./pokedex');

const palettes = pokedex.map(tapisserie => tapisserie.palette);

const output = {
  path: path.resolve(__dirname, './pokedex.min.js'),
  data: "const pokedex=" + JSON.stringify(palettes) + "; module.exports=pokedex;"
};

fs.writeFile(output.path, output.data, err => {
  if (err) return console.log(err);
  console.log(palettes);
});
