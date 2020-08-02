const fs = require('fs');
const path = require('path');

const pokedex = require('./pokedex');

const palettes = pokedex.map(tapisserie => tapisserie.palette);

const pokemons = JSON.stringify(palettes);

const pokedexMin = "const pokedex=" + pokemons + ";module.exports=pokedex;";
s
fs.writeFile(path.resolve(__dirname, './pokedex/pokedex.min.js'), pokedexMin, (err, data) => {
  if (err) return console.log(err);
  console.log(pokemons);
});
