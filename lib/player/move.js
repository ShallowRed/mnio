const Conf = require('../config');
const convert = require('../converters');

const move = (dir, socket, MNIO) => {
  socket.emit("moveCallback");
  const player = MNIO.PLAYERS[socket.id];
  const nextPos = checkMove(player, dir, MNIO);
  if (nextPos) newPosition(player, player.position, nextPos, MNIO, socket);
}

const checkMove = (player, dir, MNIO) => {

  const coord = convert.indextocoord(player.position);

  if (dir == "up" && coord[0] !== 0) coord[0]--;
  else if (dir == "down" && coord[0] !== Conf.cols - 1) coord[0]++;
  else if (dir == "left" && coord[1] !== 0) coord[1]--;
  else if (dir == "right" && coord[1] !== Conf.rows - 1) coord[1]++;
  else return;

  const nextpos = convert.coordtoindex(coord);

  if (player.owncells.includes(nextpos) ||
    (player.allowedcells.includes(nextpos) &&
      !MNIO.PositionList.includes(nextpos) &&
      !MNIO.ColorList[nextpos]))
    return nextpos;
};

const newPosition = (player, lastPos, newPos, MNIO, socket) => {
  socket.emit("NewPlayerPos", newPos);
  socket.broadcast.emit("NewPosition", [lastPos, newPos]);
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  MNIO.PositionList.push(newPos);
  player.position = newPos;
}

module.exports = move;
