const disconnect = (player, socket, posList) => {
  if (!player) return

  // Save player's palette, clear its last position
  posList.splice(posList.indexOf(player.position), 1);

  if (player.position)
    socket.broadcast.emit("NewPosition", [player.position, null]);

  console.log("Player left : " + player.name + " | " + player.dbid);
};

module.exports = disconnect;
