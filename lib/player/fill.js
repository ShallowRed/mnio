const allow = require('./allow');

const fill = (position, color, socket, MNIO) => {
  socket.emit("fillCallback");

  // Store color changes and inform everyone
  MNIO.ColorList[position] = color;

  socket.broadcast.emit('NewCell', {
    position: position,
    color: color,
  });

  // Update player's owning and allowed cells
  const player = MNIO.PLAYERS[socket.id];
  if (player.owncells.includes(position)) return;
  player.owncells.push(position);

  const allowedcells = allow(player.owncells);
  player.allowedcells = allowedcells;
  socket.emit('AllowedCells', allowedcells);

};

module.exports = fill;
