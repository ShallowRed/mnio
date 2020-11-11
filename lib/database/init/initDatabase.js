const Pokedex = require('../../pokedex/pokedex.min');
const { connect, query, sQuery, GAMEDATE } = require('../mysql');

module.exports = () => {
  connect();
  createTablesIfNotExist();
  fillPokedexIfEmpty();
};

const createTablesIfNotExist = () => {
  query("createUsersTable");
  query("createGamesTable");
  query("createPokedex");
};

const fillPokedexIfEmpty = async () => {
  const isPokedexfilled = !!(await sQuery("isPokedexfilled"))
    .length;
  if (isPokedexfilled) return;
  Pokedex.forEach(savePalette);
};

const savePalette = palette =>
  query("fillPokedex", palette.map(removeSharp));

const removeSharp = c => c.substring(1)
