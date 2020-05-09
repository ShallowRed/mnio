const path = require('path');
const fs = require('fs');
const json = require('./game_1__grid.json')[2];
const data = json.data;

const GAME = {
  id: parseInt(json.name.split('game_')[1].split('__grid')[0]),
  rows: 150,
  cols: 150
};

let Order = GAME.order = new Array(data.length);
let Colors = GAME.colors = new Array(data.length);
let Players = GAME.players = new Array();
let Palette = GAME.palette = new Array();

data.forEach((obj, i) => {
  if (!Players[obj.playerid]) Players[obj.playerid] = new Array();
  if (!Palette.includes(obj.color)) Palette.push(obj.color);
  Order[i] = parseInt(obj.cellid);
  Colors[i] = Palette.indexOf(obj.color);
  Players[obj.playerid].push(obj.cellid);
});

Players = new Set(Players);

const output = {
  path: path.resolve(__dirname, "../app/gallery/games/game" + GAME.id + ".js"),
  data: "const GAME=" + JSON.stringify(GAME) + "; export default GAME"
}

fs.writeFile(output.path, output.data, err => {
  if (err) console.log(err);
  console.log("File saved : " + output.path);
});
