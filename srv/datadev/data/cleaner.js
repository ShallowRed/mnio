const path = require('path');
const fs = require('fs');
const games = require('./games.json');

// Change index to chose game data to clean
const index = 1;

const fills = require('./game_' + index + '__grid.json');
const users = require('./game_' + index + '__users.json');

const dates = {
  game1: "01/05 &#x2794; 04/05/20",
  game2: "19/05 &#x2794; 25/05/20",
  game3: "27/05 &#x2794; 10/06/20"
}

const data = {
  games: games[2].data[index - 1],
  fills: fills[2].data,
  users: users[2].data,
}

const GAME = {
  id: data.games.gameid,
  rows: data.games.usedrows,
  cols: data.games.usedcols
};

GAME.dates = dates["game" + GAME.id];

let maxplayer = 0;
data.users.forEach(e => {
  const playerid = parseInt(e.playerid);
  if (playerid > maxplayer) maxplayer = playerid;
});

const Users = new Array(maxplayer);

data.users.forEach(e => Users[e.playerid] = e);

const Order = GAME.order = new Array(data.fills.length);
const Colors = GAME.colors = new Array(data.fills.length);
const Palette = GAME.palette = new Array();
let Players = new Array(Users.length);

data.fills.forEach(({
  playerid,
  color,
  cellid
}, i) => {

  if (!Players[playerid])
    Players[playerid] = {
      name: Users[playerid].Username,
      fills: new Array()
    };

  if (!Palette.includes(color))
    Palette.push(color);

  Order[i] = parseInt(cellid);

  Colors[i] = Palette.indexOf(color);

  Players[playerid].fills.push(cellid);
});

GAME.players = Players
  .filter(e => e && e.fills.length > 15)
  .map(({
    name,
    fills
  }, i) => {
    const player = {
      name: name,
      fills: fills.length,
      owned: [...new Set(fills)]
    };
    return player
  })

GAME.poorPlayers = data.users.length - GAME.players.length;

const {
  id,
  rows,
  cols
} = GAME;

const output = {
  path: path.resolve(__dirname, "../app/gallery/games/game" + id + ".json"),
  // path: path.resolve(__dirname, "../app/gallery/games/gametest" + GAME.id + ".js"),
  data: JSON.stringify(GAME)
};

fs.writeFile(output.path, output.data, err => {
  if (err) console.log(err);
  console.log("File saved : " + output.path);
});
