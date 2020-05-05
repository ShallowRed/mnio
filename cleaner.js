const GAME = {}

const json = require('./games/game_1__grid.json')[2];
const data = json.data;

GAME.id = parseInt(json.name.split('game_')[1].split('__grid')[0]);

let Order = GAME.order = new Array(data.length);
let Colors = GAME.colors = new Array(data.length);

let nplayers = 0;
let nnplayers = [];
data.forEach((obj, i) => {
  if (!nnplayers.includes(obj.playerid)) {
    nnplayers.push(obj.playerid);
    nplayers++
  }
});

let Players = GAME.players = new Array(nplayers);

data.forEach((obj, i) => {
  Order[i] = parseInt(obj.cellid);
  Colors[i] = '#' + obj.color;
  if (!Players[obj.playerid]) Players[obj.playerid] = new Array();
  Players[obj.playerid].push(obj.cellid);
});

Players = new Set(Players);

// console.table(Players);
console.log(GAME);
// console.log(data);

const fs = require('fs');

fs.writeFile("./app/gallery/game1.js", "const GAME=" + JSON.stringify(GAME) + ";export default GAME", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
